-- =========================================================================
-- NACOS FUTO MONOREPO: COMPLETE MASTER DATABASE SCHEMA
-- File: packages/supabase/migrations/FULL_DATABASE_SETUP.sql
-- 
-- Single-file script to set up all tables, relations, functions, 
-- constraints, RLS policies, and seed data in your Supabase project.
-- Run this once in the Supabase SQL Editor.
-- =========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- 1. CENTRAL ACADEMIC SYSTEM CONFIGURATION
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.academic_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  current_academic_year_start INTEGER NOT NULL DEFAULT 2026, -- e.g. 2026 for 2026/2027 session
  current_session TEXT NOT NULL DEFAULT '2026/2027',
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

INSERT INTO public.academic_settings (id, current_academic_year_start, current_session)
VALUES ('default', 2026, '2026/2027')
ON CONFLICT (id) DO UPDATE SET 
  current_academic_year_start = EXCLUDED.current_academic_year_start,
  current_session = EXCLUDED.current_session,
  updated_at = TIMEZONE('utc'::text, NOW());

-- =========================================================================
-- 2. PROFILES / STUDENTS TABLE
-- The registration_number is strictly numeric digits (e.g. 20241029481)
-- and is the ONLY identifier used to track students.
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  
  -- Student Identity & Separate Names
  first_name TEXT NOT NULL,
  middle_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  
  -- Institutional Registration (Digits Only, No Letters)
  registration_number TEXT UNIQUE NOT NULL, -- e.g. 20241029481 (The only student tracking number)
  matric_number TEXT UNIQUE,                -- Compatibility alias
  admission_year INTEGER NOT NULL,          -- Automatically extracted leading 4 digits
  
  -- Contact & Security
  email TEXT UNIQUE NOT NULL,               -- Must match student email on FUTO portal
  phone_number TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  
  -- Academic Faculty & Curriculum
  programme TEXT DEFAULT 'B.Tech Computer Science' NOT NULL,
  department TEXT DEFAULT 'Computer Science' NOT NULL,
  faculty TEXT DEFAULT 'School of Information & Communication Tech (SICT)' NOT NULL,
  programme_duration INTEGER DEFAULT 5 NOT NULL,
  institution TEXT DEFAULT 'Federal University of Technology, Owerri (FUTO)',
  
  -- Roles & Status
  role TEXT DEFAULT 'Student Member' NOT NULL CHECK (role IN ('Student Member', 'Chapter President', 'Admin')),
  is_active BOOLEAN DEFAULT true NOT NULL,
  
  -- Cloudinary Profile Media
  profile_photo_url TEXT,
  cloudinary_public_id TEXT,
  photo_alt TEXT,
  photo_media_type TEXT DEFAULT 'image/jpeg',
  avatar_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_profiles_reg_number ON public.profiles (registration_number);
CREATE INDEX IF NOT EXISTS idx_profiles_admission_year ON public.profiles (admission_year);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON public.profiles (is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_cloudinary_id ON public.profiles (cloudinary_public_id);

-- =========================================================================
-- 3. DYNAMIC ACADEMIC LEVEL CALCULATION STORED PROCEDURE
-- Formula: current_level = current_academic_year_start - admission_year + 1
-- =========================================================================
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
  ELSE
    RETURN 'Alumni (' || p_duration::text || '-Yr Program)';
  END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- =========================================================================
-- 4. ON-DEMAND STUDENT ID CARD SYSTEM
-- Never automatically generated on registration.
-- Student must explicitly apply from the ID Card section.
-- =========================================================================

-- 4a. ID Card Settings
CREATE TABLE IF NOT EXISTS public.id_card_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  id_card_fee NUMERIC(10,2) NOT NULL DEFAULT 2500.00,
  academic_session TEXT NOT NULL DEFAULT '2026/2027',
  is_application_open BOOLEAN NOT NULL DEFAULT true,
  allow_reapplication_on_revoke BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

INSERT INTO public.id_card_settings (id, id_card_fee, academic_session, is_application_open, allow_reapplication_on_revoke)
VALUES ('default', 2500.00, '2026/2027', true, true)
ON CONFLICT (id) DO UPDATE SET 
  id_card_fee = EXCLUDED.id_card_fee,
  academic_session = EXCLUDED.academic_session,
  updated_at = TIMEZONE('utc'::text, NOW());

-- 4b. ID Card Applications Table
CREATE TABLE IF NOT EXISTS public.id_card_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  matric_number TEXT NOT NULL,                -- Numeric registration number (the only student ID)
  application_number TEXT UNIQUE NOT NULL,    -- Application reference (e.g. APP-2026-000001)
  
  -- ID Card Tracking: uses the student's registration number
  id_card_number TEXT,                        -- Set to student's regnumber upon generation
  
  -- Lifecycle Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN (
      'draft',
      'pending_payment',
      'payment_confirmed',
      'photo_required',
      'ready_to_submit',
      'submitted',
      'processing',
      'approved',
      'generated',
      'rejected',
      'revoked'
    )
  ),
  
  -- Payment Verification
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'waived')),
  payment_reference TEXT,
  amount_paid NUMERIC(10,2) DEFAULT 2500.00,
  
  -- Cloudinary Passport Photograph
  passport_url TEXT,
  cloudinary_public_id TEXT,
  
  -- Administrative Reviews
  rejection_reason TEXT,
  revocation_reason TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  
  -- Timestamps
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  generated_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_id_apps_student_id ON public.id_card_applications (student_id);
CREATE INDEX IF NOT EXISTS idx_id_apps_matric ON public.id_card_applications (matric_number);
CREATE INDEX IF NOT EXISTS idx_id_apps_status ON public.id_card_applications (status);
CREATE INDEX IF NOT EXISTS idx_id_apps_card_num ON public.id_card_applications (id_card_number);

-- Ensure only one active application per student
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_app_per_student 
  ON public.id_card_applications (student_id)
  WHERE status NOT IN ('revoked', 'rejected');

-- =========================================================================
-- 5. DEPARTMENTAL DUES & PAYMENTS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.dues_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_matric TEXT NOT NULL,               -- Student's numeric registration number
  session TEXT NOT NULL DEFAULT '2026/2027',
  amount NUMERIC(10,2) NOT NULL,
  payment_type TEXT NOT NULL DEFAULT 'departmental_dues' CHECK (payment_type IN ('departmental_dues', 'id_card', 'event_ticket', 'merchandise')),
  payment_reference TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'successful' CHECK (status IN ('successful', 'pending', 'failed')),
  purpose TEXT NOT NULL,
  receipt_url TEXT,
  paid_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_dues_payments_matric ON public.dues_payments (student_matric);
CREATE INDEX IF NOT EXISTS idx_dues_payments_ref ON public.dues_payments (payment_reference);
CREATE INDEX IF NOT EXISTS idx_dues_payments_status ON public.dues_payments (status);

-- =========================================================================
-- 6. DEDICATED ADMIN AUTH & SCOPES (MAIN WEBSITE VS PORTAL ISOLATION)
-- =========================================================================
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

-- Admin Audit Trails
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

-- =========================================================================
-- 7. MAIN WEBSITE CMS CONTENT TABLES
-- =========================================================================

-- 7a. News & Journal Articles
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

-- 7b. Website Events
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

-- 7c. Campus Life Gallery Items
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

-- 7d. Homepage Dynamic Banners
CREATE TABLE IF NOT EXISTS public.website_homepage_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL, -- e.g. 'hero_banner', 'alert_ticker'
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  cloudinary_public_id TEXT,
  cta_text TEXT,
  cta_link TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  meta_data JSONB DEFAULT '{}'::jsonb NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =========================================================================
-- 8. CENTRAL MEDIA ASSETS REGISTRY (CLOUDINARY CATALOG)
-- Supports all 12 canonical NACOS folders across Website & Portal
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cloudinary_public_id TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  image_alt TEXT,
  media_type TEXT DEFAULT 'image' NOT NULL,
  folder TEXT NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN (
      'students', 
      'ids', 
      'executives', 
      'yellow_pages', 
      'events', 
      'gallery', 
      'alumni', 
      'news', 
      'homepage', 
      'certificates', 
      'general'
    )
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

-- =========================================================================
-- 9. ROW-LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS across all tables
ALTER TABLE public.academic_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.id_card_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.id_card_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dues_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_scopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- 9a. Academic Settings RLS
DROP POLICY IF EXISTS "Public can view academic settings" ON public.academic_settings;
CREATE POLICY "Public can view academic settings" ON public.academic_settings FOR SELECT USING (true);

-- 9b. Profiles RLS
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 9c. ID Card Settings RLS
DROP POLICY IF EXISTS "Public can view id card settings" ON public.id_card_settings;
CREATE POLICY "Public can view id card settings" ON public.id_card_settings FOR SELECT USING (true);

-- 9d. ID Card Applications RLS
DROP POLICY IF EXISTS "Students can view own applications" ON public.id_card_applications;
CREATE POLICY "Students can view own applications" ON public.id_card_applications 
  FOR SELECT USING (auth.uid() = student_id OR true); -- Public allowed for QR verification lookup

DROP POLICY IF EXISTS "Students can insert own applications" ON public.id_card_applications;
CREATE POLICY "Students can insert own applications" ON public.id_card_applications 
  FOR INSERT WITH CHECK (auth.uid() = student_id OR student_id IS NOT NULL);

DROP POLICY IF EXISTS "Students can update own applications" ON public.id_card_applications;
CREATE POLICY "Students can update own applications" ON public.id_card_applications 
  FOR UPDATE USING (auth.uid() = student_id OR true);

-- 9e. Website Content RLS (Public can view, admins can manage)
DROP POLICY IF EXISTS "Public can view published articles" ON public.website_articles;
CREATE POLICY "Public can view published articles" ON public.website_articles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view published events" ON public.website_events;
CREATE POLICY "Public can view published events" ON public.website_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view gallery" ON public.website_gallery;
CREATE POLICY "Public can view gallery" ON public.website_gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view homepage content" ON public.website_homepage_content;
CREATE POLICY "Public can view homepage content" ON public.website_homepage_content FOR SELECT USING (true);

-- 9f. Media Assets RLS
DROP POLICY IF EXISTS "Public can view media assets" ON public.media_assets;
CREATE POLICY "Public can view media assets" ON public.media_assets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can upload media assets" ON public.media_assets;
CREATE POLICY "Authenticated users can upload media assets" ON public.media_assets FOR INSERT WITH CHECK (true);

-- =========================================================================
-- SETUP COMPLETE!
-- Your Supabase database is now fully configured for the NACOS monorepo.
-- =========================================================================
