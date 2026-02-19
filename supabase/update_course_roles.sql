-- Allow Admins and Instructors to manage Courses, Modules, and Lessons
-- Run this in Supabase SQL Editor

-- 1. Courses Table
DROP POLICY IF EXISTS "Admins can do everything on courses" ON courses;
DROP POLICY IF EXISTS "Admins and Instructors can manage courses" ON courses;

CREATE POLICY "Admins and Instructors can manage courses" ON courses
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'instructor')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'instructor', 'superadmin')
        )
    );

-- 2. Course Modules Table
DROP POLICY IF EXISTS "Admins can do everything on modules" ON course_modules;
DROP POLICY IF EXISTS "Admins and Instructors can manage modules" ON course_modules;

CREATE POLICY "Admins and Instructors can manage modules" ON course_modules
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'instructor')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'instructor', 'superadmin')
        )
    );

-- 3. Course Lessons Table
DROP POLICY IF EXISTS "Admins can do everything on lessons" ON course_lessons;
DROP POLICY IF EXISTS "Admins and Instructors can manage lessons" ON course_lessons;

CREATE POLICY "Admins and Instructors can manage lessons" ON course_lessons
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'instructor')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'instructor')
        )
    );
