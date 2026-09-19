# NACOS FUTO Monorepo Platform

> **One Repository. Four Dedicated Applications. Shared Infrastructure. Distinct Experiences. Unified Brand.**

Welcome to the official digital ecosystem for the **Nigeria Association of Computing Students (NACOS), Federal University of Technology, Owerri (FUTO) Chapter**.

---

## 🏛️ Monorepo Architecture Overview

```text
nacosfuto/
│
├── apps/
│   ├── website/                      # Main Public-Facing Website (29+ informational & student resource routes)
│   │   ├── src/pages/                # About, Academics, Admissions, Events, Faculty, YellowPages...
│   │   └── src/components/           # DesktopNav, MobileNav, Footer, ThemeContext...
│   │
│   ├── portal/                       # Authenticated Student Academic Portal & Dashboard
│   │   ├── src/pages/Login.jsx       # Student Login + Direct Matric/Email Auth
│   │   ├── src/pages/Register.jsx    # Secure 2FA Student Registration with OTP (SMS/Email)
│   │   ├── src/pages/Dashboard.jsx   # Student Dashboard (Overview, Dynamic Level, Notices)
│   │   ├── src/pages/Results.jsx     # Result Checker (Semester GPA & CGPA Calculator)
│   │   ├── src/pages/Dues.jsx        # Departmental Dues Clearance & Official Digital Receipt
│   │   ├── src/pages/Courses.jsx     # Course Registration & Past Questions Repository
│   │   ├── src/pages/Profile.jsx     # Student Bio-Data & Cryptographic Digital ID E-Card
│   │   └── src/pages/Hackathon*.jsx  # BUILDX NACOS Hackathon Hub & Team Registration
│   │
│   ├── website-admin/                # Dedicated Website CMS & Public Relations Admin
│   │   ├── src/pages/AdminDashboard  # Analytics, Content Overview, Quick Actions
│   │   ├── src/pages/AdminNews.jsx   # Departmental Announcements & News Publishing
│   │   ├── src/pages/AdminEvents.jsx # Events & Hackathons Management
│   │   ├── src/pages/AdminGallery    # Campus Gallery Media Management
│   │   ├── src/pages/AdminMedia.jsx  # Cloudinary Media Assets Library
│   │   └── src/pages/AdminUsers.jsx  # Scoped Administrative Role Assignment
│   │
│   └── portal-admin/                 # Dedicated Student Portal Operations Admin
│       ├── src/pages/PortalAdminDash # Portal Verification & Metric Overview
│       ├── src/pages/PortalAdminStu* # Student Registry & Academic Record Auditing
│       ├── src/pages/PortalAdminId*  # Digital Student ID Application Reviews & Approvals
│       └── src/pages/PortalAdminSet* # Academic Session & System Settings
│
├── packages/
│   ├── auth/                         # Shared Scoped Authentication & Role-Based Permissions
│   ├── database/                     # Consolidated Supabase Client & Connection Engine
│   ├── supabase/                     # Supabase Services (Auth, OTP, SMS, Email, ID Card, Migrations)
│   ├── validation/                   # Student & Input Validation Schemas
│   ├── media/                        # Cloudinary Asset Integration & Management
│   ├── ui/                           # Shared Brand UI Components (Buttons, Badges, Modals, Cards)
│   ├── types/                        # Shared TypeScript / JSDoc Interfaces
│   └── config/                       # Central Academic Calendar & Styling Tokens
│
├── supabase_schema.sql               # Single-File Copy-Paste Supabase Database Master Schema
├── turbo.json                        # Turborepo Build Pipeline Configuration
├── package.json                      # Monorepo Workspace Configuration
└── README.md
```

---

## 🗄️ Database Setup (Supabase)

The entire backend runs on Supabase PostgreSQL with Row-Level Security (RLS).

### Option A: Complete Database Setup (Recommended)
1. Open the [supabase_schema.sql](supabase_schema.sql) file in this repository.
2. Copy the entire contents.
3. In your Supabase Dashboard, go to **SQL Editor** -> **New Query**.
4. Paste the script and click **Run**.

This initializes all 18 subsystems:
- Academic System Settings & Dynamic Level Calculation
- Verified Institutional Student Registry
- Student Profiles & Auth
- OTP 2FA Verification System (Termii SMS & Resend Email)
- Verification Sessions & Rate Limiting
- Account Recovery Requests
- Administrative Users & Scopes (Portal vs Website CMS Isolation)
- Digital Student ID Card Applications & Verification
- Academic Courses & Curriculum
- Student Academic Results & CGPA Grading
- Departmental Dues & Clearance
- CMS Announcements, Events, Gallery & Media Assets
- Admin Security Audit Trail
- Row Level Security (RLS) Policies
- Pre-seeded Administrative Accounts, Student Registry, and Courses

### Option B: Incremental Migrations
For existing databases, incremental SQL migrations are available in [`packages/supabase/migrations/`](packages/supabase/migrations/). See the [Migrations README](packages/supabase/migrations/README.md) for details.

### 🔑 Default Pre-Seeded Admin Credentials
| Scope / Role | Email | Default Password |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@nacos.org.ng` | `password` |
| **Portal Admin** | `portaladmin@nacos.org.ng` | `password` |
| **Website Admin** | `webadmin@nacos.org.ng` | `password` |

---

## ⚡ Getting Started & Local Development

### 1. Install Monorepo Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the root or individual app folders:
```bash
cp .env.example .env
```
Provide your Supabase URL, Anon Key, Termii API Key (for SMS), and Resend API Key (for Email).

### 3. Run Applications
```bash
# Start all 4 apps concurrently (Turbo pipeline)
npm run dev

# Or start specific applications:
npm run dev:website        # Main Website (http://localhost:5173)
npm run dev:portal         # Student Portal (http://localhost:5174)
npm run dev:website-admin  # Website CMS Admin (http://localhost:5175)
npm run dev:portal-admin   # Portal Operations Admin (http://localhost:5176)
```

---

## 📦 Production Builds

```bash
# Build all workspaces via Turborepo
npm run build

# Build individual applications
npm run build:website
npm run build:portal
npm run build:website-admin
npm run build:portal-admin
```

---

## 🚀 Deployment (Vercel)

All applications can be deployed from this repository as separate Vercel projects or bundled using the root `vercel.json` bundle script:

1. **Main Website**: Root `apps/website` -> `nacosfuto.org`
2. **Student Portal**: Root `apps/portal` -> `portal.nacosfuto.org`
3. **Website Admin CMS**: Root `apps/website-admin` -> `admin.nacosfuto.org`
4. **Portal Admin Operations**: Root `apps/portal-admin` -> `portal-admin.nacosfuto.org`
