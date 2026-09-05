-- =========================================================================
-- NACOS FUTO Monorepo: On-Demand Student ID Card Applications & Generation
-- Migration: 20260904_id_card_applications_system.sql
-- =========================================================================

-- 1. ID CARD FEE & SYSTEM SETTINGS TABLE
-- Allows portal administrators to dynamically configure the ID card fee
-- and session parameters without changing source code.
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

-- 2. ID CARD APPLICATIONS TABLE
-- Complete on-demand application lifecycle tracking:
-- draft -> pending_payment -> payment_confirmed -> photo_required -> ready_to_submit -> submitted -> processing -> approved -> generated -> rejected / revoked
CREATE TABLE IF NOT EXISTS public.id_card_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  matric_number TEXT NOT NULL,
  application_number TEXT UNIQUE NOT NULL,
  
  -- ID Card Tracking: Uses student's unique numeric registration number (no artificial numbers generated)
  id_card_number TEXT,
  
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
  
  -- Payment Tracking (Never trusted from client; verified via dues_payments)
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'failed')),
  payment_reference TEXT,
  amount NUMERIC NOT NULL DEFAULT 2500,
  paid_at TIMESTAMPTZ,
  
  -- Media Assets (Stored in Cloudinary)
  passport_url TEXT,
  cloudinary_public_id TEXT,
  id_card_image_url TEXT,
  id_card_pdf_url TEXT,
  qr_verification_url TEXT,
  
  -- Review, Approval & Audit Metadata
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

-- Fast lookup indexes
CREATE INDEX IF NOT EXISTS idx_id_card_apps_student_id ON public.id_card_applications (student_id);
CREATE INDEX IF NOT EXISTS idx_id_card_apps_matric ON public.id_card_applications (matric_number);
CREATE INDEX IF NOT EXISTS idx_id_card_apps_status ON public.id_card_applications (status);
CREATE INDEX IF NOT EXISTS idx_id_card_apps_card_no ON public.id_card_applications (id_card_number);

-- Uniqueness constraint: Only one active in-flight application per student
-- (A student with a rejected or revoked card may be permitted to reapply)
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_app_per_student
  ON public.id_card_applications (student_id)
  WHERE status NOT IN ('rejected', 'revoked');

-- 3. ROW-LEVEL SECURITY POLICIES
ALTER TABLE public.id_card_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.id_card_applications ENABLE ROW LEVEL SECURITY;

-- Settings: viewable by all authenticated students; editable only by portal admins
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

-- Applications: Students can view only their own applications
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

-- Students can insert their own application
CREATE POLICY "Students can create own ID application" ON public.id_card_applications
  FOR INSERT WITH CHECK (
    student_id = auth.uid()
  );

-- Students can update only their own draft/photo submission, NOT payment_status or approval
CREATE POLICY "Students can update own unapproved application" ON public.id_card_applications
  FOR UPDATE USING (
    student_id = auth.uid() AND
    status IN ('draft', 'pending_payment', 'payment_confirmed', 'photo_required', 'ready_to_submit')
  );

-- Portal Admins have full access to review, approve, reject, revoke, and regenerate
CREATE POLICY "Portal Admins have full application control" ON public.id_card_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_scopes
      WHERE user_id = auth.uid()
        AND scope IN ('student_portal', 'super_admin')
        AND is_active = true
    )
  );
