import React, { useState } from 'react';
import { X, BookOpen, Calendar, FileText } from 'lucide-react';
import { toArabicNumber } from '@/lib/hijriDate';
import { totalQuranPages, juzData } from '@/lib/quranData';
import { useSchedule } from '@/hooks/useSchedule';
import { useToast } from '@/hooks/use-toast';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose }) => {
  const { createReadingPlan } = useSchedule();
  const { toast } = useToast();
  
  const [startPage, setStartPage] = useState(1);
  const [pagesPerDay, setPagesPerDay] = useState(20);
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJuzSelect = (juzNumber: number) => {
    const juz = juzData.find(j => j.number === juzNumber);
    if (juz) {
      // Calculate approximate start page based on juz position
      const startPageForJuz = (juzNumber - 1) * 20 + 1;
      setStartPage(startPageForJuz);
      setSelectedJuz(juzNumber);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await createReadingPlan(startPage, pagesPerDay);
      
      if (error) {
        toast({
          title: 'خطأ',
          description: 'حدث خطأ في إنشاء الجدول',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'تم إنشاء الجدول',
          description: `تم إنشاء جدول قراءة ${toArabicNumber(pagesPerDay)} صفحة يومياً لمدة ٣٠ يوماً`,
        });
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Calculate preview
  const totalPagesInPlan = pagesPerDay * 30;
  const willComplete = totalPagesInPlan >= totalQuranPages;
  const endPage = Math.min(startPage + totalPagesInPlan - 1, totalQuranPages);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg glass rounded-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-gold p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary-foreground" />
            <h2 className="text-xl font-bold text-primary-foreground">تعديل الجدول</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-foreground/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Start Page / Juz Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              <BookOpen className="w-4 h-4 inline ml-2" />
              اختر نقطة البداية
            </label>
            
            {/* Juz Quick Select */}
            <div className="grid grid-cols-6 gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((juz) => (
                <button
                  key={juz}
                  type="button"
                  onClick={() => handleJuzSelect(juz)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    selectedJuz === juz
                      ? 'bg-gold text-primary-foreground'
                      : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  ج{toArabicNumber(juz)}
                </button>
              ))}
            </div>

            {/* Custom Page Input */}
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-sm">أو حدد الصفحة:</span>
              <input
                type="number"
                min={1}
                max={totalQuranPages}
                value={startPage}
                onChange={(e) => {
                  setStartPage(parseInt(e.target.value) || 1);
                  setSelectedJuz(null);
                }}
                className="w-24 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground text-center focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
              <span className="text-muted-foreground text-sm">
                من {toArabicNumber(totalQuranPages)}
              </span>
            </div>
          </div>

          {/* Pages Per Day */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              <FileText className="w-4 h-4 inline ml-2" />
              عدد الصفحات يومياً
            </label>
            
            <div className="grid grid-cols-4 gap-3">
              {[10, 15, 20, 25].map((pages) => (
                <button
                  key={pages}
                  type="button"
                  onClick={() => setPagesPerDay(pages)}
                  className={`p-3 rounded-xl transition-all ${
                    pagesPerDay === pages
                      ? 'bg-gold/20 border-2 border-gold text-gold'
                      : 'bg-secondary/50 border-2 border-transparent text-muted-foreground hover:border-gold/30'
                  }`}
                >
                  <span className="block text-xl font-bold">{toArabicNumber(pages)}</span>
                  <span className="text-xs">صفحة/يوم</span>
                </button>
              ))}
            </div>

            <input
              type="range"
              min={5}
              max={40}
              value={pagesPerDay}
              onChange={(e) => setPagesPerDay(parseInt(e.target.value))}
              className="w-full mt-4 accent-gold"
            />
          </div>

          {/* Preview */}
          <div className="p-4 bg-secondary/30 rounded-xl border border-border/50">
            <h3 className="font-semibold text-foreground mb-3">معاينة الخطة</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">البداية:</span>
                <span className="text-foreground mr-2">صفحة {toArabicNumber(startPage)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">النهاية:</span>
                <span className="text-foreground mr-2">صفحة {toArabicNumber(endPage)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">المدة:</span>
                <span className="text-foreground mr-2">٣٠ يوماً</span>
              </div>
              <div>
                <span className="text-muted-foreground">الإجمالي:</span>
                <span className={`mr-2 ${willComplete ? 'text-success' : 'text-gold'}`}>
                  {toArabicNumber(totalPagesInPlan)} صفحة
                </span>
              </div>
            </div>
            {willComplete && (
              <p className="text-success text-sm mt-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-success rounded-full" />
                ستكمل ختمة كاملة في ٣٠ يوماً
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-secondary hover:bg-secondary/80 text-foreground font-medium rounded-xl transition-all"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-gold hover:bg-gold-light text-primary-foreground font-semibold rounded-xl transition-all glow-gold disabled:opacity-50"
            >
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ الجدول'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
