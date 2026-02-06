-- Store multi-imam assignments for each schedule

ALTER TABLE public.schedules
ADD COLUMN IF NOT EXISTS imam_assignments JSONB;

COMMENT ON COLUMN public.schedules.imam_assignments IS 'Imam assignments for rakah ranges (array of { imamName, startRakat, endRakat })';
