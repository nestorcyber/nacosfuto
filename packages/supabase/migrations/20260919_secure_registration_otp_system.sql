-- =========================================================================
-- MIGRATION: 20260919_secure_registration_otp_system.sql
-- NACOS FUTO: Secure Student Registration with OTP Verification & Recovery
-- =========================================================================

-- 1. OTP Verifications Table (replaces student_verification_codes for new flow)
-- Stores hashed OTP codes with rate limiting, attempt tracking, and channel support
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_number VARCHAR(30) NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'phone')),
  destination TEXT NOT NULL,              -- masked destination (e.g. 'n***@futo.edu.ng')
  destination_full TEXT NOT NULL,         -- full destination for delivery (encrypted at rest)
  otp_hash TEXT NOT NULL,                 -- SHA-256 hash of the OTP code
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  verified_at TIMESTAMPTZ,
  is_used BOOLEAN DEFAULT false NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_otp_verifications_reg_channel ON public.otp_verifications (registration_number, channel);
CREATE INDEX IF NOT EXISTS idx_otp_verifications_expires ON public.otp_verifications (expires_at);
CREATE INDEX IF NOT EXISTS idx_otp_verifications_dest ON public.otp_verifications (destination_full);

-- 2. Verification Sessions Table
-- Short-lived tokens proving successful OTP verification before account creation
CREATE TABLE IF NOT EXISTS public.verification_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_number VARCHAR(30) NOT NULL,
  session_token TEXT UNIQUE NOT NULL,     -- cryptographically random token
  otp_verification_id UUID REFERENCES public.otp_verifications(id),
  verified_channel TEXT NOT NULL CHECK (verified_channel IN ('email', 'phone')),
  verified_destination TEXT NOT NULL,     -- masked
  is_consumed BOOLEAN DEFAULT false NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_verification_sessions_token ON public.verification_sessions (session_token);
CREATE INDEX IF NOT EXISTS idx_verification_sessions_reg ON public.verification_sessions (registration_number);

-- 3. Account Recovery Requests Table
-- Manual verification requests for students who lost access to their contact info
CREATE TABLE IF NOT EXISTS public.account_recovery_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_number VARCHAR(30) NOT NULL,
  full_name TEXT NOT NULL,
  requested_email TEXT,
  requested_phone TEXT,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_recovery_requests_reg ON public.account_recovery_requests (registration_number);
CREATE INDEX IF NOT EXISTS idx_recovery_requests_status ON public.account_recovery_requests (status);

-- 4. OTP Rate Limiting Table
-- Tracks OTP generation requests per registration number for rate limiting
CREATE TABLE IF NOT EXISTS public.otp_rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_number VARCHAR(30) NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('email', 'phone')),
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_otp_rate_limits_reg_type ON public.otp_rate_limits (registration_number, request_type);

-- 5. Row Level Security
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_recovery_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_rate_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public access for registration flow (unauthenticated users)
CREATE POLICY "OTP verifications public access" ON public.otp_verifications
  FOR ALL USING (true);

CREATE POLICY "Verification sessions public access" ON public.verification_sessions
  FOR ALL USING (true);

CREATE POLICY "Account recovery requests public access" ON public.account_recovery_requests
  FOR ALL USING (true);

CREATE POLICY "OTP rate limits public access" ON public.otp_rate_limits
  FOR ALL USING (true);

-- Admin policies for account recovery management
CREATE POLICY "Admins manage recovery requests" ON public.account_recovery_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_scopes
      WHERE user_id = auth.uid()
        AND scope IN ('student_portal', 'super_admin')
        AND is_active = true
    )
  );
