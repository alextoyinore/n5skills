-- 1. Ensure all columns exist in course_lessons
ALTER TABLE course_lessons 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS reading_content TEXT,
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- 2. Update RLS policies to include superadmin
-- We already updated update_course_roles.sql, but let's apply it here too to be safe

DO $$ 
BEGIN
    -- Courses
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins and Instructors can manage courses') THEN
        DROP POLICY "Admins and Instructors can manage courses" ON courses;
    END IF;
    CREATE POLICY "Admins, Instructors and Superadmins can manage courses" ON courses
        FOR ALL USING (
            EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'instructor', 'superadmin'))
        );

    -- Modules
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins and Instructors can manage modules') THEN
        DROP POLICY "Admins and Instructors can manage modules" ON course_modules;
    END IF;
    CREATE POLICY "Admins, Instructors and Superadmins can manage modules" ON course_modules
        FOR ALL USING (
            EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'instructor', 'superadmin'))
        );

    -- Lessons
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins and Instructors can manage lessons') THEN
        DROP POLICY "Admins and Instructors can manage lessons" ON course_lessons;
    END IF;
    CREATE POLICY "Admins, Instructors and Superadmins can manage lessons" ON course_lessons
        FOR ALL USING (
            EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'instructor', 'superadmin'))
        );
END $$;
