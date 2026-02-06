-- ============================================================
-- إصلاح شامل لقاعدة البيانات - Comprehensive Database Fix
-- انسخ هذا الكود والصقه في Supabase SQL Editor
-- ============================================================
-- 
-- اذهب إلى: https://supabase.com/dashboard
-- اختر مشروعك → SQL Editor → New Query
-- الصق كل هذا الكود واضغط "Run"
--
-- ملاحظة مهمة: يجب تشغيل القسم 1 أولاً بشكل منفصل
-- ثم تشغيل بقية الأقسام معاً
-- ============================================================


-- ============================================================
-- القسم 1: إضافة قيم الأدوار الجديدة (شغّل هذا أولاً لوحده!)
-- RUN THIS SECTION ALONE FIRST!
-- ============================================================

ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'mosque_admin';


-- ============================================================
-- بعد تشغيل القسم 1 بنجاح، شغّل كل ما يلي:
-- AFTER Section 1 succeeds, run everything below:
-- ============================================================


-- ============================================================
-- القسم 2: إصلاح سياسات profiles (حذف الكل وإعادة إنشاء)
-- ============================================================

-- حذف جميع السياسات الموجودة
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable access to own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow individuals to view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow individuals to update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow individuals to insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Mosque admin can view members" ON public.profiles;
DROP POLICY IF EXISTS "Mosque admin can view reciters" ON public.profiles;
DROP POLICY IF EXISTS "Mosque admin can update reciters" ON public.profiles;
DROP POLICY IF EXISTS "Admin can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admin has full access" ON public.profiles;
DROP POLICY IF EXISTS "Super admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow read own" ON public.profiles;
DROP POLICY IF EXISTS "Allow insert own" ON public.profiles;
DROP POLICY IF EXISTS "Allow update own" ON public.profiles;
DROP POLICY IF EXISTS "Allow read own v2" ON public.profiles;
DROP POLICY IF EXISTS "Allow insert own v2" ON public.profiles;
DROP POLICY IF EXISTS "Allow update own v2" ON public.profiles;
DROP POLICY IF EXISTS "Enable Read" ON public.profiles;
DROP POLICY IF EXISTS "Enable Insert" ON public.profiles;
DROP POLICY IF EXISTS "Enable Update" ON public.profiles;
DROP POLICY IF EXISTS "Public Insert" ON public.profiles;
DROP POLICY IF EXISTS "Public Select" ON public.profiles;
DROP POLICY IF EXISTS "Public Update" ON public.profiles;
DROP POLICY IF EXISTS "select_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "insert_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;

-- تأكد من تفعيل RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات بسيطة وغير متكررة (NO RECURSION!)
-- SELECT: المستخدم يرى ملفه الشخصي فقط
CREATE POLICY "profiles_select_own" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

-- INSERT: المستخدم يضيف ملفه الشخصي فقط
CREATE POLICY "profiles_insert_own" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- UPDATE: المستخدم يعدل ملفه الشخصي فقط
CREATE POLICY "profiles_update_own" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- DELETE: المستخدم يحذف ملفه الشخصي فقط
CREATE POLICY "profiles_delete_own" 
ON public.profiles FOR DELETE 
USING (auth.uid() = user_id);

-- منح الصلاحيات
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO anon;


-- ============================================================
-- القسم 3: إصلاح سياسات user_roles
-- ============================================================

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can update own roles" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_select" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_insert" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_update" ON public.user_roles;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_roles_select_own" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "user_roles_insert_own" 
ON public.user_roles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_roles_update_own" 
ON public.user_roles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "user_roles_delete_own" 
ON public.user_roles FOR DELETE 
USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;


-- ============================================================
-- القسم 4: إصلاح سياسات reading_plans
-- ============================================================

DROP POLICY IF EXISTS "Users can view their own reading plans" ON public.reading_plans;
DROP POLICY IF EXISTS "Users can insert their own reading plans" ON public.reading_plans;
DROP POLICY IF EXISTS "Users can update their own reading plans" ON public.reading_plans;
DROP POLICY IF EXISTS "Users can delete their own reading plans" ON public.reading_plans;

ALTER TABLE public.reading_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reading_plans_select_own" 
ON public.reading_plans FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "reading_plans_insert_own" 
ON public.reading_plans FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reading_plans_update_own" 
ON public.reading_plans FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "reading_plans_delete_own" 
ON public.reading_plans FOR DELETE 
USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reading_plans TO authenticated;


-- ============================================================
-- القسم 5: إصلاح سياسات schedules
-- ============================================================

DROP POLICY IF EXISTS "Users can view their own schedules" ON public.schedules;
DROP POLICY IF EXISTS "Users can insert their own schedules" ON public.schedules;
DROP POLICY IF EXISTS "Users can update their own schedules" ON public.schedules;
DROP POLICY IF EXISTS "Users can delete their own schedules" ON public.schedules;

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "schedules_select_own" 
ON public.schedules FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "schedules_insert_own" 
ON public.schedules FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "schedules_update_own" 
ON public.schedules FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "schedules_delete_own" 
ON public.schedules FOR DELETE 
USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.schedules TO authenticated;


-- ============================================================
-- القسم 6: إصلاح سياسات mosque_reciters
-- ============================================================

DROP POLICY IF EXISTS "Mosque admin can view their reciters" ON public.mosque_reciters;
DROP POLICY IF EXISTS "Super admin can view all assignments" ON public.mosque_reciters;
DROP POLICY IF EXISTS "Mosque admin can create assignments" ON public.mosque_reciters;

ALTER TABLE public.mosque_reciters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mosque_reciters_select" 
ON public.mosque_reciters FOR SELECT 
USING (true);

CREATE POLICY "mosque_reciters_insert" 
ON public.mosque_reciters FOR INSERT 
WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mosque_reciters TO authenticated;


-- ============================================================
-- تم الانتهاء! ✅
-- ============================================================
