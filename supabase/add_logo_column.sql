-- Add logo_url to platform_settings
ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Note: Storage buckets cannot be created via standard SQL in the SQL editor 
-- usually, but we can ensure the column exists. 
-- The bucket 'branding' should be created via the Supabase Dashboard 
-- or via API if available. Assuming we handle the column first.
