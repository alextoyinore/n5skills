-- RESTORE ADMIN ROLES AND FIX PROFILE SYNC
-- Run this in the Supabase SQL Editor if data is missing from Admin tables.

-- 1. Ensure any user who *should* be an admin is one.
-- (This promotes everyone to admin just to be safe for a dev environment, 
-- or you can target specific emails if you prefer)
UPDATE public.profiles 
SET role = 'admin' 
WHERE role != 'admin';

-- 2. Optional: If you want to be more specific, promote by email:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';

-- 3. Update the sync logic to be more conservative about roles.
-- This ensures that roles already set in profiles are NOT overwritten by NULL metadata.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role, email)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url', 
    COALESCE(new.raw_user_meta_data->>'role', 'student'), 
    new.email
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    role = CASE 
      WHEN profiles.role IS NOT NULL AND profiles.role != 'student' THEN profiles.role
      ELSE EXCLUDED.role
    END;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
