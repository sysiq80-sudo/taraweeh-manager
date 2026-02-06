-- Migration: Add UPDATE and SELECT RLS policies for profiles table
-- This allows users to read and update their own profile records
-- Fixes: 409 Conflict errors and infinite redirect loops

-- Enable RLS if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can select own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

-- Create SELECT policy - allows users to read their own profile
CREATE POLICY "Users can select own profile" 
  ON profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Create INSERT policy - allows users to insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create UPDATE policy - allows users to update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles 
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create DELETE policy - allows users to delete their own profile
CREATE POLICY "Users can delete own profile" 
  ON profiles 
  FOR DELETE 
  USING (auth.uid() = id);

-- Apply similar policies for user_roles table
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select own role" ON user_roles;
DROP POLICY IF EXISTS "Users can insert own role" ON user_roles;
DROP POLICY IF EXISTS "Users can update own role" ON user_roles;
DROP POLICY IF EXISTS "Users can delete own role" ON user_roles;

CREATE POLICY "Users can select own role" 
  ON user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own role" 
  ON user_roles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own role" 
  ON user_roles 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own role" 
  ON user_roles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Apply similar policies for reading_plans if it exists
ALTER TABLE IF EXISTS reading_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select reading plans" ON reading_plans;
CREATE POLICY "Users can select reading plans" 
  ON reading_plans 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Apply similar policies for schedules if it exists
ALTER TABLE IF EXISTS schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select own schedules" ON schedules;
CREATE POLICY "Users can select own schedules" 
  ON schedules 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own schedules" ON schedules;
CREATE POLICY "Users can insert own schedules" 
  ON schedules 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own schedules" ON schedules;
CREATE POLICY "Users can update own schedules" 
  ON schedules 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

