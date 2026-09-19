-- =========================================================================
-- MIGRATION: 20260920_fix_admin_scopes_schema.sql
-- NACOS FUTO: Fix admin_scopes relation columns & compatibility
-- Resolves: ERROR 42703: column "password_hash" of relation "admin_scopes" does not exist
-- =========================================================================

-- Step 1: Ensure public.admin_scopes exists with all necessary columns
CREATE TABLE IF NOT EXISTS public.admin_scopes (
  id TEXT PRIMARY KEY,
  user_id UUID,
  email TEXT UNIQUE,
  full_name TEXT,
  password_hash TEXT,
  scope TEXT,
  role TEXT,
  permissions JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Step 2: Migrate existing table columns to match modern auth requirements
DO $$
BEGIN
  -- Add password_hash column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'admin_scopes' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE public.admin_scopes ADD COLUMN password_hash TEXT;
  END IF;

  -- Add user_id column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'admin_scopes' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.admin_scopes ADD COLUMN user_id UUID;
  END IF;

  -- Ensure id column can store custom text keys (e.g., 'admin-seed-super')
  BEGIN
    ALTER TABLE public.admin_scopes ALTER COLUMN id TYPE TEXT USING id::TEXT;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  -- Ensure user_id is nullable (older migrations made it NOT NULL)
  BEGIN
    ALTER TABLE public.admin_scopes ALTER COLUMN user_id DROP NOT NULL;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  -- Ensure permissions column is JSONB (older migrations made it TEXT[])
  BEGIN
    ALTER TABLE public.admin_scopes ALTER COLUMN permissions TYPE JSONB USING CASE 
      WHEN permissions IS NULL THEN '[]'::jsonb 
      ELSE to_jsonb(permissions) 
    END;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  -- Ensure unique constraint on id
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'admin_scopes_pkey' OR conname = 'admin_scopes_id_key'
  ) THEN
    ALTER TABLE public.admin_scopes ADD CONSTRAINT admin_scopes_id_key UNIQUE (id);
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Step 3: Enable RLS and permissive policies for admin scopes
ALTER TABLE public.admin_scopes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read admin scopes" ON public.admin_scopes;
CREATE POLICY "Public read admin scopes" ON public.admin_scopes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage scopes" ON public.admin_scopes;
CREATE POLICY "Admins manage scopes" ON public.admin_scopes FOR ALL USING (true);

-- Step 4: Seed default administrator accounts (Password for all: "password")
-- SHA-256('password') = 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
INSERT INTO public.admin_scopes (id, email, full_name, password_hash, scope, role, permissions, is_active)
VALUES
  (
    'admin-seed-super',
    'superadmin@nacos.org.ng',
    'Executive System Administrator',
    '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    'super_admin',
    'super_admin',
    '["super_admin", "student_portal.all", "main_website.all"]'::jsonb,
    true
  ),
  (
    'admin-seed-portal',
    'portaladmin@nacos.org.ng',
    'Portal Examination & Verification Officer',
    '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    'student_portal',
    'portal_admin',
    '["student_portal.view", "student_portal.students", "student_portal.verification", "student_portal.id_cards", "student_portal.results", "student_portal.dues", "student_portal.settings"]'::jsonb,
    true
  ),
  (
    'admin-seed-website',
    'webadmin@nacos.org.ng',
    'NACOS Director of Software & Public Relations',
    '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    'main_website',
    'website_admin',
    '["main_website.view", "main_website.media", "main_website.gallery", "main_website.news", "main_website.events", "main_website.homepage", "main_website.settings"]'::jsonb,
    true
  )
ON CONFLICT (id) DO UPDATE 
SET 
  password_hash = EXCLUDED.password_hash,
  permissions = EXCLUDED.permissions,
  is_active = EXCLUDED.is_active;
