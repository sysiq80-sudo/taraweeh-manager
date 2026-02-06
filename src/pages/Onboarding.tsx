import React, { useState, useEffect } from 'react';
import { User, Building, MapPin, Phone, Moon } from 'lucide-react';
import { IslamicPattern } from '@/components/ui/IslamicPattern';
import { useProfile, CityType, AppRole } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const cities: { value: CityType; label: string }[] = [
  { value: 'ramadi', label: 'الرمادي' },
  { value: 'fallujah', label: 'الفلوجة' },
  { value: 'hit', label: 'هيت' },
  { value: 'haditha', label: 'حديثة' },
  { value: 'ana', label: 'عانة' },
  { value: 'rawa', label: 'راوة' },
  { value: 'qaim', label: 'القائم' },
  { value: 'rutba', label: 'الرطبة' },
];

const Onboarding: React.FC = () => {
  const { user } = useAuth();
  const { createProfile, profile, loading: profileLoading } = useProfile();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState('');
  const [mosqueName, setMosqueName] = useState('');
  const [city, setCity] = useState<CityType>('ramadi');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Default role; the database promotes the first signup to super_admin
  const determineRole = (): AppRole => 'mosque_admin';

  const role = determineRole();

  // REVERSE CHECK: If profile already exists, redirect to Dashboard
  useEffect(() => {
    if (!profileLoading && profile) {
      console.log('User already has profile on Onboarding page, redirecting to Dashboard');
      window.location.href = '/';
    }
  }, [profileLoading, profile]);

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setErrors({ fullName: 'الاسم مطلوب' });
      return;
    }

    if (!mosqueName.trim()) {
      setErrors({ mosqueName: 'اسم المسجد مطلوب' });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await createProfile({
        full_name: fullName,
        mosque_name: mosqueName || undefined,
        city,
        phone: phone || undefined,
        role,
      });

      // Check if it's a 409 Conflict (profile already exists) - this is OK, profile was updated
      const is409Error = error && ((error as any).code === '23505' || error.message?.includes('409') || error.message?.includes('duplicate key'));

      if (error && !is409Error) {
        console.error('Onboarding error:', error);
        toast({
          title: 'خطأ',
          description: error.message || 'حدث خطأ في إنشاء الملف الشخصي',
          variant: 'destructive',
        });
      } else {
        // Success OR 409 (profile already existed and was updated)
        const message = is409Error 
          ? 'تم تحديث ملفك الشخصي'
          : 'تم إنشاء ملفك الشخصي بنجاح';
        toast({
          title: 'مرحباً بك!',
          description: message,
        });
        // Hard redirect to Dashboard
        console.log('Profile saved successfully, redirecting to Dashboard');
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      }
    } catch (err) {
      console.error('Onboarding exception:', err);
      toast({
        title: 'خطأ غير متوقع',
        description: 'حدث خطأ. سيتم نقلك للصفحة الرئيسية',
        variant: 'destructive',
      });
      // Hard redirect
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
      <IslamicPattern />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-gold flex items-center justify-center glow-gold">
            <Moon className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">منظّم التراويح</h1>
          <p className="text-muted-foreground mt-2">نسخة الأنبار</p>
        </div>

        {/* Form Card */}
        <div className="glass rounded-2xl p-8 glow-soft">
          <form onSubmit={handleOnboarding} className="space-y-5">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-foreground">بيانات المسجد</h2>
              <p className="text-muted-foreground text-sm mt-1">أكمل بيانات مسجدك</p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                الاسم الكامل *
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
              {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName}</p>}
            </div>

            {/* City */}
            <div>
              <label htmlFor="city-select" className="block text-sm font-medium text-foreground mb-2">
                المدينة *
              </label>
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  id="city-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value as CityType)}
                  className="w-full pr-10 pl-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 appearance-none"
                  aria-label="اختر المدينة"
                >
                  {cities.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mosque Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                اسم المسجد *
              </label>
              <div className="relative">
                <Building className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={mosqueName}
                  onChange={(e) => setMosqueName(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="أدخل اسم المسجد"
                />
              </div>
              {errors.mosqueName && <p className="text-destructive text-sm mt-1">{errors.mosqueName}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                رقم الهاتف
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="رقم الهاتف (اختياري)"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gold hover:bg-gold-light text-primary-foreground font-semibold rounded-xl transition-all glow-gold disabled:opacity-50 mt-6"
            >
              {isSubmitting ? 'جاري الحفظ...' : 'أكمل التسجيل'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
