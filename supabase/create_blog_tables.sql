-- Create Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content JSONB NOT NULL, -- Editor.js output
    excerpt TEXT,
    featured_image TEXT,
    author_id UUID REFERENCES public.profiles(id) DEFAULT auth.uid(),
    category TEXT,
    tags JSONB DEFAULT '[]', -- List of tags
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Blog posts are viewable by everyone" ON blog_posts;
CREATE POLICY "Blog posts are viewable by everyone" 
ON blog_posts FOR SELECT 
USING (status = 'published');

DROP POLICY IF EXISTS "Admins can manage all blog posts" ON blog_posts;
CREATE POLICY "Admins can manage all blog posts" 
ON blog_posts FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
