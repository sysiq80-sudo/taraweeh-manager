import React from 'react';
import { BookOpen, ChevronLeft, Clock } from 'lucide-react';
import { toArabicNumber } from '@/lib/hijriDate';
import { juzData } from '@/lib/quranData';

interface TodayScheduleCardProps {
  ramadanDay?: number;
  juzNumber?: number;
  startPage?: number;
  endPage?: number;
  surahRange?: string;
  rakatsAssigned?: string;
}

export const TodayScheduleCard: React.FC<TodayScheduleCardProps> = ({
  ramadanDay = 1,
  juzNumber = 1,
  startPage = 1,
  endPage = 20,
  surahRange = 'الفاتحة - البقرة (الآية ١٤١)',
  rakatsAssigned = 'أول ٤ ركعات',
}) => {
  const juz = juzData.find((j) => j.number === juzNumber);

  return (
    <div className="glass rounded-2xl overflow-hidden card-hover">
      {/* Header with gradient */}
      <div className="bg-gradient-gold p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/80 text-sm mb-1">قراءة الليلة</p>
            <h2 className="text-2xl font-bold text-primary-foreground">
              الليلة {toArabicNumber(ramadanDay)} من رمضان
            </h2>
          </div>
          <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Juz Info */}
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
          <div>
            <p className="text-muted-foreground text-sm mb-1">الجزء</p>
            <p className="text-xl font-bold text-foreground">{juz?.name || `الجزء ${toArabicNumber(juzNumber)}`}</p>
          </div>
          <div className="text-left">
            <p className="text-muted-foreground text-sm mb-1">الصفحات</p>
            <p className="text-lg font-semibold text-gold">
              {toArabicNumber(startPage)} - {toArabicNumber(endPage)}
            </p>
          </div>
        </div>

        {/* Surah Range */}
        <div className="p-4 bg-secondary/50 rounded-xl">
          <p className="text-muted-foreground text-sm mb-2">نطاق السور</p>
          <p className="text-lg font-medium text-foreground">{surahRange}</p>
        </div>

        {/* Assignment Info */}
        <div className="flex items-center justify-between p-4 border border-gold/20 rounded-xl">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gold" />
            <div>
              <p className="text-muted-foreground text-sm">الركعات المخصصة</p>
              <p className="font-semibold text-foreground">{rakatsAssigned}</p>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      {/* Action Button */}
      <div className="px-5 pb-5">
        <button className="w-full py-3 bg-gold hover:bg-gold-light text-primary-foreground font-semibold rounded-xl transition-all glow-gold">
          عرض التفاصيل الكاملة
        </button>
      </div>
    </div>
  );
};
