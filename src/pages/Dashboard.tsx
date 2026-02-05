import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { IslamicPattern } from '@/components/ui/IslamicPattern';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { PrayerTimesWidget } from '@/components/dashboard/PrayerTimesWidget';
import { DateWidget } from '@/components/dashboard/DateWidget';
import { TodayScheduleCard } from '@/components/dashboard/TodayScheduleCard';
import { ProgressWidget } from '@/components/dashboard/ProgressWidget';
import { ScheduleCalendar } from '@/components/dashboard/ScheduleCalendar';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('dashboard');

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
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(true)} />

          {/* Page Content */}
          <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
            {/* Welcome Banner */}
            <section className="animate-fade-in">
              <WelcomeBanner userName="أحمد" ramadanDay={5} />
            </section>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Today's Schedule */}
                <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <TodayScheduleCard
                    ramadanDay={5}
                    juzNumber={5}
                    startPage={82}
                    endPage={102}
                    surahRange="النساء (الآية ٢٤ - ١٤٧)"
                    rakatsAssigned="أول ٤ ركعات"
                  />
                </section>

                {/* Schedule Calendar */}
                <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <ScheduleCalendar currentDay={5} />
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
                    completedPages={82}
                    completedJuz={4}
                    currentStreak={5}
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
    </div>
  );
};

export default Dashboard;
