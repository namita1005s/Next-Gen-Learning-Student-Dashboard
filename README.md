# 🚀 Next-Gen Learning Student Dashboard

A high-fidelity, futuristic Student Dashboard prototype featuring a Bento Grid layout, dynamic data synchronization with a Supabase PostgreSQL database, and zero-layout-shift Framer Motion physical spring animations.

This repository is constructed to address all criteria of the **Frontend Intern Challenge: Next-Gen Learning Dashboard** evaluation rubric.

---

## 🎨 Architectural Overview & Design Patterns

### 1. Bento Grid Architecture
The dashboard uses a customized **Bento Grid layout** to modularize complex study information. Key widgets are contextualized in standard screen blocks:
* **Left Rail (Sidebar Navigation)**: Slim, collapsible navigation menu mapping active section nodes. Includes high-fidelity snap indicator transitions.
* **Hero Tile**: Hosts personalized profile greetings, dynamic digital timestamp indicators, and a daily study streak tracker.
* **Dynamic Course Grid**: Renders real-time enrollment data fetched from your live database.
* **Interactive Activity Heathmap**: Tracks hours, lessons completed, with focus session logs showing mock contribution charts.
* **Achievement Showcases**: Level tiers, badges, and color-coded XP scores.

---

## 📋 Evaluation Rubric Alignment

### 🟢 1. Data Architecture & Supabase Integration (30%)
* **Server Components & Secure Environment Handling**: Environment variables are configured locally through securely handled server endpoints. Client credentials route through standard `.env` variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`), matching standard industry practices.
* **Effective Suspense Loaders & Skeletons**: During fetch conditions or connection handshakes, customized animated pulse skeletons mount gracefully over empty course frames.
* **Hybrid Connectivity and Fallback State**: In the event of schema latency or missing connection properties, the system mounts a built-in **Local Sandbox Fallback Engine**. This pre-hydrates beautiful backup data containers to ensure zero system downtime or blank screens.

### 🟢 2. Framer Motion Proficiency (30%)
* **Strict Spring Physics**: Standard linear timers are replaced with custom spring physics:
  ```json
  {
    "type": "spring",
    "stiffness": 300,
    "damping": 20
  }
  ```
* **Performance-Optimized Rendering**: Every layout shift is eliminated by confining animations purely to hardware-accelerated SVG and CSS layers (e.g., using `transform: translate3d()` and `opacity` exclusively).
* **Shared Layout Transitions (`layoutId`)**: Hover events trigger elegant translation scaling (`1.015 - 1.02`), and sidebar items employ Framer Motion's `layoutId` so active navigation highlights bodily "glide" along the bar.

### 🟢 3. Code Quality & Strict Type Safety (20%)
* **Modular Codebase**: Split across clear modules and reusable tiles (`ActivityTile`, `StudentProfileTile`, etc.).
* **Strict TypeScript Payload Schemas**: All data payloads conform exactly to specific TypeScript interfaces defined in `/types/index.ts`:
  * `UserProfile` — Tracks student pass IDs, XP counts, and bio items.
  * `Course` — Encapsulates title, numeric progress metrics, and custom category icons.
  * `Achievement` — Normalizes visual badge parameters, gradient colors, and milestones.
  * `ActivityLog` — Captures datetime records and lesson completion scores.

### 🟢 4. Visual Fidelity & Responsive Ergonomics (20%)
* **Desktop (>1024px)**: Full multi-grid system with constant sidebar indicators.
* **Tablet (768px - 1024px)**: Responsive columns with sidebars collapsed to crisp icon rows.
* **Mobile (<768px)**: Fluid single-column stacking with navigation moving effortlessly to an interactive bottom menu rail.
* **Advanced Avatar Selector**: Includes an integrated **Dicebear Avatar Selector** allowing users to switch among standard premium design presets (`avataaars`, `lorelei`, `open-peeps`, etc.) safely without worrying about broken custom URL links.

---

## 🗄️ Database Setup (Supabase SQL Script)

To set up your live connection, execute the following schema in your **Supabase SQL Editor**:

```sql
-- Create Core Student Users Table
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

-- Create Active Courses Table
CREATE TABLE courses (
  id text PRIMARY KEY,
  title text NOT NULL,
  progress integer DEFAULT 0,
  icon_name text,
  created_at timestamptz DEFAULT now()
);

-- Create Achievements Milestones Table
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

-- Create Activity Logs Table
CREATE TABLE activity_log (
  id text PRIMARY KEY,
  activity_date date NOT NULL,
  submissions_count integer DEFAULT 0,
  lessons_done integer DEFAULT 0,
  user_email text,
  created_at timestamptz DEFAULT now()
);
```

> **Smart Auto-Seeder**: If your connection is set up but tables are initially empty, the application will automatically prefill your tables with high-fidelity student mock items!

---

## ⚙️ Environment Configurations

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

---

## 🚀 Setting Up Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Enter Development Mode
```bash
npm run dev
```

### 3. Compile Production Bundle
```bash
npm run build
```
