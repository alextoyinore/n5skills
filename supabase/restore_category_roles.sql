-- Restore Relational Categories & Set Admin/Instructor Policies
-- Run this in Supabase SQL Editor

-- 1. Ensure RLS is enabled
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to start fresh (Safe to run, just resetting permissions)
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON categories;
DROP POLICY IF EXISTS "Admins and Instructors can manage categories" ON categories;

-- 3. Create VIEW Policy (Everyone)
CREATE POLICY "Categories are viewable by everyone" 
ON categories FOR SELECT 
USING (true);

-- 4. Create MANAGE Policy (Admins & Instructors)
CREATE POLICY "Admins and Instructors can manage categories" 
ON categories 
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

-- 5. Restore Foreign Key in Courses (if it was dropped/modified)
-- If you have text data in 'category', you might want to back it up or map it back to IDs if possible.
-- For now, we assume we are just switching the UI back to use category_id.
