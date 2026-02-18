-- Add reading_content to course_lessons if not exists
ALTER TABLE course_lessons 
ADD COLUMN IF NOT EXISTS reading_content TEXT;

-- ensure order_index exists (it likely does but being safe)
ALTER TABLE course_lessons 
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
