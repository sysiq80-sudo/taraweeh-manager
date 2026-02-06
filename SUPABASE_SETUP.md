# إعداد Supabase

## المتطلبات

لتشغيل هذا التطبيق، تحتاج إلى إعداد Supabase Project مع المصادقة والجداول الصحيحة.

## الخطوات:

### 1. إنشاء Project على Supabase
- انتقل إلى https://app.supabase.com
- أنشئ حساب جديد (أو سجل دخول)
- أنشئ project جديد

### 2. تفعيل المصادقة بالبريد الإلكتروني
1. في لوحة التحكم، اذهب إلى **Authentication** → **Providers**
2. تأكد من أن **Email** مفعل
3. تحت **Email Auth**, تأكد من تفعيل:
   - ✅ Email/Password authentication
   - ✅ Confirm email required (اختياري)

### 3. نسخ بيانات الاتصال
1. اذهب إلى **Project Settings** → **API**
2. انسخ:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon public key** → `VITE_SUPABASE_PUBLISHABLE_KEY`
3. احفظها في ملف `.env`:

```
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_PROJECT_ID="your-project-id"
```

### 4. إنشاء الجداول المطلوبة

في SQL Editor، شغّل:

```sql
-- Create profiles table
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

-- Create user_roles table
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'reciter' CHECK (role IN ('admin', 'reciter')),
  created_at TIMESTAMP DEFAULT now()
);

-- Create reading_plans table
CREATE TABLE reading_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_page INTEGER NOT NULL,
  pages_per_day INTEGER NOT NULL,
  start_date DATE NOT NULL,
  total_days INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create schedules table
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reading_plan_id UUID REFERENCES reading_plans(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  day_number INTEGER NOT NULL,
  start_page INTEGER NOT NULL,
  end_page INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('completed', 'today', 'upcoming', 'absent')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
```

### 5. إنشاء RLS Policies

```sql
-- Profiles policies
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can read own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own role" ON user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reading plans policies
CREATE POLICY "Users can read own plans" ON reading_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plans" ON reading_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans" ON reading_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plans" ON reading_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Schedules policies
CREATE POLICY "Users can read own schedules" ON schedules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedules" ON schedules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules" ON schedules
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules" ON schedules
  FOR DELETE USING (auth.uid() = user_id);
```

### 6. اختبر المصادقة
1. أنشئ حساب اختباري:
   - البريد: `test@example.com`
   - كلمة المرور: `Test123456`

2. حاول تسجيل الدخول في التطبيق

## استكشاف الأخطاء

### خطأ 400 Bad Request
- تأكد من تفعيل Email/Password authentication في Supabase
- تحقق من أن البيانات صحيحة (البريد والكلمة)
- تحقق من console للأخطاء التفصيلية (`F12` → Console)

### فشل في قراءة البيانات
- تأكد من إنشاء الجداول
- تأكد من تفعيل RLS policies
- تحقق من أن المستخدم مصرح له بقراءة البيانات

### عدم تحديث البيانات
- افتح DevTools (`F12` → Network)
- تحقق من الطلبات إلى Supabase
- ابحث عن رسائل الخطأ

## الدعم

إذا واجهت مشاكل:
1. تحقق من console (`F12`)
2. تحقق من Network tab لرؤية طلبات Supabase
3. راجع [وثائق Supabase](https://supabase.com/docs)
