-- Migration: fix_admin_profiles_initial_rls
-- Initial RLS setup for admin_profiles table.
-- Note: This was later refined by fix_admin_profiles_rls.sql which removes
-- the authenticated read policy. Kept for historical reference.

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read (later removed)
CREATE POLICY "Allow authenticated read on admin_profiles"
ON admin_profiles FOR SELECT
TO authenticated
USING (true);

-- Allow service role full access (for admin API)
CREATE POLICY "Allow service role full access on admin_profiles"
ON admin_profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
