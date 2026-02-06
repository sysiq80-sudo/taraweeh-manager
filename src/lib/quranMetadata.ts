// Complete Quran Metadata for Advanced Scheduling
// Contains all 114 Surahs with their start pages and ayah counts

export interface SurahMetadata {
  number: number;
  name: string;
  nameArabic: string;
  ayahCount: number;
  startPage: number;
  endPage: number;
  revelationType: 'Meccan' | 'Medinan';
}

// Complete list of all 114 Surahs
export const allSurahs: SurahMetadata[] = [
  { number: 1, name: 'Al-Fatihah', nameArabic: 'الفاتحة', ayahCount: 7, startPage: 1, endPage: 1, revelationType: 'Meccan' },
  { number: 2, name: 'Al-Baqarah', nameArabic: 'البقرة', ayahCount: 286, startPage: 2, endPage: 49, revelationType: 'Medinan' },
  { number: 3, name: 'Ali Imran', nameArabic: 'آل عمران', ayahCount: 200, startPage: 50, endPage: 76, revelationType: 'Medinan' },
  { number: 4, name: 'An-Nisa', nameArabic: 'النساء', ayahCount: 176, startPage: 77, endPage: 106, revelationType: 'Medinan' },
  { number: 5, name: 'Al-Ma\'idah', nameArabic: 'المائدة', ayahCount: 120, startPage: 106, endPage: 127, revelationType: 'Medinan' },
  { number: 6, name: 'Al-An\'am', nameArabic: 'الأنعام', ayahCount: 165, startPage: 128, endPage: 150, revelationType: 'Meccan' },
  { number: 7, name: 'Al-A\'raf', nameArabic: 'الأعراف', ayahCount: 206, startPage: 151, endPage: 176, revelationType: 'Meccan' },
  { number: 8, name: 'Al-Anfal', nameArabic: 'الأنفال', ayahCount: 75, startPage: 177, endPage: 186, revelationType: 'Medinan' },
  { number: 9, name: 'At-Tawbah', nameArabic: 'التوبة', ayahCount: 129, startPage: 187, endPage: 206, revelationType: 'Medinan' },
  { number: 10, name: 'Yunus', nameArabic: 'يونس', ayahCount: 109, startPage: 208, endPage: 221, revelationType: 'Meccan' },
  { number: 11, name: 'Hud', nameArabic: 'هود', ayahCount: 123, startPage: 221, endPage: 235, revelationType: 'Meccan' },
  { number: 12, name: 'Yusuf', nameArabic: 'يوسف', ayahCount: 111, startPage: 235, endPage: 248, revelationType: 'Meccan' },
  { number: 13, name: 'Ar-Ra\'d', nameArabic: 'الرعد', ayahCount: 43, startPage: 249, endPage: 255, revelationType: 'Medinan' },
  { number: 14, name: 'Ibrahim', nameArabic: 'إبراهيم', ayahCount: 52, startPage: 255, endPage: 261, revelationType: 'Meccan' },
  { number: 15, name: 'Al-Hijr', nameArabic: 'الحجر', ayahCount: 99, startPage: 262, endPage: 267, revelationType: 'Meccan' },
  { number: 16, name: 'An-Nahl', nameArabic: 'النحل', ayahCount: 128, startPage: 267, endPage: 281, revelationType: 'Meccan' },
  { number: 17, name: 'Al-Isra', nameArabic: 'الإسراء', ayahCount: 111, startPage: 282, endPage: 293, revelationType: 'Meccan' },
  { number: 18, name: 'Al-Kahf', nameArabic: 'الكهف', ayahCount: 110, startPage: 293, endPage: 304, revelationType: 'Meccan' },
  { number: 19, name: 'Maryam', nameArabic: 'مريم', ayahCount: 98, startPage: 305, endPage: 312, revelationType: 'Meccan' },
  { number: 20, name: 'Ta-Ha', nameArabic: 'طه', ayahCount: 135, startPage: 312, endPage: 321, revelationType: 'Meccan' },
  { number: 21, name: 'Al-Anbiya', nameArabic: 'الأنبياء', ayahCount: 112, startPage: 322, endPage: 331, revelationType: 'Meccan' },
  { number: 22, name: 'Al-Hajj', nameArabic: 'الحج', ayahCount: 78, startPage: 332, endPage: 341, revelationType: 'Medinan' },
  { number: 23, name: 'Al-Mu\'minun', nameArabic: 'المؤمنون', ayahCount: 118, startPage: 342, endPage: 349, revelationType: 'Meccan' },
  { number: 24, name: 'An-Nur', nameArabic: 'النور', ayahCount: 64, startPage: 350, endPage: 359, revelationType: 'Medinan' },
  { number: 25, name: 'Al-Furqan', nameArabic: 'الفرقان', ayahCount: 77, startPage: 359, endPage: 366, revelationType: 'Meccan' },
  { number: 26, name: 'Ash-Shu\'ara', nameArabic: 'الشعراء', ayahCount: 227, startPage: 367, endPage: 377, revelationType: 'Meccan' },
  { number: 27, name: 'An-Naml', nameArabic: 'النمل', ayahCount: 93, startPage: 377, endPage: 385, revelationType: 'Meccan' },
  { number: 28, name: 'Al-Qasas', nameArabic: 'القصص', ayahCount: 88, startPage: 385, endPage: 396, revelationType: 'Meccan' },
  { number: 29, name: 'Al-Ankabut', nameArabic: 'العنكبوت', ayahCount: 69, startPage: 396, endPage: 404, revelationType: 'Meccan' },
  { number: 30, name: 'Ar-Rum', nameArabic: 'الروم', ayahCount: 60, startPage: 404, endPage: 410, revelationType: 'Meccan' },
  { number: 31, name: 'Luqman', nameArabic: 'لقمان', ayahCount: 34, startPage: 411, endPage: 414, revelationType: 'Meccan' },
  { number: 32, name: 'As-Sajdah', nameArabic: 'السجدة', ayahCount: 30, startPage: 415, endPage: 417, revelationType: 'Meccan' },
  { number: 33, name: 'Al-Ahzab', nameArabic: 'الأحزاب', ayahCount: 73, startPage: 418, endPage: 427, revelationType: 'Medinan' },
  { number: 34, name: 'Saba', nameArabic: 'سبأ', ayahCount: 54, startPage: 428, endPage: 434, revelationType: 'Meccan' },
  { number: 35, name: 'Fatir', nameArabic: 'فاطر', ayahCount: 45, startPage: 434, endPage: 440, revelationType: 'Meccan' },
  { number: 36, name: 'Ya-Sin', nameArabic: 'يس', ayahCount: 83, startPage: 440, endPage: 445, revelationType: 'Meccan' },
  { number: 37, name: 'As-Saffat', nameArabic: 'الصافات', ayahCount: 182, startPage: 446, endPage: 452, revelationType: 'Meccan' },
  { number: 38, name: 'Sad', nameArabic: 'ص', ayahCount: 88, startPage: 453, endPage: 458, revelationType: 'Meccan' },
  { number: 39, name: 'Az-Zumar', nameArabic: 'الزمر', ayahCount: 75, startPage: 458, endPage: 467, revelationType: 'Meccan' },
  { number: 40, name: 'Ghafir', nameArabic: 'غافر', ayahCount: 85, startPage: 467, endPage: 476, revelationType: 'Meccan' },
  { number: 41, name: 'Fussilat', nameArabic: 'فصلت', ayahCount: 54, startPage: 477, endPage: 482, revelationType: 'Meccan' },
  { number: 42, name: 'Ash-Shuraa', nameArabic: 'الشورى', ayahCount: 53, startPage: 483, endPage: 489, revelationType: 'Meccan' },
  { number: 43, name: 'Az-Zukhruf', nameArabic: 'الزخرف', ayahCount: 89, startPage: 489, endPage: 495, revelationType: 'Meccan' },
  { number: 44, name: 'Ad-Dukhan', nameArabic: 'الدخان', ayahCount: 59, startPage: 496, endPage: 498, revelationType: 'Meccan' },
  { number: 45, name: 'Al-Jathiyah', nameArabic: 'الجاثية', ayahCount: 37, startPage: 499, endPage: 502, revelationType: 'Meccan' },
  { number: 46, name: 'Al-Ahqaf', nameArabic: 'الأحقاف', ayahCount: 35, startPage: 502, endPage: 506, revelationType: 'Meccan' },
  { number: 47, name: 'Muhammad', nameArabic: 'محمد', ayahCount: 38, startPage: 507, endPage: 510, revelationType: 'Medinan' },
  { number: 48, name: 'Al-Fath', nameArabic: 'الفتح', ayahCount: 29, startPage: 511, endPage: 515, revelationType: 'Medinan' },
  { number: 49, name: 'Al-Hujurat', nameArabic: 'الحجرات', ayahCount: 18, startPage: 515, endPage: 517, revelationType: 'Medinan' },
  { number: 50, name: 'Qaf', nameArabic: 'ق', ayahCount: 45, startPage: 518, endPage: 520, revelationType: 'Meccan' },
  { number: 51, name: 'Adh-Dhariyat', nameArabic: 'الذاريات', ayahCount: 60, startPage: 520, endPage: 523, revelationType: 'Meccan' },
  { number: 52, name: 'At-Tur', nameArabic: 'الطور', ayahCount: 49, startPage: 523, endPage: 525, revelationType: 'Meccan' },
  { number: 53, name: 'An-Najm', nameArabic: 'النجم', ayahCount: 62, startPage: 526, endPage: 528, revelationType: 'Meccan' },
  { number: 54, name: 'Al-Qamar', nameArabic: 'القمر', ayahCount: 55, startPage: 528, endPage: 531, revelationType: 'Meccan' },
  { number: 55, name: 'Ar-Rahman', nameArabic: 'الرحمن', ayahCount: 78, startPage: 531, endPage: 534, revelationType: 'Medinan' },
  { number: 56, name: 'Al-Waqi\'ah', nameArabic: 'الواقعة', ayahCount: 96, startPage: 534, endPage: 537, revelationType: 'Meccan' },
  { number: 57, name: 'Al-Hadid', nameArabic: 'الحديد', ayahCount: 29, startPage: 537, endPage: 541, revelationType: 'Medinan' },
  { number: 58, name: 'Al-Mujadila', nameArabic: 'المجادلة', ayahCount: 22, startPage: 542, endPage: 545, revelationType: 'Medinan' },
  { number: 59, name: 'Al-Hashr', nameArabic: 'الحشر', ayahCount: 24, startPage: 545, endPage: 548, revelationType: 'Medinan' },
  { number: 60, name: 'Al-Mumtahanah', nameArabic: 'الممتحنة', ayahCount: 13, startPage: 549, endPage: 550, revelationType: 'Medinan' },
  { number: 61, name: 'As-Saf', nameArabic: 'الصف', ayahCount: 14, startPage: 551, endPage: 552, revelationType: 'Medinan' },
  { number: 62, name: 'Al-Jumu\'ah', nameArabic: 'الجمعة', ayahCount: 11, startPage: 553, endPage: 554, revelationType: 'Medinan' },
  { number: 63, name: 'Al-Munafiqun', nameArabic: 'المنافقون', ayahCount: 11, startPage: 554, endPage: 555, revelationType: 'Medinan' },
  { number: 64, name: 'At-Taghabun', nameArabic: 'التغابن', ayahCount: 18, startPage: 556, endPage: 557, revelationType: 'Medinan' },
  { number: 65, name: 'At-Talaq', nameArabic: 'الطلاق', ayahCount: 12, startPage: 558, endPage: 559, revelationType: 'Medinan' },
  { number: 66, name: 'At-Tahrim', nameArabic: 'التحريم', ayahCount: 12, startPage: 560, endPage: 561, revelationType: 'Medinan' },
  { number: 67, name: 'Al-Mulk', nameArabic: 'الملك', ayahCount: 30, startPage: 562, endPage: 564, revelationType: 'Meccan' },
  { number: 68, name: 'Al-Qalam', nameArabic: 'القلم', ayahCount: 52, startPage: 564, endPage: 566, revelationType: 'Meccan' },
  { number: 69, name: 'Al-Haqqah', nameArabic: 'الحاقة', ayahCount: 52, startPage: 566, endPage: 568, revelationType: 'Meccan' },
  { number: 70, name: 'Al-Ma\'arij', nameArabic: 'المعارج', ayahCount: 44, startPage: 568, endPage: 570, revelationType: 'Meccan' },
  { number: 71, name: 'Nuh', nameArabic: 'نوح', ayahCount: 28, startPage: 570, endPage: 571, revelationType: 'Meccan' },
  { number: 72, name: 'Al-Jinn', nameArabic: 'الجن', ayahCount: 28, startPage: 572, endPage: 573, revelationType: 'Meccan' },
  { number: 73, name: 'Al-Muzzammil', nameArabic: 'المزمل', ayahCount: 20, startPage: 574, endPage: 575, revelationType: 'Meccan' },
  { number: 74, name: 'Al-Muddaththir', nameArabic: 'المدثر', ayahCount: 56, startPage: 575, endPage: 577, revelationType: 'Meccan' },
  { number: 75, name: 'Al-Qiyamah', nameArabic: 'القيامة', ayahCount: 40, startPage: 577, endPage: 578, revelationType: 'Meccan' },
  { number: 76, name: 'Al-Insan', nameArabic: 'الإنسان', ayahCount: 31, startPage: 578, endPage: 580, revelationType: 'Medinan' },
  { number: 77, name: 'Al-Mursalat', nameArabic: 'المرسلات', ayahCount: 50, startPage: 580, endPage: 582, revelationType: 'Meccan' },
  { number: 78, name: 'An-Naba', nameArabic: 'النبأ', ayahCount: 40, startPage: 582, endPage: 583, revelationType: 'Meccan' },
  { number: 79, name: 'An-Nazi\'at', nameArabic: 'النازعات', ayahCount: 46, startPage: 583, endPage: 585, revelationType: 'Meccan' },
  { number: 80, name: 'Abasa', nameArabic: 'عبس', ayahCount: 42, startPage: 585, endPage: 586, revelationType: 'Meccan' },
  { number: 81, name: 'At-Takwir', nameArabic: 'التكوير', ayahCount: 29, startPage: 586, endPage: 587, revelationType: 'Meccan' },
  { number: 82, name: 'Al-Infitar', nameArabic: 'الانفطار', ayahCount: 19, startPage: 587, endPage: 587, revelationType: 'Meccan' },
  { number: 83, name: 'Al-Mutaffifin', nameArabic: 'المطففين', ayahCount: 36, startPage: 587, endPage: 589, revelationType: 'Meccan' },
  { number: 84, name: 'Al-Inshiqaq', nameArabic: 'الانشقاق', ayahCount: 25, startPage: 589, endPage: 590, revelationType: 'Meccan' },
  { number: 85, name: 'Al-Buruj', nameArabic: 'البروج', ayahCount: 22, startPage: 590, endPage: 591, revelationType: 'Meccan' },
  { number: 86, name: 'At-Tariq', nameArabic: 'الطارق', ayahCount: 17, startPage: 591, endPage: 591, revelationType: 'Meccan' },
  { number: 87, name: 'Al-A\'la', nameArabic: 'الأعلى', ayahCount: 19, startPage: 591, endPage: 592, revelationType: 'Meccan' },
  { number: 88, name: 'Al-Ghashiyah', nameArabic: 'الغاشية', ayahCount: 26, startPage: 592, endPage: 592, revelationType: 'Meccan' },
  { number: 89, name: 'Al-Fajr', nameArabic: 'الفجر', ayahCount: 30, startPage: 593, endPage: 594, revelationType: 'Meccan' },
  { number: 90, name: 'Al-Balad', nameArabic: 'البلد', ayahCount: 20, startPage: 594, endPage: 595, revelationType: 'Meccan' },
  { number: 91, name: 'Ash-Shams', nameArabic: 'الشمس', ayahCount: 15, startPage: 595, endPage: 595, revelationType: 'Meccan' },
  { number: 92, name: 'Al-Layl', nameArabic: 'الليل', ayahCount: 21, startPage: 595, endPage: 596, revelationType: 'Meccan' },
  { number: 93, name: 'Ad-Duhaa', nameArabic: 'الضحى', ayahCount: 11, startPage: 596, endPage: 596, revelationType: 'Meccan' },
  { number: 94, name: 'Ash-Sharh', nameArabic: 'الشرح', ayahCount: 8, startPage: 596, endPage: 596, revelationType: 'Meccan' },
  { number: 95, name: 'At-Tin', nameArabic: 'التين', ayahCount: 8, startPage: 597, endPage: 597, revelationType: 'Meccan' },
  { number: 96, name: 'Al-Alaq', nameArabic: 'العلق', ayahCount: 19, startPage: 597, endPage: 597, revelationType: 'Meccan' },
  { number: 97, name: 'Al-Qadr', nameArabic: 'القدر', ayahCount: 5, startPage: 598, endPage: 598, revelationType: 'Meccan' },
  { number: 98, name: 'Al-Bayyinah', nameArabic: 'البينة', ayahCount: 8, startPage: 598, endPage: 599, revelationType: 'Medinan' },
  { number: 99, name: 'Az-Zalzalah', nameArabic: 'الزلزلة', ayahCount: 8, startPage: 599, endPage: 599, revelationType: 'Medinan' },
  { number: 100, name: 'Al-Adiyat', nameArabic: 'العاديات', ayahCount: 11, startPage: 599, endPage: 600, revelationType: 'Meccan' },
  { number: 101, name: 'Al-Qari\'ah', nameArabic: 'القارعة', ayahCount: 11, startPage: 600, endPage: 600, revelationType: 'Meccan' },
  { number: 102, name: 'At-Takathur', nameArabic: 'التكاثر', ayahCount: 8, startPage: 600, endPage: 600, revelationType: 'Meccan' },
  { number: 103, name: 'Al-Asr', nameArabic: 'العصر', ayahCount: 3, startPage: 601, endPage: 601, revelationType: 'Meccan' },
  { number: 104, name: 'Al-Humazah', nameArabic: 'الهمزة', ayahCount: 9, startPage: 601, endPage: 601, revelationType: 'Meccan' },
  { number: 105, name: 'Al-Fil', nameArabic: 'الفيل', ayahCount: 5, startPage: 601, endPage: 601, revelationType: 'Meccan' },
  { number: 106, name: 'Quraysh', nameArabic: 'قريش', ayahCount: 4, startPage: 602, endPage: 602, revelationType: 'Meccan' },
  { number: 107, name: 'Al-Ma\'un', nameArabic: 'الماعون', ayahCount: 7, startPage: 602, endPage: 602, revelationType: 'Meccan' },
  { number: 108, name: 'Al-Kawthar', nameArabic: 'الكوثر', ayahCount: 3, startPage: 602, endPage: 602, revelationType: 'Meccan' },
  { number: 109, name: 'Al-Kafirun', nameArabic: 'الكافرون', ayahCount: 6, startPage: 603, endPage: 603, revelationType: 'Meccan' },
  { number: 110, name: 'An-Nasr', nameArabic: 'النصر', ayahCount: 3, startPage: 603, endPage: 603, revelationType: 'Medinan' },
  { number: 111, name: 'Al-Masad', nameArabic: 'المسد', ayahCount: 5, startPage: 603, endPage: 603, revelationType: 'Meccan' },
  { number: 112, name: 'Al-Ikhlas', nameArabic: 'الإخلاص', ayahCount: 4, startPage: 604, endPage: 604, revelationType: 'Meccan' },
  { number: 113, name: 'Al-Falaq', nameArabic: 'الفلق', ayahCount: 5, startPage: 604, endPage: 604, revelationType: 'Meccan' },
  { number: 114, name: 'An-Nas', nameArabic: 'الناس', ayahCount: 6, startPage: 604, endPage: 604, revelationType: 'Meccan' },
];

// ==================== MOSQUE-CENTRIC TYPES ====================

/**
 * THE "NO-FATIHA" RULE (Critical)
 * Page 1 (Surat Al-Fatiha) is EXCLUDED from all calculations.
 * The Khatmah ALWAYS starts from Page 2 (Start of Surat Al-Baqarah).
 */
export const QURAN_START_PAGE = 2; // Physical Mushaf Page 2 (Al-Baqarah)
export const QURAN_END_PAGE = 604;
export const EFFECTIVE_QURAN_PAGES = QURAN_END_PAGE - QURAN_START_PAGE + 1; // 603 pages

/**
 * Dynamic Pacing: Different Rak'at counts for different phases
 * Example: Days 1-20: 20 Rak'ats, Days 21-30: 8 Rak'ats
 */
export interface RakatPhase {
  startDay: number;
  endDay: number;
  rakatsPerNight: number;
}

/**
 * Page Partition: Tracks position within a page
 * Example: Page 5, Part 2/3 means middle third of Page 5
 */
export interface PagePartition {
  page: number;
  part: number; // Current part (1-based)
  totalParts: number; // How many parts the page is divided into
  percentageStart: number; // 0-100
  percentageEnd: number; // 0-100
}

/**
 * Enhanced Rakat Breakdown with Page Partitioning
 */
export interface RakatBreakdown {
  rakatNumber: number;
  partition: PagePartition;
  startAyah: number;
  endAyah: number;
  ayahCount: number;
  surahName: string;
  surahNameArabic: string;
}

/**
 * Night Schedule with Smart Partitioning
 */
export interface NightSchedule {
  nightNumber: number;
  date: string;
  rakats: RakatBreakdown[];
  totalPages: number; // Total pages covered in this night
  rakatsCount: number; // Number of Rak'ats for this night
}

// ==================== HELPER FUNCTIONS ====================

export function getSurahByNumber(surahNumber: number): SurahMetadata | undefined {
  return allSurahs.find(s => s.number === surahNumber);
}

export function getSurahByPage(pageNumber: number): SurahMetadata | undefined {
  return allSurahs.find(s => pageNumber >= s.startPage && pageNumber <= s.endPage);
}

/**
 * Calculate pages per day (respecting Fatiha exclusion)
 * @param totalDays - Total duration in days
 * @param startPage - Starting page (default: 2, Al-Baqarah)
 * @param endPage - Ending page (default: 604)
 */
export function calculatePagesPerDay(totalDays: number, startPage: number = QURAN_START_PAGE, endPage: number = QURAN_END_PAGE): number {
  const totalPages = endPage - startPage + 1;
  return Math.ceil(totalPages / totalDays);
}

/**
 * Calculate total days needed (respecting Fatiha exclusion)
 * @param pagesPerDay - Pages to read per day
 * @param startPage - Starting page (default: 2, Al-Baqarah)
 * @param endPage - Ending page (default: 604)
 */
export function calculateTotalDays(pagesPerDay: number, startPage: number = QURAN_START_PAGE, endPage: number = QURAN_END_PAGE): number {
  const totalPages = endPage - startPage + 1;
  return Math.ceil(totalPages / pagesPerDay);
}

/**
 * Estimate ayah range within a page based on percentage
 * @param page - Page number
 * @param percentageStart - Starting percentage (0-100)
 * @param percentageEnd - Ending percentage (0-100)
 */
function estimateAyahRange(page: number, percentageStart: number, percentageEnd: number): { startAyah: number; endAyah: number } {
  const surah = getSurahByPage(page);
  if (!surah) return { startAyah: 1, endAyah: 15 };

  // Average ~15 ayahs per page
  const estimatedAyahsPerPage = 15;
  
  // Calculate ayah position within the page
  const ayahStart = Math.floor((percentageStart / 100) * estimatedAyahsPerPage) + 1;
  const ayahEnd = Math.ceil((percentageEnd / 100) * estimatedAyahsPerPage);
  
  return { 
    startAyah: Math.max(1, ayahStart), 
    endAyah: Math.min(estimatedAyahsPerPage, ayahEnd) 
  };
}

// ==================== SMART PARTITIONING ENGINE ====================

/**
 * THE SPLIT ALGORITHM (The Core Logic)
 * 
 * Implements "Mosque-Centric Continuous Flow" with precise page partitioning.
 * 
 * HOW IT WORKS:
 * - User sets: "How many Rak'ats to finish 1 Page?" (e.g., 3 Rak'ats = 1 Page)
 * - The engine divides each page into that many equal parts
 * - Each Rak'ah gets one part (e.g., 33.33% of the page)
 * - Carries over precisely to next page when current page is fully consumed
 * 
 * EXAMPLE: 1 Page = 3 Rak'ats
 * - Rak'ah 1: Page 2, Part 1/3 (0-33.33%) - Top third
 * - Rak'ah 2: Page 2, Part 2/3 (33.33-66.66%) - Middle third
 * - Rak'ah 3: Page 2, Part 3/3 (66.66-100%) - Bottom third
 * - Rak'ah 4: Page 3, Part 1/3 (0-33.33%) - Moves to next page
 * 
 * @param rakatsPerPage - How many Rak'ats needed to complete 1 full page (density setting)
 * @param totalRakatsForNight - Total Rak'ats to pray this night
 * @param globalCursorPage - Current page position (starts at QURAN_START_PAGE = 2)
 * @param globalCursorPercentage - Current position within the page (0-100)
 * @returns Array of RakatBreakdown with precise partitions
 */
function calculateSmartRakatPartitioning(
  rakatsPerPage: number,
  totalRakatsForNight: number,
  globalCursorPage: number,
  globalCursorPercentage: number
): { rakats: RakatBreakdown[]; nextPage: number; nextPercentage: number } {
  const rakats: RakatBreakdown[] = [];
  
  let currentPage = globalCursorPage;
  let currentPercentage = globalCursorPercentage;
  
  // Calculate how much percentage each Rak'ah consumes
  const percentagePerRakat = 100 / rakatsPerPage;
  
  for (let i = 0; i < totalRakatsForNight; i++) {
    // Determine which part of the page this Rak'ah occupies
    const partNumber = Math.floor(currentPercentage / percentagePerRakat) + 1;
    const startPercentage = currentPercentage;
    const endPercentage = Math.min(currentPercentage + percentagePerRakat, 100);
    
    // Get Surah info for this page
    const surah = getSurahByPage(currentPage);
    
    // Estimate ayah range based on percentage
    const { startAyah, endAyah } = estimateAyahRange(currentPage, startPercentage, endPercentage);
    
    rakats.push({
      rakatNumber: i + 1,
      partition: {
        page: currentPage,
        part: partNumber,
        totalParts: rakatsPerPage,
        percentageStart: Math.round(startPercentage * 10) / 10,
        percentageEnd: Math.round(endPercentage * 10) / 10,
      },
      startAyah,
      endAyah,
      ayahCount: endAyah - startAyah + 1,
      surahName: surah?.name || 'Unknown',
      surahNameArabic: surah?.nameArabic || 'غير معروف',
    });
    
    // Move cursor forward
    currentPercentage += percentagePerRakat;
    
    // Carry-over logic: Move to next page if current page is fully consumed
    if (currentPercentage >= 100) {
      currentPage++;
      currentPercentage = 0;
      
      // Safety: Don't exceed Quran
      if (currentPage > QURAN_END_PAGE) {
        currentPage = QURAN_START_PAGE; // Loop back (optional)
        currentPercentage = 0;
      }
    }
  }
  
  return {
    rakats,
    nextPage: currentPage,
    nextPercentage: currentPercentage,
  };
}

/**
 * Generate complete schedule preview with Smart Partitioning
 * 
 * THE "NO-FATIHA" RULE: Always starts from Page 2 (Al-Baqarah)
 * 
 * @param rakatsPerPage - Density: How many Rak'ats to complete 1 page (e.g., 3)
 * @param rakatPhases - Dynamic pacing: Different Rak'at counts for different phases
 * @param totalDays - Total duration of the schedule
 * @param startPage - Starting page (default: 2, respecting Fatiha exclusion)
 */
export function generateSchedulePreview(
  rakatsPerPage: number,
  rakatPhases: RakatPhase[],
  totalDays: number,
  startPage: number = QURAN_START_PAGE
): NightSchedule[] {
  const schedule: NightSchedule[] = [];
  
  // Global cursor tracking (THE CARRY-OVER LOGIC)
  let globalCursorPage = startPage;
  let globalCursorPercentage = 0;
  
  for (let day = 1; day <= totalDays && globalCursorPage <= QURAN_END_PAGE; day++) {
    // Find the appropriate Rak'at phase for this day
    const phase = rakatPhases.find(p => day >= p.startDay && day <= p.endDay);
    const rakatsForNight = phase?.rakatsPerNight || 8; // Default 8 Rak'ats
    
    // Calculate Rak'at partitions for this night
    const { rakats, nextPage, nextPercentage } = calculateSmartRakatPartitioning(
      rakatsPerPage,
      rakatsForNight,
      globalCursorPage,
      globalCursorPercentage
    );
    
    // Calculate total pages covered (approximation)
    const totalPagesFloat = rakatsForNight / rakatsPerPage;
    const totalPages = Math.ceil(totalPagesFloat * 10) / 10; // Round to 1 decimal
    
    schedule.push({
      nightNumber: day,
      date: new Date(Date.now() + (day - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      rakats,
      totalPages,
      rakatsCount: rakatsForNight,
    });
    
    // Update global cursor for next day (THE CARRY-OVER)
    globalCursorPage = nextPage;
    globalCursorPercentage = nextPercentage;
  }
  
  return schedule;
}

/**
 * LEGACY COMPATIBILITY: Simple schedule preview with uniform Rak'at count
 * (Wrapper around new smart partitioning engine)
 */
export function generateSchedulePreviewSimple(
  startPage: number,
  pagesPerDay: number,
  totalDays: number,
  rakatsPerNight: number
): NightSchedule[] {
  // Convert pagesPerDay to rakatsPerPage density
  // Logic: If pagesPerDay = 20 and rakatsPerNight = 20, then 1 page = 1 Rak'ah
  const rakatsPerPage = rakatsPerNight / pagesPerDay;
  
  // Create single phase for entire duration
  const phases: RakatPhase[] = [{
    startDay: 1,
    endDay: totalDays,
    rakatsPerNight,
  }];
  
  return generateSchedulePreview(rakatsPerPage, phases, totalDays, startPage);
}

// ==================== CONSTANTS ====================

export const totalQuranPages = QURAN_END_PAGE; // 604
export const effectiveQuranPages = EFFECTIVE_QURAN_PAGES; // 603 (excluding Fatiha)
export const totalSurahs = 114;
export const quranStartPage = QURAN_START_PAGE; // 2 (Al-Baqarah, respecting Fatiha exclusion)
