-- Migration: create_auth_sessions

CREATE TABLE IF NOT EXISTS auth_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bitrix_user_id varchar(255) NOT NULL,
  member_id varchar(255) NOT NULL,
  domain varchar(255) NOT NULL,
  auth_id text NOT NULL,
  refresh_id text,
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(member_id, bitrix_user_id)
);

-- Enable RLS
ALTER TABLE auth_sessions ENABLE ROW LEVEL SECURITY;

-- Since the backend uses the Service Role key, it bypasses RLS. 
-- We do not need to create public policies for this table.
