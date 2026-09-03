# NACOS FUTO Monorepo Platform

> **One Repository. Multiple Applications. One Shared Infrastructure. Distinct User Experiences. One Unified Brand.**

Welcome to the official digital ecosystem for the **Nigeria Association of Computing Students (NACOS), Federal University of Technology, Owerri (FUTO) Chapter**.

---

## 🏛️ Monorepo Architecture Overview

```text
nacosfuto/
│
├── apps/
│   ├── website/                      # Main Public-Facing Website (all 29+ routes preserved)
│   │   ├── src/pages/                # About, Academics, Admissions, Events, Faculty, YellowPages...
│   │   └── src/components/           # DesktopNav, MobileNav, Footer, ThemeContext...
│   │
│   └── portal/                       # Authenticated Student Academic Portal & Dashboard
│       ├── src/pages/Login.jsx       # Student Login + Dedicated BUILDX Hackathon Button
│       ├── src/pages/Dashboard.jsx   # Student Dashboard (Overview, CGPA, Dues, Notices)
│       ├── src/pages/Results.jsx     # Result Checker (Semester GPA & CGPA Calculator)
│       ├── src/pages/Dues.jsx        # Departmental Dues Clearance & Official Digital Receipt
│       ├── src/pages/Courses.jsx     # Course Registration & Past Questions Repository
│       ├── src/pages/Profile.jsx     # Student Bio-Data & Cryptographic Digital ID E-Card
│       └── src/pages/Hackathon*.jsx  # BUILDX NACOS Hackathon Hub & Team Registration
│
├── packages/
│   ├── supabase/                     # Shared Supabase Client, Auth Helpers, Database Schema (RLS)
│   ├── ui/                           # Shared UI Components (Logo, Button, Badge, Card)
│   ├── types/                        # Shared TypeScript / JSDoc Data Interfaces
│   └── config/                       # Shared Tailwind CSS & PostCSS Brand Theme Presets
│
├── package.json                      # Monorepo Workspace Configuration
├── pnpm-workspace.yaml               # PNPM Workspaces Config
└── README.md
```

---

## ⚡ Getting Started & Local Development

### 1. Run Both Apps Concurrently
```bash
# Start both Main Website (Port 5173) and Portal (Port 5174)
npm run dev:all
```

### 2. Run Applications Individually

#### Main Public Website
```bash
npm run dev:website
# Opens at http://localhost:5173
```

#### Student Portal
```bash
npm run dev:portal
# Opens at http://localhost:5174
```

---

## 📦 Production Builds

```bash
# Build all workspaces
npm run build

# Build individual workspaces
npm run build:website
npm run build:portal
```

---

## 🔐 Shared Supabase Infrastructure

Both applications share the **same central Supabase project**:

* **Auth**: Student Matric Number & Email Authentication (`@nacos/supabase/auth`).
* **Database**: Centralized PostgreSQL schema with Row-Level Security (`packages/supabase/src/schema.sql`):
  - `profiles` — Student bio-data, academic level, and matriculation records.
  - `dues_payments` — Annual departmental dues (₦2,500) and verification statuses.
  - `academic_results` — Semester grade points, credit units, scores, and CGPA.
  - `hackathon_teams` — BUILDX NACOS 2026 hackathon team rosters and project pitches.
* **Storage**: Digital receipt PDFs, past question bundles, and student ID badges.

---

## 🚀 Deployment (Vercel)

Both applications can be deployed from the single GitHub repository as separate Vercel projects:

1. **Main Website Project**:
   - **Root Directory**: `apps/website`
   - **Framework Preset**: Vite
   - **Domain**: `nacosfuto.org` or `nacos.futocsc.edu.ng`

2. **Student Portal Project**:
   - **Root Directory**: `apps/portal`
   - **Framework Preset**: Vite
   - **Domain**: `portal.nacosfuto.org` or `portal.futocsc.edu.ng`
