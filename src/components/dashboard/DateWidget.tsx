import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import {
  formatGregorianDateArabic,
  getArabicDayName,
  toArabicNumber,
} from '@/lib/hijriDate';
import { fetchPrayerTimes, PrayerTimesData } from '@/lib/prayerTimes';

export const DateWidget: React.FC = () => {
  const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
  const today = new Date();
  const dayName = getArabicDayName(today);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchPrayerTimes();
      setPrayerData(data);
    };
    loadData();
  }, []);

  // Use Hijri date from API if available
  const hijriDisplay = prayerData?.hijriDate 
    ? `${toArabicNumber(parseInt(prayerData.hijriDate.day))} ${prayerData.hijriDate.monthAr} ${toArabicNumber(parseInt(prayerData.hijriDate.year))} هـ`
    : null;
  
  const isRamadan = prayerData?.hijriDate?.month === '9';
  const ramadanDay = prayerData?.hijriDate ? parseInt(prayerData.hijriDate.day) : null;

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
        {hijriDisplay ? (
          <p className="text-xl font-semibold text-gold">{hijriDisplay}</p>
        ) : (
          <div className="h-7 bg-muted rounded w-48 animate-pulse" />
        )}
        {isRamadan && ramadanDay && (
          <p className="text-muted-foreground mt-1">
            الليلة {toArabicNumber(ramadanDay)} من رمضان
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
