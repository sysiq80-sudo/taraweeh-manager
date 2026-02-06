import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { totalQuranPages, quranStartPage as QURAN_START_PAGE } from '@/lib/quranData';

export interface ReadingPlan {
  id: string;
  user_id: string;
  start_page: number;
  pages_per_day: number;
  start_date: string;
  total_days: number;
  has_qiyam_plan?: boolean;
  qiyam_start_day?: number;
  created_at: string;
  updated_at: string;
}

export interface ImamAssignment {
  imamName: string;
  startRakat: number;
  endRakat: number;
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
  type?: 'taraweeh' | 'qiyam';
  imam_assignments?: ImamAssignment[] | null;
  created_at: string;
  updated_at: string;
}

export function useSchedule() {
  const { user } = useAuth();
  const [readingPlan, setReadingPlan] = useState<ReadingPlan | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSchedules = useCallback(async () => {
    if (!user) {
      setSchedules([]);
      setReadingPlan(null);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Fetch reading plan
      const { data: planData, error: planError } = await supabase
        .from('reading_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (planError) {
        console.error('Reading plan fetch error:', planError);
        throw planError;
      }

      if (planData) {
        setReadingPlan(planData as ReadingPlan);
      }

      // Fetch schedules
      const { data: schedulesData, error: schedulesError } = await supabase
        .from('schedules')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (schedulesError) {
        console.error('Schedules fetch error:', schedulesError);
        throw schedulesError;
      }

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
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch schedules'));
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const createReadingPlan = async (
    startPage: number,
    pagesPerDay: number,
    imamPeriods?: Array<{ imamName: string; startDay: number; endDay: number; rakatsCount: number }>
  ) => {
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
      const dayNum = i + 1;
      const endPage = Math.min(currentPage + pagesPerDay - 1, totalQuranPages);

      // Find which period this day belongs to
      let assignedPeriod = null;
      if (imamPeriods && imamPeriods.length > 0) {
        assignedPeriod = imamPeriods.find(
          (period) => dayNum >= period.startDay && dayNum <= period.endDay
        );
      }

      schedulesToInsert.push({
        user_id: user.id,
        reading_plan_id: planData.id,
        date: scheduleDate.toISOString().split('T')[0],
        day_number: dayNum,
        start_page: currentPage,
        end_page: endPage,
        status: i === 0 ? 'today' : 'upcoming',
        imam_assignments: assignedPeriod
          ? [{ imamName: assignedPeriod.imamName, rakatsCount: assignedPeriod.rakatsCount, startDay: assignedPeriod.startDay, endDay: assignedPeriod.endDay }]
          : null,
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

  const getShareToken = async (): Promise<{ token: string | null; error: Error | null }> => {
    if (!readingPlan) {
      return { token: null, error: new Error('لا يوجد جدول قراءة') };
    }

    try {
      const { data, error } = await supabase.rpc('get_or_create_share_token', {
        _reading_plan_id: readingPlan.id,
      });

      if (error) throw error;

      return { token: data, error: null };
    } catch (err) {
      return { 
        token: null, 
        error: err instanceof Error ? err : new Error('فشل في إنشاء رابط المشاركة') 
      };
    }
  };

  const revokeShareToken = async (): Promise<{ success: boolean; error: Error | null }> => {
    if (!readingPlan) {
      return { success: false, error: new Error('لا يوجد جدول قراءة') };
    }

    try {
      const { data, error } = await supabase.rpc('revoke_share_token', {
        _reading_plan_id: readingPlan.id,
      });

      if (error) throw error;

      return { success: data, error: null };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err : new Error('فشل في إلغاء المشاركة') 
      };
    }
  };

  /**
   * Create a Qiyam (last 10 days) schedule
   * This is a parallel schedule separate from Taraweeh
   * Typically covers days 21-30 with different reading pace
   */
  const createQiyamSchedule = async (
    startPage: number, 
    pagesPerDay: number,
    qiyamStartDay: number = 21
  ) => {
    if (!user || !readingPlan) {
      return { error: new Error('لا يوجد خطة قراءة رئيسية') };
    }

    // Delete existing Qiyam schedules
    await supabase
      .from('schedules')
      .delete()
      .eq('user_id', user.id)
      .eq('type', 'qiyam');

    // Create new reading plan for Qiyam (optional, could reuse existing)
    const qiyamDays = 31 - qiyamStartDay; // e.g., 21-30 = 10 days
    const startDate = new Date();
    startDate.setDate(qiyamStartDay); // Set to Ramadan day

    // Generate Qiyam schedules
    const qiyamSchedulesToInsert = [];
    let currentPage = startPage;

    for (let i = 0; i < qiyamDays; i++) {
      const scheduleDate = new Date(startDate);
      scheduleDate.setDate(scheduleDate.getDate() + i);
      
      const endPage = Math.min(currentPage + pagesPerDay - 1, totalQuranPages);
      
      qiyamSchedulesToInsert.push({
        user_id: user.id,
        reading_plan_id: readingPlan.id, // Link to main plan
        date: scheduleDate.toISOString().split('T')[0],
        day_number: qiyamStartDay + i,
        start_page: currentPage,
        end_page: endPage,
        status: i === 0 ? 'today' : 'upcoming',
        type: 'qiyam', // Mark as Qiyam type
      });

      currentPage = endPage + 1;
      if (currentPage > totalQuranPages) {
        currentPage = QURAN_START_PAGE; // Loop back respectfully
      }
    }

    const { error: schedulesError } = await supabase
      .from('schedules')
      .insert(qiyamSchedulesToInsert);

    if (schedulesError) return { error: schedulesError };

    // Update reading plan to indicate Qiyam exists
    await supabase
      .from('reading_plans')
      .update({ has_qiyam_plan: true, qiyam_start_day: qiyamStartDay })
      .eq('id', readingPlan.id);

    // Refetch data
    await fetchSchedules();

    return { error: null };
  };

  /**
   * Get Today's Qiyam schedule (if in last 10 days)
   */
  const getTodayQiyamSchedule = () => {
    const today = new Date().toISOString().split('T')[0];
    return schedules.find(s => s.date === today && s.type === 'qiyam') || null;
  };

  /**
   * Check if we're in the Qiyam period (last 10 days)
   */
  const isQiyamPeriod = () => {
    if (!readingPlan) return false;
    const today = new Date();
    const qiyamStartDate = new Date(readingPlan.start_date);
    qiyamStartDate.setDate(qiyamStartDate.getDate() + (readingPlan.qiyam_start_day || 21) - 1);
    return today >= qiyamStartDate;
  };

  return {
    readingPlan,
    schedules,
    loading,
    error,
    createReadingPlan,
    createQiyamSchedule,
    updateScheduleStatus,
    getTodaySchedule,
    getTodayQiyamSchedule,
    getCompletedCount,
    getCompletedPages,
    getShareToken,
    revokeShareToken,
    isQiyamPeriod,
    refetch: fetchSchedules,
  };
}
