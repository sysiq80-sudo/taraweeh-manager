-- Migration: Add share_token for public schedule sharing
-- This allows schedules to be shared publicly via unique tokens

-- Add share_token column to reading_plans table (master plan)
ALTER TABLE public.reading_plans
ADD COLUMN IF NOT EXISTS share_token UUID DEFAULT gen_random_uuid() UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_reading_plans_share_token 
ON public.reading_plans(share_token);

-- Add comment for documentation
COMMENT ON COLUMN public.reading_plans.share_token IS 
'Unique token for sharing the reading plan publicly without authentication';

-- Update RLS policies to allow public read access with valid share_token
-- Drop existing public read policy if it exists
DROP POLICY IF EXISTS "Public can view shared reading plans" ON public.reading_plans;

-- Create policy for public read access with valid share_token
CREATE POLICY "Public can view shared reading plans"
  ON public.reading_plans
  FOR SELECT
  USING (share_token IS NOT NULL);

-- Update schedules table RLS to allow public read if reading_plan has share_token
DROP POLICY IF EXISTS "Public can view schedules with share token" ON public.schedules;

CREATE POLICY "Public can view schedules with share token"
  ON public.schedules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 
      FROM public.reading_plans rp
      WHERE rp.id = schedules.reading_plan_id
        AND rp.share_token IS NOT NULL
    )
  );

-- Allow public read of profiles for shared schedules (name and mosque only)
DROP POLICY IF EXISTS "Public can view profiles for shared schedules" ON public.profiles;

CREATE POLICY "Public can view profiles for shared schedules"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.reading_plans rp
      WHERE rp.user_id = profiles.user_id
        AND rp.share_token IS NOT NULL
    )
  );

-- Function to generate or retrieve share token
CREATE OR REPLACE FUNCTION public.get_or_create_share_token(_reading_plan_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _token UUID;
BEGIN
  -- Get existing token or generate new one
  SELECT share_token INTO _token
  FROM public.reading_plans
  WHERE id = _reading_plan_id
    AND user_id = auth.uid();
  
  -- If no token exists, generate one
  IF _token IS NULL THEN
    UPDATE public.reading_plans
    SET share_token = gen_random_uuid()
    WHERE id = _reading_plan_id
      AND user_id = auth.uid()
    RETURNING share_token INTO _token;
  END IF;
  
  RETURN _token;
END;
$$;

-- Function to revoke share token (make plan private again)
CREATE OR REPLACE FUNCTION public.revoke_share_token(_reading_plan_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.reading_plans
  SET share_token = NULL
  WHERE id = _reading_plan_id
    AND user_id = auth.uid();
  
  RETURN FOUND;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_or_create_share_token(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_share_token(UUID) TO authenticated;
