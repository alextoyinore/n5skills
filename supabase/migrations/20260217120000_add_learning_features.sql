-- 1. Lesson Resources Table
CREATE TABLE IF NOT EXISTS lesson_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT, -- e.g., 'PDF', 'ZIP'
    file_size TEXT, -- e.g., '2.4 MB'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Lesson Discussions Table
CREATE TABLE IF NOT EXISTS lesson_discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT, -- Optional title for the question/topic
    content TEXT NOT NULL,
    parent_id UUID REFERENCES lesson_discussions(id) ON DELETE CASCADE, -- For replies
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Lesson Notes Table
CREATE TABLE IF NOT EXISTS lesson_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
    content TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, lesson_id) -- One note per lesson per user
);

-- Enable RLS
ALTER TABLE lesson_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_notes ENABLE ROW LEVEL SECURITY;

-- Policies for Resources
-- Everyone can view resources if they have access to the lesson (simplified to public for published courses logic usually, but here we'll just allow auth read for simplicity or public read)
CREATE POLICY "Public read access for resources" ON lesson_resources
    FOR SELECT USING (true);

-- Admins can manage resources
CREATE POLICY "Admins can manage resources" ON lesson_resources
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

-- Policies for Discussions
-- Everyone can view discussions
CREATE POLICY "Public read access for discussions" ON lesson_discussions
    FOR SELECT USING (true);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can post" ON lesson_discussions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update/delete their own posts
CREATE POLICY "Users can edit own posts" ON lesson_discussions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON lesson_discussions
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for Notes
-- Users can only see their own notes
CREATE POLICY "Users view own notes" ON lesson_notes
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert/update their own notes
CREATE POLICY "Users manage own notes" ON lesson_notes
    FOR ALL USING (auth.uid() = user_id);
