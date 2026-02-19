-- 1. Ensure Columns Exist (Double-check)
ALTER TABLE course_modules ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS reading_content TEXT;
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- 2. Update RLS for ALL roles including Superadmin
-- Courses
DROP POLICY IF EXISTS "Admins and Instructors can manage courses" ON courses;
DROP POLICY IF EXISTS "Admins, Instructors and Superadmins can manage courses" ON courses;
CREATE POLICY "Full access to courses for staff" ON courses
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'instructor', 'superadmin'))
    );

-- Modules
DROP POLICY IF EXISTS "Admins and Instructors can manage modules" ON course_modules;
DROP POLICY IF EXISTS "Admins, Instructors and Superadmins can manage modules" ON course_modules;
CREATE POLICY "Full access to modules for staff" ON course_modules
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'instructor', 'superadmin'))
    );

-- Lessons
DROP POLICY IF EXISTS "Admins and Instructors can manage lessons" ON course_lessons;
DROP POLICY IF EXISTS "Admins, Instructors and Superadmins can manage lessons" ON course_lessons;
CREATE POLICY "Full access to lessons for staff" ON course_lessons
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'instructor', 'superadmin'))
    );

-- 3. Force PostgREST to reload schema cache
-- This is a common way to nudge Supabase to see new columns immediately
NOTIFY pgrst, 'reload schema';

-- 4. Final Verification Query (Run this to see if columns are there)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'course_lessons' 
AND column_name IN ('description', 'reading_content', 'order_index');
