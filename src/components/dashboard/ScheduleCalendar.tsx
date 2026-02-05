import React from 'react';
import { ChevronLeft, ChevronRight, Check, Circle } from 'lucide-react';
import { toArabicNumber } from '@/lib/hijriDate';
import { Schedule } from '@/hooks/useSchedule';

interface ScheduleCalendarProps {
  currentDay?: number;
  schedules?: Schedule[];
  loading?: boolean;
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  currentDay = 1,
  schedules = [],
  loading = false,
}) => {
  // Generate display data - either from real schedules or default placeholders
  const displayData = schedules.length > 0 
    ? schedules.map(s => ({
        day: s.day_number,
        juz: Math.ceil(s.start_page / 20),
        status: s.status as 'completed' | 'today' | 'upcoming' | 'absent',
      }))
    : Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        juz: i + 1,
        status: (i < currentDay - 1 ? 'completed' : i === currentDay - 1 ? 'today' : 'upcoming') as 'completed' | 'today' | 'upcoming' | 'absent',
      }));

  const completedCount = displayData.filter(d => d.status === 'completed').length;
  const todayCount = displayData.filter(d => d.status === 'today').length;
  const remainingCount = displayData.filter(d => d.status === 'upcoming').length;

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-6" />
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 card-hover">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">جدول رمضان</h2>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <span className="text-gold font-semibold">رمضان ١٤٤٦</span>
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">اليوم</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-muted-foreground">مكتمل</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-muted" />
          <span className="text-muted-foreground">قادم</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-6 gap-2">
        {displayData.map((schedule) => (
          <div
            key={schedule.day}
            className={`
              relative p-3 rounded-xl text-center transition-all cursor-pointer
              ${schedule.status === 'today' 
                ? 'bg-primary/20 border-2 border-primary ring-2 ring-primary/20' 
                : schedule.status === 'completed'
                  ? 'bg-success/10 border border-success/30'
                  : schedule.status === 'absent'
                    ? 'bg-destructive/10 border border-destructive/30'
                    : 'bg-secondary/50 hover:bg-secondary border border-transparent'
              }
            `}
          >
            {/* Day Number */}
            <p className={`text-lg font-bold mb-1 ${
              schedule.status === 'today' ? 'text-primary' : 
              schedule.status === 'completed' ? 'text-success' : 
              schedule.status === 'absent' ? 'text-destructive' : 'text-foreground'
            }`}>
              {toArabicNumber(schedule.day)}
            </p>
            
            {/* Juz Number */}
            <p className="text-xs text-muted-foreground">ج{toArabicNumber(schedule.juz)}</p>

            {/* Status Icon */}
            {schedule.status === 'completed' && (
              <div className="absolute -top-1 -left-1 w-5 h-5 bg-success rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
            {schedule.status === 'today' && (
              <div className="absolute -top-1 -left-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center animate-pulse">
                <Circle className="w-3 h-3 text-primary-foreground fill-current" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-sm">
        <div className="text-center">
          <p className="text-2xl font-bold text-success">{toArabicNumber(completedCount)}</p>
          <p className="text-muted-foreground">مكتمل</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{toArabicNumber(todayCount)}</p>
          <p className="text-muted-foreground">اليوم</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-muted-foreground">{toArabicNumber(remainingCount)}</p>
          <p className="text-muted-foreground">متبقي</p>
        </div>
      </div>
    </div>
  );
};
