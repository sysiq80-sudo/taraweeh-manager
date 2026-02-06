import React from 'react';
import { AlertCircle, ExternalLink, Copy } from 'lucide-react';

export const SupabaseSetupHelper: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم النسخ!');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="glass rounded-2xl p-8 glow-soft">
          <div className="flex gap-4 mb-6">
            <AlertCircle className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                تحتاج إلى إعداد Supabase
              </h2>
              <p className="text-muted-foreground">
                يبدو أن Supabase قد لا يكون مكوناً بشكل صحيح. اتبع الخطوات أدناه:
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="bg-secondary/50 p-4 rounded-xl">
              <h3 className="font-bold text-foreground mb-3">الخطوة 1: تحقق من الاتصال</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ البريد الإلكتروني: الملف الحالي يحتوي على بيانات صحيحة</li>
                <li>✓ تأكد من أن Project ID صحيح: <code className="bg-background px-2 py-1 rounded">bhgxytrbzzqdspumtftj</code></li>
                <li>✓ انتقل إلى <a href="https://app.supabase.com" className="text-gold hover:underline">Supabase Dashboard</a></li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-secondary/50 p-4 rounded-xl">
              <h3 className="font-bold text-foreground mb-3">الخطوة 2: تفعيل المصادقة</h3>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>اذهب إلى <strong>Authentication</strong> → <strong>Providers</strong></li>
                <li>تأكد من تفعيل <strong>Email</strong> provider</li>
                <li>فعّل <strong>Email/Password authentication</strong></li>
              </ol>
            </div>

            {/* Step 3 */}
            <div className="bg-secondary/50 p-4 rounded-xl">
              <h3 className="font-bold text-foreground mb-3">الخطوة 3: إنشاء الجداول</h3>
              <p className="text-sm text-muted-foreground mb-3">
                اذهب إلى <strong>SQL Editor</strong> والصق الكود أدناه:
              </p>
              <div className="bg-background rounded-lg p-3 text-xs overflow-auto max-h-64">
                <pre className="text-muted-foreground">
{`-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  mosque_name TEXT,
  city TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);`}
                </pre>
              </div>
              <button
                onClick={() => copyToClipboard(`CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  mosque_name TEXT,
  city TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);\nALTER TABLE profiles ENABLE ROW LEVEL SECURITY;\nCREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);`)}
                className="mt-3 flex items-center gap-2 px-3 py-2 bg-gold text-primary-foreground text-sm rounded hover:bg-gold/90"
              >
                <Copy className="w-4 h-4" /> انسخ رمز SQL
              </button>
            </div>

            {/* Step 4 */}
            <div className="bg-secondary/50 p-4 rounded-xl">
              <h3 className="font-bold text-foreground mb-3">الخطوة 4: إنشاء حساب اختباري</h3>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>في التطبيق، اختر <strong>"إنشاء حساب"</strong></li>
                <li>استخدم بريد واضح: <code className="bg-background px-2 py-1 rounded">test@example.com</code></li>
                <li>استخدم كلمة مرور: <code className="bg-background px-2 py-1 rounded">Test123456</code></li>
              </ol>
            </div>

            {/* Documentation Link */}
            <div className="bg-gold/10 border border-gold/30 p-4 rounded-xl">
              <a
                href="/SUPABASE_SETUP.md"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                اقرأ التعليمات الكاملة (SUPABASE_SETUP.md)
              </a>
            </div>

            {/* Support */}
            <div className="text-center text-sm text-muted-foreground">
              <p>بحاجة لمساعدة؟ افتح Developer Tools (<strong>F12</strong>) وانظر للـ Console للأخطاء التفصيلية</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
