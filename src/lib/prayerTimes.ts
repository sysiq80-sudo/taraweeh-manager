// Prayer times for Al Anbar, Iraq using Aladhan API

export interface PrayerTimesData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
  hijriDate?: {
    day: string;
    month: string;
    monthAr: string;
    year: string;
  };
}

// Ramadi, Al Anbar coordinates
const RAMADI_COORDS = {
  latitude: 33.4251,
  longitude: 43.3019,
};

export async function fetchPrayerTimes(date: Date = new Date()): Promise<PrayerTimesData | null> {
  try {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Using timingsByCity endpoint for Ramadi, Iraq with method 3 (Muslim World League)
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${RAMADI_COORDS.latitude}&longitude=${RAMADI_COORDS.longitude}&method=3&school=0`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch prayer times');
    }

    const data = await response.json();
    const timings = data.data.timings;
    const hijri = data.data.date.hijri;

    return {
      fajr: timings.Fajr,
      sunrise: timings.Sunrise,
      dhuhr: timings.Dhuhr,
      asr: timings.Asr,
      maghrib: timings.Maghrib,
      isha: timings.Isha,
      date: data.data.date.readable,
      hijriDate: {
        day: hijri.day,
        month: hijri.month.number.toString(),
        monthAr: hijri.month.ar,
        year: hijri.year,
      },
    };
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return null;
  }
}

export function getNextPrayer(prayerTimes: PrayerTimesData): {
  name: string;
  time: string;
  nameArabic: string;
} | null {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { name: 'Fajr', nameArabic: 'الفجر', time: prayerTimes.fajr },
    { name: 'Sunrise', nameArabic: 'الشروق', time: prayerTimes.sunrise },
    { name: 'Dhuhr', nameArabic: 'الظهر', time: prayerTimes.dhuhr },
    { name: 'Asr', nameArabic: 'العصر', time: prayerTimes.asr },
    { name: 'Maghrib', nameArabic: 'المغرب', time: prayerTimes.maghrib },
    { name: 'Isha', nameArabic: 'العشاء', time: prayerTimes.isha },
  ];

  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerMinutes = hours * 60 + minutes;

    if (prayerMinutes > currentTime) {
      return prayer;
    }
  }

  // If all prayers passed, return Fajr for next day
  return prayers[0];
}

export function getTimeUntilPrayer(prayerTime: string): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date();
  const [prayerHours, prayerMinutes] = prayerTime.split(':').map(Number);

  let targetTime = new Date(now);
  targetTime.setHours(prayerHours, prayerMinutes, 0, 0);

  // If the prayer time has passed, calculate for next day
  if (targetTime <= now) {
    targetTime.setDate(targetTime.getDate() + 1);
  }

  const diff = targetTime.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

export function formatTimeArabic(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'م' : 'ص';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}
