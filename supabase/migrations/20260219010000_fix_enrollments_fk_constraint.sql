-- Allow curriculum items to be deleted/reordered even if students have progress
-- This prevents the "violates foreign key constraint" error

-- 1. Find the constraint name for enrollments.last_lesson_id
-- If it's the one from 20240216_add_last_lesson_tracking, it might be auto-named
-- We'll drop and recreate it to be explicitly named and set to NULL on delete

DO $$ 
BEGIN
    -- Drop existing constraint if we can find it by name or by looking it up
    -- Typically it's enrollments_last_lesson_id_fkey
    ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_last_lesson_id_fkey;
    
    -- Re-add with ON DELETE SET NULL
    ALTER TABLE enrollments 
    ADD CONSTRAINT enrollments_last_lesson_id_fkey 
    FOREIGN KEY (last_lesson_id) 
    REFERENCES course_lessons(id) 
    ON DELETE SET NULL;
END $$;
