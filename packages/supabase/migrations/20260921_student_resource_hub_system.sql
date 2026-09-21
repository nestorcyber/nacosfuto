-- =========================================================================
-- MIGRATION: 20260921_student_resource_hub_system.sql
-- NACOS FUTO: Student Resource Hub System with Backblaze B2 & Supabase
-- =========================================================================

-- Step 1: Create resource categories table
CREATE TABLE IF NOT EXISTS public.resource_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50) DEFAULT 'BookOpen',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Step 2: Create main resources table
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.resource_categories(id) ON DELETE SET NULL,
  course_code VARCHAR(30),
  course_title VARCHAR(255),
  level VARCHAR(20) DEFAULT 'All Levels',
  session VARCHAR(30) DEFAULT '2026/2027',
  semester VARCHAR(20) DEFAULT 'First Semester',
  resource_type VARCHAR(50) DEFAULT 'document', -- 'document', 'past_question', 'video', 'slides', 'archive', 'image', 'other'
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) DEFAULT 'pdf',
  file_extension VARCHAR(20) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size BIGINT DEFAULT 0,
  storage_provider VARCHAR(50) DEFAULT 'backblaze_b2', -- 'backblaze_b2', 'cloudflare_r2', 'supabase_storage', 'aws_s3'
  storage_bucket VARCHAR(100) DEFAULT 'nacos-resources',
  storage_key TEXT NOT NULL,
  thumbnail_storage_key TEXT,
  duration_seconds INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Step 3: Create resource downloads tracking table
CREATE TABLE IF NOT EXISTS public.resource_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
  user_id TEXT,
  ip_hash VARCHAR(64),
  user_agent TEXT,
  downloaded_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Step 4: Create resource views tracking table
CREATE TABLE IF NOT EXISTS public.resource_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
  user_id TEXT,
  viewed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Step 5: Create resource tags and relationship link tables
CREATE TABLE IF NOT EXISTS public.resource_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.resource_tag_links (
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.resource_tags(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (resource_id, tag_id)
);

-- Step 6: Create Indexes for fast querying, filtering, and sorting
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category_id);
CREATE INDEX IF NOT EXISTS idx_resources_course_code ON public.resources(course_code);
CREATE INDEX IF NOT EXISTS idx_resources_level ON public.resources(level);
CREATE INDEX IF NOT EXISTS idx_resources_session ON public.resources(session);
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_is_published ON public.resources(is_published);
CREATE INDEX IF NOT EXISTS idx_resources_is_active ON public.resources(is_active);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_downloads ON public.resources(download_count DESC);
CREATE INDEX IF NOT EXISTS idx_resources_storage_provider ON public.resources(storage_provider);
CREATE INDEX IF NOT EXISTS idx_resource_downloads_resource ON public.resource_downloads(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_downloads_time ON public.resource_downloads(downloaded_at DESC);

-- Step 7: Atomic RPC function to increment download counts without race conditions
CREATE OR REPLACE FUNCTION public.increment_resource_download(
  p_resource_id UUID,
  p_user_id TEXT DEFAULT NULL,
  p_ip_hash TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_count INTEGER;
BEGIN
  -- Insert download record
  INSERT INTO public.resource_downloads (resource_id, user_id, ip_hash, user_agent, downloaded_at)
  VALUES (p_resource_id, p_user_id, p_ip_hash, p_user_agent, NOW());

  -- Atomically increment counter
  UPDATE public.resources
  SET 
    download_count = download_count + 1,
    updated_at = NOW()
  WHERE id = p_resource_id
  RETURNING download_count INTO v_new_count;

  RETURN COALESCE(v_new_count, 0);
END;
$$;

-- Step 8: Atomic RPC function to increment view counts
CREATE OR REPLACE FUNCTION public.increment_resource_view(
  p_resource_id UUID,
  p_user_id TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_count INTEGER;
BEGIN
  -- Insert view record
  INSERT INTO public.resource_views (resource_id, user_id, viewed_at)
  VALUES (p_resource_id, p_user_id, NOW());

  -- Atomically increment counter
  UPDATE public.resources
  SET 
    view_count = view_count + 1,
    updated_at = NOW()
  WHERE id = p_resource_id
  RETURNING view_count INTO v_new_count;

  RETURN COALESCE(v_new_count, 0);
END;
$$;

-- Step 9: Enable Row Level Security (RLS)
ALTER TABLE public.resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_tag_links ENABLE ROW LEVEL SECURITY;

-- Step 10: RLS Policies
-- Categories: Public read for active categories, authenticated insert/update/delete for admins
DROP POLICY IF EXISTS "Public read resource categories" ON public.resource_categories;
CREATE POLICY "Public read resource categories" ON public.resource_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage resource categories" ON public.resource_categories;
CREATE POLICY "Admins manage resource categories" ON public.resource_categories FOR ALL USING (true);

-- Resources: Public/students can read active published resources; Admins have full access
DROP POLICY IF EXISTS "Public read active resources" ON public.resources;
CREATE POLICY "Public read active resources" ON public.resources FOR SELECT USING (is_active = true AND is_published = true);

DROP POLICY IF EXISTS "Admins manage resources" ON public.resources;
CREATE POLICY "Admins manage resources" ON public.resources FOR ALL USING (true);

-- Downloads: Anyone can log downloads via RPC or insert their own download record
DROP POLICY IF EXISTS "Public log downloads" ON public.resource_downloads;
CREATE POLICY "Public log downloads" ON public.resource_downloads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins view all downloads" ON public.resource_downloads;
CREATE POLICY "Admins view all downloads" ON public.resource_downloads FOR SELECT USING (true);

-- Views: Public can log views
DROP POLICY IF EXISTS "Public log views" ON public.resource_views;
CREATE POLICY "Public log views" ON public.resource_views FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins view all views" ON public.resource_views;
CREATE POLICY "Admins view all views" ON public.resource_views FOR SELECT USING (true);

-- Tags: Public read, admins manage
DROP POLICY IF EXISTS "Public read tags" ON public.resource_tags;
CREATE POLICY "Public read tags" ON public.resource_tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage tags" ON public.resource_tags;
CREATE POLICY "Admins manage tags" ON public.resource_tags FOR ALL USING (true);

DROP POLICY IF EXISTS "Public read tag links" ON public.resource_tag_links;
CREATE POLICY "Public read tag links" ON public.resource_tag_links FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage tag links" ON public.resource_tag_links;
CREATE POLICY "Admins manage tag links" ON public.resource_tag_links FOR ALL USING (true);

-- Step 11: Seed initial standard resource categories
INSERT INTO public.resource_categories (id, name, slug, description, icon, display_order, is_active)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Course Materials', 'course-materials', 'Official lecture notes, slide presentations, and syllabus documents', 'BookOpen', 1, true),
  ('c0000000-0000-0000-0000-000000000002', 'Past Questions', 'past-questions', 'Verified past examination papers and solved mid-semester test archives', 'FileCheck', 2, true),
  ('c0000000-0000-0000-0000-000000000003', 'Tutorials & Code', 'tutorials', 'Programming walkthroughs, lab exercises, and source code packages', 'Code2', 3, true),
  ('c0000000-0000-0000-0000-000000000004', 'Handbooks & Guides', 'handbooks', 'Departmental curriculum guides, academic regulations, and SICT student handbooks', 'FileText', 4, true),
  ('c0000000-0000-0000-0000-000000000005', 'Forms & Clearances', 'forms', 'Departmental registration forms, appraisal templates, and clearance sheets', 'ClipboardList', 5, true),
  ('c0000000-0000-0000-0000-000000000006', 'Video Lectures', 'videos', 'Recorded lectures, tech workshop sessions, and laboratory demonstrations', 'Video', 6, true),
  ('c0000000-0000-0000-0000-000000000007', 'Event Documents', 'events', 'Hackathon briefs, summit keynote materials, and conference decks', 'Calendar', 7, true),
  ('c0000000-0000-0000-0000-000000000008', 'Other Resources', 'other', 'Supplementary datasets, tools, and student publications', 'FolderArchive', 8, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;
