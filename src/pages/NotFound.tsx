import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Moon } from 'lucide-react';
import { IslamicPattern } from '@/components/ui/IslamicPattern';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center">
      <IslamicPattern />
      
      <div className="relative z-10 text-center px-4">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
          <Moon className="w-12 h-12 text-primary" />
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-bold text-primary mb-4">٤٠٤</h1>

        {/* Message */}
        <h2 className="text-2xl font-bold text-foreground mb-2">الصفحة غير موجودة</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          عذراً، الصفحة التي تبحث عنها غير موجودة. قد تكون قد حُذفت أو أن الرابط غير صحيح.
        </p>

        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-gold-light text-primary-foreground font-semibold rounded-xl transition-all glow-gold"
        >
          <Home className="w-5 h-5" />
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
