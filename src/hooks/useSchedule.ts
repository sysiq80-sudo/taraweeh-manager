import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { totalQuranPages } from '@/lib/quranData';

export interface ReadingPlan {
  id: string;
  user_id: string;
  start_page: number;
  pages_per_day: number;
  start_date: string;
  total_days: number;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: string;
  user_id: string;
  reading_plan_id: string | null;
  date: string;
  day_number: number;
  start_page: number;
  end_page: number;
  status: 'completed' | 'today' | 'upcoming' | 'absent';
  created_at: string;
  updated_at: string;
}

export function useSchedule() {
  const { user } = useAuth();
  const [readingPlan, setReadingPlan] = useState<ReadingPlan | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = useCallback(async () => {
    if (!user) {
      setSchedules([]);
      setReadingPlan(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Fetch reading plan
    const { data: planData } = await supabase
      .from('reading_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (planData) {
      setReadingPlan(planData as ReadingPlan);
    }

    // Fetch schedules
    const { data: schedulesData } = await supabase
      .from('schedules')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    if (schedulesData) {
      // Update status based on current date
      const today = new Date().toISOString().split('T')[0];
      const updatedSchedules = schedulesData.map(s => {
        let status = s.status;
        if (s.date < today && status !== 'completed' && status !== 'absent') {
          status = 'completed'; // Auto-complete past days
        } else if (s.date === today) {
          status = 'today';
        } else if (s.date > today) {
          status = 'upcoming';
        }
        return { ...s, status } as Schedule;
      });
      setSchedules(updatedSchedules);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const createReadingPlan = async (startPage: number, pagesPerDay: number) => {
    if (!user) return { error: new Error('Not authenticated') };

    const startDate = new Date();
    const totalDays = 30;

    // Delete existing schedules and plan
    await supabase.from('schedules').delete().eq('user_id', user.id);
    await supabase.from('reading_plans').delete().eq('user_id', user.id);

    // Create new reading plan
    const { data: planData, error: planError } = await supabase
      .from('reading_plans')
      .insert({
        user_id: user.id,
        start_page: startPage,
        pages_per_day: pagesPerDay,
        start_date: startDate.toISOString().split('T')[0],
        total_days: totalDays,
      })
      .select()
      .single();

    if (planError) return { error: planError };

    // Generate schedules for 30 days
    const schedulesToInsert = [];
    let currentPage = startPage;

    for (let i = 0; i < totalDays; i++) {
      const scheduleDate = new Date(startDate);
      scheduleDate.setDate(scheduleDate.getDate() + i);
      
      const endPage = Math.min(currentPage + pagesPerDay - 1, totalQuranPages);
      
      schedulesToInsert.push({
        user_id: user.id,
        reading_plan_id: planData.id,
        date: scheduleDate.toISOString().split('T')[0],
        day_number: i + 1,
        start_page: currentPage,
        end_page: endPage,
        status: i === 0 ? 'today' : 'upcoming',
      });

      currentPage = endPage + 1;
      if (currentPage > totalQuranPages) {
        currentPage = 1; // Loop back to start if exceeding total pages
      }
    }

    const { error: schedulesError } = await supabase
      .from('schedules')
      .insert(schedulesToInsert);

    if (schedulesError) return { error: schedulesError };

    // Refetch data
    await fetchSchedules();

    return { error: null };
  };

  const updateScheduleStatus = async (scheduleId: string, status: Schedule['status']) => {
    const { error } = await supabase
      .from('schedules')
      .update({ status })
      .eq('id', scheduleId);

    if (!error) {
      setSchedules(prev => 
        prev.map(s => s.id === scheduleId ? { ...s, status } : s)
      );
    }

    return { error };
  };

  const getTodaySchedule = () => {
    const today = new Date().toISOString().split('T')[0];
    return schedules.find(s => s.date === today) || null;
  };

  const getCompletedCount = () => {
    return schedules.filter(s => s.status === 'completed').length;
  };

  const getCompletedPages = () => {
    return schedules
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + (s.end_page - s.start_page + 1), 0);
  };

  return {
    readingPlan,
    schedules,
    loading,
    createReadingPlan,
    updateScheduleStatus,
    getTodaySchedule,
    getCompletedCount,
    getCompletedPages,
    refetch: fetchSchedules,
  };
}
