-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, course_id)
);

-- Lesson completions table
CREATE TABLE IF NOT EXISTS lesson_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, lesson_id)
);

-- Platform Settings table
CREATE TABLE IF NOT EXISTS platform_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_name TEXT DEFAULT 'N5 Skills',
    support_email TEXT DEFAULT 'support@n5skills.com',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_by UUID REFERENCES auth.users(id)
);

-- Insert initial settings
INSERT INTO platform_settings (platform_name, support_email)
SELECT 'N5 Skills', 'support@n5skills.com'
WHERE NOT EXISTS (SELECT 1 FROM platform_settings);

-- RLS Policies
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Enrollment Policies
CREATE POLICY "Users can view their own enrollments" ON enrollments
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin can view all enrollments" ON enrollments
    FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
CREATE POLICY "Users can enroll themselves" ON enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Completion Policies
CREATE POLICY "Users can view their own lesson completions" ON lesson_completions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin can view all completions" ON lesson_completions
    FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
CREATE POLICY "Users can mark lessons as complete" ON lesson_completions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unmark lessons as complete" ON lesson_completions
    FOR DELETE USING (auth.uid() = user_id);

-- Settings Policies
CREATE POLICY "Allow public read-only access to settings" ON platform_settings
    FOR SELECT USING (true);
CREATE POLICY "Allow admins to manage settings" ON platform_settings
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
