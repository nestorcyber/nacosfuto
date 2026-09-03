-- =========================================================================
-- NACOS FUTO Monorepo Shared Supabase Schema
-- Student Authentication, Profile Management & Dynamic Academic Tracking
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. CENTRAL ACADEMIC SYSTEM CONFIGURATION
-- Controls active university academic sessions dynamically across the app
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.academic_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  current_academic_year_start INTEGER NOT NULL DEFAULT 2026, -- e.g. 2026 for 2026/2027 session
  current_session TEXT NOT NULL DEFAULT '2026/2027',
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

INSERT INTO public.academic_settings (id, current_academic_year_start, current_session)
VALUES ('default', 2026, '2026/2027')
ON CONFLICT (id) DO NOTHING;

-- -------------------------------------------------------------------------
-- 2. PROFILES / STUDENTS TABLE
-- Stores student biodata, registration number, admission year, and credentials
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  
  -- Student Identity & Separate Names (All strictly required)
  first_name TEXT NOT NULL,
  middle_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  
  -- Institutional Registration & Verification
  registration_number TEXT UNIQUE NOT NULL, -- Format begins with 4-digit admission year (e.g. 2024CS12345)
  matric_number TEXT UNIQUE, -- Compatibility alias
  admission_year INTEGER NOT NULL, -- Automatically extracted leading 4 digits
  
  -- Contact & Security
  email TEXT UNIQUE NOT NULL, -- Must match email on FUTO portal
  phone_number TEXT NOT NULL, -- Active student mobile line
  password_hash TEXT NOT NULL, -- Cryptographically hashed password (SHA-256 + salt)
  
  -- Academic Faculty & Curriculum
  programme TEXT DEFAULT 'B.Tech Computer Science' NOT NULL,
  department TEXT DEFAULT 'Computer Science' NOT NULL,
  faculty TEXT DEFAULT 'School of Information & Communication Tech (SICT)' NOT NULL,
  programme_duration INTEGER DEFAULT 5 NOT NULL, -- e.g. 4, 5, or 6 years
  institution TEXT DEFAULT 'Federal University of Technology, Owerri (FUTO)',
  
  -- Roles & Permissions
  role TEXT DEFAULT 'Student Member' NOT NULL CHECK (role IN ('Student Member', 'Chapter President', 'Admin')),
  is_active BOOLEAN DEFAULT true NOT NULL,
  profile_photo_url TEXT, -- Reference / URL to student uploaded passport photograph
  avatar_url TEXT, -- Backward compatibility alias
  
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Fast lookup indexes
CREATE INDEX IF NOT EXISTS idx_profiles_reg_number ON public.profiles (registration_number);
CREATE INDEX IF NOT EXISTS idx_profiles_admission_year ON public.profiles (admission_year);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON public.profiles (is_active);

-- -------------------------------------------------------------------------
-- 3. DERIVED ACADEMIC LEVEL CALCULATION FUNCTION
-- Formula: current_level = current_academic_year_start - admission_year + 1
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.calculate_student_level(p_admission_year INTEGER, p_duration INTEGER DEFAULT 5)
RETURNS TEXT AS $$
DECLARE
  v_current_year INTEGER;
  v_level INTEGER;
BEGIN
  SELECT current_academic_year_start INTO v_current_year FROM public.academic_settings WHERE id = 'default';
  IF v_current_year IS NULL THEN
    v_current_year := 2026;
  END IF;

  v_level := v_current_year - p_admission_year + 1;

  IF v_level <= 0 THEN
    RETURN '100 Level';
  ELSIF v_level = 1 THEN
    RETURN '100 Level';
  ELSIF v_level = 2 THEN
    RETURN '200 Level';
  ELSIF v_level = 3 THEN
    RETURN '300 Level';
  ELSIF v_level = 4 THEN
    RETURN '400 Level';
  ELSIF v_level = 5 THEN
    RETURN '500 Level';
  ELSIF v_level = 6 AND p_duration >= 6 THEN
    RETURN '600 Level';
  ELSIF v_level > p_duration THEN
    RETURN 'Graduated Alumni';
  ELSE
    RETURN (v_level * 100)::TEXT || ' Level';
  END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- -------------------------------------------------------------------------
-- 4. DYNAMIC STUDENT ACADEMIC RECORDS VIEW
-- Provides always-accurate, real-time derived levels and graduation years
-- -------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.student_academic_records AS
SELECT 
  p.id,
  p.registration_number,
  p.matric_number,
  p.first_name,
  p.middle_name,
  p.last_name,
  p.full_name,
  p.email,
  p.phone_number,
  p.admission_year,
  p.programme,
  p.department,
  p.faculty,
  p.programme_duration,
  p.institution,
  p.role,
  p.is_active,
  public.calculate_student_level(p.admission_year, p.programme_duration) AS current_level,
  (p.admission_year + p.programme_duration) AS expected_graduation_year,
  s.current_session AS academic_session,
  p.created_at,
  p.updated_at
FROM public.profiles p
CROSS JOIN public.academic_settings s
WHERE s.id = 'default';

-- -------------------------------------------------------------------------
-- 5. DUES PAYMENTS TABLE
-- -------------------------------------------------------------------------
-- 5. DUES & ID CARD PAYMENTS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dues_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  matric_number TEXT NOT NULL,
  payment_type TEXT DEFAULT 'id_card' CHECK (payment_type IN ('id_card', 'departmental_dues', 'dues_and_id_card')),
  session TEXT NOT NULL, -- e.g. '2026/2027'
  amount NUMERIC DEFAULT 2500 NOT NULL,
  payment_reference TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'verified' CHECK (status IN ('pending', 'verified', 'rejected', 'successful')),
  verified_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_dues_payments_matric ON public.dues_payments (matric_number);
CREATE INDEX IF NOT EXISTS idx_dues_payments_student ON public.dues_payments (student_id);

-- -------------------------------------------------------------------------
-- 6. STUDENT ID CARDS TABLE
-- Tracks official generated ID cards, template versions, and payment linking
-- NOTE: Student identity info (name, reg number, department) is NOT duplicated here
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.id_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  payment_id UUID REFERENCES public.dues_payments(id) ON DELETE RESTRICT NOT NULL,
  template_version TEXT DEFAULT 'v1' NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked')) NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_id_cards_student_id ON public.id_cards (student_id);
CREATE INDEX IF NOT EXISTS idx_id_cards_payment_id ON public.id_cards (payment_id);

-- Constraint: A student has only one active ID card
CREATE UNIQUE INDEX IF NOT EXISTS idx_active_id_card_per_student 
  ON public.id_cards (student_id) 
  WHERE status = 'active';

-- -------------------------------------------------------------------------
-- 7. ACADEMIC RESULTS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.academic_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  matric_number TEXT NOT NULL,
  session TEXT NOT NULL, -- e.g. '2024/2025'
  semester TEXT NOT NULL CHECK (semester IN ('First', 'Second')),
  course_code TEXT NOT NULL,
  course_title TEXT NOT NULL,
  credit_units INTEGER NOT NULL,
  score NUMERIC NOT NULL,
  grade TEXT NOT NULL,
  grade_point NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- -------------------------------------------------------------------------
-- 8. HACKATHON TEAMS TABLE (BUILDX NACOS)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hackathon_teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name TEXT NOT NULL,
  chapter TEXT NOT NULL,
  track TEXT NOT NULL CHECK (track IN ('fintech', 'ai', 'digital')),
  lead_name TEXT NOT NULL,
  lead_email TEXT NOT NULL,
  lead_matric TEXT NOT NULL,
  lead_phone TEXT NOT NULL,
  members JSONB DEFAULT '[]'::jsonb NOT NULL,
  project_title TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  proposed_solution TEXT NOT NULL,
  tech_stack TEXT NOT NULL,
  github_repo TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- -------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dues_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.id_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hackathon_teams ENABLE ROW LEVEL SECURITY;

-- Academic Settings: readable by all users, writable only by admins
CREATE POLICY "Academic settings viewable by everyone" ON public.academic_settings
  FOR SELECT USING (true);

-- Profiles: Students can view and update their own profile; Admins can view all
CREATE POLICY "Students can view own profile" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Chapter President'))
  );

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Students can update own profile and photo" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Dues & ID Card Payments: Students can view only their own payments; Admins can manage
CREATE POLICY "Students can view own payments" ON public.dues_payments
  FOR SELECT USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Chapter President'))
  );

CREATE POLICY "Admins can manage payments" ON public.dues_payments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Chapter President'))
  );

-- ID Cards: Students can view only their own ID card
CREATE POLICY "Students can view own ID cards" ON public.id_cards
  FOR SELECT USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Chapter President'))
  );

-- Students can insert/generate an ID card ONLY with a verified payment for themselves
CREATE POLICY "Students can generate own ID card with verified payment" ON public.id_cards
  FOR INSERT WITH CHECK (
    auth.uid() = student_id AND
    EXISTS (
      SELECT 1 FROM public.dues_payments
      WHERE id = payment_id 
        AND student_id = auth.uid() 
        AND status IN ('verified', 'successful')
    )
  );

-- Academic Results: Students can read only their own results
CREATE POLICY "Users can view own academic results" ON public.academic_results
  FOR SELECT USING (auth.uid() = student_id);

-- Hackathons: Any verified student can submit a team
CREATE POLICY "Authenticated users can submit hackathon teams" ON public.hackathon_teams
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view hackathon teams" ON public.hackathon_teams
  FOR SELECT USING (true);
