-- Add last_lesson_id to track the most recently accessed lesson for a student in a course
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS last_lesson_id UUID REFERENCES course_lessons(id);

-- Update last_accessed_at automatically (this column already exists but let's ensure it's easy to use)
-- No changes needed if it already exists, but for clarity:
-- ALTER TABLE enrollments ALTER COLUMN last_accessed_at SET DEFAULT now();
