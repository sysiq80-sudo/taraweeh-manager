-- CRITICAL FIX: Reset RLS Policies to Fix 500/403 Errors
-- Removes all recursive and conflicting policies
-- Creates simple, non-recursive policies for basic CRUD operations

-- Step 1: Drop ALL existing profile policies
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
CREATE POLICY "Allow read own" 
ON profiles 
FOR SELECT 
USING (auth.uid() = id);

-- INSERT: Allow users to insert their own profile
CREATE POLICY "Allow insert own" 
ON profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- UPDATE: Allow users to update their own profile
CREATE POLICY "Allow update own" 
ON profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles TO authenticated;
