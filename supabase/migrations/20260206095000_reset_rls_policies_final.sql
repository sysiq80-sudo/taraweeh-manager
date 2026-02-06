-- FINAL RLS RESET: Simplest Possible Policies
-- Removes ALL conflicting policies and creates basic ones

-- Step 1: Drop ALL existing policies on profiles table
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

-- Step 3: Create Absolute Basic Non-Recursive Policies
-- SELECT: Only users can see their own profile
CREATE POLICY "Public Select" 
ON profiles 
FOR SELECT 
USING (auth.uid() = id);

-- INSERT: Only authenticated users can insert their own profile
CREATE POLICY "Public Insert" 
ON profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- UPDATE: Only users can update their own profile
CREATE POLICY "Public Update" 
ON profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Step 4: Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles TO authenticated;
