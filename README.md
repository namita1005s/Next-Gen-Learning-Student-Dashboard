# 🚀 Next-Gen Learning Student Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.x-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Supabase-Database-3ecf8e?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Framer_Motion-12.x-ff007f?logo=framer" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwind-css" alt="Tailwind CSS" />
</p>

## 🌐 Live Demo
[https://next-gen-learning-student-dashboard-seven.vercel.app](https://next-gen-learning-student-dashboard-seven.vercel.app)

---

## 📖 About

A modern student dashboard with Bento Grid layout, live Supabase data fetching, and smooth Framer Motion animations.

**Features:**
- Dark mode Bento Grid dashboard
- Collapsible sidebar with layoutId animations
- Live course data from Supabase
- Animated progress bars
- Activity heatmap
- Achievements & Settings tabs
- Fully responsive

# 🚀 Getting Started

Follow these steps to set up the project locally.

## Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/next-gen-learning-student-dashboard.git
cd next-gen-learning-student-dashboard
npm install
```

## Step 2: Create Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in:

**Supabase Dashboard → Project Settings → API**

## Step 3: Run the Development Server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

The dashboard will automatically reload whenever you make changes.

---

## 📂 Project Structure

```text
src/
├── app/
├── components/
├── lib/
├── hooks/
├── types/
└── utils/
```

---

## ✨ Key Features

* Modern Bento Grid Dashboard UI
* Smooth Framer Motion Animations
* Supabase Database Integration
* Dark Theme Interface
* Responsive Design
* Progress Tracking System
* Achievement Management
* Activity Heatmap Visualization
* User Settings Panel

---

## 🚀 Deployment

The easiest way to deploy this project is using Vercel.

```bash
npm run build
```

Then deploy your repository to Vercel and add the same environment variables used in `.env.local`.

---

## 👩‍💻 Author

**Namita Singh**

* GitHub: @namita1005s
* MCA Student | Full Stack & Data Science Enthusiast

---

## 📜 License

This project is created for learning and portfolio purposes.

---

<p align="center">
  Built with ❤️ using Next.js, Supabase & Framer Motion
</p>

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Supabase | Database |
| Lucide React | Icons |

---

## 🗄️ Database Setup

Run in Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  streak_days INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (name, email, streak_days, total_xp) VALUES
  ('Namita Singh', 'namita@singh.com', 7, 1240);

-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  icon_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO courses (title, progress, icon_name) VALUES
  ('Data Science', 45, 'BarChart3'),
  ('Backend Development (JAVA)', 30, 'Server'),
  ('Full Stack Development', 25, 'Code2'),
  ('Advanced React Patterns', 75, 'Globe');

-- Achievements table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  level TEXT NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  user_email TEXT REFERENCES users(email),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Activity log table
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_date DATE NOT NULL,
  submissions_count INTEGER DEFAULT 0,
  lessons_done INTEGER DEFAULT 0,
  user_email TEXT REFERENCES users(email),
  created_at TIMESTAMP DEFAULT NOW()
);

-- User settings table
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT UNIQUE REFERENCES users(email),
  animation_speed TEXT DEFAULT 'normal',
  show_streak BOOLEAN DEFAULT true,
  show_xp BOOLEAN DEFAULT true,
  updated_at TIMESTAMP DEFAULT NOW()
);

# 🚀 Getting Started

Follow these steps to set up the project locally.

## Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/next-gen-learning-student-dashboard.git
cd next-gen-learning-student-dashboard
npm install
```

## Step 2: Create Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in:

**Supabase Dashboard → Project Settings → API**

## Step 3: Run the Development Server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

The dashboard will automatically reload whenever you make changes.

---

## 📂 Project Structure

```text
src/
├── app/
├── components/
├── lib/
├── hooks/
├── types/
└── utils/
```

---

## ✨ Key Features

* Modern Bento Grid Dashboard UI
* Smooth Framer Motion Animations
* Supabase Database Integration
* Dark Theme Interface
* Responsive Design
* Progress Tracking System
* Achievement Management
* Activity Heatmap Visualization
* User Settings Panel

---

## 🚀 Deployment

The easiest way to deploy this project is using Vercel.

```bash
npm run build
```

Then deploy your repository to Vercel and add the same environment variables used in `.env.local`.

---

## 👩‍💻 Author

**Namita Singh**


* MCA Student | Full Stack Enthusiast

---

## 📜 License

This project is created for Internship purposes.

---

<p align="center">
  Built with ❤️ using Next.js, Supabase & Framer Motion
</p>

