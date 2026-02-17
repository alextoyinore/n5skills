-- Add description and resources columns to course_lessons
ALTER TABLE course_lessons
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '[]'::jsonb;
