-- Fix enrollments table foreign key to point to public.profiles instead of auth.users
-- This allows PostgREST to resolve joins between enrollments and profiles

-- 1. Drop existing foreign key constraint if it exists
ALTER TABLE public.enrollments 
DROP CONSTRAINT IF EXISTS enrollments_user_id_fkey;

-- 2. Add new foreign key constraint pointing to public.profiles
ALTER TABLE public.enrollments
ADD CONSTRAINT enrollments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 3. Ensure RLS allows admins to see everything (already exists but worth verifying)
-- Policy: "Admin can view all enrollments" ON enrollments
-- FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
