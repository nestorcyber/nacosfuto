-- =========================================================================
-- NACOS FUTO: ADD STUDENT (Anyanwu Nestor Ifeanyi - 20241450682)
-- =========================================================================

-- 1. Drop the foreign key constraint that binds profiles.id to auth.users
-- (This allows creating student profiles directly without requiring auth.users entries)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey CASCADE;

-- 2. Ensure default UUID generation is active on profiles.id
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3. Ensure unique constraint on registration_number for profiles so ON CONFLICT works
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_registration_number_key' OR conname = 'profiles_reg_key'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_registration_number_key UNIQUE (registration_number);
  END IF;
EXCEPTION
  WHEN duplicate_table OR duplicate_object OR duplicate_column THEN NULL;
END $$;

-- 4. Insert into public.verified_students (Official Roster)
INSERT INTO public.verified_students (
  registration_number,
  surname,
  first_name,
  middle_name,
  last_name,
  full_name,
  email,
  phone_number,
  department,
  faculty,
  programme,
  programme_duration,
  admission_year,
  level,
  status,
  has_registered
) VALUES (
  '20241450682',
  'Anyanwu',
  'Nestor',
  'Ifeanyi',
  'Anyanwu',
  'Anyanwu Nestor Ifeanyi',
  'nestor.ifeanyi@futo.edu.ng',
  '+2348145068200',
  'Computer Science',
  'School of Information & Communication Tech (SICT)',
  'B.Tech Computer Science',
  5,
  2024,
  '100 Level',
  'active',
  true
)
ON CONFLICT (registration_number) DO UPDATE SET
  surname = EXCLUDED.surname,
  first_name = EXCLUDED.first_name,
  middle_name = EXCLUDED.middle_name,
  last_name = EXCLUDED.last_name,
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  phone_number = EXCLUDED.phone_number,
  has_registered = true,
  updated_at = NOW();

-- 5. Insert into public.profiles (Active Student Account - Password: password)
INSERT INTO public.profiles (
  id,
  registration_number,
  matric_number,
  surname,
  first_name,
  middle_name,
  last_name,
  full_name,
  email,
  phone_number,
  department,
  faculty,
  programme,
  programme_duration,
  admission_year,
  password_hash,
  role,
  is_active
) VALUES (
  gen_random_uuid(),
  '20241450682',
  '20241450682',
  'Anyanwu',
  'Nestor',
  'Ifeanyi',
  'Anyanwu',
  'Anyanwu Nestor Ifeanyi',
  'nestor.ifeanyi@futo.edu.ng',
  '+2348145068200',
  'Computer Science',
  'School of Information & Communication Tech (SICT)',
  'B.Tech Computer Science',
  5,
  2024,
  '0c72b5bd44ae98f639e6d29d0429f1fade10ee23cd770e5b8fc9bd2ba248aeb6',
  'Student Member',
  true
)
ON CONFLICT (registration_number) DO UPDATE SET
  surname = EXCLUDED.surname,
  first_name = EXCLUDED.first_name,
  middle_name = EXCLUDED.middle_name,
  last_name = EXCLUDED.last_name,
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  phone_number = EXCLUDED.phone_number,
  password_hash = EXCLUDED.password_hash,
  is_active = true,
  updated_at = NOW();
