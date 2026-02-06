-- Migration: Add Role Hierarchy to Profiles
-- Implements: Super Admin > Mosque Admin > Reciter architecture

-- Add role column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'reciter';

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.role IS 'User role: super_admin (system admin), mosque_admin (mosque administrator), or reciter (imam/reader)';

-- Update enum type if it exists
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS role_check;

ALTER TABLE public.profiles
ADD CONSTRAINT role_check CHECK (role IN ('super_admin', 'mosque_admin', 'reciter'));

-- Create index for faster role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role 
ON public.profiles(role);

-- Add mosque_id column for linking mosque admins to specific mosques
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS mosque_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.profiles.mosque_id IS 'Reference to the Mosque Admin who manages this reciter (only filled for reciter role)';

-- Create index for mosque hierarchy
CREATE INDEX IF NOT EXISTS idx_profiles_mosque_id 
ON public.profiles(mosque_id);

-- Update RLS policies for role-based access
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Mosque admin can view reciters" ON public.profiles;
DROP POLICY IF EXISTS "Super admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Mosque admin can update reciters" ON public.profiles;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow mosque admins to view reciters in their mosque
CREATE POLICY "Mosque admin can view reciters"
  ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = user_id 
    OR (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid() AND p.role = 'mosque_admin'
          AND (profiles.mosque_id = p.id OR profiles.id = p.id)
      )
    )
  );

-- Allow super admins to view all profiles
CREATE POLICY "Super admin can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'super_admin'
    )
  );

-- Allow users to update own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow mosque admins to update reciters in their mosque
CREATE POLICY "Mosque admin can update reciters"
  ON public.profiles
  FOR UPDATE
  USING (
    auth.uid() = user_id
    OR (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid() AND p.role = 'mosque_admin'
          AND profiles.mosque_id = p.id
      )
    )
  );

-- Table for tracking which mosque admin manages which reciter
-- This provides a many-to-many relationship
CREATE TABLE IF NOT EXISTS public.mosque_reciters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mosque_admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reciter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(mosque_admin_id, reciter_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_mosque_reciters_admin 
ON public.mosque_reciters(mosque_admin_id);

CREATE INDEX IF NOT EXISTS idx_mosque_reciters_reciter 
ON public.mosque_reciters(reciter_id);

-- Add comment
COMMENT ON TABLE public.mosque_reciters IS 'Maps mosque admins to their assigned reciters. Enables one mosque admin to manage multiple reciters.';

-- Enable RLS on mosque_reciters table
ALTER TABLE public.mosque_reciters ENABLE ROW LEVEL SECURITY;

-- RLS policies for mosque_reciters
DROP POLICY IF EXISTS "Mosque admin can view their reciters" ON public.mosque_reciters;
DROP POLICY IF EXISTS "Super admin can view all assignments" ON public.mosque_reciters;
DROP POLICY IF EXISTS "Mosque admin can create assignments" ON public.mosque_reciters;

CREATE POLICY "Mosque admin can view their reciters"
  ON public.mosque_reciters
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.id = mosque_reciters.mosque_admin_id
    )
  );

CREATE POLICY "Super admin can view all assignments"
  ON public.mosque_reciters
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'super_admin'
    )
  );

CREATE POLICY "Mosque admin can create assignments"
  ON public.mosque_reciters
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.id = mosque_admin_id AND p.role = 'mosque_admin'
    )
  );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mosque_reciters TO authenticated;
