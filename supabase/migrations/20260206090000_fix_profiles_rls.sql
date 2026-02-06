-- Reset and simplify profiles RLS to prevent recursive policies

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable access to own profile" ON public.profiles;

CREATE POLICY "Enable access to own profile"
  ON public.profiles
  FOR ALL
  USING (auth.uid() = id);
