-- Migration: create_admin_sessions
-- Stores admin auth tokens for the NovelSolar admin dashboard.
-- Run this directly in your Supabase SQL editor or via the CLI.

CREATE TABLE IF NOT EXISTS admin_sessions (
  token       text PRIMARY KEY,
  user_id     text,
  email       text,
  created_at  bigint NOT NULL,
  expires_at  bigint NOT NULL
);

-- Only the service-role key (used server-side) should touch this table.
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- No public policies — service role bypasses RLS entirely.

-- Enable pg_cron extension for scheduled cleanup (safe to run if already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Auto-delete expired rows to keep the table lean.
SELECT cron.schedule(
  'delete-expired-admin-sessions',
  '0 * * * *',           -- every hour
  $$DELETE FROM admin_sessions WHERE expires_at < (EXTRACT(EPOCH FROM now()) * 1000)::bigint$$
);
