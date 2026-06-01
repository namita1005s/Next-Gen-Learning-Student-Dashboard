# 🚀 Next-Gen Learning Student Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-blue?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-6.x-purple?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css" alt="Tailwind v4" />
  <img src="https://img.shields.io/badge/Supabase-Database-3ecf8e?style=for-the-badge&logo=supabase" alt="Supabase Backend" />
  <img src="https://img.shields.io/badge/Framer_Motion-12.x-ff007f?style=for-the-badge&logo=framer" alt="Framer Motion" />
</p>

## 🌐 Live Product Demo
👉 **Experience the live build at:** [https://next-gen-learning-student-dashboard-seven.vercel.app](https://next-gen-learning-student-dashboard-seven.vercel.app)

---

An ultra-modern, high-fidelity **Student Dashboard** designed for next-generation educational interfaces. Built on a modular **Bento Grid** layout, this workspace integrates live PostgreSQL data synchronization with Supabase, dynamic profile and bio personalization, a premium Dicebear Avatar Studio, customizable mindset goals, and zero-layout-shift physics-based animations.

---

## 🏛️ Architectural Choices

The system's UI/UX and logic pathways were architected to achieve peak physical performance and a pristine developer-facing aesthetic:

1.  **Bento Grid Visual Prioritization**: Instead of presenting a dry, linear feed of data, the interface places information into a scannable **Bento Grid**. Highly critical data (like the live student profile status, Streak counter, and active course levels) gets prominent focal sizing in the upper-tier of the screen grid, while peripheral tiles (e.g. Mindset Gym quote carousel, hours-learned activity graphs) occupy lower-tier columns.
2.  **Immersive Cosmic Dark Canvas**: Formulated with a deep eye-safe palette (`bg-zinc-950` with high-contrast borders `border-zinc-800/60`). Designed specifically to assist night-time study sessions by reducing blue-light emissions and maintaining student concentration.
3.  **Modular Component Boundary Strategy**: Components (e.g., `ActivityTile`, `HeroTile`, `StudentProfileTile`, `MindsetGymTile`) are isolated and extracted inside `/components` instead of bloating `App.tsx`. This keeps individual module boundaries strictly self-contained.
4.  **Hardware-Accelerated Fluid Layouts**: Visual transitions are limited solely to CSS properties that do not trigger layout recalculations (`transform` and `opacity`), maximizing animation efficiency.

---

## 🏗️ Server/Client Component Split Strategy

To maintain lightweight footprints for client rendering, we crafted a robust architecture based around a clean division of labor:

*   **Vite Single Page Application (SPA)**: The application is built as a highly optimized client-SPA powered by Vite. Doing so shifts the compute load of handling layout structures, local goal synchronization, and animation states entirely to the browser.
*   **Decoupled Server Integration**: Communication with the PostgreSQL database (hosted on Supabase) is handled asynchronously on the client via the `@supabase/supabase-js` client SDK.
*   **Next.js Server Cleanup**:
    *   **The Problem**: The workspace initially included template files with Next.js specific server-side modules (`lib/supabase/server.ts` importing `next/headers`). This created a build conflict for Vite's static production compiler (`tsc --noEmit` throwing errors for missing node-level framework structures).
    *   **The Resolution**: We separated the concerns by removing the unnecessary SSR node-bound server entry entirely. The live applet now compiles strictly on pristine browser standards, ensuring trouble-free deployments on hosting tools like Vercel.
*   **Environment Variable Security**: All keys are prefixed with `NEXT_PUBLIC_` or `VITE_` and are securely resolved inside Vite's compile stage. This ensures they are seamlessly bound to the development context without leaking underlying server credentials during local runs.

---

## ⚡ Challenges Faced & Resolution Paths

### Challenge 1: The Leftover Next.js Server Imports (`TS2307`)
*   **Context**: Deploying to Vercel originally threw compilation blocks because the linter encountered `next/headers` inside `/lib/supabase/server.ts`.
*   **Resolution**: Since the dashboard is formatted as a pure, lightning-fast client SPA built on React + Vite, Next.js server files served no active operational purpose. We safely deleted `/lib/supabase/server.ts` and confirmed that the production linter executes with zero warnings (`exit code 0`).

### Challenge 2: Graceful Offline Fallback & Connection Errors
*   **Context**: If a user lacks configured Supabase settings, or experiences network interruptions, standard dashboards throw uncaught errors or render empty skeletons.
*   **Resolution**: We developed a robust **Hybrid Offline Sandbox Engine**. If the Supabase URL and key are blank or the API handshake times out, the system automatically hydates the UI with high-fidelity, interactive mock datasets. This maintains 100% operation with zero downtime.

### Challenge 3: Eliminating Cumulative Layout Shift (CLS)
*   **Context**: High-density bento grids often suffer from layout reflow flickering when images, data feeds, or charts hydrate at different intervals.
*   **Resolution**: We implemented fixed structural container constraints combined with custom pulsing loading skeletons that occupy exact element coordinate spaces prior to data mounting.

### Challenge 4: Harmful Depreciation Warnings (`node-domexception`)
*   **Context**: Bundlers occasionally output warning lines like:
    `npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead`.
*   **Resolution**: We verified that this harmless warning originates from deeply encapsulated downstream npm libraries. We documented this inside our pipeline guides to confirm that it is benign and will not impact runtime execution.

---

## 🛠️ Step-by-Step Vercel Deployment Instructions

Specify these exact configurations on the Vercel dashboard to deploy the SPA in seconds:

1.  **Import Repo**: Connect your GitHub and select **`namita1005s/Next-Gen-Learning-Student-Dashboard`**.
2.  **Configure Build & Output**:
    *   **Framework Preset**: Select **Vite** *(Very critical: Do NOT select Next.js)*.
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
    *   **Install Command**: `npm install`
3.  **Inject Secrets**: Add your two active Supabase environment variables:
    *   `NEXT_PUBLIC_SUPABASE_URL` ➡️ *your-supabase-url*
    *   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` ➡️ *your-supabase-anon-key*
4.  **Launch**: Click **Deploy**! Vercel will bundle the static build into `/dist` and distribute it globally.

---

## 🗄️ Supabase PostgreSQL Setup Schema

Create a functional PostgreSQL backend by running these queries inside your **Supabase SQL Editor**:

```sql
-- 1. Create User Profiles
CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid(),
  name text,
  email text PRIMARY KEY,
  gender text,
  date_of_birth date,
  phone text,
  address text,
  admission_date date,
  class_name text,
  institution text,
  student_pass_id text,
  bio text,
  streak_days integer DEFAULT 0,
  total_xp integer DEFAULT 0,
  avatar_url text
);

-- 2. Create Enrolled Courses
CREATE TABLE courses (
  id text PRIMARY KEY,
  title text NOT NULL,
  progress integer DEFAULT 0,
  icon_name text,
  created_at timestamptz DEFAULT now()
);

-- 3. Create Achievements
CREATE TABLE achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL,
  level text NOT NULL,
  xp_earned integer DEFAULT 0,
  color_from text DEFAULT 'from-amber-500/20',
  color_to text DEFAULT 'to-orange-500/10',
  text_color text DEFAULT 'text-amber-400',
  border_color text DEFAULT 'border-amber-500/30',
  user_email text REFERENCES users(email),
  created_at timestamp DEFAULT now()
);

-- 4. Create Focus Activity Logs
CREATE TABLE activity_log (
  id text PRIMARY KEY,
  activity_date date NOT NULL,
  submissions_count integer DEFAULT 0,
  lessons_done integer DEFAULT 0,
  user_email text,
  created_at timestamptz DEFAULT now()
);

-- 5. Create Custom Student Settings
CREATE TABLE user_settings (
  id text PRIMARY KEY,
  user_email text UNIQUE,
  animation_speed text DEFAULT 'normal',
  show_streak boolean DEFAULT true,
  show_xp boolean DEFAULT true,
  streak_reminders boolean DEFAULT true,
  sound_effects boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

-- Disable Row Level Security during onboarding for direct client access
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings DISABLE ROW LEVEL SECURITY;
```

---

## 🏁 Quick Local Setup

Run these commands in your shell to kickstart your local experience:

```bash
# 1. Install all required dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Compile optimization production assets
npm run build
```
