-- Add enable_oauth column to platform_settings table
ALTER TABLE platform_settings 
ADD COLUMN IF NOT EXISTS enable_oauth BOOLEAN DEFAULT true;

-- Update existing row if it exists
UPDATE platform_settings SET enable_oauth = true WHERE enable_oauth IS NULL;
