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
  
  -- Institutional Registration & Verification (Single definitive tracking number for students)
  registration_number TEXT UNIQUE NOT NULL, -- Pure numeric format without letters, begins with 4-digit admission year (e.g. 20241029481)
  matric_number TEXT UNIQUE, -- Compatibility alias (numeric)
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
  profile_photo_url TEXT, -- Reference / Cloudinary URL to student uploaded passport photograph
  cloudinary_public_id TEXT, -- Cloudinary public identifier for asset replacement & deletion
  photo_alt TEXT, -- Image alt text
  photo_media_type TEXT DEFAULT 'image/jpeg',
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

-- -------------------------------------------------------------------------
-- 9. CLOUDINARY MEDIA ASSETS TABLE
-- Central platform media metadata registry (URL, public ID, category, entity)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cloudinary_public_id TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  image_alt TEXT,
  media_type TEXT DEFAULT 'image' NOT NULL,
  folder TEXT NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN ('students', 'executives', 'events', 'gallery', 'news', 'certificates', 'ids', 'general')
  ),
  entity_type TEXT,
  entity_id TEXT,
  format TEXT,
  bytes INTEGER,
  width INTEGER,
  height INTEGER,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_media_assets_category ON public.media_assets (category);
CREATE INDEX IF NOT EXISTS idx_media_assets_folder ON public.media_assets (folder);
CREATE INDEX IF NOT EXISTS idx_media_assets_entity ON public.media_assets (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_uploaded_by ON public.media_assets (uploaded_by);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view platform media assets" ON public.media_assets
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own media records" ON public.media_assets
  FOR INSERT WITH CHECK (
    auth.uid() = uploaded_by OR 
    uploaded_by IS NULL OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Chapter President'))
  );

CREATE POLICY "Users can update own media records" ON public.media_assets
  FOR UPDATE USING (
    auth.uid() = uploaded_by OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Chapter President'))
  );

CREATE POLICY "Users can delete own media records" ON public.media_assets
  FOR DELETE USING (
    auth.uid() = uploaded_by OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Chapter President'))
  );

CREATE POLICY "Admins have full media management access" ON public.media_assets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Chapter President'))
  );

-- -------------------------------------------------------------------------
-- 10. SCOPED ADMINISTRATIVE ACCESS ROLES TABLE
-- Strictly separates Main Website Admin from Student Portal Admin
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_scopes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  scope TEXT NOT NULL CHECK (scope IN ('main_website', 'student_portal', 'finance', 'super_admin')),
  role TEXT NOT NULL DEFAULT 'website_admin',
  permissions TEXT[] NOT NULL DEFAULT ARRAY['main_website.view', 'main_website.media', 'main_website.gallery', 'main_website.news', 'main_website.events', 'main_website.homepage'],
  is_active BOOLEAN DEFAULT true NOT NULL,
  granted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, scope)
);

CREATE INDEX IF NOT EXISTS idx_admin_scopes_user ON public.admin_scopes (user_id);
CREATE INDEX IF NOT EXISTS idx_admin_scopes_scope ON public.admin_scopes (scope);
CREATE INDEX IF NOT EXISTS idx_admin_scopes_active ON public.admin_scopes (is_active);

-- -------------------------------------------------------------------------
-- 11. ADMINISTRATIVE AUDIT LOGS TABLE
-- Tracks all website CMS and media modifications with user attribution
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email TEXT NOT NULL,
  scope TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB DEFAULT '{}'::jsonb NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_scope ON public.admin_audit_logs (scope);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.admin_audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.admin_audit_logs (created_at DESC);

-- -------------------------------------------------------------------------
-- 12. DYNAMIC WEBSITE CONTENT TABLES
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.website_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  cloudinary_public_id TEXT,
  author TEXT DEFAULT 'NACOS Press Team' NOT NULL,
  category TEXT DEFAULT 'Tech & Academics' NOT NULL,
  is_published BOOLEAN DEFAULT true NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  published_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.website_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  event_date TEXT NOT NULL,
  event_time TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  cloudinary_public_id TEXT,
  category TEXT DEFAULT 'Workshop' NOT NULL,
  is_published BOOLEAN DEFAULT true NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.website_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  caption TEXT NOT NULL,
  image_url TEXT NOT NULL,
  cloudinary_public_id TEXT,
  category TEXT DEFAULT 'Campus Life' NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.website_homepage_content (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  hero_badge TEXT DEFAULT 'Official Tech Community of FUTO' NOT NULL,
  hero_title TEXT DEFAULT 'Empowering the Next Generation of Tech Leaders' NOT NULL,
  hero_subtitle TEXT DEFAULT 'Department of Computer Science, Federal University of Technology, Owerri.' NOT NULL,
  announcement_banner TEXT,
  announcement_active BOOLEAN DEFAULT false NOT NULL,
  student_count TEXT DEFAULT '2,500+' NOT NULL,
  alumni_count TEXT DEFAULT '10,000+' NOT NULL,
  faculty_count TEXT DEFAULT '45+' NOT NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row-Level Security
ALTER TABLE public.admin_scopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_homepage_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own admin scopes" ON public.admin_scopes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admins have full access to admin_scopes" ON public.admin_scopes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_scopes 
      WHERE user_id = auth.uid() AND scope = 'super_admin' AND is_active = true
    )
  );

CREATE POLICY "Admins can view relevant audit logs" ON public.admin_audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_scopes
      WHERE user_id = auth.uid() 
        AND (scope = 'super_admin' OR (scope = admin_audit_logs.scope AND 'main_website.view' = ANY(permissions)))
        AND is_active = true
    )
  );

CREATE POLICY "Public can view published articles" ON public.website_articles
  FOR SELECT USING (is_published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Main website admins can manage articles" ON public.website_articles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_scopes 
      WHERE user_id = auth.uid() 
        AND scope IN ('main_website', 'super_admin') 
        AND is_active = true
    )
  );

CREATE POLICY "Public can view published events" ON public.website_events
  FOR SELECT USING (is_published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Main website admins can manage events" ON public.website_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_scopes 
      WHERE user_id = auth.uid() 
        AND scope IN ('main_website', 'super_admin') 
        AND is_active = true
    )
  );

CREATE POLICY "Public can view gallery" ON public.website_gallery
  FOR SELECT USING (true);

CREATE POLICY "Main website admins can manage gallery" ON public.website_gallery
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_scopes 
      WHERE user_id = auth.uid() 
        AND scope IN ('main_website', 'super_admin') 
        AND is_active = true
    )
  );

CREATE POLICY "Public can view homepage content" ON public.website_homepage_content
  FOR SELECT USING (true);

CREATE POLICY "Main website admins can update homepage content" ON public.website_homepage_content
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_scopes 
      WHERE user_id = auth.uid() 
        AND scope IN ('main_website', 'super_admin') 
        AND is_active = true
    )
  );

-- -------------------------------------------------------------------------
-- 15. ON-DEMAND STUDENT ID CARD APPLICATIONS & CONFIGURABLE SETTINGS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.id_card_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  id_card_fee NUMERIC NOT NULL DEFAULT 2500,
  is_application_open BOOLEAN NOT NULL DEFAULT true,
  academic_session TEXT NOT NULL DEFAULT '2026/2027',
  allow_reapplication_on_revoke BOOLEAN NOT NULL DEFAULT true,
  card_template_version TEXT NOT NULL DEFAULT '2026.1',
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

INSERT INTO public.id_card_settings (id, id_card_fee, is_application_open, academic_session, allow_reapplication_on_revoke)
VALUES ('default', 2500, true, '2026/2027', true)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.id_card_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  matric_number TEXT NOT NULL,
  application_number TEXT UNIQUE NOT NULL,
  id_card_number TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN (
      'draft', 'pending_payment', 'payment_confirmed', 'photo_required',
      'ready_to_submit', 'submitted', 'processing', 'approved', 'generated',
      'rejected', 'revoked'
    )
  ),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'failed')),
  payment_reference TEXT,
  amount NUMERIC NOT NULL DEFAULT 2500,
  paid_at TIMESTAMPTZ,
  passport_url TEXT,
  cloudinary_public_id TEXT,
  id_card_image_url TEXT,
  id_card_pdf_url TEXT,
  qr_verification_url TEXT,
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  generated_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  rejection_reason TEXT,
  revocation_reason TEXT,
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_id_card_apps_student_id ON public.id_card_applications (student_id);
CREATE INDEX IF NOT EXISTS idx_id_card_apps_matric ON public.id_card_applications (matric_number);
CREATE INDEX IF NOT EXISTS idx_id_card_apps_status ON public.id_card_applications (status);
CREATE INDEX IF NOT EXISTS idx_id_card_apps_card_no ON public.id_card_applications (id_card_number);

CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_app_per_student
  ON public.id_card_applications (student_id)
  WHERE status NOT IN ('rejected', 'revoked');

ALTER TABLE public.id_card_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.id_card_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ID Card settings viewable by everyone" ON public.id_card_settings
  FOR SELECT USING (true);

CREATE POLICY "ID Card settings editable by portal admins" ON public.id_card_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_scopes
      WHERE user_id = auth.uid()
        AND scope IN ('student_portal', 'super_admin')
        AND is_active = true
    )
  );

CREATE POLICY "Students can view own ID application" ON public.id_card_applications
  FOR SELECT USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.admin_scopes
      WHERE user_id = auth.uid()
        AND scope IN ('student_portal', 'super_admin')
        AND is_active = true
    )
  );

CREATE POLICY "Students can create own ID application" ON public.id_card_applications
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own unapproved application" ON public.id_card_applications
  FOR UPDATE USING (
    student_id = auth.uid() AND
    status IN ('draft', 'pending_payment', 'payment_confirmed', 'photo_required', 'ready_to_submit')
  );

CREATE POLICY "Portal Admins have full application control" ON public.id_card_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_scopes
      WHERE user_id = auth.uid()
        AND scope IN ('student_portal', 'super_admin')
        AND is_active = true
    )
  );



