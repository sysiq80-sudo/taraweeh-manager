-- FINAL FIX: Reset RLS Policies - Drop and Recreate
-- This migration handles the case where policies already exist

-- Step 1: Drop ALL existing profile policies (if they exist)
DROP POLICY IF EXISTS "Allow read own" ON profiles;
DROP POLICY IF EXISTS "Allow insert own" ON profiles;
DROP POLICY IF EXISTS "Allow update own" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable access to own profile" ON profiles;
DROP POLICY IF EXISTS "Allow individuals to view own profile" ON profiles;
DROP POLICY IF EXISTS "Allow individuals to update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow individuals to insert own profile" ON profiles;
DROP POLICY IF EXISTS "Mosque admin can view members" ON profiles;
DROP POLICY IF EXISTS "Admin can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admin has full access" ON profiles;

-- Step 2: Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create SIMPLE, NON-RECURSIVE policies
-- SELECT: Allow users to read their own profile
CREATE POLICY "Allow read own v2"
ON profiles
FOR SELECT
USING (auth.uid() = id);

-- INSERT: Allow users to insert their own profile
CREATE POLICY "Allow insert own v2"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- UPDATE: Allow users to update their own profile
CREATE POLICY "Allow update own v2"
ON profiles
FOR UPDATE
USING (auth.uid() = id);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles TO authenticated;
