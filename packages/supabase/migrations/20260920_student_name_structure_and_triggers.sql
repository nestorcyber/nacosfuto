-- =========================================================================
-- MIGRATION: 20260920_student_name_structure_and_triggers.sql
-- NACOS FUTO: Structured Student Names (Surname, First Name, Middle Name, Auto Full Name)
-- =========================================================================

-- 1. Ensure columns exist on public.verified_students
ALTER TABLE public.verified_students ADD COLUMN IF NOT EXISTS surname TEXT;
ALTER TABLE public.verified_students ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.verified_students ADD COLUMN IF NOT EXISTS middle_name TEXT DEFAULT '';
ALTER TABLE public.verified_students ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.verified_students ADD COLUMN IF NOT EXISTS full_name TEXT;

-- 2. Ensure columns exist on public.profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS surname TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS middle_name TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;

-- 3. Create or replace the automatic name synchronization trigger function
CREATE OR REPLACE FUNCTION public.sync_student_names()
RETURNS TRIGGER AS $$
DECLARE
  v_parts TEXT[];
BEGIN
  -- Sync surname <-> last_name (synonyms)
  IF (NEW.surname IS NULL OR NEW.surname = '') AND (NEW.last_name IS NOT NULL AND NEW.last_name != '') THEN
    NEW.surname := TRIM(NEW.last_name);
  END IF;
  IF (NEW.last_name IS NULL OR NEW.last_name = '') AND (NEW.surname IS NOT NULL AND NEW.surname != '') THEN
    NEW.last_name := TRIM(NEW.surname);
  END IF;

  -- Case A: Surname or First Name is provided -> auto-compute Full Name: Surname Firstname Middlename
  IF (NEW.surname IS NOT NULL AND NEW.surname != '') OR (NEW.first_name IS NOT NULL AND NEW.first_name != '') THEN
    NEW.full_name := TRIM(CONCAT_WS(' ',
      NULLIF(TRIM(COALESCE(NEW.surname, '')), ''),
      NULLIF(TRIM(COALESCE(NEW.first_name, '')), ''),
      NULLIF(TRIM(COALESCE(NEW.middle_name, '')), '')
    ));
  -- Case B: Only Full Name was provided -> extract Surname, First Name, and Middle Name
  ELSIF (NEW.full_name IS NOT NULL AND NEW.full_name != '') THEN
    v_parts := regexp_split_to_array(TRIM(NEW.full_name), '\s+');
    IF array_length(v_parts, 1) >= 1 THEN
      NEW.surname := v_parts[1];
      NEW.last_name := v_parts[1];
    END IF;
    IF array_length(v_parts, 1) = 2 THEN
      NEW.first_name := v_parts[2];
      NEW.middle_name := '';
    ELSIF array_length(v_parts, 1) >= 3 THEN
      NEW.first_name := v_parts[2];
      NEW.middle_name := array_to_string(v_parts[3:array_length(v_parts, 1)], ' ');
    END IF;
  END IF;

  -- Final guarantee: ensure full_name is populated
  IF NEW.full_name IS NULL OR NEW.full_name = '' THEN
    NEW.full_name := TRIM(CONCAT_WS(' ',
      NULLIF(TRIM(COALESCE(NEW.surname, '')), ''),
      NULLIF(TRIM(COALESCE(NEW.first_name, '')), ''),
      NULLIF(TRIM(COALESCE(NEW.middle_name, '')), '')
    ));
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Attach triggers to both student tables
DROP TRIGGER IF EXISTS trg_sync_verified_student_names ON public.verified_students;
CREATE TRIGGER trg_sync_verified_student_names
BEFORE INSERT OR UPDATE ON public.verified_students
FOR EACH ROW EXECUTE FUNCTION public.sync_student_names();

DROP TRIGGER IF EXISTS trg_sync_profile_names ON public.profiles;
CREATE TRIGGER trg_sync_profile_names
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_student_names();

-- 5. Backfill existing records to split full_name into surname, first_name, middle_name
UPDATE public.verified_students
SET full_name = full_name
WHERE full_name IS NOT NULL;

UPDATE public.profiles
SET full_name = full_name
WHERE full_name IS NOT NULL;
