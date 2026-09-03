-- =========================================================================
-- MIGRATION: 20260903_student_id_card_system.sql
-- NACOS FUTO Monorepo: Student ID Card Generation & Verification System
-- =========================================================================

-- 1. Ensure profile_photo_url exists on public.profiles without modifying existing data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'profile_photo_url'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN profile_photo_url TEXT;
  END IF;

  -- Backfill profile_photo_url from avatar_url if present
  UPDATE public.profiles 
  SET profile_photo_url = avatar_url 
  WHERE profile_photo_url IS NULL AND avatar_url IS NOT NULL;
END $$;

-- 2. Extend public.dues_payments with payment_type to distinguish ID card payments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'dues_payments' 
      AND column_name = 'payment_type'
  ) THEN
    ALTER TABLE public.dues_payments 
      ADD COLUMN payment_type TEXT DEFAULT 'id_card' CHECK (payment_type IN ('id_card', 'departmental_dues', 'dues_and_id_card'));
  END IF;
END $$;

-- Update status check constraint on dues_payments to accept 'successful' as valid status
ALTER TABLE public.dues_payments 
  DROP CONSTRAINT IF EXISTS dues_payments_status_check;

ALTER TABLE public.dues_payments 
  ADD CONSTRAINT dues_payments_status_check 
  CHECK (status IN ('pending', 'verified', 'rejected', 'successful'));

-- 3. Create or upgrade public.id_cards table
-- Enforces NO duplication of student identity fields (retrieved via foreign key)
CREATE TABLE IF NOT EXISTS public.id_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  payment_id UUID REFERENCES public.dues_payments(id) ON DELETE RESTRICT NOT NULL,
  template_version TEXT DEFAULT 'v1' NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked')) NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Performance & Relationship Indexes
CREATE INDEX IF NOT EXISTS idx_id_cards_student_id ON public.id_cards (student_id);
CREATE INDEX IF NOT EXISTS idx_id_cards_payment_id ON public.id_cards (payment_id);

-- Constraint: Only ONE active ID card per student at any given time
CREATE UNIQUE INDEX IF NOT EXISTS idx_active_id_card_per_student 
  ON public.id_cards (student_id) 
  WHERE status = 'active';

-- 4. Secure Row Level Security (RLS) Policies
ALTER TABLE public.id_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view own ID cards" ON public.id_cards;
CREATE POLICY "Students can view own ID cards" ON public.id_cards
  FOR SELECT USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can generate own ID card with verified payment" ON public.id_cards;
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

DROP POLICY IF EXISTS "Admins can manage all ID cards" ON public.id_cards;
CREATE POLICY "Admins can manage all ID cards" ON public.id_cards
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('Admin', 'Chapter President')
    )
  );
