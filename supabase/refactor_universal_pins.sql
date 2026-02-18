-- 1. Make course_id nullable in course_pins
ALTER TABLE course_pins ALTER COLUMN course_id DROP NOT NULL;

-- 2. Update redeem_course_pin RPC to handle universal PINs
CREATE OR REPLACE FUNCTION redeem_course_pin(p_pin_code TEXT, p_user_id UUID, p_course_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_pin_id UUID;
BEGIN
    -- Check if PIN is valid and unused. 
    -- It can either have no course_id (universal) OR must match the course_id (legacy).
    SELECT id INTO v_pin_id
    FROM course_pins
    WHERE pin_code = p_pin_code
    AND (course_id IS NULL OR course_id = p_course_id)
    AND is_used = FALSE
    FOR UPDATE;

    IF v_pin_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Mark PIN as used and associate it with the course if it wasn't already
    UPDATE course_pins
    SET is_used = TRUE,
        used_by = p_user_id,
        course_id = COALESCE(course_id, p_course_id),
        used_at = timezone('utc'::text, now())
    WHERE id = v_pin_id;

    -- Unlock or create enrollment if needed
    -- First, check if enrollment exists
    IF EXISTS (SELECT 1 FROM enrollments WHERE user_id = p_user_id AND course_id = p_course_id) THEN
        UPDATE enrollments
        SET is_unlocked = TRUE
        WHERE user_id = p_user_id
        AND course_id = p_course_id;
    ELSE
        INSERT INTO enrollments (user_id, course_id, is_unlocked)
        VALUES (p_user_id, p_course_id, TRUE);
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
