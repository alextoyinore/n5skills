-- Course Creation Tables (Coursera-style)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 0. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT, -- Lucide icon name or emoji
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Categories are viewable by everyone') THEN
        CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage categories') THEN
        CREATE POLICY "Admins can manage categories" ON categories 
        FOR ALL 
        USING (
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE profiles.id = auth.uid() 
                AND profiles.role = 'admin'
            )
        )
        WITH CHECK (
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE profiles.id = auth.uid() 
                AND profiles.role = 'admin'
            )
        );
    END IF;
END $$;

-- 1. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    instructor_id UUID REFERENCES auth.users(id),
    category_id UUID REFERENCES categories(id),
    level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    duration TEXT,
    price DECIMAL(10, 2) DEFAULT 0,
    is_free BOOLEAN DEFAULT FALSE,
    description TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add migration helper for category_id transition
DO $$ 
BEGIN
    -- 1. Add category_id if it doesn't exist (in case table existed without it)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='category_id') THEN
        ALTER TABLE courses ADD COLUMN category_id UUID REFERENCES categories(id);
    END IF;

    -- 2. Drop the old text-based category column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='category') THEN
        ALTER TABLE courses DROP COLUMN category;
    END IF;
END $$;

-- 2. Course Modules Table
CREATE TABLE IF NOT EXISTS course_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(course_id, order_index)
);

-- 3. Course Lessons Table
CREATE TABLE IF NOT EXISTS course_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_type TEXT CHECK (content_type IN ('video', 'reading', 'quiz')),
    video_url TEXT,
    reading_content TEXT,
    duration TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(module_id, order_index)
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;

-- Policies (Direct Profile Check for Roles)
DROP POLICY IF EXISTS "Admins can do everything on courses" ON courses;
CREATE POLICY "Admins can do everything on courses" ON courses
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can do everything on modules" ON course_modules;
CREATE POLICY "Admins can do everything on modules" ON course_modules
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can do everything on lessons" ON course_lessons;
CREATE POLICY "Admins can do everything on lessons" ON course_lessons
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Public read access for published courses
DROP POLICY IF EXISTS "Public can view published courses" ON courses;
CREATE POLICY "Public can view published courses" ON courses
    FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public can view modules of published courses" ON course_modules;
CREATE POLICY "Public can view modules of published courses" ON course_modules
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM courses 
            WHERE courses.id = course_modules.course_id 
            AND courses.status = 'published'
        )
    );

DROP POLICY IF EXISTS "Public can view lessons of published courses" ON course_lessons;
CREATE POLICY "Public can view lessons of published courses" ON course_lessons
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM course_modules
            JOIN courses ON courses.id = course_modules.course_id
            WHERE course_modules.id = course_lessons.module_id
            AND courses.status = 'published'
        )
    );
