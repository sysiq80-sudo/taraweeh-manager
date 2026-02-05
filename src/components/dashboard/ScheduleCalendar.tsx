import React from 'react';
import { ChevronLeft, ChevronRight, Check, Circle } from 'lucide-react';
import { toArabicNumber } from '@/lib/hijriDate';

interface DaySchedule {
  day: number;
  juz: number;
  status: 'completed' | 'today' | 'upcoming' | 'absent';
}

interface ScheduleCalendarProps {
  currentDay?: number;
  scheduleData?: DaySchedule[];
}

const defaultSchedule: DaySchedule[] = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  juz: i + 1,
  status: i < 4 ? 'completed' : i === 4 ? 'today' : 'upcoming',
}));

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  currentDay = 5,
  scheduleData = defaultSchedule,
}) => {
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
        {scheduleData.map((schedule) => (
          <div
            key={schedule.day}
            className={`
              relative p-3 rounded-xl text-center transition-all cursor-pointer
              ${schedule.status === 'today' 
                ? 'bg-primary/20 border-2 border-primary ring-2 ring-primary/20' 
                : schedule.status === 'completed'
                  ? 'bg-success/10 border border-success/30'
                  : 'bg-secondary/50 hover:bg-secondary border border-transparent'
              }
            `}
          >
            {/* Day Number */}
            <p className={`text-lg font-bold mb-1 ${
              schedule.status === 'today' ? 'text-primary' : 
              schedule.status === 'completed' ? 'text-success' : 'text-foreground'
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
          <p className="text-2xl font-bold text-success">{toArabicNumber(4)}</p>
          <p className="text-muted-foreground">مكتمل</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{toArabicNumber(1)}</p>
          <p className="text-muted-foreground">اليوم</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-muted-foreground">{toArabicNumber(25)}</p>
          <p className="text-muted-foreground">متبقي</p>
        </div>
      </div>
    </div>
  );
};
