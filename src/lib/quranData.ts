// Quran data structure for scheduling

// Quran starts at page 2 (page 1 is cover/Fatiha which is excluded)
export const quranStartPage = 2;

export interface QuranJuz {
  number: number;
  name: string;
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
  pages: number;
}

export interface QuranSurah {
  number: number;
  name: string;
  nameArabic: string;
  ayahCount: number;
  startPage: number;
}

// Juz information with Arabic names
export const juzData: QuranJuz[] = [
  { number: 1, name: 'الجزء الأول', startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 141, pages: 20 },
  { number: 2, name: 'الجزء الثاني', startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252, pages: 20 },
  { number: 3, name: 'الجزء الثالث', startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 92, pages: 20 },
  { number: 4, name: 'الجزء الرابع', startSurah: 3, startAyah: 93, endSurah: 4, endAyah: 23, pages: 20 },
  { number: 5, name: 'الجزء الخامس', startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147, pages: 20 },
  { number: 6, name: 'الجزء السادس', startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81, pages: 20 },
  { number: 7, name: 'الجزء السابع', startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110, pages: 20 },
  { number: 8, name: 'الجزء الثامن', startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87, pages: 20 },
  { number: 9, name: 'الجزء التاسع', startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40, pages: 20 },
  { number: 10, name: 'الجزء العاشر', startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92, pages: 20 },
  { number: 11, name: 'الجزء الحادي عشر', startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5, pages: 20 },
  { number: 12, name: 'الجزء الثاني عشر', startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52, pages: 20 },
  { number: 13, name: 'الجزء الثالث عشر', startSurah: 12, startAyah: 53, endSurah: 14, endAyah: 52, pages: 20 },
  { number: 14, name: 'الجزء الرابع عشر', startSurah: 15, startAyah: 1, endSurah: 16, endAyah: 128, pages: 20 },
  { number: 15, name: 'الجزء الخامس عشر', startSurah: 17, startAyah: 1, endSurah: 18, endAyah: 74, pages: 20 },
  { number: 16, name: 'الجزء السادس عشر', startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135, pages: 20 },
  { number: 17, name: 'الجزء السابع عشر', startSurah: 21, startAyah: 1, endSurah: 22, endAyah: 78, pages: 20 },
  { number: 18, name: 'الجزء الثامن عشر', startSurah: 23, startAyah: 1, endSurah: 25, endAyah: 20, pages: 20 },
  { number: 19, name: 'الجزء التاسع عشر', startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 55, pages: 20 },
  { number: 20, name: 'الجزء العشرون', startSurah: 27, startAyah: 56, endSurah: 29, endAyah: 45, pages: 20 },
  { number: 21, name: 'الجزء الحادي والعشرون', startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30, pages: 20 },
  { number: 22, name: 'الجزء الثاني والعشرون', startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27, pages: 20 },
  { number: 23, name: 'الجزء الثالث والعشرون', startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31, pages: 20 },
  { number: 24, name: 'الجزء الرابع والعشرون', startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46, pages: 20 },
  { number: 25, name: 'الجزء الخامس والعشرون', startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37, pages: 20 },
  { number: 26, name: 'الجزء السادس والعشرون', startSurah: 46, startAyah: 1, endSurah: 51, endAyah: 30, pages: 20 },
  { number: 27, name: 'الجزء السابع والعشرون', startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29, pages: 20 },
  { number: 28, name: 'الجزء الثامن والعشرون', startSurah: 58, startAyah: 1, endSurah: 66, endAyah: 12, pages: 20 },
  { number: 29, name: 'الجزء التاسع والعشرون', startSurah: 67, startAyah: 1, endSurah: 77, endAyah: 50, pages: 20 },
  { number: 30, name: 'الجزء الثلاثون', startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6, pages: 24 },
];

// Major Surahs for display
export const majorSurahs: QuranSurah[] = [
  { number: 1, name: 'Al-Fatiha', nameArabic: 'الفاتحة', ayahCount: 7, startPage: 1 },
  { number: 2, name: 'Al-Baqarah', nameArabic: 'البقرة', ayahCount: 286, startPage: 2 },
  { number: 3, name: 'Ali Imran', nameArabic: 'آل عمران', ayahCount: 200, startPage: 50 },
  { number: 4, name: 'An-Nisa', nameArabic: 'النساء', ayahCount: 176, startPage: 77 },
  { number: 18, name: 'Al-Kahf', nameArabic: 'الكهف', ayahCount: 110, startPage: 293 },
  { number: 36, name: 'Ya-Sin', nameArabic: 'يس', ayahCount: 83, startPage: 440 },
  { number: 67, name: 'Al-Mulk', nameArabic: 'الملك', ayahCount: 30, startPage: 562 },
  { number: 114, name: 'An-Nas', nameArabic: 'الناس', ayahCount: 6, startPage: 604 },
];

export const totalQuranPages = 604;
export const totalJuz = 30;

export function getJuzByNumber(juzNumber: number): QuranJuz | undefined {
  return juzData.find((j) => j.number === juzNumber);
}

export function calculateProgress(completedPages: number): number {
  return Math.round((completedPages / totalQuranPages) * 100);
}

export function getPagesForNights(totalNights: number = 30): number {
  return Math.ceil(totalQuranPages / totalNights);
}
