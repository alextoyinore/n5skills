-- 1. Update profiles role constraint
-- First, identify the constraint name if possible, or just drop and recreate or use a safer approach.
-- Since it's a check constraint on the 'role' column:
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'student', 'instructor', 'superadmin'));

-- 2. Update RLS Policies for superadmin
-- We need to ensure superadmin has access to everything. 
-- In many cases, we can update existing policies or add new ones.

-- Profiles: superadmin can manage everything
DROP POLICY IF EXISTS "Superadmins can manage all profiles" ON profiles;
CREATE POLICY "Superadmins can manage all profiles" ON profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'superadmin'
        )
    );

-- Courses: superadmin full access
DROP POLICY IF EXISTS "Superadmins can manage all courses" ON courses;
CREATE POLICY "Superadmins can manage all courses" ON courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'superadmin'
        )
    );

-- Enrollments: superadmin full access
DROP POLICY IF EXISTS "Superadmins can manage all enrollments" ON enrollments;
CREATE POLICY "Superadmins can manage all enrollments" ON enrollments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'superadmin'
        )
    );

-- Course Pins: superadmin full access (already in admin policy? let's make it explicit)
DROP POLICY IF EXISTS "Superadmins can manage all pins" ON course_pins;
CREATE POLICY "Superadmins can manage all pins" ON course_pins
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'superadmin'
        )
    );

-- Blog Posts: superadmin full access
DROP POLICY IF EXISTS "Superadmins can manage all blog posts" ON blog_posts;
CREATE POLICY "Superadmins can manage all blog posts" ON blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'superadmin'
        )
    );

-- 3. Utility: Grant existing admin superadmin role if needed (Optional, for easy testing)
-- UPDATE profiles SET role = 'superadmin' WHERE email = 'your-admin-email@example.com';
