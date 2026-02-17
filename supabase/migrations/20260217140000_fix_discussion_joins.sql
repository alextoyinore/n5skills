-- Fix lesson_discussions foreign key to point to public.profiles
ALTER TABLE lesson_discussions 
DROP CONSTRAINT IF EXISTS lesson_discussions_user_id_fkey;

ALTER TABLE lesson_discussions
ADD CONSTRAINT lesson_discussions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Fix lesson_notes foreign key to point to public.profiles
ALTER TABLE lesson_notes
DROP CONSTRAINT IF EXISTS lesson_notes_user_id_fkey;

ALTER TABLE lesson_notes
ADD CONSTRAINT lesson_notes_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
