-- =========================================================================
-- MIGRATION: 20260905_verified_students.sql
-- NACOS FUTO: Controlled Student Registration & Verified Roster System
-- =========================================================================

-- 1. Create Verified Students Table
-- Authoritative whitelist of enrolled students permitted to register on the portal
CREATE TABLE IF NOT EXISTS public.verified_students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_number VARCHAR(30) UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone_number TEXT,
  department TEXT NOT NULL DEFAULT 'Computer Science',
  faculty TEXT NOT NULL DEFAULT 'School of Information & Communication Tech (SICT)',
  level TEXT NOT NULL DEFAULT '100 Level',
  admission_year INTEGER NOT NULL,
  programme TEXT NOT NULL DEFAULT 'B.Tech Computer Science',
  programme_duration INTEGER NOT NULL DEFAULT 5,
  academic_session TEXT NOT NULL DEFAULT '2024/2025',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'graduated')),
  has_registered BOOLEAN NOT NULL DEFAULT false,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  registered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_verified_students_regno ON public.verified_students (registration_number);
CREATE INDEX IF NOT EXISTS idx_verified_students_email ON public.verified_students (email);
CREATE INDEX IF NOT EXISTS idx_verified_students_dept ON public.verified_students (department);
CREATE INDEX IF NOT EXISTS idx_verified_students_level ON public.verified_students (level);
CREATE INDEX IF NOT EXISTS idx_verified_students_status ON public.verified_students (status);
CREATE INDEX IF NOT EXISTS idx_verified_students_has_reg ON public.verified_students (has_registered);
CREATE INDEX IF NOT EXISTS idx_verified_students_auth_user ON public.verified_students (auth_user_id);

-- 2. Create Student Verification Codes Table (OTP System)
CREATE TABLE IF NOT EXISTS public.student_verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_number VARCHAR(30) NOT NULL,
  email TEXT NOT NULL,
  code VARCHAR(10) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  is_used BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_verification_codes_lookup ON public.student_verification_codes (registration_number, code, is_used);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires ON public.student_verification_codes (expires_at);

-- 3. Row Level Security (RLS) Setup
ALTER TABLE public.verified_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_verification_codes ENABLE ROW LEVEL SECURITY;

-- 3a. Secure Function for Public Registration Lookup
-- Strips sensitive authentication fields while returning identity confirmation
CREATE OR REPLACE FUNCTION public.lookup_verified_student(p_reg_no TEXT)
RETURNS TABLE (
  found BOOLEAN,
  registration_number TEXT,
  full_name TEXT,
  email_masked TEXT,
  department TEXT,
  faculty TEXT,
  level TEXT,
  programme TEXT,
  academic_session TEXT,
  status TEXT,
  has_registered BOOLEAN,
  message TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_rec RECORD;
  v_at_pos INT;
  v_masked TEXT;
BEGIN
  SELECT * INTO v_rec 
  FROM public.verified_students 
  WHERE UPPER(TRIM(verified_students.registration_number)) = UPPER(TRIM(p_reg_no))
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      false, 
      NULL::TEXT, 
      NULL::TEXT, 
      NULL::TEXT, 
      NULL::TEXT, 
      NULL::TEXT, 
      NULL::TEXT, 
      NULL::TEXT, 
      NULL::TEXT, 
      NULL::TEXT, 
      false, 
      'User not found, contact admin.'::TEXT;
    RETURN;
  END IF;

  IF v_rec.status != 'active' THEN
    RETURN QUERY SELECT 
      false, 
      v_rec.registration_number::TEXT, 
      v_rec.full_name::TEXT, 
      NULL::TEXT, 
      v_rec.department::TEXT, 
      v_rec.faculty::TEXT, 
      v_rec.level::TEXT, 
      v_rec.programme::TEXT, 
      v_rec.academic_session::TEXT, 
      v_rec.status::TEXT, 
      v_rec.has_registered, 
      'Your student record is currently inactive or suspended. Please contact the department administrator.'::TEXT;
    RETURN;
  END IF;

  IF v_rec.has_registered = true THEN
    RETURN QUERY SELECT 
      false, 
      v_rec.registration_number::TEXT, 
      v_rec.full_name::TEXT, 
      NULL::TEXT, 
      v_rec.department::TEXT, 
      v_rec.faculty::TEXT, 
      v_rec.level::TEXT, 
      v_rec.programme::TEXT, 
      v_rec.academic_session::TEXT, 
      v_rec.status::TEXT, 
      v_rec.has_registered, 
      'An account has already been registered for this registration number. Please sign in or contact admin to reset.'::TEXT;
    RETURN;
  END IF;

  -- Mask email for privacy (e.g. j***e@futo.edu.ng)
  v_at_pos := POSITION('@' IN v_rec.email);
  IF v_at_pos > 2 THEN
    v_masked := SUBSTRING(v_rec.email FROM 1 FOR 1) || '••••' || SUBSTRING(v_rec.email FROM (v_at_pos - 1));
  ELSE
    v_masked := v_rec.email;
  END IF;

  RETURN QUERY SELECT 
    true, 
    v_rec.registration_number::TEXT, 
    v_rec.full_name::TEXT, 
    v_masked::TEXT, 
    v_rec.department::TEXT, 
    v_rec.faculty::TEXT, 
    v_rec.level::TEXT, 
    v_rec.programme::TEXT, 
    v_rec.academic_session::TEXT, 
    v_rec.status::TEXT, 
    v_rec.has_registered, 
    'Student record verified.'::TEXT;
END;
$$;

-- 3b. RLS Policies on verified_students
-- Authenticated users can read their own verified record
CREATE POLICY "Students can view own verified record" ON public.verified_students
  FOR SELECT USING (auth.uid() = auth_user_id);

-- Admins, HOD, and Super Admins can manage verified roster
CREATE POLICY "Admins full access to verified_students" ON public.verified_students
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_scopes 
      WHERE user_id = auth.uid() 
        AND scope IN ('student_portal', 'super_admin') 
        AND is_active = true
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
        AND role IN ('Admin', 'Super Admin', 'Chapter President', 'HOD', 'Department Admin')
    )
  );

-- Public lookup policy (SELECT allows public lookup via registration number)
CREATE POLICY "Public registration number verification lookup" ON public.verified_students
  FOR SELECT USING (true);

-- 3c. Verification codes RLS policies
CREATE POLICY "Verification code insert and validation" ON public.student_verification_codes
  FOR ALL USING (true);

-- 4. Initial Seed of Canonical Verified Students
INSERT INTO public.verified_students (
  registration_number,
  full_name,
  email,
  phone_number,
  department,
  faculty,
  level,
  admission_year,
  programme,
  programme_duration,
  academic_session,
  status,
  has_registered
) VALUES 
(
  '20241029481',
  'Nestor Anyanwu',
  'nestor.anyanwu@futo.edu.ng',
  '+234 801 234 5678',
  'Computer Science',
  'School of Information & Communication Tech (SICT)',
  '100 Level',
  2024,
  'B.Tech Computer Science',
  5,
  '2024/2025',
  'active',
  false
),
(
  '20251145321',
  'Chioma Eze',
  'chioma.eze@futo.edu.ng',
  '+234 809 876 5432',
  'Computer Science',
  'School of Information & Communication Tech (SICT)',
  '100 Level',
  2025,
  'B.Sc Software Engineering',
  4,
  '2025/2026',
  'active',
  false
),
(
  '20261099999',
  'Emeka Okoro',
  'emeka.okoro@futo.edu.ng',
  '+234 812 345 6789',
  'Computer Science',
  'School of Information & Communication Tech (SICT)',
  '100 Level',
  2026,
  'B.Tech Computer Science',
  5,
  '2026/2027',
  'active',
  false
),
(
  '20221139481',
  'David Okonkwo',
  'david.okonkwo@futo.edu.ng',
  '+234 814 592 0184',
  'Computer Science',
  'School of Information & Communication Tech (SICT)',
  '300 Level',
  2022,
  'B.Tech Computer Science',
  5,
  '2024/2025',
  'active',
  false
),
(
  '20231184920',
  'Amarachi Blessing Nwosu',
  'amarachi.nwosu@futo.edu.ng',
  '+234 802 998 7711',
  'Computer Science',
  'School of Information & Communication Tech (SICT)',
  '200 Level',
  2023,
  'B.Tech Computer Science',
  5,
  '2024/2025',
  'active',
  false
),
(
  '20211048201',
  'Somtochukwu Michael Obi',
  'somto.obi@futo.edu.ng',
  '+234 806 332 1980',
  'Computer Science',
  'School of Information & Communication Tech (SICT)',
  '400 Level',
  2021,
  'B.Tech Computer Science',
  5,
  '2024/2025',
  'active',
  false
)
ON CONFLICT (registration_number) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  updated_at = TIMEZONE('utc'::text, NOW());
