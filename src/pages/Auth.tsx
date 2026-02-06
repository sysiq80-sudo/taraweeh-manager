import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { IslamicPattern, MosqueSilhouette } from '@/components/ui/IslamicPattern';
import { useAuth } from '@/hooks/useAuth';
import { getRandomVerse } from '@/lib/quranicVerses';
import { useToast } from '@/hooks/use-toast';

const emailSchema = z.string().email('البريد الإلكتروني غير صحيح');
const passwordSchema = z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signIn, signUp } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [verse] = useState(getRandomVerse());

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && user) {
      const redirectId = window.setTimeout(() => {
        navigate('/', { replace: true });
      }, 0);

      return () => window.clearTimeout(redirectId);
    }

    return undefined;
  }, [authLoading, user, navigate]);

  if (!authLoading && user) {
    return null;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
          console.error('Login error:', error);

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
          } else if (error.message.includes('400') || error.status === 400) {
            toast({
              title: 'خطأ في الطلب',
              description: 'تأكد من صحة البريد الإلكتروني وكلمة المرور. إذا كنت جديداً، استخدم "إنشاء حساب"',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'خطأ',
              description: error.message || 'فشل تسجيل الدخول',
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'مرحباً!',
            description: 'تم تسجيل الدخول بنجاح',
          });
        }
      } else if (mode === 'signup') {
        const { data, error } = await signUp(email, password);
        if (error) {
          console.error('Signup error:', error);

          if (error.message.includes('already registered')) {
            toast({
              title: 'الحساب موجود',
              description: 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول',
              variant: 'destructive',
            });
          } else if (error.message.includes('Password')) {
            toast({
              title: 'خطأ في كلمة المرور',
              description: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'خطأ في إنشاء الحساب',
              description: error.message || 'فشل إنشاء الحساب',
              variant: 'destructive',
            });
          }
        } else if (data?.session) {
          toast({
            title: 'تم إنشاء الحساب',
            description: 'تم تسجيل الدخول تلقائياً',
          });
          navigate('/onboarding', { replace: true });
        } else {
          toast({
            title: 'تم إنشاء الحساب',
            description: 'يرجى تسجيل الدخول للمتابعة',
          });
          setEmail('');
          setPassword('');
          setMode('login');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ غير متوقع. حاول لاحقاً',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
      <IslamicPattern />

      <div className="relative z-10 w-full max-w-md">
        {/* Quranic Verse */}
        <div className="mb-6 text-center">
          <div className="glass rounded-xl p-4 inline-block max-w-sm">
            <p className="text-gold text-lg font-semibold leading-relaxed">
              ﴿ {verse.arabic} ﴾
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              سورة {verse.surah} - الآية {verse.ayah}
            </p>
          </div>
        </div>
        {/* Setup Helper Alert */}
        {showHelp && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 animate-in fade-in">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-amber-600 mb-2">هل تواجه مشاكل في تسجيل الدخول؟</p>
                <ul className="space-y-1 text-amber-700/80 mb-3">
                  <li>✓ تأكد من إعداد <strong>Supabase Project</strong></li>
                  <li>✓ فعّل <strong>Email/Password Authentication</strong></li>
                  <li>✓ أنشئ جداول <strong>profiles</strong></li>
                  <li>✓ اقرأ <strong>SUPABASE_SETUP.md</strong> للتفاصيل الكاملة</li>
                </ul>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  ← إغلق
                </button>
              </div>
            </div>
          </div>
        )}

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
          <form onSubmit={handleAuth} className="space-y-5">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {mode === 'login' ? 'أدخل بياناتك للمتابعة' : 'أنشئ حسابك للبدء'}
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
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
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
              {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gold hover:bg-gold-light text-primary-foreground font-semibold rounded-xl transition-all glow-gold disabled:opacity-50"
            >
              {isSubmitting ? 'جاري التحميل...' : mode === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}
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

            <div className="border-t border-border/30 pt-4 mt-4">
              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {showHelp ? 'إخفاء المساعدة' : 'هل تحتاج مساعدة؟'}
              </button>
            </div>
          </form>
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
