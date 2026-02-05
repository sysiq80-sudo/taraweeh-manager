-- Create city enum for Al Anbar cities
CREATE TYPE public.city_type AS ENUM ('ramadi', 'fallujah', 'hit', 'haditha', 'ana', 'rawa', 'qaim', 'rutba');

-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'reciter');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    mosque_name TEXT,
    city city_type NOT NULL DEFAULT 'ramadi',
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'reciter',
    UNIQUE (user_id, role)
);

-- Create reading_plans table
CREATE TABLE public.reading_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    start_page INTEGER NOT NULL DEFAULT 1,
    pages_per_day INTEGER NOT NULL DEFAULT 20,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_days INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create schedules table
CREATE TABLE public.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reading_plan_id UUID REFERENCES public.reading_plans(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    day_number INTEGER NOT NULL,
    start_page INTEGER NOT NULL,
    end_page INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('completed', 'today', 'upcoming', 'absent')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role"
    ON public.user_roles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Reading plans policies
CREATE POLICY "Users can view their own reading plans"
    ON public.reading_plans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading plans"
    ON public.reading_plans FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading plans"
    ON public.reading_plans FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading plans"
    ON public.reading_plans FOR DELETE
    USING (auth.uid() = user_id);

-- Schedules policies
CREATE POLICY "Users can view their own schedules"
    ON public.schedules FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own schedules"
    ON public.schedules FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedules"
    ON public.schedules FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedules"
    ON public.schedules FOR DELETE
    USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reading_plans_updated_at
    BEFORE UPDATE ON public.reading_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at
    BEFORE UPDATE ON public.schedules
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();