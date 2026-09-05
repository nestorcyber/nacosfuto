-- =========================================================================
-- MIGRATION: 20260904_website_admin_auth_and_scopes.sql
-- NACOS FUTO: Dedicated Main Website Admin Authentication, Scopes & Audit Logs
-- =========================================================================

-- 1. Create Scoped Admin Roles Table
-- Guarantees Main Website Admin and Student Portal Admin are strictly isolated
CREATE TABLE IF NOT EXISTS public.admin_scopes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  scope TEXT NOT NULL CHECK (scope IN ('main_website', 'student_portal', 'finance', 'super_admin')),
  role TEXT NOT NULL DEFAULT 'website_admin', -- e.g. 'website_admin', 'website_editor', 'super_admin', 'portal_admin'
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

-- 2. Create Admin Audit Logs Table
-- Records every important administrative change with attribution
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email TEXT NOT NULL,
  scope TEXT NOT NULL,
  action TEXT NOT NULL, -- e.g. 'login', 'image_upload', 'news_publish', 'event_create', etc.
  resource_type TEXT NOT NULL, -- e.g. 'media', 'gallery', 'news', 'event', 'homepage', 'admin_user'
  resource_id TEXT,
  details JSONB DEFAULT '{}'::jsonb NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_scope ON public.admin_audit_logs (scope);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.admin_audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.admin_audit_logs (created_at DESC);

-- 3. Website Content Tables
-- Dynamic storage for public website content managed via Main Website Admin

-- 3a. News & Journal Articles
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

-- 3b. Website Events
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

-- 3c. Campus Life Gallery Items
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

-- 3d. Dynamic Homepage Content
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

INSERT INTO public.website_homepage_content (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;

-- 4. Row-Level Security (RLS) Policies
ALTER TABLE public.admin_scopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_homepage_content ENABLE ROW LEVEL SECURITY;

-- 4a. Admin Scopes RLS
-- A user can see their own scope; Super Admins can see and manage all scopes
CREATE POLICY "Users can view own admin scopes" ON public.admin_scopes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admins have full access to admin_scopes" ON public.admin_scopes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_scopes 
      WHERE user_id = auth.uid() AND scope = 'super_admin' AND is_active = true
    )
  );

-- 4b. Admin Audit Logs RLS
-- Scoped admins can view logs for their scope; Super admins see all
CREATE POLICY "Admins can view relevant audit logs" ON public.admin_audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_scopes
      WHERE user_id = auth.uid() 
        AND (scope = 'super_admin' OR (scope = admin_audit_logs.scope AND 'main_website.view' = ANY(permissions)))
        AND is_active = true
    )
  );

CREATE POLICY "Authenticated admins can insert audit logs" ON public.admin_audit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 4c. Website Content RLS (Public can read published items; Only main_website admins can mutate)
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
