-- Add dealer pathway columns to profiles table

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dealer_status_enum') THEN
        CREATE TYPE public.dealer_status_enum AS ENUM ('none', 'pending', 'approved', 'rejected');
    END IF;
END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' NOT NULL,
  ADD COLUMN IF NOT EXISTS dealer_status public.dealer_status_enum DEFAULT 'none' NOT NULL;
