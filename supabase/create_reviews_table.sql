-- Course Reviews Table
DROP TABLE IF EXISTS course_reviews;
CREATE TABLE course_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Ensure one review per user per course
    UNIQUE(course_id, user_id)
);

-- Enable RLS
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Anyone can view reviews for published courses
DROP POLICY IF EXISTS "Anyone can view reviews" ON course_reviews;
CREATE POLICY "Anyone can view reviews" ON course_reviews
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM courses
            WHERE courses.id = course_reviews.course_id
            AND courses.status = 'published'
        )
        OR 
        auth.uid() = user_id
        OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 2. Authenticated users can create reviews
DROP POLICY IF EXISTS "Users can create reviews" ON course_reviews;
CREATE POLICY "Users can create reviews" ON course_reviews
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own reviews
DROP POLICY IF EXISTS "Users can update their own reviews" ON course_reviews;
CREATE POLICY "Users can update their own reviews" ON course_reviews
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. Users can delete their own reviews
DROP POLICY IF EXISTS "Users can delete their own reviews" ON course_reviews;
CREATE POLICY "Users can delete their own reviews" ON course_reviews
    FOR DELETE
    USING (auth.uid() = user_id);
