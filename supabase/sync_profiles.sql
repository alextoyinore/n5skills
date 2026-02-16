-- Sync auth.users to public.profiles
-- This script ensures that every user in auth.users has a corresponding row in public.profiles

INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', substring(email from '^[^@]+')), 
    raw_user_meta_data->>'avatar_url',
    COALESCE(raw_user_meta_data->>'role', 'student') -- Default to student if role is missing in metadata, or keep existing role logic below
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET  
    email = EXCLUDED.email, -- Update email if mismatched
    -- Only update role if the existing profile has no role (or default 'student') and metadata says 'admin'/'instructor'
    -- But here we just want to ensure the record exists. 
    -- Let's blindly trust auth.users metadata for role if we satisfy the conflict (which effectively re-syncs everything)
    -- actually, let's preserve existing roles if they are already set to something important
    role = CASE 
        WHEN public.profiles.role = 'admin' THEN 'admin' -- Don't demote existing admins
        ELSE EXCLUDED.role 
    END;

-- Also verify that the RLS policy allows viewing
-- (We already have "Public profiles are viewable by everyone" in setup_profiles.sql)
-- Let's just ensure admins have clear access without recursive subqueries.
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT
USING (true); -- Simplified to true as public profiles are already viewable.
