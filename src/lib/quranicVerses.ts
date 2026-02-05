// Quranic verses about time, prayer, and worship
export const quranicVerses = [
  {
    arabic: 'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا',
    translation: 'إن الصلاة كانت على المؤمنين فريضة محددة بأوقاتها',
    surah: 'النساء',
    ayah: 103,
  },
  {
    arabic: 'وَسَبِّحْ بِحَمْدِ رَبِّكَ قَبْلَ طُلُوعِ الشَّمْسِ وَقَبْلَ غُرُوبِهَا',
    translation: 'وسبح بحمد ربك قبل طلوع الشمس وقبل غروبها',
    surah: 'طه',
    ayah: 130,
  },
  {
    arabic: 'أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ إِلَىٰ غَسَقِ اللَّيْلِ',
    translation: 'أقم الصلاة من زوال الشمس إلى ظلام الليل',
    surah: 'الإسراء',
    ayah: 78,
  },
  {
    arabic: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ',
    translation: 'واستعينوا على أموركم بالصبر والصلاة',
    surah: 'البقرة',
    ayah: 45,
  },
  {
    arabic: 'شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ',
    translation: 'شهر رمضان الذي أنزل فيه القرآن هدى للناس',
    surah: 'البقرة',
    ayah: 185,
  },
  {
    arabic: 'وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا',
    translation: 'ورتل القرآن ترتيلاً حسناً',
    surah: 'المزمل',
    ayah: 4,
  },
  {
    arabic: 'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ',
    translation: 'إنا أنزلنا القرآن في ليلة القدر',
    surah: 'القدر',
    ayah: 1,
  },
  {
    arabic: 'حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ',
    translation: 'حافظوا على الصلوات والصلاة الوسطى',
    surah: 'البقرة',
    ayah: 238,
  },
];

export function getRandomVerse() {
  const randomIndex = Math.floor(Math.random() * quranicVerses.length);
  return quranicVerses[randomIndex];
}
