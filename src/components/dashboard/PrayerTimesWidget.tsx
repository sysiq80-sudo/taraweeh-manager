import React, { useEffect, useState } from 'react';
import { Moon, Sun, Sunrise, Sunset, Clock } from 'lucide-react';
import {
  fetchPrayerTimes,
  getNextPrayer,
  getTimeUntilPrayer,
  formatTimeArabic,
  PrayerTimesData,
} from '@/lib/prayerTimes';
import { toArabicNumber } from '@/lib/hijriDate';

interface PrayerTime {
  name: string;
  nameArabic: string;
  time: string;
  icon: React.ReactNode;
}

export const PrayerTimesWidget: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; nameArabic: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrayerTimes = async () => {
      const times = await fetchPrayerTimes();
      setPrayerTimes(times);
      if (times) {
        setNextPrayer(getNextPrayer(times));
      }
      setLoading(false);
    };

    loadPrayerTimes();
  }, []);

  useEffect(() => {
    if (!nextPrayer) return;

    const updateCountdown = () => {
      setCountdown(getTimeUntilPrayer(nextPrayer.time));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextPrayer]);

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-4" />
        <div className="h-20 bg-muted rounded mb-4" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!prayerTimes) {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <p className="text-muted-foreground">تعذر تحميل مواقيت الصلاة</p>
      </div>
    );
  }

  const prayers: PrayerTime[] = [
    { name: 'Fajr', nameArabic: 'الفجر', time: prayerTimes.fajr, icon: <Moon className="w-5 h-5" /> },
    { name: 'Sunrise', nameArabic: 'الشروق', time: prayerTimes.sunrise, icon: <Sunrise className="w-5 h-5" /> },
    { name: 'Dhuhr', nameArabic: 'الظهر', time: prayerTimes.dhuhr, icon: <Sun className="w-5 h-5" /> },
    { name: 'Asr', nameArabic: 'العصر', time: prayerTimes.asr, icon: <Sun className="w-5 h-5 opacity-70" /> },
    { name: 'Maghrib', nameArabic: 'المغرب', time: prayerTimes.maghrib, icon: <Sunset className="w-5 h-5" /> },
    { name: 'Isha', nameArabic: 'العشاء', time: prayerTimes.isha, icon: <Moon className="w-5 h-5" /> },
  ];

  return (
    <div className="glass rounded-2xl p-6 card-hover">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">مواقيت الصلاة</h2>
        <span className="text-sm text-muted-foreground">الأنبار، العراق</span>
      </div>

      {/* Next Prayer Countdown */}
      {nextPrayer && (
        <div className="bg-gradient-card rounded-xl p-5 mb-6 border border-gold/20 glow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-sm">الصلاة القادمة</span>
            <Clock className="w-4 h-4 text-gold" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gold">{nextPrayer.nameArabic}</h3>
              <p className="text-muted-foreground">{formatTimeArabic(nextPrayer.time)}</p>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 text-3xl font-bold text-foreground arabic-nums">
                <span className="text-gold">{toArabicNumber(countdown.seconds)}</span>
                <span className="text-muted-foreground">:</span>
                <span>{toArabicNumber(countdown.minutes)}</span>
                <span className="text-muted-foreground">:</span>
                <span>{toArabicNumber(countdown.hours)}</span>
              </div>
              <p className="text-xs text-muted-foreground text-left mt-1">ساعة : دقيقة : ثانية</p>
            </div>
          </div>
        </div>
      )}

      {/* Prayer Times Grid */}
      <div className="grid grid-cols-3 gap-3">
        {prayers.map((prayer) => (
          <div
            key={prayer.name}
            className={`rounded-xl p-3 text-center transition-all ${
              nextPrayer?.name === prayer.name
                ? 'bg-gold/20 border border-gold/40'
                : 'bg-secondary/50 hover:bg-secondary'
            }`}
          >
            <div
              className={`mx-auto mb-2 ${
                nextPrayer?.name === prayer.name ? 'text-gold' : 'text-muted-foreground'
              }`}
            >
              {prayer.icon}
            </div>
            <p className="text-sm font-medium text-foreground mb-1">{prayer.nameArabic}</p>
            <p className="text-xs text-muted-foreground">{formatTimeArabic(prayer.time)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
