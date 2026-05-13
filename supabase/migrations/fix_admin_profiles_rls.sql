-- Migration: fix_admin_profiles_rls
-- Removes the overly-broad authenticated read policy on admin_profiles.
-- Only the service role (server-side API) should access this table.

DROP POLICY IF EXISTS "Allow authenticated read on admin_profiles" ON admin_profiles;
