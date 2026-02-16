-- 1. Add email column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Update the handle_new_user function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role, email)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url', 
    'student', 
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Add RLS policy to allow Admins to update any profile
-- (This allows changing roles, etc.)
CREATE POLICY "Admins can update any profile" ON public.profiles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Note: Select policy is already "Public profiles are viewable by everyone", so Admins can see all users.

-- 4. (Optional) Backfill script attempt - this has strict permissions usually, 
-- but we can try to update profiles that have matching auth.users if running from dashboard SQL editor
-- UPDATE public.profiles p
-- SET email = u.email
-- FROM auth.users u
-- WHERE p.id = u.id AND p.email IS NULL;
