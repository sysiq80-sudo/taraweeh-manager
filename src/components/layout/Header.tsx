import React from 'react';
import { Bell, User, Moon as MoonIcon } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface HeaderProps {
  userName?: string;
  mosqueName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'أحمد محمد',
  mosqueName = 'مسجد الرحمن - الرمادي',
}) => {
  return (
    <header className="glass sticky top-0 z-50 border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <SidebarTrigger className="p-2 hover:bg-secondary rounded-lg transition-colors" />
            
            <div className="flex items-center gap-3">
              {/* Logo Icon */}
              <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
                <MoonIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">منظّم التراويح</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">نسخة الأنبار</p>
              </div>
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 left-1 w-2 h-2 bg-gold rounded-full" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 p-2 px-3 bg-secondary/50 rounded-xl">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{mosqueName}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center">
                <User className="w-5 h-5 text-gold" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
