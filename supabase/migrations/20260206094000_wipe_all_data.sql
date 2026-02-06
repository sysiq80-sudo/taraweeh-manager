-- COMPLETE WIPE: Delete All User Data
-- Truncate all user-related tables to start fresh

TRUNCATE TABLE profiles CASCADE;
TRUNCATE TABLE user_roles CASCADE;

-- Note: This does NOT delete auth users from Supabase Auth itself
-- Those are managed separately in the Auth dashboard
-- If you need to delete auth users, do it in Supabase Console → Authentication tab
