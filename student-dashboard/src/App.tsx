import { useState, useEffect, FormEvent } from 'react';
import Loading from '../components/Loading';
import Sidebar from '../components/Sidebar';
import BentoGrid from '../components/BentoGrid';
import StudentProfileTile from '../components/StudentProfileTile';
import { Course, Achievement, ActivityLog, UserSettings, UserProfile } from '../types';
import { createClient } from '../lib/supabase/client';
import * as LucideIcons from 'lucide-react';
import { BookOpen, Calendar, Award, Settings, CheckCircle2, ChevronRight, Bell, Lock, User, Palette, Globe, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [courses, setCourses] = useState<Course[]>([
    { id: 'c1000000-0000-4000-a000-000000000001', title: 'Advanced React Patterns', progress: 75, icon_name: 'Code2', created_at: '' },
    { id: 'c2000000-0000-4000-a000-000000000002', title: 'Global Systems Architecture & Distribution', progress: 40, icon_name: 'Globe', created_at: '' },
    { id: 'c3000000-0000-4000-a000-000000000003', title: 'Futuristic Human Interface Design', progress: 95, icon_name: 'Palette', created_at: '' },
    { id: 'c4000000-0000-4000-a000-000000000004', title: 'High-Throughput Web Performance & Edge Computing', progress: 15, icon_name: 'Zap', created_at: '' }
  ]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>({
    id: 'd1000000-0000-4000-a000-000000000001',
    name: 'Namita Singh',
    email: 'namita1006singh@gmail.com',
    gender: 'Female',
    date_of_birth: '2002-06-10',
    phone: '+91 94672 81345',
    address: 'Delhi, India',
    admission_date: '2023-06-20',
    class_name: 'Computer Science & Engineering',
    institution: 'Indian Institute of Technology',
    student_pass_id: 'STU-2024-001',
    streak_days: 7,
    total_xp: 1240,
    bio: 'Passionate full-stack developer and lifelong learner. Love building beautiful web applications and exploring new technologies.',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Namita',
    student_id: 'STU-2024-001',
    grade_level: 'Sophomore',
    major: 'Computer Science & Engineering',
    university: 'Indian Institute of Technology',
    rank_percent: '98%',
    total_hours_learned: 42,
    courses_completed: 12,
    certificates_earned: 4,
    theme: 'dark',
    language: 'English',
    is_pro_member: true
  });
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'a1000000-0000-4000-a000-000000000001',
      title: 'React Expert',
      level: 'Level 4',
      description: 'Finished Advanced Hook patterns with A+',
      icon_name: 'Code2',
      xp_earned: 500,
      color_from: 'from-amber-500/20',
      color_to: 'to-orange-500/10',
      text_color: 'text-amber-400',
      border_color: 'border-amber-500/30',
      user_email: 'namita1006singh@gmail.com',
      created_at: ''
    },
    {
      id: 'a2000000-0000-4000-a000-000000000002',
      title: 'Framer Alchemist',
      level: 'Level 2',
      description: 'Executed 10 GPU transitions with zero reflows',
      icon_name: 'Sparkles',
      xp_earned: 300,
      color_from: 'from-indigo-500/20',
      color_to: 'to-purple-500/10',
      text_color: 'text-indigo-400',
      border_color: 'border-indigo-500/30',
      user_email: 'namita1006singh@gmail.com',
      created_at: ''
    },
    {
      id: 'a3000000-0000-4000-a000-000000000003',
      title: 'Database Architect',
      level: 'Level 3',
      description: 'Seeded Supabase PostgreSQL schemas successfully',
      icon_name: 'Database',
      xp_earned: 400,
      color_from: 'from-emerald-500/20',
      color_to: 'to-teal-500/10',
      text_color: 'text-emerald-400',
      border_color: 'border-emerald-500/30',
      user_email: 'namita1006singh@gmail.com',
      created_at: ''
    },
    {
      id: 'a4000000-0000-4000-a000-000000000004',
      title: 'Daily Runner',
      level: 'Level 5',
      description: 'Maintained 7-day progress streak',
      icon_name: 'Flame',
      xp_earned: 600,
      color_from: 'from-red-500/20',
      color_to: 'to-rose-500/10',
      text_color: 'text-red-400',
      border_color: 'border-red-500/30',
      user_email: 'namita1006singh@gmail.com',
      created_at: ''
    }
  ]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([
    {
      id: '11111111-0000-4000-a000-000000000001',
      activity_date: new Date().toISOString().split('T')[0],
      submissions_count: 4,
      lessons_done: 2,
      user_email: 'namita1006singh@gmail.com',
      created_at: ''
    }
  ]);
  const [userSettings, setUserSettings] = useState<UserSettings | null>({
    id: '51000000-0000-4000-a000-000000000001',
    user_email: 'namita1006singh@gmail.com',
    animation_speed: 'normal',
    show_streak: true,
    show_xp: true,
    streak_reminders: true,
    sound_effects: false,
    updated_at: ''
  });

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dbSyncStatus, setDbSyncStatus] = useState<'synced' | 'local'>('local');
  const [isDbEmpty, setIsDbEmpty] = useState(false);
  const [seedingStatus, setSeedingStatus] = useState<'idle' | 'seeding' | 'success' | 'error'>('idle');

  // Multi-tab router within dashboard
  const [activeTab, setActiveTab] = useState('dashboard');

  // Interactive settings state conforming to the Supabase users table schema
  const [nameVal, setNameVal] = useState('Namita Singh');
  const [bioVal, setBioVal] = useState('Passionate full-stack developer and lifelong learner. Love building beautiful web applications and exploring new technologies.');
  const [genderVal, setGenderVal] = useState('Female');
  const [dateOfBirthVal, setDateOfBirthVal] = useState('2002-06-10');
  const [phoneVal, setPhoneVal] = useState('+91 94672 81345');
  const [addressVal, setAddressVal] = useState('Delhi, India');
  const [admissionDateVal, setAdmissionDateVal] = useState('2023-06-20');
  const [classNameVal, setClassNameVal] = useState('Computer Science & Engineering');
  const [institutionVal, setInstitutionVal] = useState('Indian Institute of Technology');
  const [studentPassIdVal, setStudentPassIdVal] = useState('STU-2024-001');

  // Custom secondary UI fields
  const [avatarUrlVal, setAvatarUrlVal] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Namita');
  const [themeVal, setThemeVal] = useState('dark');
  const [languageVal, setLanguageVal] = useState('English');
  const [isProVal, setIsProVal] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const activeEmail = 'namita1006singh@gmail.com';

  const handleProfileUpdate = (updated: UserProfile) => {
    setUserProfile(updated);
  };

  const handleActivityLogged = (newLog: ActivityLog) => {
    setActivityLog(prev => [newLog, ...prev]);
  };

  useEffect(() => {
    if (userProfile) {
      setNameVal(userProfile.name || '');
      setBioVal(userProfile.bio || '');
      setGenderVal(userProfile.gender || 'Female');
      setDateOfBirthVal(userProfile.date_of_birth || '2002-06-10');
      setPhoneVal(userProfile.phone || '+91 94672 81345');
      setAddressVal(userProfile.address || 'Delhi, India');
      setAdmissionDateVal(userProfile.admission_date || '2023-06-20');
      setClassNameVal(userProfile.class_name || userProfile.major || 'Computer Science & Engineering');
      setInstitutionVal(userProfile.institution || userProfile.university || 'Indian Institute of Technology');
      setStudentPassIdVal(userProfile.student_pass_id || userProfile.student_id || 'STU-2024-001');

      setAvatarUrlVal(userProfile.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Namita');
      setThemeVal(userProfile.theme || 'dark');
      setLanguageVal(userProfile.language || 'English');
      setIsProVal(userProfile.is_pro_member || false);
    }
  }, [userProfile]);

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);
    
    try {
      const supabase = createClient();
      
      // Persist the custom avatar URL in browser local storage as fallback/complement
      localStorage.setItem(`avatar_${activeEmail}`, avatarUrlVal);
      
      // Update only the actual columns present in your CREATE TABLE users schema!
      const { error } = await supabase
        .from('users')
        .update({
          name: nameVal,
          gender: genderVal,
          date_of_birth: dateOfBirthVal || null,
          phone: phoneVal,
          address: addressVal,
          admission_date: admissionDateVal || null,
          class_name: classNameVal,
          institution: institutionVal,
          student_pass_id: studentPassIdVal,
          bio: bioVal
        })
        .eq('email', activeEmail);
        
      if (error) throw error;
      
      handleProfileUpdate({
        ...userProfile,
        id: userProfile?.id || '',
        name: nameVal,
        email: activeEmail,
        bio: bioVal,
        gender: genderVal,
        date_of_birth: dateOfBirthVal,
        phone: phoneVal,
        address: addressVal,
        admission_date: admissionDateVal,
        class_name: classNameVal,
        institution: institutionVal,
        student_pass_id: studentPassIdVal,
        
        // Map compatibility fields
        major: classNameVal,
        university: institutionVal,
        student_id: studentPassIdVal,
        avatar_url: avatarUrlVal,
        theme: themeVal,
        language: languageVal,
        is_pro_member: isProVal,
        streak_days: userProfile?.streak_days || 7,
        total_xp: userProfile?.total_xp || 1240
      });
      
      setSaveStatus({ type: 'success', message: 'Your student profile has been updated successfully.' });
      setTimeout(() => setSaveStatus(null), 3500);
    } catch (err: any) {
      console.error('Error saving settings to Supabase:', err);
      setSaveStatus({ 
        type: 'error', 
        message: `Error saving changes: ${err.message || 'Please check your connection and try again.'}` 
      });
      setTimeout(() => setSaveStatus(null), 8000);
    } finally {
      setIsSaving(false);
    }
  };

  async function fetchData() {
    setErrorMsg(null);
    setIsDbEmpty(false);
    const supabase = createClient();

    try {
      // 1. Fetch User Profile (looks for both candidate emails so either works!)
      let loadedProfile: UserProfile | null = null;
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .or(`email.eq.${activeEmail},email.eq.namita@singh.com`)
        .limit(1);

      if (userError) {
        throw new Error(`Failed to query 'users' table: ${userError.message}`);
      }

      if (userData && userData.length > 0) {
        const userObj = userData[0];
        loadedProfile = {
          id: userObj.id,
          name: userObj.name || '',
          email: userObj.email || activeEmail,
          gender: userObj.gender || '',
          date_of_birth: userObj.date_of_birth || null,
          phone: userObj.phone || '',
          address: userObj.address || '',
          admission_date: userObj.admission_date || null,
          class_name: userObj.class_name || '',
          institution: userObj.institution || '',
          student_pass_id: userObj.student_pass_id || '',
          bio: userObj.bio || '',
          streak_days: typeof userObj.streak_days === 'number' ? userObj.streak_days : 0,
          total_xp: typeof userObj.total_xp === 'number' ? userObj.total_xp : 0,
          
          // Compatibility mappings
          avatar_url: userObj.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userObj.name || 'user')}`,
          student_id: userObj.student_pass_id || userObj.student_id || '',
          grade_level: userObj.grade_level || '',
          major: userObj.class_name || userObj.major || '',
          university: userObj.institution || userObj.university || '',
          rank_percent: userObj.rank_percent || '',
          total_hours_learned: typeof userObj.total_hours_learned === 'number' ? userObj.total_hours_learned : 0,
          courses_completed: typeof userObj.courses_completed === 'number' ? userObj.courses_completed : 0,
          certificates_earned: typeof userObj.certificates_earned === 'number' ? userObj.certificates_earned : 0,
          is_pro_member: typeof userObj.is_pro_member === 'boolean' ? userObj.is_pro_member : false
        };
        setUserProfile(loadedProfile);
        setDbSyncStatus('synced');
      }

      // 2. Fetch Achievements (looks for both active email or the standard test email)
      const achResult = await supabase
        .from('achievements')
        .select('*')
        .or(`user_email.eq.${activeEmail},user_email.eq.namita@singh.com`);

      if (achResult.error) {
        throw new Error(`Failed to query 'achievements' table: ${achResult.error.message}`);
      }
      if (achResult.data && achResult.data.length > 0) {
        setAchievements(achResult.data as Achievement[]);
      }

      // 3. Fetch Activity Log
      const actResult = await supabase
        .from('activity_log')
        .select('*')
        .or(`user_email.eq.${activeEmail},user_email.eq.namita@singh.com`)
        .order('activity_date', { ascending: true });

      if (actResult.error) {
        throw new Error(`Failed to query 'activity_log' table: ${actResult.error.message}`);
      }
      if (actResult.data && actResult.data.length > 0) {
        setActivityLog(actResult.data as ActivityLog[]);
      }

      // 4. Fetch User Settings
      const setResult = await supabase
        .from('user_settings')
        .select('*')
        .or(`user_email.eq.${activeEmail},user_email.eq.namita@singh.com`)
        .limit(1);

      if (setResult.error) {
        throw new Error(`Failed to query 'user_settings' table: ${setResult.error.message}`);
      }
      
      if (setResult.data && setResult.data.length > 0) {
        setUserSettings(setResult.data[0] as UserSettings);
      }

      // 5. Fetch Courses
      const queryResult = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true });

      if (queryResult.error) {
        throw new Error(`Failed to query 'courses' table: ${queryResult.error.message}`);
      }

      const coursesData = queryResult.data as Course[];
      if (coursesData && coursesData.length > 0) {
        setCourses(coursesData);
      }

      if (loadedProfile) {
        setDbSyncStatus('synced');
      }

    } catch (err: any) {
      console.warn('Unable to query database, loading offline data container:', err.message);
      setDbSyncStatus('local');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedAvatar = localStorage.getItem(`avatar_${activeEmail}`);
    if (savedAvatar) {
      setUserProfile(prev => prev ? { ...prev, avatar_url: savedAvatar } : null);
      setAvatarUrlVal(savedAvatar);
    }
    fetchData();
  }, []);

  const handleSeedDatabase = async () => {
    setSeedingStatus('seeding');
    const supabase = createClient();

    try {
      // Seed user profile
      const { error: userErr } = await supabase
        .from('users')
        .insert([
          {
            id: 'd1000000-0000-4000-a000-000000000001',
            name: 'Namita Singh',
            email: activeEmail,
            gender: 'Female',
            date_of_birth: '2002-06-10',
            phone: '+91 94672 81345',
            address: 'Delhi, India',
            admission_date: '2023-06-20',
            class_name: 'Computer Science & Engineering',
            institution: 'Indian Institute of Technology',
            student_pass_id: 'STU-2024-001',
            streak_days: 7,
            total_xp: 1240,
            bio: 'Passionate full-stack developer and lifelong learner. Love building beautiful web applications and exploring new technologies.'
          }
        ]);

      if (userErr && !userErr.message.includes('duplicate key')) {
        throw new Error(`User seeding error: ${userErr.message}`);
      }

      // Seed courses
      const { error: courseErr } = await supabase
        .from('courses')
        .insert([
          { id: 'c1000000-0000-4000-a000-000000000001', title: 'Advanced React Patterns', progress: 75, icon_name: 'Code2' },
          { id: 'c2000000-0000-4000-a000-000000000002', title: 'Global Systems Architecture & Distribution', progress: 40, icon_name: 'Globe' },
          { id: 'c3000000-0000-4000-a000-000000000003', title: 'Futuristic Human Interface Design', progress: 95, icon_name: 'Palette' },
          { id: 'c4000000-0000-4000-a000-000000000004', title: 'High-Throughput Web Performance & Edge Computing', progress: 15, icon_name: 'Zap' }
        ]);

      if (courseErr && !courseErr.message.includes('duplicate key')) {
        throw new Error(`Course seeding error: ${courseErr.message}`);
      }

      // Seed achievements
      const { error: achErr } = await supabase
        .from('achievements')
        .insert([
          {
            id: 'a1000000-0000-4000-a000-000000000001',
            title: 'React Expert',
            level: 'Level 4',
            description: 'Finished Advanced Hook patterns with A+',
            icon_name: 'Code2',
            xp_earned: 500,
            color_from: 'from-amber-500/20',
            color_to: 'to-orange-500/10',
            text_color: 'text-amber-400',
            border_color: 'border-amber-500/30',
            user_email: activeEmail
          },
          {
            id: 'a2000000-0000-4000-a000-000000000002',
            title: 'Framer Alchemist',
            level: 'Level 2',
            description: 'Executed 10 GPU transitions with zero reflows',
            icon_name: 'Sparkles',
            xp_earned: 300,
            color_from: 'from-indigo-500/20',
            color_to: 'to-purple-500/10',
            text_color: 'text-indigo-400',
            border_color: 'border-indigo-500/30',
            user_email: activeEmail
          },
          {
            id: 'a3000000-0000-4000-a000-000000000003',
            title: 'Database Architect',
            level: 'Level 3',
            description: 'Seeded Supabase PostgreSQL schemas successfully',
            icon_name: 'Database',
            xp_earned: 400,
            color_from: 'from-emerald-500/20',
            color_to: 'to-teal-500/10',
            text_color: 'text-emerald-400',
            border_color: 'border-emerald-500/30',
            user_email: activeEmail
          }
        ]);

      if (achErr && !achErr.message.includes('duplicate key')) {
        throw new Error(`Achievement seeding error: ${achErr.message}`);
      }

      // Seed activity log
      const { error: actErr } = await supabase
        .from('activity_log')
        .insert([
          {
            id: '11111111-0000-4000-a000-000000000001',
            activity_date: new Date().toISOString().split('T')[0],
            submissions_count: 4,
            lessons_done: 2,
            user_email: activeEmail
          }
        ]);

      if (actErr && !actErr.message.includes('duplicate key')) {
        throw new Error(`Activity log seeding error: ${actErr.message}`);
      }

      // Seed user settings
      const { error: setErr } = await supabase
        .from('user_settings')
        .insert([
          {
            id: '51000000-0000-4000-a000-000000000001',
            user_email: activeEmail,
            animation_speed: 'normal',
            show_streak: true,
            show_xp: true,
            streak_reminders: true,
            sound_effects: false
          }
        ]);

      if (setErr && !setErr.message.includes('duplicate key')) {
        throw new Error(`User settings seeding error: ${setErr.message}`);
      }

      setSeedingStatus('success');
      // Re-trigger reload from Supabase
      setLoading(true);
      setTimeout(() => {
        fetchData();
      }, 500);

    } catch (err: any) {
      console.error('Error auto-seeding Supabase database:', err);
      setSeedingStatus('error');
      alert(`Seeding failed: ${err.message || 'Make sure your tables are created.'}`);
    }
  };

  if (loading) {
    return <Loading />;
  }

  // Error view (likely missing schemas or connection issues)
  if (errorMsg) {
    return (
      <main className="min-h-screen bg-black text-white p-6 md:p-12 flex flex-col justify-center items-center text-center space-y-8" id="error-boundaries">
        <div className="max-w-2xl bg-zinc-950 border border-zinc-805 p-8 rounded-[36px] space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-500/10 text-red-500 rounded-full border border-red-500/20 flex items-center justify-center font-bold text-2xl font-mono">
            !
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black font-sans text-neutral-100">Database Connection Needed</h1>
            <p className="text-zinc-400 text-xs font-sans leading-relaxed">
              We couldn't read your Supabase project tables. This error typically occurs when the schema tables are missing, or Row Level Security (RLS) is blocking access.
            </p>
            <div className="bg-red-950/20 border border-red-900/30 text-red-400 font-mono text-[11px] p-3 rounded-xl select-all">
              {errorMsg}
            </div>
          </div>

          <div className="border-t border-zinc-900/80 pt-6 text-left space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">Run this schema inside your Supabase SQL Editor:</h3>
            <pre className="text-[10px] text-zinc-300 bg-zinc-90 w-full p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors max-h-60 overflow-y-auto font-mono select-all text-left leading-relaxed">
{`CREATE TABLE users (
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
  total_xp integer DEFAULT 0
);

CREATE TABLE courses (
  id text PRIMARY KEY,
  title text NOT NULL,
  progress integer DEFAULT 0,
  icon_name text,
  created_at timestamptz DEFAULT now()
);

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

CREATE TABLE activity_log (
  id text PRIMARY KEY,
  activity_date date NOT NULL,
  submissions_count integer DEFAULT 0,
  lessons_done integer DEFAULT 0,
  user_email text,
  created_at timestamptz DEFAULT now()
);

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

-- Click "Disable RLS" or write SELECT policies to allow the web client to read them:
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings DISABLE ROW LEVEL SECURITY;`}
            </pre>
            <div className="flex justify-center pt-4">
              <button 
                onClick={() => { setLoading(true); fetchData(); }}
                className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                🔄 Retry Connection
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }



  // Pure data fetched directly from Supabase rendering on dashboard
  return (
    <div className="flex min-h-screen bg-[#09090b] text-zinc-100" id="dashboard-layout-root">
      {/* Sidebar: Left Navigation Section */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userProfile={userProfile || undefined} />

      {/* Main Dashboard Panel */}
      <main className="flex-1 min-h-screen p-4 md:p-10 lg:p-12 overflow-y-auto space-y-8 pb-24 md:pb-12" id="main-content-flow">
        {/* Header Ribbon bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-6" id="dashboard-header-bar">
          <div className="space-y-1">
            <h2 className="font-sans text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'courses' && 'Active Registrations'}
              {activeTab === 'activity' && 'Focused Activity Logs'}
              {activeTab === 'achievements' && 'Earned Badges & Ribbons'}
              {activeTab === 'settings' && 'User Settings'}
            </h2>
            <p className="text-xs text-zinc-500 font-sans">
              {activeTab === 'dashboard' && 'Monitor your progress modules and submission metrics.'}
              {activeTab === 'courses' && 'Review your syllabus progression and complete assignments.'}
              {activeTab === 'activity' && 'Explore active learning spans and study trends.'}
              {activeTab === 'achievements' && 'Review milestones achieved during your software modules.'}
              {activeTab === 'settings' && 'Manage security credentials, profiles, development keys.'}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap" id="header-interactive-actions">
            <span className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-xl font-mono">
              UTC: 2026-05-30
            </span>
          </div>
        </header>

        {/* Tab Router Switch */}
        <div id="tab-router-container" className="pt-2">
          {activeTab === 'dashboard' && (
            <BentoGrid 
              courses={courses} 
              userProfile={userProfile || undefined} 
              activityLog={activityLog} 
              onProfileUpdate={handleProfileUpdate}
              onActivityLogged={handleActivityLogged}
            />
          )}

          {activeTab === 'courses' && (
            <motion.section 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
              id="courses-tab-view"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, idx) => (
                  <div 
                    key={course.id} 
                    className="p-6 bg-zinc-900 border border-zinc-805 rounded-[32px] hover:border-indigo-500/50 transition-all flex flex-col justify-between h-56"
                    id={`courses-list-${course.id}`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="p-2 bg-zinc-950 rounded-xl text-indigo-400 border border-zinc-800 text-xs font-mono">
                          Module {idx + 1}
                        </span>
                        {course.progress === 100 && (
                          <span className="text-emerald-400 text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Passed
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-neutral-100">{course.title}</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-neutral-500 font-mono">
                        <span>XP Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === 'activity' && (
            <motion.section 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-zinc-900 border border-zinc-800 rounded-[32px] space-y-6 max-w-4xl mx-auto"
              id="activity-tab-view"
            >
              <h3 className="text-xl font-bold text-white mb-2">Focused Contribution Matrices</h3>
              <p className="text-sm text-neutral-400">
                Hourly focus metrics captured by the cloud monitor compile. Learn duration targets are set at 2 hours a day.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-2xl">
                  <span className="text-[10px] text-zinc-500 block">WEEKLY FOCUS</span>
                  <span className="text-2xl font-black text-indigo-400">18.4 hrs</span>
                </div>
                <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-2xl">
                  <span className="text-[10px] text-zinc-500 block">AVG GRADE</span>
                  <span className="text-2xl font-black text-indigo-400">92% A+</span>
                </div>
                <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-2xl">
                  <span className="text-[10px] text-zinc-500 block">MILESTONES</span>
                  <span className="text-2xl font-black text-indigo-400">12 Badges</span>
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === 'achievements' && (
            <motion.section 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              id="achievements-tab-view"
            >
              {(achievements || []).map((ach, idx) => {
                const IconComponent = (LucideIcons as any)[ach.icon_name] || Award;
                return (
                  <div 
                    key={ach.id || idx} 
                    className={`p-6 bg-gradient-to-br ${ach.color_from || 'from-amber-500/20'} ${ach.color_to || 'to-orange-500/10'} ${ach.text_color || 'text-amber-400'} ${ach.border_color || 'border-amber-500/30'} border rounded-[32px] space-y-4 shadow-xl`} 
                    id={`achievement-badge-${idx}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-zinc-950/60 rounded-lg">{ach.level}</span>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-zinc-100">{ach.title}</h4>
                      <p className="text-xs text-zinc-400 mt-2 font-sans">{ach.description}</p>
                      {ach.xp_earned && (
                        <div className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-zinc-400 bg-black/30 border border-white/5 py-0.5 px-2 rounded font-mono">
                          🏆 {ach.xp_earned} XP
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.section>
          )}

          {activeTab === 'profile' && (
            <motion.section 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto space-y-6"
              id="profile-tab-view"
            >
              <StudentProfileTile userProfile={userProfile || undefined} />
            </motion.section>
          )}

          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="max-w-4xl mx-auto space-y-6 animate-fade-in" id="settings-tab-view">
              
              {/* Header Status notifier if saved */}
              <AnimatePresence>
                {saveStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
                      saveStatus.type === 'success' 
                        ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 font-sans' 
                        : 'bg-red-500/10 border-red-500/25 text-red-400 font-sans'
                    }`}
                    id="settings-save-alert"
                  >
                    <span className="flex items-center gap-2">
                       ✓ {saveStatus.message}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Section 1: Personal Dossier Info */}
              <motion.section
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-zinc-950 border border-zinc-800 rounded-[28px] p-6 space-y-4 shadow-xl"
                id="settings-section-personal"
              >
                <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
                  <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/10 text-indigo-400 font-bold">
                    <User size={18} />
                  </div>
                  <h3 className="font-extrabold text-white text-md">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-1" id="settings-name-field">
                    <label className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={nameVal} 
                      onChange={(e) => setNameVal(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-colors font-sans"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-1" id="settings-email-field">
                    <label className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">Email Address (Read-only)</label>
                    <input 
                      type="email" 
                      disabled
                      value={userProfile?.email || 'namita@singh.com'} 
                      className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-zinc-500 cursor-not-allowed select-none font-sans"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-1" id="settings-gender-field">
                    <label className="text-[11px] font-mono font-bold text-zinc-550 uppercase tracking-wider block">Gender</label>
                    <select 
                      value={genderVal} 
                      onChange={(e) => setGenderVal(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-colors font-sans"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 col-span-1" id="settings-dob-field">
                    <label className="text-[11px] font-mono font-bold text-zinc-550 uppercase tracking-wider block">Date of Birth</label>
                    <input 
                      type="date" 
                      value={dateOfBirthVal || ''} 
                      onChange={(e) => setDateOfBirthVal(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-colors font-sans"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-1" id="settings-phone-field">
                    <label className="text-[11px] font-mono font-bold text-zinc-550 uppercase tracking-wider block">Phone Number</label>
                    <input 
                      type="text" 
                      value={phoneVal} 
                      onChange={(e) => setPhoneVal(e.target.value)}
                      placeholder="+91 94672 81345"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-colors font-sans"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-1" id="settings-address-field">
                    <label className="text-[11px] font-mono font-bold text-zinc-550 uppercase tracking-wider block">Residential Address</label>
                    <input 
                      type="text" 
                      value={addressVal} 
                      onChange={(e) => setAddressVal(e.target.value)}
                      placeholder="Delhi, India"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-colors font-sans"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2" id="settings-avatar-field">
                    <label className="text-[11px] font-mono font-bold text-zinc-550 uppercase tracking-wider block">Profile Avatar Image</label>
                    <input 
                      type="url" 
                      value={avatarUrlVal} 
                      onChange={(e) => setAvatarUrlVal(e.target.value)}
                      placeholder="https://api.dicebear.com/7.x/..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-colors font-mono"
                    />
                    <div className="text-[11px] text-zinc-400 bg-zinc-950/85 border border-zinc-900 p-3 rounded-xl mt-1.5 leading-relaxed font-sans space-y-2">
                      <span className="text-zinc-300 font-bold block">Quick Presets:</span>
                      <p className="text-[10px] text-zinc-500">
                        Choose from these premium design templates or paste any valid public image link:
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['avataaars', 'lorelei', 'bottts', 'pixel-art', 'open-peeps', 'adventurer', 'personas'].map(style => (
                          <button
                            type="button"
                            key={style}
                            onClick={() => setAvatarUrlVal(`https://api.dicebear.com/9.x/${style}/svg?seed=Felix`)}
                            className="text-[9px] font-mono bg-zinc-900 hover:bg-zinc-800 hover:text-indigo-400 border border-zinc-800 text-zinc-300 px-2 py-1 rounded cursor-pointer transition-all"
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 col-span-2" id="settings-bio-field">
                    <label className="text-[11px] font-mono font-bold text-zinc-550 uppercase tracking-wider block">Biography / Bio</label>
                    <textarea 
                      rows={3}
                      value={bioVal} 
                      onChange={(e) => setBioVal(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:border-indigo-500 focus:outline-none transition-colors resize-none leading-relaxed font-sans"
                    />
                  </div>
                </div>
              </motion.section>

              {/* Submit Action Bar */}
              <div className="flex items-center justify-between p-5 bg-zinc-950 border border-zinc-850 rounded-[24px] flex-wrap gap-4 shadow-md" id="settings-action-bar">
                <span className="text-xs text-zinc-500 italic font-medium font-sans">Any modifications are instantly saved to your student profile securely.</span>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white font-sans text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  {isSaving ? 'Syncing...' : 'Save Settings'}
                </button>
              </div>

            </form>
          )}
        </div>
      </main>
    </div>
  );
}
