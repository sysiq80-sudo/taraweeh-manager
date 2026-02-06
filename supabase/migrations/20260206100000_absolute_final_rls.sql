-- COMPLETE RLS RESET: Delete ALL policies and recreate from scratch
-- This handles the case where some policies already exist

-- Step 1: Drop ALL policies including new ones
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
DROP POLICY IF EXISTS "Allow read own" ON profiles;
DROP POLICY IF EXISTS "Allow insert own" ON profiles;
DROP POLICY IF EXISTS "Allow update own" ON profiles;
DROP POLICY IF EXISTS "Allow read own v2" ON profiles;
DROP POLICY IF EXISTS "Allow insert own v2" ON profiles;
DROP POLICY IF EXISTS "Allow update own v2" ON profiles;
DROP POLICY IF EXISTS "Enable Read" ON profiles;
DROP POLICY IF EXISTS "Enable Insert" ON profiles;
DROP POLICY IF EXISTS "Enable Update" ON profiles;
DROP POLICY IF EXISTS "Public Insert" ON profiles;
DROP POLICY IF EXISTS "Public Select" ON profiles;
DROP POLICY IF EXISTS "Public Update" ON profiles;

-- Step 2: Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create FRESH Simple Non-Recursive Policies
CREATE POLICY "select_own_profile" 
ON profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "insert_own_profile" 
ON profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "update_own_profile" 
ON profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Step 4: Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles TO authenticated;
