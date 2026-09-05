-- =========================================================================
-- MIGRATION: 20260904_cloudinary_media_integration.sql
-- NACOS FUTO: Cloudinary Dedicated Media Management & Image Delivery Schema
-- =========================================================================

-- 1. Extend public.profiles with Cloudinary media references
DO $$
BEGIN
  -- Add cloudinary_public_id to public.profiles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'cloudinary_public_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN cloudinary_public_id TEXT;
  END IF;

  -- Add photo_alt to public.profiles for accessibility
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'photo_alt'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN photo_alt TEXT;
  END IF;

  -- Add photo_media_type to public.profiles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'photo_media_type'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN photo_media_type TEXT DEFAULT 'image/jpeg';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_cloudinary_public_id 
  ON public.profiles (cloudinary_public_id);

-- 2. Create public.media_assets Table (Central Platform Media Registry)
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
  entity_type TEXT, -- e.g. 'student_passport', 'id_card_photo', 'event_flyer', 'gallery_item'
  entity_id TEXT,   -- e.g. student registration number or event identifier
  format TEXT,      -- e.g. 'jpg', 'png', 'webp'
  bytes INTEGER,    -- file size in bytes
  width INTEGER,    -- original image width
  height INTEGER,   -- original image height
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Fast lookup indexes
CREATE INDEX IF NOT EXISTS idx_media_assets_category ON public.media_assets (category);
CREATE INDEX IF NOT EXISTS idx_media_assets_folder ON public.media_assets (folder);
CREATE INDEX IF NOT EXISTS idx_media_assets_entity ON public.media_assets (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_uploaded_by ON public.media_assets (uploaded_by);

-- 3. Row-Level Security (RLS) Policies
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone (public & authenticated) can view published platform media
DROP POLICY IF EXISTS "Public can view platform media assets" ON public.media_assets;
CREATE POLICY "Public can view platform media assets" ON public.media_assets
  FOR SELECT USING (true);

-- Policy: Authenticated users can record media they personally upload
DROP POLICY IF EXISTS "Users can insert own media records" ON public.media_assets;
CREATE POLICY "Users can insert own media records" ON public.media_assets
  FOR INSERT WITH CHECK (
    auth.uid() = uploaded_by OR 
    uploaded_by IS NULL OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Chapter President'))
  );

-- Policy: Users can update metadata of their own media
DROP POLICY IF EXISTS "Users can update own media records" ON public.media_assets;
CREATE POLICY "Users can update own media records" ON public.media_assets
  FOR UPDATE USING (
    auth.uid() = uploaded_by OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Chapter President'))
  );

-- Policy: Users can delete their own media records
DROP POLICY IF EXISTS "Users can delete own media records" ON public.media_assets;
CREATE POLICY "Users can delete own media records" ON public.media_assets
  FOR DELETE USING (
    auth.uid() = uploaded_by OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Chapter President'))
  );

-- Policy: Administrators and Chapter Presidents have full access
DROP POLICY IF EXISTS "Admins have full media management access" ON public.media_assets;
CREATE POLICY "Admins have full media management access" ON public.media_assets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Admin', 'Chapter President'))
  );
