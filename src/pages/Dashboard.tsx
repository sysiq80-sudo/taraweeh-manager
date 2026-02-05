import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { IslamicPattern } from '@/components/ui/IslamicPattern';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { PrayerTimesWidget } from '@/components/dashboard/PrayerTimesWidget';
import { DateWidget } from '@/components/dashboard/DateWidget';
import { TodayScheduleCard } from '@/components/dashboard/TodayScheduleCard';
import { ProgressWidget } from '@/components/dashboard/ProgressWidget';
import { ScheduleCalendar } from '@/components/dashboard/ScheduleCalendar';
import { ScheduleModal } from '@/components/dashboard/ScheduleModal';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSchedule } from '@/hooks/useSchedule';
import { juzData, totalQuranPages } from '@/lib/quranData';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { schedules, loading: scheduleLoading, getTodaySchedule, getCompletedCount, getCompletedPages } = useSchedule();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    } else if (!authLoading && !profileLoading && user && !profile) {
      navigate('/auth');
    }
  }, [user, profile, authLoading, profileLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const todaySchedule = getTodaySchedule();
  const completedCount = getCompletedCount();
  const completedPages = getCompletedPages();
  const completedJuz = Math.floor(completedPages / 20);

  // Get juz number from today's schedule
  const currentJuzNumber = todaySchedule ? Math.ceil(todaySchedule.start_page / 20) : 1;
  const currentJuz = juzData.find(j => j.number === currentJuzNumber);

  // Calculate current day number
  const currentDayNumber = todaySchedule?.day_number || 1;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Islamic Pattern Background */}
      <IslamicPattern />

      {/* Layout */}
      <div className="relative z-10 flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeItem={activeNavItem}
          onItemClick={setActiveNavItem}
          onSignOut={handleSignOut}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <Header 
            onMenuClick={() => setSidebarOpen(true)} 
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
              />
            </section>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Today's Schedule */}
                <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <TodayScheduleCard
                    ramadanDay={currentDayNumber}
                    juzNumber={currentJuzNumber}
                    startPage={todaySchedule?.start_page || 1}
                    endPage={todaySchedule?.end_page || 20}
                    surahRange={currentJuz?.name || 'الجزء الأول'}
                    rakatsAssigned="أول ٤ ركعات"
                  />
                </section>

                {/* Schedule Calendar */}
                <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
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
                <section className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                  <DateWidget />
                </section>

                {/* Prayer Times */}
                <section className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                  <PrayerTimesWidget />
                </section>

                {/* Progress Widget */}
                <section className="animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
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
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleModal 
        isOpen={scheduleModalOpen} 
        onClose={() => setScheduleModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
