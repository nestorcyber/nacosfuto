# NACOS FUTO: Cloudinary Dedicated Media Management Guide

This document outlines the architecture, setup, configuration, and workflows for using **Cloudinary** as the dedicated media management and image delivery infrastructure alongside **Supabase** as the relational system of record for the NACOS platform.

---

## 1. System Architecture & Separation of Responsibilities

```
+---------------------------------------------------------------------------------+
|                                 USER INTERFACE                                  |
|         (apps/website - Public Site  |  apps/portal - Student/Admin Portal)     |
+----------------------------------------+----------------------------------------+
                                         |
                  +----------------------+----------------------+
                  |                                             |
                  v                                             v
+----------------------------------+          +-----------------------------------+
|   SUPABASE (System of Record)    |          |   CLOUDINARY (Media Storage/CDN)  |
+----------------------------------+          +-----------------------------------+
| - Student Authentication         |          | - Student Passport Photos         |
| - Student Bio-data & Levels      |          | - Executive Portrait Photos       |
| - Payment Records & Clearances   |          | - Event Flyers & Banners          |
| - ID Card Active Registrations   |          | - Campus Life Gallery             |
| - Relational Metadata:           |          | - Digital Certificates & Badges   |
|   * profile_photo_url            |          | - Automatic Format (f_auto)       |
|   * cloudinary_public_id         |          | - Dynamic Quality (q_auto)        |
|   * photo_alt, photo_media_type  |          | - Facial-Centered Crop (g_face)   |
|   * public.media_assets table    |          | - Global High-Speed CDN Edge      |
+----------------------------------+          +-----------------------------------+
```

### Key Principles
1. **Zero Binary Storage in Supabase**: Images are never stored as binary data or base64 blobs inside Supabase tables. Only the Cloudinary HTTPS delivery URLs and unique `cloudinary_public_id` values are stored.
2. **Deterministic Identifiers**: Assets use deterministic paths (e.g. `nacos/students/2024CS12345_passport`) to easily replace or delete without leaving orphaned files.
3. **Safe Two-Phase Replacement**: When an image is replaced, the new image is uploaded first; only after the upload succeeds and the database is updated is the old Cloudinary asset removed.

---

## 2. Environment Variables

Create or update your `.env` file (based on `.env.example`):

```env
# -----------------------------------------------------------------------------
# Supabase Configuration
# -----------------------------------------------------------------------------
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# -----------------------------------------------------------------------------
# Cloudinary Client Configuration (VITE_ prefix exposed to browser)
# -----------------------------------------------------------------------------
VITE_CLOUDINARY_CLOUD_NAME=nacos-futo
VITE_CLOUDINARY_UPLOAD_PRESET=nacos_portal_preset

# -----------------------------------------------------------------------------
# Cloudinary Serverless Backend Configuration (NEVER exposed to browser)
# -----------------------------------------------------------------------------
CLOUDINARY_CLOUD_NAME=nacos-futo
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_super_secret_cloudinary_key
```

> [!WARNING]
> Never prefix `CLOUDINARY_API_SECRET` with `VITE_`. It is exclusively read on the server side by `/api/cloudinary/sign.js` and `/api/cloudinary/delete.js` or in local development middleware.

---

## 3. Cloudinary Folder Structure

All media uploaded by students, executives, and administrators is organized into folders:

```
nacos/
├── students/       # Passports: nacos/students/{matric}_passport
├── executives/     # Executives: nacos/executives/{role}_{name}
├── events/         # Event flyers: nacos/events/{event_slug}
├── gallery/        # Campus gallery: nacos/gallery/{title}_{timestamp}
├── news/           # Article featured images: nacos/news/{slug}
├── certificates/   # Badges & certificate templates: nacos/certificates/{name}
├── ids/            # Official student ID digital badges: nacos/ids/{matric}
└── general/        # Departmental banners, icons, and general assets
```

---

## 4. How Uploads Work

The system provides a unified abstraction via `@nacos/media`:

```javascript
import { 
  uploadMedia, 
  deleteMedia, 
  replaceMedia, 
  getOptimizedImageUrl,
  CLOUDINARY_FOLDERS 
} from '@nacos/media';
```

### 1. Upload Flow
1. Client selects an image through `<MediaUpload />`.
2. Format (JPG, PNG, WebP) and size (<= 5MB) are validated in the browser.
3. The component requests a cryptographic SHA-1 signature from `/api/cloudinary/sign`.
4. The file is uploaded directly to `https://api.cloudinary.com/v1_1/<cloud_name>/image/upload`.
5. Progress (0% to 100%) is reported in real-time.
6. The resulting Cloudinary URL and `public_id` are saved to the Supabase database.

### 2. Dev & Unsigned Fallback
If serverless signing is unavailable or during local offline development:
- An unsigned upload preset (`VITE_CLOUDINARY_UPLOAD_PRESET`) is used if configured.
- If completely offline or without credentials, a simulated local reader handles the request so developers can continue working seamlessly without blockers.

---

## 5. Supabase Database Schema

The database migration `packages/supabase/migrations/20260904_cloudinary_media_integration.sql` creates:

### 1. Additions to `public.profiles`
- `profile_photo_url TEXT`: Official Cloudinary HTTPS passport photo URL.
- `cloudinary_public_id TEXT`: Cloudinary public ID for asset management.
- `photo_alt TEXT`: Accessibility alt description.
- `photo_media_type TEXT`: MIME type (e.g. `image/jpeg`).

### 2. Table `public.media_assets`
A central registry for all platform assets (flyers, banners, gallery items, certificates):
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `cloudinary_public_id TEXT NOT NULL UNIQUE`
- `image_url TEXT NOT NULL`
- `image_alt TEXT`
- `media_type TEXT DEFAULT 'image'`
- `folder TEXT NOT NULL`
- `category TEXT NOT NULL CHECK (category IN ('students', 'executives', 'events', 'gallery', 'news', 'certificates', 'ids', 'general'))`
- `entity_type TEXT`
- `entity_id TEXT`
- `format TEXT`, `bytes INTEGER`, `width INTEGER`, `height INTEGER`
- `uploaded_by UUID REFERENCES public.profiles(id)`
- `created_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ`

### 3. Row-Level Security (RLS)
- Public can view published media.
- Students can insert, update, and delete only their own uploaded media (`uploaded_by = auth.uid()`).
- Admins and Chapter Presidents have full media management permissions.

---

## 6. Dynamic Transformations & Delivery Presets

The `@nacos/media` package exports pre-configured optimization presets:

| Preset Name | Dimensions | Crop / Gravity | Formats | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| `avatar` | `96x96` | `c_fill, g_face` | `f_auto, q_auto` | Header avatar, user dropdown |
| `avatar_md` | `200x200` | `c_fill, g_face` | `f_auto, q_auto` | Profile overview card |
| `id_card_photo` | `300x360` | `c_fill, g_face` | `f_auto, q_auto` | Official ID card canvas badge |
| `thumbnail` | `160x160` | `c_fill` | `f_auto, q_auto` | Media library grid thumbnail |
| `card` | `600x400` | `c_fill` | `f_auto, q_auto` | Event cards, blog previews |
| `banner` | `1200x630` | `c_fill` | `f_auto, q_auto` | Event headers & social previews |
| `gallery_preview`| `600x600` | `c_fill` | `f_auto, q_auto` | Campus gallery grid masonry |
| `gallery_full` | `1600` (max) | `c_limit` | `f_auto, q_auto` | Lightbox modal full-res view |

---

## 7. Reusable UI Components

### `<MediaUpload />`
Universal dropzone and upload component:
```jsx
import { MediaUpload, CLOUDINARY_FOLDERS } from '@nacos/media';

<MediaUpload
  currentImageUrl={student.profile_photo_url}
  currentPublicId={student.cloudinary_public_id}
  folder={CLOUDINARY_FOLDERS.STUDENTS}
  publicId="nacos/students/2024CS12345_passport"
  label="Upload Passport Photo"
  helperText="JPG, PNG, or WebP up to 5MB"
  aspectRatio="portrait"
  previewPreset="id_card_photo"
  onUploadSuccess={({ url, publicId }) => {
    // Sync with database
  }}
  onDeleteSuccess={() => {
    // Clear reference in database
  }}
/>
```

### `<CloudinaryImage />`
Next/Image equivalent for Vite + React:
```jsx
import { CloudinaryImage } from '@nacos/media';

<CloudinaryImage
  src="nacos/gallery/dept_front"
  fallbackSrc="/local-fallback.jpg"
  alt="Department Building"
  preset="gallery_preview"
  className="w-full h-auto rounded-xl"
/>
```

---

## 8. Admin Media Management Dashboard

Administrators and Chapter Presidents can access `/admin/media` in the portal to:
1. **Browse All Platform Media**: Filter by `students`, `executives`, `events`, `gallery`, `news`, `certificates`, `ids`.
2. **Inspect Transformations**: Preview any asset through different presets (`avatar`, `card`, `banner`, `gallery_full`).
3. **Copy CDN URLs**: One-click copy for social media and announcements.
4. **Upload New Assets**: Direct upload into organized folders with metadata tags.
5. **Delete & Replace Assets**: Remove or update media without leaving orphaned files.

---

## 9. Vercel Deployment

1. Set the following environment variables in your Vercel Project Settings:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET` (optional)
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. Vercel automatically deploys `api/cloudinary/sign.js` and `api/cloudinary/delete.js` as serverless functions.
3. The root `vercel.json` ensures `/api/*` routes execute serverless functions while `/portal/*` and `/*` route to the SPAs.
