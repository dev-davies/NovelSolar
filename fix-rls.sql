-- Enable RLS on admin_profiles table
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Allow authenticated read on admin_profiles" 
ON admin_profiles FOR SELECT 
TO authenticated 
USING (true);

-- Allow service role full access (for your admin API)
CREATE POLICY "Allow service role full access on admin_profiles" 
ON admin_profiles FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);