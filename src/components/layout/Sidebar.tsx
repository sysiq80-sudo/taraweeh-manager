import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Settings,
  Users,
  Clock,
  LogOut,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: string;
  onItemClick?: (item: string) => void;
  onSignOut?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'schedule', label: 'جدول القراءة', icon: <Calendar className="w-5 h-5" />, badge: 3 },
  { id: 'quran', label: 'خطة الختمة', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'prayer-times', label: 'مواقيت الصلاة', icon: <Clock className="w-5 h-5" /> },
  { id: 'reciters', label: 'القراء', icon: <Users className="w-5 h-5" /> },
  { id: 'settings', label: 'الإعدادات', icon: <Settings className="w-5 h-5" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeItem = 'dashboard',
  onItemClick,
  onSignOut,
}) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-72 bg-card border-l border-border z-50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-0
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between lg:hidden">
            <h2 className="font-bold text-foreground">القائمة</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onItemClick?.(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center justify-between p-3 rounded-xl transition-all
                  ${activeItem === item.id
                    ? 'bg-gold/20 text-gold border border-gold/30'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs bg-gold text-primary-foreground rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <button 
              onClick={onSignOut}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
