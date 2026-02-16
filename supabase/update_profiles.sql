-- Update profiles table with additional fields
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS headline TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS socials JSONB DEFAULT '{}'::jsonb;

-- Example structure for socials JSONB:
-- {
--   "twitter": "https://twitter.com/username",
--   "linkedin": "https://linkedin.com/in/username",
--   "github": "https://github.com/username"
-- }
