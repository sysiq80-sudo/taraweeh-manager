import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Mail, Lock, User, Phone, Building, MapPin, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { IslamicPattern, MosqueSilhouette } from '@/components/ui/IslamicPattern';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, CityType, AppRole } from '@/hooks/useProfile';
import { getRandomVerse } from '@/lib/quranicVerses';
import { useToast } from '@/hooks/use-toast';

const emailSchema = z.string().email('البريد الإلكتروني غير صحيح');
const passwordSchema = z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');

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

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signIn, signUp } = useAuth();
  const { profile, loading: profileLoading, createProfile } = useProfile();
  const { toast } = useToast();

  const [mode, setMode] = useState<'login' | 'signup' | 'onboarding'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verse] = useState(getRandomVerse());

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mosqueName, setMosqueName] = useState('');
  const [city, setCity] = useState<CityType>('ramadi');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<AppRole>('reciter');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && !authLoading && !profileLoading) {
      if (profile) {
        navigate('/');
      } else if (mode !== 'onboarding') {
        setMode('onboarding');
      }
    }
  }, [user, profile, authLoading, profileLoading, navigate, mode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }
    
    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: 'خطأ في تسجيل الدخول',
              description: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
              variant: 'destructive',
            });
          } else if (error.message.includes('Email not confirmed')) {
            toast({
              title: 'البريد الإلكتروني غير مؤكد',
              description: 'يرجى تأكيد بريدك الإلكتروني أولاً',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'خطأ',
              description: error.message,
              variant: 'destructive',
            });
          }
        }
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'الحساب موجود',
              description: 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'خطأ في إنشاء الحساب',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'تم إنشاء الحساب',
            description: 'تم إرسال رابط التأكيد إلى بريدك الإلكتروني',
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      setErrors({ fullName: 'الاسم مطلوب' });
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

      if (error) {
        toast({
          title: 'خطأ',
          description: 'حدث خطأ في إنشاء الملف الشخصي',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'مرحباً بك!',
          description: 'تم إنشاء حسابك بنجاح',
        });
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
          {mode === 'onboarding' ? (
            /* Onboarding Form */
            <form onSubmit={handleOnboarding} className="space-y-5">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground">أكمل ملفك الشخصي</h2>
                <p className="text-muted-foreground text-sm mt-1">أخبرنا المزيد عنك</p>
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
                {errors.fullName && (
                  <p className="text-destructive text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  نوع الحساب *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('reciter')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      role === 'reciter'
                        ? 'border-gold bg-gold/20 text-gold'
                        : 'border-border bg-secondary/50 text-muted-foreground hover:border-gold/50'
                    }`}
                  >
                    <User className="w-6 h-6 mx-auto mb-2" />
                    <span className="block font-medium">قارئ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      role === 'admin'
                        ? 'border-gold bg-gold/20 text-gold'
                        : 'border-border bg-secondary/50 text-muted-foreground hover:border-gold/50'
                    }`}
                  >
                    <Building className="w-6 h-6 mx-auto mb-2" />
                    <span className="block font-medium">مسؤول مسجد</span>
                  </button>
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  المدينة *
                </label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value as CityType)}
                    className="w-full pr-10 pl-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 appearance-none"
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
                  اسم المسجد
                </label>
                <div className="relative">
                  <Building className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={mosqueName}
                    onChange={(e) => setMosqueName(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                    placeholder="اسم المسجد (اختياري)"
                  />
                </div>
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
                    placeholder="07XX XXX XXXX (اختياري)"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gold hover:bg-gold-light text-primary-foreground font-semibold rounded-xl transition-all glow-gold disabled:opacity-50"
              >
                {isSubmitting ? 'جاري الحفظ...' : 'إكمال التسجيل'}
              </button>
            </form>
          ) : (
            /* Login/Signup Form */
            <form onSubmit={handleAuth} className="space-y-5">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground">
                  {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {mode === 'login' 
                    ? 'أدخل بياناتك للمتابعة' 
                    : 'أنشئ حسابك للبدء'}
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                    placeholder="example@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10 pl-12 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gold hover:bg-gold-light text-primary-foreground font-semibold rounded-xl transition-all glow-gold disabled:opacity-50"
              >
                {isSubmitting 
                  ? 'جاري التحميل...' 
                  : mode === 'login' 
                    ? 'تسجيل الدخول' 
                    : 'إنشاء الحساب'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-gold hover:text-gold-light transition-colors text-sm"
                >
                  {mode === 'login' 
                    ? 'ليس لديك حساب؟ أنشئ حساباً جديداً' 
                    : 'لديك حساب؟ سجّل الدخول'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Quranic Verse */}
        <div className="mt-8 text-center">
          <div className="glass rounded-xl p-4 inline-block max-w-sm">
            <p className="text-gold text-lg font-semibold leading-relaxed">
              ﴿ {verse.arabic} ﴾
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              سورة {verse.surah} - الآية {verse.ayah}
            </p>
          </div>
        </div>

        {/* Mosque Silhouette */}
        <div className="mt-8 opacity-20">
          <MosqueSilhouette className="w-full h-24 text-gold" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
