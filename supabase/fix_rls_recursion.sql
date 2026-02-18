-- 1. Helper functions with SECURITY DEFINER to bypass RLS recursion
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'superadmin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND (role = 'admin' OR role = 'superadmin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_instructor()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND (role = 'instructor' OR role = 'admin' OR role = 'superadmin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Fix Profiles Policies (The Root Cause)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
CREATE POLICY "Users can insert their own profile." ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
CREATE POLICY "Users can update own profile." ON profiles
    FOR UPDATE USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Superadmins can manage all profiles" ON profiles;
CREATE POLICY "Superadmins can manage all profiles" ON profiles
    FOR ALL USING (public.is_superadmin());

-- 3. Fix Courses Policies
DROP POLICY IF EXISTS "Admins can do everything on courses" ON courses;
CREATE POLICY "Admins can do everything on courses" ON courses
    FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Superadmins can manage all courses" ON courses;
-- (Redundant if is_admin() includes superadmin, but good for explicitness)
CREATE POLICY "Superadmins can manage all courses" ON courses
    FOR ALL USING (public.is_superadmin());

-- 4. Fix Enrollments Policies
DROP POLICY IF EXISTS "Admin can view all enrollments" ON enrollments;
CREATE POLICY "Admin can view all enrollments" ON enrollments
    FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Superadmins can manage all enrollments" ON enrollments;
CREATE POLICY "Superadmins can manage all enrollments" ON enrollments
    FOR ALL USING (public.is_superadmin());

-- 5. Fix Course Pins Policies
DROP POLICY IF EXISTS "Superadmins can manage all pins" ON course_pins;
CREATE POLICY "Superadmins can manage all pins" ON course_pins
    FOR ALL USING (public.is_superadmin());

-- 6. Fix Blog Posts Policies
DROP POLICY IF EXISTS "Admins can manage all blog posts" ON blog_posts;
CREATE POLICY "Admins can manage all blog posts" ON blog_posts
    FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Superadmins can manage all blog posts" ON blog_posts;
CREATE POLICY "Superadmins can manage all blog posts" ON blog_posts
    FOR ALL USING (public.is_superadmin());

-- 7. Fix Platform Settings Policies
DROP POLICY IF EXISTS "Allow admins to manage settings" ON platform_settings;
CREATE POLICY "Allow admins to manage settings" ON platform_settings
    FOR ALL USING (public.is_admin());

-- 8. Fix Lesson Completions Policies
DROP POLICY IF EXISTS "Admin can view all completions" ON lesson_completions;
CREATE POLICY "Admin can view all completions" ON lesson_completions
    FOR SELECT USING (public.is_admin());
