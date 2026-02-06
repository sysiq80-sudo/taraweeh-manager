import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  Calendar, 
  Plus, 
  Mail, 
  Phone, 
  MapPin,
  Shield,
  Search,
  Filter,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { IslamicPattern } from '@/components/ui/IslamicPattern';
import { ScheduleModal } from '@/components/dashboard/ScheduleModal';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { toArabicNumber } from '@/lib/hijriDate';

interface Reciter {
  id: string;
  user_id: string;
  full_name: string;
  mosque_name: string | null;
  city: string;
  phone: string | null;
  created_at: string;
}

interface Stats {
  totalReciters: number;
  totalMosques: number;
  activeSchedules: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, role, loading: profileLoading } = useProfile();
  
  const [activeNavItem, setActiveNavItem] = useState('admin');
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [stats, setStats] = useState<Stats>({ totalReciters: 0, totalMosques: 0, activeSchedules: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  useEffect(() => {
    if (role && role !== 'mosque_admin') {
      navigate('/');
    }
  }, [role, navigate]);

  useEffect(() => {
    if (!user || !profile) return;

    const fetchAdminData = async () => {
      try {
        setLoading(true);

        // Fetch all reciters from the same mosque
        const { data: recitersData, error: recitersError } = await supabase
          .from('profiles')
          .select(`
            id,
            user_id,
            full_name,
            mosque_name,
            city,
            phone,
            created_at
          `)
          .eq('mosque_name', profile.mosque_name)
          .order('created_at', { ascending: false });

        if (recitersError) throw recitersError;
        setReciters(recitersData || []);

        // Calculate stats
        const uniqueMosques = new Set(recitersData?.map(r => r.mosque_name).filter(Boolean));
        
        // Get active schedules count
        const { count: schedulesCount } = await supabase
          .from('schedules')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'upcoming')
          .gte('date', new Date().toISOString().split('T')[0]);

        setStats({
          totalReciters: recitersData?.length || 0,
          totalMosques: uniqueMosques.size,
          activeSchedules: schedulesCount || 0,
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user, profile]);

  const handleCreateScheduleForReciter = (reciter: Reciter) => {
    setSelectedReciter(reciter);
    setScheduleModalOpen(true);
  };

  const filteredReciters = reciters.filter(reciter =>
    reciter.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reciter.mosque_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reciter.phone?.includes(searchQuery)
  );

  if (profileLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (role !== 'mosque_admin') {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-background relative flex w-full">
        <IslamicPattern />

        <AppSidebar
          activeItem={activeNavItem}
          onItemClick={setActiveNavItem}
          onSignOut={handleSignOut}
        />

        <SidebarInset className="flex-1 flex flex-col relative z-10">
          <Header
            userName={profile?.full_name || 'المدير'}
            mosqueName={profile?.mosque_name || 'غير محدد'}
          />

          <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <Shield className="w-8 h-8 text-gold" />
                  لوحة الإدارة
                </h1>
                <p className="text-muted-foreground mt-1">إدارة القراء والجداول</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-2xl border border-border/50 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">إجمالي القراء</p>
                    <h3 className="text-3xl font-bold text-foreground">{toArabicNumber(stats.totalReciters)}</h3>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gold/20 flex items-center justify-center">
                    <Users className="w-7 h-7 text-gold" />
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-2xl border border-border/50 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">المساجد المسجلة</p>
                    <h3 className="text-3xl font-bold text-foreground">{toArabicNumber(stats.totalMosques)}</h3>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-green-500" />
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-2xl border border-border/50 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">الجداول النشطة</p>
                    <h3 className="text-3xl font-bold text-foreground">{toArabicNumber(stats.activeSchedules)}</h3>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Calendar className="w-7 h-7 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Reciters Management */}
            <div className="glass p-6 rounded-2xl border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Users className="w-6 h-6 text-gold" />
                  إدارة القراء
                </h2>

                {/* Search Bar */}
                <div className="relative w-72">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="بحث بالاسم، المسجد، أو الهاتف..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Reciters Table */}
              <div className="overflow-x-auto">
                <table className="w-full" dir="rtl">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">الاسم</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">المسجد</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">المدينة</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">الهاتف</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReciters.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-muted-foreground">
                          لا يوجد قراء مسجلين
                        </td>
                      </tr>
                    ) : (
                      filteredReciters.map((reciter) => (
                        <tr key={reciter.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                                <Users className="w-5 h-5 text-gold" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{reciter.full_name}</p>
                                <p className="text-xs text-muted-foreground">{reciter.id.slice(0, 8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Building2 className="w-4 h-4" />
                              <span>{reciter.mosque_name || 'غير محدد'}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{reciter.city}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="w-4 h-4" />
                              <span dir="ltr">{reciter.phone || '-'}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleCreateScheduleForReciter(reciter)}
                              className="flex items-center gap-2 px-4 py-2 bg-gold/20 hover:bg-gold/30 text-gold rounded-lg transition-all border border-gold/30"
                            >
                              <Plus className="w-4 h-4" />
                              إنشاء جدول
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>

          <footer className="py-4 border-t border-border/50 mt-auto">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-muted-foreground">
                منظّم التراويح - نسخة الأنبار © ١٤٤٦ هـ
              </p>
            </div>
          </footer>
        </SidebarInset>
      </div>

      {/* Schedule Modal for Selected Reciter */}
      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => {
          setScheduleModalOpen(false);
          setSelectedReciter(null);
        }}
      />
    </SidebarProvider>
  );
};

export default AdminDashboard;
