-- EMERGENCY FIX: Infinite Recursion in Profiles RLS (Code 42P17)
-- This migration clears ALL recursive policies and establishes safe, direct auth checks

-- Step 1: Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable access to own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Allow individuals to view own profile" ON profiles;
DROP POLICY IF EXISTS "Allow individuals to update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow individuals to insert own profile" ON profiles;
DROP POLICY IF EXISTS "Mosque admin can view members" ON profiles;
DROP POLICY IF EXISTS "Admin can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admin has full access" ON profiles;

-- Step 2: Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create SAFE, NON-RECURSIVE policies with direct auth checks only
-- No role checks, no mosque_id checks, no subqueries — just auth.uid() = id

CREATE POLICY "Allow individuals to view own profile" 
ON profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Allow individuals to update own profile" 
ON profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Allow individuals to insert own profile" 
ON profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- End migration
