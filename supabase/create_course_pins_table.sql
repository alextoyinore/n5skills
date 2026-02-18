-- 1. Add is_unlocked to enrollments
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS is_unlocked BOOLEAN DEFAULT FALSE;

-- 2. Update existing enrollments for free courses to be unlocked
UPDATE enrollments 
SET is_unlocked = TRUE 
FROM courses 
WHERE enrollments.course_id = courses.id 
AND courses.is_free = TRUE;

-- 3. Create course_pins table
CREATE TABLE IF NOT EXISTS course_pins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    pin_code TEXT UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    used_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Enable RLS
ALTER TABLE course_pins ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Admins can manage all pins" ON course_pins;
CREATE POLICY "Admins can manage all pins" ON course_pins
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Users can view pins they redeemed" ON course_pins;
CREATE POLICY "Users can view pins they redeemed" ON course_pins
    FOR SELECT 
    USING (auth.uid() = used_by);

-- 6. RPC for redeeming PIN (Secure way to update both tables)
CREATE OR REPLACE FUNCTION redeem_course_pin(p_pin_code TEXT, p_user_id UUID, p_course_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_pin_id UUID;
BEGIN
    -- Check if PIN is valid, unused, and matches course
    SELECT id INTO v_pin_id
    FROM course_pins
    WHERE pin_code = p_pin_code
    AND course_id = p_course_id
    AND is_used = FALSE
    FOR UPDATE;

    IF v_pin_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Mark PIN as used
    UPDATE course_pins
    SET is_used = TRUE,
        used_by = p_user_id,
        used_at = timezone('utc'::text, now())
    WHERE id = v_pin_id;

    -- Unlock enrollment
    UPDATE enrollments
    SET is_unlocked = TRUE
    WHERE user_id = p_user_id
    AND course_id = p_course_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
