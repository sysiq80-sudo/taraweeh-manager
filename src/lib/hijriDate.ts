// Hijri date utilities for Arabic display

const hijriMonths = [
  'محرّم',
  'صفر',
  'ربيع الأول',
  'ربيع الثاني',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوّال',
  'ذو القعدة',
  'ذو الحجة',
];

const arabicDays = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toArabicNumber(num: number): string {
  return num
    .toString()
    .split('')
    .map((digit) => arabicNumbers[parseInt(digit)] || digit)
    .join('');
}

export function getArabicDayName(date: Date): string {
  return arabicDays[date.getDay()];
}

export function getHijriMonth(monthIndex: number): string {
  return hijriMonths[monthIndex] || '';
}

// Simple Hijri date calculation (approximate - for production use a proper library)
export function toHijriDate(gregorianDate: Date): {
  day: number;
  month: number;
  year: number;
  monthName: string;
} {
  // Using the Umm al-Qura calendar approximation
  const gregorianYear = gregorianDate.getFullYear();
  const gregorianMonth = gregorianDate.getMonth();
  const gregorianDay = gregorianDate.getDate();

  // Julian Day Number
  const a = Math.floor((14 - (gregorianMonth + 1)) / 12);
  const y = gregorianYear + 4800 - a;
  const m = gregorianMonth + 1 + 12 * a - 3;
  const jd =
    gregorianDay +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  // Convert to Hijri
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const remainder = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - remainder) / 5316) *
      Math.floor((50 * remainder) / 17719) +
    Math.floor(remainder / 5670) * Math.floor((43 * remainder) / 15238);
  const adjustedRemainder =
    remainder -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;

  const hijriMonth = Math.floor((24 * adjustedRemainder) / 709);
  const hijriDay = adjustedRemainder - Math.floor((709 * hijriMonth) / 24);
  const hijriYear = 30 * n + j - 30;

  return {
    day: hijriDay,
    month: hijriMonth,
    year: hijriYear,
    monthName: getHijriMonth(hijriMonth - 1),
  };
}

export function formatHijriDate(date: Date): string {
  const hijri = toHijriDate(date);
  return `${toArabicNumber(hijri.day)} ${hijri.monthName} ${toArabicNumber(hijri.year)} هـ`;
}

export function formatGregorianDateArabic(date: Date): string {
  const months = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ];

  return `${toArabicNumber(date.getDate())} ${months[date.getMonth()]} ${toArabicNumber(date.getFullYear())}`;
}

// Get Ramadan day number (1-30)
export function getRamadanDay(date: Date): number | null {
  const hijri = toHijriDate(date);
  if (hijri.month === 9) {
    // Ramadan
    return hijri.day;
  }
  return null;
}
