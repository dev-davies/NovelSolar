-- Fix admin_profiles: remove authenticated read, keep only service role access
DROP POLICY IF EXISTS "Allow authenticated read on admin_profiles" ON admin_profiles;