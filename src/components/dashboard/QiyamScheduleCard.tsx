import React from 'react';
import { Moon, BookOpen, MapPin } from 'lucide-react';
import { toArabicNumber } from '@/lib/hijriDate';

interface QiyamScheduleCardProps {
  ramadanDay?: number;
  startPage?: number;
  endPage?: number;
  surahRange?: string;
  rakatsAssigned?: string;
}

export const QiyamScheduleCard: React.FC<QiyamScheduleCardProps> = ({
  ramadanDay = 21,
  startPage = 500,
  endPage = 520,
  surahRange = 'الجزء الأخير',
  rakatsAssigned = 'آخر ركعات الليل',
}) => {
  const pageCount = endPage - startPage + 1;

  return (
    <div className="glass rounded-2xl p-6 border-2 border-purple-500/30 card-hover relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-3xl" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Moon className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-bold text-foreground">جدول قيام الليل</h3>
          </div>
          <p className="text-sm text-purple-400">الأيام الأخيرة من رمضان</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gold">{toArabicNumber(ramadanDay)}</p>
          <p className="text-xs text-muted-foreground">يوم رمضان</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
        {/* Pages */}
        <div className="bg-secondary/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-gold" />
            <p className="text-xs text-muted-foreground">الصفحات</p>
          </div>
          <p className="text-lg font-bold text-foreground">
            {toArabicNumber(startPage)} - {toArabicNumber(endPage)}
          </p>
          <p className="text-xs text-gold mt-1">{toArabicNumber(pageCount)} صفحات</p>
        </div>

        {/* Surah Range */}
        <div className="bg-secondary/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-muted-foreground">النطاق</p>
          </div>
          <p className="text-sm font-medium text-foreground truncate">{surahRange}</p>
          <p className="text-xs text-purple-400 mt-1">{rakatsAssigned}</p>
        </div>
      </div>

      {/* Status Bar */}
      <div className="relative z-10 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
        <p className="text-xs text-purple-300 text-center">
          ℹ️ جدول منفصل للأيام الأخيرة - لن يؤثر على جدول التراويح
        </p>
      </div>
    </div>
  );
};
