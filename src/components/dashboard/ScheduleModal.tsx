import React, { useEffect, useState } from 'react';
import { BookOpen, Calendar, FileText, Hash, Users, X } from 'lucide-react';
import { toArabicNumber } from '@/lib/hijriDate';
import {
  allSurahs,
  calculateTotalDays,
  generateSchedulePreviewSimple,
  getSurahByNumber,
  quranStartPage,
  totalQuranPages,
} from '@/lib/quranMetadata';
import { ImamAssignment, useSchedule } from '@/hooks/useSchedule';
import { useToast } from '@/hooks/use-toast';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'juz' | 'surah' | 'page' | 'ayah';
type ScheduleType = 'taraweeh' | 'qiyam';
type WizardStep = 'start_point' | 'daily_quantity' | 'imam_allocation' | 'preview';

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose }) => {
  const { createReadingPlan } = useSchedule();
  const { toast } = useToast();

  const [wizardStep, setWizardStep] = useState<WizardStep>('start_point');
  const [scheduleType, setScheduleType] = useState<ScheduleType>('taraweeh');
  const [activeTab, setActiveTab] = useState<TabType>('juz');

  const [startPage, setStartPage] = useState(quranStartPage);
  const [pagesPerNight, setPagesPerNight] = useState(2);
  const [rakatsPerNight, setRakatsPerNight] = useState(8);
  const [duration, setDuration] = useState(30);

  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [selectedAyah, setSelectedAyah] = useState(1);
  const [customPage, setCustomPage] = useState(quranStartPage);

  const [imamCount, setImamCount] = useState(1);
  const [imamAssignments, setImamAssignments] = useState<ImamAssignment[]>([
    { imamName: '', startRakat: 1, endRakat: 8 },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pagesPerNight > 0) {
      const calculatedDays = calculateTotalDays(pagesPerNight, startPage, totalQuranPages);
      setDuration(calculatedDays);
    }
  }, [pagesPerNight, startPage]);

  useEffect(() => {
    setImamAssignments((prev) => {
      const assignments: ImamAssignment[] = [];
      const rakatsPerImam = Math.ceil(rakatsPerNight / Math.max(imamCount, 1));

      for (let i = 0; i < imamCount; i++) {
        const startRakat = i * rakatsPerImam + 1;
        const endRakat = Math.min((i + 1) * rakatsPerImam, rakatsPerNight);
        assignments.push({
          imamName: prev[i]?.imamName || '',
          startRakat,
          endRakat,
        });
      }

      return assignments;
    });
  }, [imamCount, rakatsPerNight]);

  const handleJuzSelect = (juzNumber: number) => {
    const startPageForJuz = juzNumber === 1 ? quranStartPage : (juzNumber - 1) * 20 + 1;
    setStartPage(startPageForJuz);
    setSelectedJuz(juzNumber);
  };

  const handleSurahSelect = (surahNumber: number) => {
    const surah = getSurahByNumber(surahNumber);
    if (surah) {
      setStartPage(surah.startPage);
      setSelectedSurah(surahNumber);
      setSelectedAyah(1);
    }
  };

  const handleAyahSelect = () => {
    if (!selectedSurah) return;
    const surah = getSurahByNumber(selectedSurah);
    if (!surah) return;

    const ayahRatio = selectedAyah / surah.ayahCount;
    const surahPages = surah.endPage - surah.startPage + 1;
    const approximatePage = Math.floor(surah.startPage + ayahRatio * surahPages);
    setStartPage(Math.max(1, Math.min(totalQuranPages, approximatePage)));
  };

  const handleImamCountChange = (count: number) => {
    setImamCount(count);
  };

  const handleImamNameChange = (index: number, name: string) => {
    setImamAssignments((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], imamName: name };
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await createReadingPlan(startPage, pagesPerNight, imamAssignments);

      if (error) {
        toast({
          title: 'خطأ',
          description: 'حدث خطأ في إنشاء الجدول',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'تم إنشاء الجدول',
          description: `تم إنشاء جدول قراءة ${toArabicNumber(pagesPerNight)} صفحة يومياً لمدة ${toArabicNumber(duration)} يوماً`,
        });
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const endPage = Math.min(startPage + pagesPerNight * duration - 1, totalQuranPages);
  const totalPagesInPlan = endPage - startPage + 1;
  const willComplete = endPage >= totalQuranPages;

  const schedulePreview = generateSchedulePreviewSimple(
    startPage,
    pagesPerNight,
    Math.min(duration, 3),
    rakatsPerNight
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl glass rounded-2xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-gold p-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary-foreground" />
            <h2 className="text-xl font-bold text-primary-foreground">إنشاء جدول متقدم</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-primary-foreground/20 rounded-lg transition-colors" title="إغلاق">
            <X className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">نوع الجدول</label>
            <div className="flex gap-2 p-1 bg-secondary/30 rounded-xl">
              <button
                type="button"
                onClick={() => setScheduleType('taraweeh')}
                className={
                  'flex-1 py-2 px-4 rounded-lg font-medium transition-all ' +
                  (scheduleType === 'taraweeh'
                    ? 'bg-gold text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground')
                }
              >
                التراويح
              </button>
              <button
                type="button"
                onClick={() => setScheduleType('qiyam')}
                className={
                  'flex-1 py-2 px-4 rounded-lg font-medium transition-all ' +
                  (scheduleType === 'qiyam'
                    ? 'bg-gold text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground')
                }
              >
                قيام الليل
              </button>
            </div>
          </div>

          {wizardStep === 'start_point' && (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  <BookOpen className="w-4 h-4 inline ml-2" />
                  اختر نقطة البداية
                </label>
                <div className="flex gap-2 p-1 bg-secondary/30 rounded-xl mb-4">
                  {['juz', 'surah', 'page', 'ayah'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab as TabType)}
                      className={
                        'flex-1 py-2 px-4 rounded-lg font-medium transition-all ' +
                        (activeTab === tab
                          ? 'bg-gold text-primary-foreground shadow-lg'
                          : 'text-muted-foreground hover:text-foreground')
                      }
                    >
                      {{ juz: 'بالجزء', surah: 'بالسورة', page: 'بالصفحة', ayah: 'بالآية' }[tab as TabType]}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'juz' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-10 gap-2">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                      <button
                        key={juz}
                        type="button"
                        onClick={() => handleJuzSelect(juz)}
                        className={
                          selectedJuz === juz
                            ? 'p-2 rounded-lg text-sm font-bold bg-gold text-primary-foreground shadow-md transition-all'
                            : 'p-2 rounded-lg text-sm font-bold bg-secondary/50 text-muted-foreground hover:bg-secondary'
                        }
                      >
                        {toArabicNumber(juz)}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">الصفحة المحددة: {toArabicNumber(startPage)}</p>
                </div>
              )}

              {activeTab === 'surah' && (
                <div className="space-y-3">
                  <select
                    value={selectedSurah || ''}
                    onChange={(e) => handleSurahSelect(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                    dir="rtl"
                    title="اختر السورة"
                  >
                    <option value="">اختر السورة...</option>
                    {allSurahs.map((surah) => (
                      <option key={surah.number} value={surah.number}>
                        {toArabicNumber(surah.number)}. {surah.nameArabic}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === 'page' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-4">
                    <label className="text-muted-foreground">الصفحة:</label>
                    <input
                      type="number"
                      min={quranStartPage}
                      max={totalQuranPages}
                      value={customPage}
                      onChange={(e) => {
                        const page = Math.max(quranStartPage, parseInt(e.target.value, 10) || quranStartPage);
                        setCustomPage(page);
                        setStartPage(page);
                      }}
                      className="w-32 px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-gold/50"
                    />
                    <span className="text-muted-foreground">من {toArabicNumber(totalQuranPages)}</span>
                  </div>
                </div>
              )}

              {activeTab === 'ayah' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">السورة:</label>
                    <select
                      value={selectedSurah || ''}
                      onChange={(e) => {
                        const surahNum = parseInt(e.target.value, 10);
                        setSelectedSurah(surahNum);
                        setSelectedAyah(1);
                        handleSurahSelect(surahNum);
                      }}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                      dir="rtl"
                    >
                      <option value="">اختر السورة...</option>
                      {allSurahs.map((surah) => (
                        <option key={surah.number} value={surah.number}>
                          {toArabicNumber(surah.number)}. {surah.nameArabic}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedSurah && (
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">رقم الآية:</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min={1}
                          max={getSurahByNumber(selectedSurah)?.ayahCount || 1}
                          value={selectedAyah}
                          onChange={(e) => setSelectedAyah(parseInt(e.target.value, 10) || 1)}
                          onBlur={handleAyahSelect}
                          className="flex-1 px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground text-center font-bold focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                        <button
                          type="button"
                          onClick={handleAyahSelect}
                          className="px-6 py-3 bg-gold/20 border border-gold text-gold rounded-xl hover:bg-gold/30 transition-all"
                        >
                          حساب الصفحة
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">الصفحة التقريبية: {toArabicNumber(startPage)}</p>
                    </div>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() => setWizardStep('daily_quantity')}
                className="w-full py-3 bg-gold hover:bg-gold-light text-primary-foreground font-semibold rounded-xl transition-all mt-6"
              >
                التالي: كمية القراءة
              </button>
            </>
          )}

          {wizardStep === 'daily_quantity' && (
            <>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    <FileText className="w-4 h-4 inline ml-2" />
                    كم صفحة تريد قراءتها كل ليلة؟
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">عدد الصفحات:</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0.5}
                          max={50}
                          step={0.5}
                          value={pagesPerNight}
                          onChange={(e) => setPagesPerNight(parseFloat(e.target.value) || 1)}
                          className="w-24 px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                        <span className="text-foreground">صفحة/ليلة</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {[1, 1.5, 2, 2.5, 3, 4, 5].map((pages) => (
                        <button
                          key={pages}
                          type="button"
                          onClick={() => setPagesPerNight(pages)}
                          className={
                            pagesPerNight === pages
                              ? 'px-3 py-2 rounded-lg font-medium bg-gold/20 border-2 border-gold text-gold transition-all'
                              : 'px-3 py-2 rounded-lg font-medium bg-secondary/50 border-2 border-transparent text-muted-foreground hover:border-gold/30'
                          }
                        >
                          {toArabicNumber(pages)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    <Hash className="w-4 h-4 inline ml-2" />
                    كم ركعة في الليلة الواحدة؟
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">عدد الركعات:</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={2}
                          max={30}
                          value={rakatsPerNight}
                          onChange={(e) => setRakatsPerNight(parseInt(e.target.value, 10) || 8)}
                          className="w-24 px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                        <span className="text-foreground">ركعة</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[8, 12, 16, 20, 24].map((rakats) => (
                        <button
                          key={rakats}
                          type="button"
                          onClick={() => setRakatsPerNight(rakats)}
                          className={
                            rakatsPerNight === rakats
                              ? 'py-2 px-3 rounded-lg font-bold bg-gold text-primary-foreground transition-all'
                              : 'py-2 px-3 rounded-lg font-bold bg-secondary/50 text-muted-foreground hover:bg-secondary'
                          }
                        >
                          {toArabicNumber(rakats)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gold/10 border border-gold/30 rounded-xl">
                  <p className="text-sm text-gold mb-2"><strong>الملخص:</strong></p>
                  <p className="text-sm text-muted-foreground">
                    {toArabicNumber(pagesPerNight)} صفحة × {toArabicNumber(rakatsPerNight)} ركعة يوميا
                  </p>
                  <p className="text-sm text-gold font-semibold mt-2">= إنهاء في {toArabicNumber(duration)} يوما</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setWizardStep('start_point')}
                  className="flex-1 py-3 bg-secondary hover:bg-secondary/80 text-foreground font-medium rounded-xl transition-all"
                >
                  السابق
                </button>
                <button
                  type="button"
                  onClick={() => setWizardStep('imam_allocation')}
                  className="flex-1 py-3 bg-gold hover:bg-gold-light text-primary-foreground font-semibold rounded-xl transition-all"
                >
                  التالي: تعيين الائمة
                </button>
              </div>
            </>
          )}

          {wizardStep === 'imam_allocation' && (
            <>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    <Users className="w-4 h-4 inline ml-2" />
                    كم امام يشارك في الصلاة؟
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => handleImamCountChange(count)}
                        className={
                          imamCount === count
                            ? 'px-4 py-2 rounded-lg font-bold bg-gold text-primary-foreground transition-all'
                            : 'px-4 py-2 rounded-lg font-bold bg-secondary/50 text-muted-foreground hover:bg-secondary'
                        }
                      >
                        {count === 1 ? 'امام واحد' : `${toArabicNumber(count)} ائمة`}
                      </button>
                    ))}
                  </div>
                </div>

                {imamCount > 1 && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">قم بتسمية الائمة وتحديد الركعات لكل منهم:</p>
                    {imamAssignments.map((assignment, index) => (
                      <div key={index} className="p-4 bg-secondary/30 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">التحويلة {toArabicNumber(index + 1)}</span>
                          <span className="text-xs text-muted-foreground">
                            الركعات {toArabicNumber(assignment.startRakat)} - {toArabicNumber(assignment.endRakat)}
                          </span>
                        </div>
                        <input
                          type="text"
                          placeholder="اسم الامام"
                          value={assignment.imamName}
                          onChange={(e) => handleImamNameChange(index, e.target.value)}
                          className="w-full px-4 py-2 bg-background/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setWizardStep('daily_quantity')}
                  className="flex-1 py-3 bg-secondary hover:bg-secondary/80 text-foreground font-medium rounded-xl transition-all"
                >
                  السابق
                </button>
                <button
                  type="button"
                  onClick={() => setWizardStep('preview')}
                  className="flex-1 py-3 bg-gold hover:bg-gold-light text-primary-foreground font-semibold rounded-xl transition-all"
                >
                  التالي: معاينة
                </button>
              </div>
            </>
          )}

          {wizardStep === 'preview' && (
            <>
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold" />
                  معاينة الخطة
                </h3>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-background/50 rounded-lg">
                    <span className="text-muted-foreground block">البداية</span>
                    <span className="text-foreground font-bold">صفحة {toArabicNumber(startPage)}</span>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg">
                    <span className="text-muted-foreground block">النهاية</span>
                    <span className="text-foreground font-bold">صفحة {toArabicNumber(endPage)}</span>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg">
                    <span className="text-muted-foreground block">المدة</span>
                    <span className="text-gold font-bold">{toArabicNumber(duration)} يوما</span>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg">
                    <span className="text-muted-foreground block">الاجمالي</span>
                    <span className="text-gold font-bold">{toArabicNumber(totalPagesInPlan)} صفحة</span>
                  </div>
                </div>

                {willComplete && (
                  <div className="p-3 bg-success/10 border border-success/30 rounded-lg flex items-center gap-2">
                    <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <p className="text-success text-sm font-medium">ستكمل ختمة كاملة في {toArabicNumber(duration)} يوما</p>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">معاينة الليالي الاولى:</h4>
                  {schedulePreview.map((night) => (
                    <div key={night.nightNumber} className="p-4 bg-background/50 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gold">الليلة {toArabicNumber(night.nightNumber)}</span>
                        <span className="text-xs text-muted-foreground">
                          ~{toArabicNumber(night.totalPages)} صفحة | {toArabicNumber(night.rakatsCount)} ركعة
                        </span>
                      </div>

                      {imamCount > 1 &&
                        imamAssignments.map((assignment, imamIdx) => {
                          const imamRakats = night.rakats.filter(
                            (r) => r.rakatNumber >= assignment.startRakat && r.rakatNumber <= assignment.endRakat
                          );
                          if (imamRakats.length === 0) return null;

                          return (
                            <div key={imamIdx} className="mt-2 p-3 bg-gold/10 rounded-lg border border-gold/20">
                              <p className="text-xs font-semibold text-gold mb-2">
                                {assignment.imamName
                                  ? `الامام: ${assignment.imamName}`
                                  : `الامام ${toArabicNumber(imamIdx + 1)}`}
                              </p>
                              <div className="space-y-1">
                                {imamRakats.slice(0, 3).map((rakat) => (
                                  <div key={rakat.rakatNumber} className="text-xs text-muted-foreground flex justify-between">
                                    <span>ركعة {toArabicNumber(rakat.rakatNumber)}</span>
                                    <span>صفحة {toArabicNumber(rakat.partition.page)}</span>
                                  </div>
                                ))}
                                {imamRakats.slice(0, 3).map((rakat) => (
                                  <div key={`${rakat.rakatNumber}-ayah`} className="text-[11px] text-muted-foreground/80">
                                    {rakat.surahNameArabic} {toArabicNumber(rakat.startAyah)} - {toArabicNumber(rakat.endAyah)}
                                  </div>
                                ))}
                                {imamRakats.length > 3 && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    + {toArabicNumber(imamRakats.length - 3)} ركعات اخرى
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}

                      {imamCount === 1 && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {night.rakats.slice(0, 6).map((rakat) => (
                            <div key={rakat.rakatNumber} className="text-xs p-2 bg-gold/10 rounded border border-gold/30">
                              <div className="font-bold text-gold">ركعة {toArabicNumber(rakat.rakatNumber)}</div>
                              <div className="text-muted-foreground mt-1">
                                <div className="font-semibold">صفحة {toArabicNumber(rakat.partition.page)}</div>
                                <div className="text-[10px] truncate">
                                  {rakat.surahNameArabic} {toArabicNumber(rakat.startAyah)} - {toArabicNumber(rakat.endAyah)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {night.rakats.length > 6 && (
                        <p className="text-xs text-muted-foreground text-center">+ {toArabicNumber(night.rakats.length - 6)} ركعات اخرى</p>
                      )}
                    </div>
                  ))}
                  {duration > 3 && (
                    <p className="text-xs text-muted-foreground text-center mt-2">... وباقي {toArabicNumber(duration - 3)} ليلة</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setWizardStep('imam_allocation')}
                  className="flex-1 py-3 bg-secondary hover:bg-secondary/80 text-foreground font-medium rounded-xl transition-all"
                >
                  السابق
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gold hover:bg-gold-light text-primary-foreground font-semibold rounded-xl transition-all glow-gold disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري الحفظ...' : 'حفظ الجدول'}
                </button>
              </div>
            </>
          )}

          <div className="flex justify-center gap-2 mt-4">
            {(['start_point', 'daily_quantity', 'imam_allocation', 'preview'] as WizardStep[]).map((step, idx) => (
              <div
                key={step}
                className={
                  'h-2 w-8 rounded-full transition-all ' +
                  (wizardStep === step
                    ? 'bg-gold'
                    : ['start_point', 'daily_quantity', 'imam_allocation', 'preview'].indexOf(wizardStep) > idx
                      ? 'bg-gold/50'
                      : 'bg-secondary/50')
                }
              />
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};
