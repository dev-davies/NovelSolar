-- Migration: create_user_sessions
-- Stores user auth tokens for the NovelSolar customer portal.
-- Run this directly in your Supabase SQL editor or via the CLI.

CREATE TABLE IF NOT EXISTS user_sessions (
  token       text PRIMARY KEY,
  contact_id  text NOT NULL,
  email       text NOT NULL,
  created_at  bigint NOT NULL,
  expires_at  bigint NOT NULL
);

-- Only the service-role key (used server-side) should touch this table.
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- No public policies — service role bypasses RLS entirely.

-- Enable pg_cron extension for scheduled cleanup
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Auto-delete expired rows to keep the table lean.
SELECT cron.schedule(
  'delete-expired-user-sessions',
  '0 * * * *',           -- every hour
  $$DELETE FROM user_sessions WHERE expires_at < (EXTRACT(EPOCH FROM now()) * 1000)::bigint$$
);
