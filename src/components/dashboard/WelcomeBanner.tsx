import React from 'react';
import { Sparkles, Share2 } from 'lucide-react';
import { MosqueSilhouette } from '@/components/ui/IslamicPattern';
import { toArabicNumber, toHijriDate } from '@/lib/hijriDate';

interface WelcomeBannerProps {
  userName?: string;
  ramadanDay?: number;
  onEditSchedule?: () => void;
  onShare?: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  userName = 'أحمد',
  ramadanDay,
  onEditSchedule,
  onShare,
}) => {
  const today = new Date();
  const hijri = toHijriDate(today);
  const isRamadan = hijri.month === 9;
  const displayDay = ramadanDay || (isRamadan ? hijri.day : 1);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-card border border-gold/20 glow-soft">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10">
        <MosqueSilhouette className="absolute bottom-0 left-0 right-0 w-full h-32 text-gold" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Text Content */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold animate-pulse" />
              <span className="text-gold text-sm font-medium">
                {isRamadan ? 'رمضان مبارك' : 'أهلاً بك'}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              السلام عليكم، {userName}
            </h1>
            
            <p className="text-muted-foreground text-lg max-w-lg">
              {isRamadan
                ? `الليلة ${toArabicNumber(displayDay)} من رمضان المبارك. تابع تقدمك في الختمة وجدول التراويح.`
                : 'مرحباً بك في منظّم التراويح. جهّز خطتك لشهر رمضان المبارك.'
              }
            </p>
          </div>

          {/* Stats Card */}
          <div className="flex gap-4">
            <div className="glass rounded-xl p-4 text-center min-w-[100px]">
              <p className="text-3xl font-bold text-gold">{toArabicNumber(displayDay)}</p>
              <p className="text-sm text-muted-foreground">يوم رمضان</p>
            </div>
            <div className="glass rounded-xl p-4 text-center min-w-[100px]">
              <p className="text-3xl font-bold text-foreground">{toArabicNumber(30 - displayDay)}</p>
              <p className="text-sm text-muted-foreground">أيام متبقية</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button className="px-5 py-2.5 bg-gold hover:bg-gold-light text-primary-foreground font-semibold rounded-xl transition-all glow-gold">
            عرض قراءة الليلة
          </button>
          <button 
            onClick={onEditSchedule}
            className="px-5 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground font-medium rounded-xl transition-all border border-border"
          >
            تعديل الجدول
          </button>
          <button 
            onClick={onShare}
            className="px-5 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 font-medium rounded-xl transition-all border border-blue-500/30 flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            مشاركة الجدول
          </button>
        </div>
      </div>
    </div>
  );
};
