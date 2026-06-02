-- Add attachment tracking columns to dealer_applications
ALTER TABLE public.dealer_applications
ADD COLUMN IF NOT EXISTS previous_work_urls TEXT[] DEFAULT '{}'::TEXT[],
ADD COLUMN IF NOT EXISTS former_purchase_url TEXT;

-- Create the public storage bucket for dealer attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('dealer-attachments', 'dealer-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage bucket access policies
-- Note: These policies assume standard Supabase auth setup.
CREATE POLICY "Public Read Access for dealer-attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'dealer-attachments');

CREATE POLICY "Allow Insert for authenticated users in dealer-attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'dealer-attachments' 
  AND auth.role() = 'authenticated'
);
