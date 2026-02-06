import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { IslamicPattern } from '@/components/ui/IslamicPattern';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Users, BarChart3, Calendar } from 'lucide-react';
import { toArabicNumber } from '@/lib/hijriDate';

interface MosqueStats {
  id: string;
  mosque_name: string | null;
  full_name: string;
  city: string;
  reciterCount: number;
  planCount: number;
  created_at: string;
}

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, role } = useProfile();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [mosques, setMosques] = useState<MosqueStats[]>([]);
  const [totalReciters, setTotalReciters] = useState(0);
  const [totalPlans, setTotalPlans] = useState(0);

  useEffect(() => {
    // Redirect if not super admin
    if (role && role !== 'super_admin') {
      navigate('/');
      return;
    }

    if (role === 'super_admin') {
      loadDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all mosque admins
      const { data: mosquesData, error: mosquesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'mosque_admin');

      if (mosquesError) throw mosquesError;

      const mosqueStats: MosqueStats[] = [];
      
      for (const mosque of mosquesData || []) {
        // Count reading plans for this mosque
        const { count: planCount } = await supabase
          .from('reading_plans')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', mosque.id);

        mosqueStats.push({
          id: mosque.id,
          mosque_name: mosque.mosque_name,
          full_name: mosque.full_name,
          city: mosque.city,
          reciterCount: 0, // Will be populated after migrations
          planCount: planCount || 0,
          created_at: mosque.created_at,
        });
      }

      setMosques(mosqueStats);

      // Total reciters across all (profiles with role='reciter')
      const { count: totalReciterCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'reciter');

      setTotalReciters(totalReciterCount || 0);

      // Total reading plans
      const { count: totalPlanCount } = await supabase
        .from('reading_plans')
        .select('*', { count: 'exact', head: true });

      setTotalPlans(totalPlanCount || 0);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل بيانات لوحة التحكم',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-background relative flex w-full">
        <IslamicPattern />

        <AppSidebar />

        <SidebarInset className="flex-1 flex flex-col relative z-20">
          <Header 
            userName={profile?.full_name || 'مسؤول النظام'}
            mosqueName="لوحة التحكم الرئيسية"
          />

          <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">لوحة التحكم الرئيسية</h1>
              <p className="text-muted-foreground">نظرة عامة على كل المساجد والقراء والجداول</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Mosques */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">إجمالي المساجد</p>
                    <p className="text-3xl font-bold text-foreground">{toArabicNumber(mosques.length)}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-gold" />
                </div>
                <p className="text-xs text-muted-foreground">مساجد مسجلة في النظام</p>
              </div>

              {/* Total Reciters */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">إجمالي القراء</p>
                    <p className="text-3xl font-bold text-foreground">{toArabicNumber(totalReciters)}</p>
                  </div>
                  <Users className="w-8 h-8 text-gold" />
                </div>
                <p className="text-xs text-muted-foreground">أئمة وقراء الجداول</p>
              </div>

              {/* Total Plans */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">إجمالي الجداول</p>
                    <p className="text-3xl font-bold text-foreground">{toArabicNumber(totalPlans)}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-gold" />
                </div>
                <p className="text-xs text-muted-foreground">خطط القراءة المنشأة</p>
              </div>
            </div>

            {/* Mosques Table */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gold" />
                المساجد والمسؤولون
              </h2>

              {mosques.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">لا توجد مساجد مسجلة حالياً</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-right py-3 px-4 font-semibold text-foreground">اسم المسجد</th>
                        <th className="text-right py-3 px-4 font-semibold text-foreground">المدينة</th>
                        <th className="text-center py-3 px-4 font-semibold text-foreground">القراء</th>
                        <th className="text-center py-3 px-4 font-semibold text-foreground">الجداول</th>
                        <th className="text-right py-3 px-4 font-semibold text-foreground">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mosques.map((mosque) => (
                        <tr key={mosque.id} className="border-b border-border/50 hover:bg-secondary/30">
                          <td className="py-3 px-4">
                            <p className="font-medium text-foreground">{mosque.mosque_name || mosque.full_name}</p>
                            <p className="text-xs text-muted-foreground">{mosque.full_name}</p>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{mosque.city || 'غير محدد'}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                              {toArabicNumber(mosque.reciterCount)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-3 py-1 bg-success/20 text-success rounded-full text-sm font-medium">
                              {toArabicNumber(mosque.planCount)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="px-3 py-1 bg-success/20 text-success rounded-full text-xs font-medium">
                              نشط
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>

          <footer className="py-4 border-t border-border/50 mt-auto">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-muted-foreground">
                منظّم التراويح - لوحة التحكم الرئيسية © ١٤٤٦ هـ
              </p>
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SuperAdminDashboard;
