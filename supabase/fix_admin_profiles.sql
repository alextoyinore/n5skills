-- Comprehensive script to fix profiles table and sync with auth.users

-- 1. Ensure required columns exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Update the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role, email, created_at)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', substring(new.email from '^[^@]+')), 
    new.raw_user_meta_data->>'avatar_url', 
    COALESCE(new.raw_user_meta_data->>'role', 'student'), 
    new.email,
    new.created_at
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    role = CASE 
      WHEN profiles.role IS NOT NULL AND profiles.role != 'student' THEN profiles.role
      ELSE EXCLUDED.role
    END,
    created_at = COALESCE(profiles.created_at, EXCLUDED.created_at);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Perform a one-time sync (backfill) of data from auth.users to profiles
INSERT INTO public.profiles (id, email, full_name, avatar_url, role, created_at)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', substring(email from '^[^@]+')), 
    raw_user_meta_data->>'avatar_url',
    COALESCE(raw_user_meta_data->>'role', 'student'),
    created_at
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET  
    email = EXCLUDED.email,
    full_name = COALESCE(profiles.full_name, EXCLUDED.full_name),
    avatar_url = COALESCE(profiles.avatar_url, EXCLUDED.avatar_url),
    role = CASE 
        WHEN profiles.role IS NOT NULL AND profiles.role != 'student' THEN profiles.role
        ELSE EXCLUDED.role 
    END,
    created_at = COALESCE(profiles.created_at, EXCLUDED.created_at);

-- 4. Ensure RLS policies are correct for Admin management
-- We already have a public select policy, but let's ensure admins can update.
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile" ON public.profiles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Ensure admins can delete (suspend) users if needed later
DROP POLICY IF EXISTS "Admins can delete any profile" ON public.profiles;
CREATE POLICY "Admins can delete any profile" ON public.profiles
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
