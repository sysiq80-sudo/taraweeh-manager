-- Migration: Add Qiyam AL-Layl Support
-- Implements: Parallel schedule tracks for Taraweeh and Qiyam
-- Concept: Last 10 days of Ramadan have TWO separate prayer schedules

-- Add type column to schedules table
-- Values: 'taraweeh' (main nightly prayers), 'qiyam' (special last 10 days)
ALTER TABLE public.schedules
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'taraweeh';

-- Add comment for documentation
COMMENT ON COLUMN public.schedules.type IS 'Schedule type: taraweeh (main prayers) or qiyam (last 10 days special prayers)';

-- Add check constraint
ALTER TABLE public.schedules
DROP CONSTRAINT IF EXISTS schedule_type_check;

ALTER TABLE public.schedules
ADD CONSTRAINT schedule_type_check CHECK (type IN ('taraweeh', 'qiyam'));

-- Create index for schedule type lookups
CREATE INDEX IF NOT EXISTS idx_schedules_type 
ON public.schedules(type);

-- Create composite index for efficient queries
CREATE INDEX IF NOT EXISTS idx_schedules_user_type 
ON public.schedules(user_id, type);

-- Create composite index for date and type
CREATE INDEX IF NOT EXISTS idx_schedules_date_type 
ON public.schedules(date, type);

-- Add qiyam_reading_plan_id column to links Qiyam schedules to their parent plan
ALTER TABLE public.schedules
ADD COLUMN IF NOT EXISTS qiyam_reading_plan_id UUID REFERENCES public.reading_plans(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.schedules.qiyam_reading_plan_id IS 'Reference to the Qiyam reading plan (only set when type = qiyam)';

-- Create index for qiyam lookups
CREATE INDEX IF NOT EXISTS idx_schedules_qiyam_plan 
ON public.schedules(qiyam_reading_plan_id) WHERE type = 'qiyam';

-- Update reading_plans table to track qiyam status
ALTER TABLE public.reading_plans
ADD COLUMN IF NOT EXISTS has_qiyam_plan BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN public.reading_plans.has_qiyam_plan IS 'Indicates if a separate Qiyam plan exists for this reading plan';

-- Add qiyam_start_day column
ALTER TABLE public.reading_plans
ADD COLUMN IF NOT EXISTS qiyam_start_day INTEGER DEFAULT 21;

COMMENT ON COLUMN public.reading_plans.qiyam_start_day IS 'Ramadan day when Qiyam schedule begins (typically 21)';

-- RLS Policy: Users can only see their own Qiyam/Taraweeh schedules
DROP POLICY IF EXISTS "Users can view own schedules" ON public.schedules;

CREATE POLICY "Users can view own schedules"
  ON public.schedules
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Public can view Qiyam schedules with valid share_token
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
    OR (
      type = 'qiyam'
      AND EXISTS (
        SELECT 1 
        FROM public.reading_plans rp
        WHERE rp.id = schedules.qiyam_reading_plan_id
          AND rp.share_token IS NOT NULL
      )
    )
  );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.schedules TO authenticated;
