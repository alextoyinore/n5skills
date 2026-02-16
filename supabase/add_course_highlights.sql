-- Add highlights column to courses table
-- This stores an array of course highlight points for "What you'll master" section

ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS highlights TEXT[];

-- Add a comment
COMMENT ON COLUMN courses.highlights IS 'Array of course highlight points for "What you''ll master" section';
