import React from 'react';
import { Award, TrendingUp } from 'lucide-react';
import { toArabicNumber } from '@/lib/hijriDate';
import { totalQuranPages, totalJuz } from '@/lib/quranData';

interface ProgressWidgetProps {
  completedPages?: number;
  completedJuz?: number;
  currentStreak?: number;
}

export const ProgressWidget: React.FC<ProgressWidgetProps> = ({
  completedPages = 80,
  completedJuz = 4,
  currentStreak = 5,
}) => {
  const progressPercentage = Math.round((completedPages / totalQuranPages) * 100);
  const juzProgress = Math.round((completedJuz / totalJuz) * 100);

  return (
    <div className="glass rounded-2xl p-6 card-hover">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">تقدم الختمة</h2>
        <div className="flex items-center gap-2 text-gold">
          <TrendingUp className="w-5 h-5" />
          <span className="font-semibold">{toArabicNumber(currentStreak)} أيام متتالية</span>
        </div>
      </div>

      {/* Main Progress Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-40 h-40">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress Circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#progressGradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - progressPercentage / 100)}`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--gold))" />
                <stop offset="100%" stopColor="hsl(var(--gold-light))" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gold">{toArabicNumber(progressPercentage)}%</span>
            <span className="text-sm text-muted-foreground">مكتمل</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Pages Read */}
        <div className="bg-secondary/50 rounded-xl p-4 text-center">
          <p className="text-muted-foreground text-sm mb-1">الصفحات المقروءة</p>
          <p className="text-2xl font-bold text-foreground">
            {toArabicNumber(completedPages)}/{toArabicNumber(totalQuranPages)}
          </p>
        </div>

        {/* Juz Completed */}
        <div className="bg-secondary/50 rounded-xl p-4 text-center">
          <p className="text-muted-foreground text-sm mb-1">الأجزاء المكتملة</p>
          <p className="text-2xl font-bold text-foreground">
            {toArabicNumber(completedJuz)}/{toArabicNumber(totalJuz)}
          </p>
        </div>
      </div>

      {/* Juz Progress Bar */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">تقدم الأجزاء</span>
          <span className="text-sm font-medium text-gold">{toArabicNumber(juzProgress)}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full progress-gold rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${juzProgress}%` }}
          />
        </div>
      </div>

      {/* Achievement Badge */}
      {completedJuz >= 5 && (
        <div className="mt-4 p-3 bg-gold/10 border border-gold/20 rounded-xl flex items-center gap-3">
          <Award className="w-6 h-6 text-gold" />
          <div>
            <p className="font-semibold text-foreground">إنجاز جديد!</p>
            <p className="text-sm text-muted-foreground">أكملت ٥ أجزاء من القرآن الكريم</p>
          </div>
        </div>
      )}
    </div>
  );
};
