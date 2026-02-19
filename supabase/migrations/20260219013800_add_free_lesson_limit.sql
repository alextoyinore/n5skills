-- Add free_lesson_limit column to platform_settings table
-- Default is 5 lessons for unpaid courses
ALTER TABLE platform_settings 
ADD COLUMN IF NOT EXISTS free_lesson_limit INTEGER DEFAULT 5;

-- Update existing row
UPDATE platform_settings SET free_lesson_limit = 5 WHERE free_lesson_limit IS NULL;
