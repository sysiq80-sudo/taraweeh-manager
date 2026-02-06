import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Settings,
  Users,
  Clock,
  LogOut,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useProfile } from '@/hooks/useProfile';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  route: string;
  adminOnly?: boolean;
  superAdminOnly?: boolean;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard className="w-5 h-5" />, route: '/' },
  { id: 'schedule', label: 'جدول القراءة', icon: <Calendar className="w-5 h-5" />, route: '/' },
  { id: 'quran', label: 'خطة الختمة', icon: <BookOpen className="w-5 h-5" />, route: '/' },
  { id: 'prayer-times', label: 'مواقيت الصلاة', icon: <Clock className="w-5 h-5" />, route: '/' },
  { id: 'super-admin', label: 'لوحة التحكم الرئيسية', icon: <ShieldCheck className="w-5 h-5" />, route: '/super-admin', superAdminOnly: true },
  { id: 'admin', label: 'لوحة الإدارة', icon: <ShieldCheck className="w-5 h-5" />, route: '/admin', adminOnly: true },
  { id: 'reciters', label: 'القراء', icon: <Users className="w-5 h-5" />, route: '/' },
  { id: 'settings', label: 'الإعدادات', icon: <Settings className="w-5 h-5" />, route: '/' },
];

interface AppSidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
  onSignOut?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeItem = 'dashboard',
  onItemClick,
  onSignOut,
}) => {
  const { state, toggleSidebar } = useSidebar();
  const { role } = useProfile();
  const navigate = useNavigate();
  const isCollapsed = state === 'collapsed';

  const handleItemClick = (item: NavItem) => {
    onItemClick?.(item.id);
    navigate(item.route);
  };

  // Filter nav items based on role
  const visibleNavItems = navItems.filter(item => {
    if (item.superAdminOnly) return role === 'super_admin';
    if (item.adminOnly) return role === 'mosque_admin' || role === 'super_admin';
    return true;
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-foreground text-sm">منظّم التراويح</h2>
                <p className="text-xs text-muted-foreground">نسخة الأنبار</p>
              </div>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label={isCollapsed ? 'توسيع القائمة' : 'طي القائمة'}
          >
            {isCollapsed ? (
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleNavItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleItemClick(item)}
                    isActive={activeItem === item.id}
                    tooltip={isCollapsed ? item.label : undefined}
                    className={`
                      ${activeItem === item.id
                        ? 'bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }
                    `}
                  >
                    {item.icon}
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                    {!isCollapsed && item.badge && (
                      <span className="mr-auto px-2 py-0.5 text-xs bg-gold text-primary-foreground rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onSignOut}
              tooltip={isCollapsed ? 'تسجيل الخروج' : undefined}
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span className="font-medium">تسجيل الخروج</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
