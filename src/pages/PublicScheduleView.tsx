import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Building2, 
  BookOpen, 
  CheckCircle2, 
  Clock,
  Share2,
  AlertCircle,
  Moon,
} from 'lucide-react';
import { IslamicPattern } from '@/components/ui/IslamicPattern';
import { supabase } from '@/integrations/supabase/client';
import { toArabicNumber } from '@/lib/hijriDate';
import { juzData } from '@/lib/quranData';

interface Schedule {
  id: string;
  date: string;
  day_number: number;
  start_page: number;
  end_page: number;
  status: string;
}

interface ReadingPlan {
  id: string;
  start_page: number;
  pages_per_day: number;
  start_date: string;
  total_days: number;
}

interface Profile {
  full_name: string;
  mosque_name: string | null;
}

interface PublicScheduleData {
  schedules: Schedule[];
  reading_plan: ReadingPlan;
  profile: Profile;
}

const PublicScheduleView: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [data, setData] = useState<PublicScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('رمز المشاركة غير صالح');
      setLoading(false);
      return;
    }

    const fetchPublicSchedule = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch reading plan by share_token
        const { data: planData, error: planError } = await supabase
          .from('reading_plans')
          .select('*')
          .eq('share_token', token)
          .maybeSingle();

        if (planError) throw planError;
        if (!planData) {
          setError('الجدول غير موجود أو تم إلغاء مشاركته');
          setLoading(false);
          return;
        }

        // Fetch schedules for this reading plan
        const { data: schedulesData, error: schedulesError } = await supabase
          .from('schedules')
          .select('*')
          .eq('reading_plan_id', planData.id)
          .order('date', { ascending: true });

        if (schedulesError) throw schedulesError;

        // Fetch profile info
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, mosque_name')
          .eq('user_id', planData.user_id)
          .single();

        if (profileError) throw profileError;

        setData({
          schedules: schedulesData || [],
          reading_plan: planData,
          profile: profileData,
        });
      } catch (err: any) {
        console.error('Error fetching public schedule:', err);
        setError(err.message || 'حدث خطأ في تحميل الجدول');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicSchedule();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <IslamicPattern />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل الجدول...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <IslamicPattern />
        <div className="relative z-10 text-center glass p-8 rounded-2xl border border-border max-w-md">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">عذراً</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-3 bg-gold text-primary-foreground rounded-xl hover:bg-gold/90 transition-all"
          >
            العودة إلى الصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  const completedSchedules = data.schedules.filter(s => s.status === 'completed');
  const completedPages = completedSchedules.reduce((sum, s) => sum + (s.end_page - s.start_page + 1), 0);
  const completedJuz = Math.floor(completedPages / 20);
  const progressPercentage = (completedPages / 604) * 100;

  return (
    <div className="min-h-screen bg-background relative">
      <IslamicPattern />

      <div className="relative z-10">
        {/* Header */}
        <header className="glass sticky top-0 z-50 border-b border-border/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
                  <Moon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">جدول التراويح المشترك</h1>
                  <p className="text-xs text-muted-foreground">عرض فقط - للقراءة</p>
                </div>
              </div>
              <Share2 className="w-6 h-6 text-gold" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 space-y-6 max-w-5xl">
          {/* Reciter Info Card */}
          <div className="glass p-6 rounded-2xl border border-gold/30 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                <User className="w-8 h-8 text-gold" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-1">{data.profile.full_name}</h2>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {data.profile.mosque_name || 'غير محدد'}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {toArabicNumber(data.reading_plan.total_days)} يوماً
                  </span>
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {toArabicNumber(data.reading_plan.pages_per_day)} صفحة/يوم
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass p-4 rounded-xl border border-border/50 text-center">
              <p className="text-muted-foreground text-sm mb-1">الإجمالي</p>
              <p className="text-2xl font-bold text-foreground">{toArabicNumber(data.schedules.length)}</p>
              <p className="text-xs text-muted-foreground">يوم</p>
            </div>
            <div className="glass p-4 rounded-xl border border-border/50 text-center">
              <p className="text-muted-foreground text-sm mb-1">المكتمل</p>
              <p className="text-2xl font-bold text-success">{toArabicNumber(completedSchedules.length)}</p>
              <p className="text-xs text-muted-foreground">يوم</p>
            </div>
            <div className="glass p-4 rounded-xl border border-border/50 text-center">
              <p className="text-muted-foreground text-sm mb-1">الصفحات</p>
              <p className="text-2xl font-bold text-gold">{toArabicNumber(completedPages)}</p>
              <p className="text-xs text-muted-foreground">من {toArabicNumber(604)}</p>
            </div>
            <div className="glass p-4 rounded-xl border border-border/50 text-center">
              <p className="text-muted-foreground text-sm mb-1">الأجزاء</p>
              <p className="text-2xl font-bold text-gold">{toArabicNumber(completedJuz)}</p>
              <p className="text-xs text-muted-foreground">جزء</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="glass p-6 rounded-2xl border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">التقدم الإجمالي</h3>
              <span className="text-gold font-bold">{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full h-4 bg-secondary/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Schedule Calendar */}
          <div className="glass p-6 rounded-2xl border border-border/50">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-gold" />
              جدول القراءة التفصيلي
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {data.schedules.map((schedule) => {
                const juzNumber = Math.ceil(schedule.start_page / 20);
                const juz = juzData.find(j => j.number === juzNumber);
                const isCompleted = schedule.status === 'completed';
                const isToday = schedule.status === 'today';

                return (
                  <div
                    key={schedule.id}
                    className={`
                      p-4 rounded-xl border transition-all
                      ${isCompleted 
                        ? 'bg-success/10 border-success/30' 
                        : isToday 
                          ? 'bg-gold/10 border-gold/30 ring-2 ring-gold/50' 
                          : 'bg-secondary/30 border-border/50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">
                        اليوم {toArabicNumber(schedule.day_number)}
                      </span>
                      {isCompleted && <CheckCircle2 className="w-4 h-4 text-success" />}
                      {isToday && <Clock className="w-4 h-4 text-gold animate-pulse" />}
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-1">
                      ج{toArabicNumber(juzNumber)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ص {toArabicNumber(schedule.start_page)}-{toArabicNumber(schedule.end_page)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Notice */}
          <div className="glass p-4 rounded-xl border border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              هذا جدول مشترك للقراءة فقط • للحصول على نسختك الخاصة، 
              <button
                onClick={() => navigate('/auth')}
                className="text-gold hover:underline mr-1"
              >
                سجّل الدخول هنا
              </button>
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-border/50 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              منظّم التراويح - نسخة الأنبار © ١٤٤٦ هـ
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PublicScheduleView;
