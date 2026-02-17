-- Fix courses foreign key to point to public.profiles instead of auth.users
-- This enables joins with the profiles table in frontend queries
ALTER TABLE courses 
DROP CONSTRAINT IF EXISTS courses_instructor_id_fkey;

ALTER TABLE courses
ADD CONSTRAINT courses_instructor_id_fkey 
FOREIGN KEY (instructor_id) REFERENCES profiles(id) ON DELETE SET NULL;
