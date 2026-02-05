import React from 'react';
import { Calendar } from 'lucide-react';
import {
  formatHijriDate,
  formatGregorianDateArabic,
  getArabicDayName,
  toHijriDate,
  toArabicNumber,
} from '@/lib/hijriDate';

export const DateWidget: React.FC = () => {
  const today = new Date();
  const hijri = toHijriDate(today);
  const dayName = getArabicDayName(today);
  const isRamadan = hijri.month === 9;

  return (
    <div className="glass rounded-2xl p-6 card-hover">
      {/* Crescent Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
          <Calendar className="w-6 h-6 text-gold" />
        </div>
        {isRamadan && (
          <span className="px-3 py-1 bg-gold/20 text-gold text-sm rounded-full font-medium">
            رمضان مبارك
          </span>
        )}
      </div>

      {/* Day Name */}
      <h2 className="text-3xl font-bold text-foreground mb-2">{dayName}</h2>

      {/* Hijri Date */}
      <div className="mb-4">
        <p className="text-xl font-semibold text-gold">{formatHijriDate(today)}</p>
        {isRamadan && (
          <p className="text-muted-foreground mt-1">
            الليلة {toArabicNumber(hijri.day)} من رمضان
          </p>
        )}
      </div>

      {/* Gregorian Date */}
      <div className="pt-4 border-t border-border/50">
        <p className="text-muted-foreground text-sm">التاريخ الميلادي</p>
        <p className="text-foreground">{formatGregorianDateArabic(today)}</p>
      </div>
    </div>
  );
};
