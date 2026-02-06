import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { IslamicPattern } from '@/components/ui/IslamicPattern';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { PrayerTimesWidget } from '@/components/dashboard/PrayerTimesWidget';
import { DateWidget } from '@/components/dashboard/DateWidget';
import { TodayScheduleCard } from '@/components/dashboard/TodayScheduleCard';
import { QiyamScheduleCard } from '@/components/dashboard/QiyamScheduleCard';
import { ProgressWidget } from '@/components/dashboard/ProgressWidget';
import { ScheduleCalendar } from '@/components/dashboard/ScheduleCalendar';
import { ScheduleModal } from '@/components/dashboard/ScheduleModal';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSchedule } from '@/hooks/useSchedule';
import { useToast } from '@/hooks/use-toast';
import { juzData, totalQuranPages } from '@/lib/quranData';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, error: profileError } = useProfile();
  const { 
    schedules, 
    loading: scheduleLoading, 
    error: scheduleError, 
    getTodaySchedule, 
    getTodayQiyamSchedule,
    getCompletedCount, 
    getCompletedPages, 
    getShareToken,
    isQiyamPeriod,
  } = useSchedule();
  const { toast } = useToast();
  
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleShareSchedule = async () => {
    try {
      const { token, error } = await getShareToken();
      
      if (error) {
        toast({
          title: 'خطأ',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      if (token) {
        const shareUrl = `${window.location.origin}/view/${token}`;
        
        // Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        
        toast({
          title: 'تم إنشاء الرابط',
          description: 'تم نسخ رابط المشاركة إلى الحافظة',
        });
      }
    } catch (err) {
      toast({
        title: 'خطأ',
        description: 'فشل في مشاركة الجدول',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-destructive mb-4">خطأ في تحميل الملف الشخصي</h2>
          <p className="text-muted-foreground mb-6">{profileError.message}</p>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-2 bg-gold text-primary-foreground rounded-lg hover:bg-gold/90"
          >
            العودة إلى تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const todaySchedule = getTodaySchedule();
  const todayQiyamSchedule = getTodayQiyamSchedule();
  const completedCount = getCompletedCount();
  const completedPages = getCompletedPages();
  const completedJuz = Math.floor(completedPages / 20);
  const inQiyamPeriod = isQiyamPeriod();

  // Get juz number from today's schedule
  const currentJuzNumber = todaySchedule ? Math.ceil(todaySchedule.start_page / 20) : 1;
  const currentJuz = juzData.find(j => j.number === currentJuzNumber);

  // Calculate current day number
  const currentDayNumber = todaySchedule?.day_number || 1;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-background relative flex w-full">
        {/* Islamic Pattern Background */}
        <IslamicPattern />

        {/* Sidebar */}
        <AppSidebar
          activeItem={activeNavItem}
          onItemClick={setActiveNavItem}
          onSignOut={handleSignOut}
        />

        {/* Main Content */}
        <SidebarInset className="flex-1 flex flex-col relative z-20">
          {/* Header */}
          <Header 
            userName={profile.full_name}
            mosqueName={profile.mosque_name || 'غير محدد'}
          />

          {/* Page Content */}
          <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
            {/* Welcome Banner */}
            <section className="animate-fade-in">
              <WelcomeBanner 
                userName={profile.full_name.split(' ')[0]} 
                ramadanDay={currentDayNumber}
                onEditSchedule={() => setScheduleModalOpen(true)}
                onShare={handleShareSchedule}
              />
            </section>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Today's Schedule */}
                <section className="animate-fade-in-up">
                  <TodayScheduleCard
                    ramadanDay={currentDayNumber}
                    juzNumber={currentJuzNumber}
                    startPage={todaySchedule?.start_page || 1}
                    endPage={todaySchedule?.end_page || 20}
                    surahRange={currentJuz?.name || 'الجزء الأول'}
                    rakatsAssigned="أول ٤ ركعات"
                  />
                </section>

                {/* Qiyam Schedule (Last 10 Days) */}
                {inQiyamPeriod && todayQiyamSchedule && (
                  <section className="animate-fade-in-up">
                    <QiyamScheduleCard
                      ramadanDay={todayQiyamSchedule.day_number}
                      startPage={todayQiyamSchedule.start_page}
                      endPage={todayQiyamSchedule.end_page}
                      surahRange="قيام الليل"
                      rakatsAssigned="ركعات القيام"
                    />
                  </section>
                )}

                {/* Schedule Calendar */}
                <section className="animate-fade-in-up">
                  <ScheduleCalendar 
                    currentDay={currentDayNumber} 
                    schedules={schedules}
                    loading={scheduleLoading}
                  />
                </section>
              </div>

              {/* Right Column - Widgets */}
              <div className="space-y-6">
                {/* Date Widget */}
                <section className="animate-fade-in-up">
                  <DateWidget />
                </section>

                {/* Prayer Times */}
                <section className="animate-fade-in-up">
                  <PrayerTimesWidget />
                </section>

                {/* Progress Widget */}
                <section className="animate-fade-in-up">
                  <ProgressWidget
                    completedPages={completedPages}
                    completedJuz={completedJuz}
                    currentStreak={completedCount}
                  />
                </section>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="py-4 border-t border-border/50 mt-auto">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-muted-foreground">
                منظّم التراويح - نسخة الأنبار © ١٤٤٦ هـ
              </p>
            </div>
          </footer>
        </SidebarInset>
      </div>

      {/* Schedule Modal */}
      <ScheduleModal 
        isOpen={scheduleModalOpen} 
        onClose={() => setScheduleModalOpen(false)} 
      />
    </SidebarProvider>
  );
};

export default Dashboard;
