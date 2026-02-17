-- Update platform settings to Uwise
UPDATE platform_settings
SET 
    platform_name = 'Uwise',
    support_email = 'support@uwise.com'
WHERE id IS NOT NULL;

-- Ensure bio column exists in profiles (idempotent check)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bio') THEN
        ALTER TABLE profiles ADD COLUMN bio TEXT;
    END IF;
END $$;
