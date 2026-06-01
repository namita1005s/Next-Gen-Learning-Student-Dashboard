'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, Calendar, CheckSquare, Plus, Clock, BookOpen, AlertCircle, Sparkles, Check
} from 'lucide-react';
import { ActivityLog, UserProfile } from '../types';
import { createClient } from '../lib/supabase/client';

interface ActivityTileProps {
  index?: number;
  activityLog?: ActivityLog[];
  userProfile?: UserProfile;
  onProfileUpdate?: (updated: UserProfile) => void;
  onActivityLogged?: (newLog: ActivityLog) => void;
}

interface GeneratedDay {
  date: string;
  count: number;
  dayIndex: number;
  formattedDate: string;
}

// Simple deterministic hash to seed the background contributions realistically
const hashIntVal = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

export default function ActivityTile({ 
  index = 0, 
  activityLog = [], 
  userProfile,
  onProfileUpdate,
  onActivityLogged
}: ActivityTileProps) {
  const [hoveredDay, setHoveredDay] = useState<{ week: number; day: number; data: GeneratedDay } | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  const [lessonsDone, setLessonsDone] = useState(2);
  const [hoursFocused, setHoursFocused] = useState(1.5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isLightTheme = userProfile?.theme === 'light';

  // 1. Build weeks matrix dynamically (53 weeks, ending June 6, 2026; starting June 1, 2025)
  const startSunday = new Date('2025-06-01');
  const weeks: GeneratedDay[][] = [];

  // Parse custom user activity log from Supabase
  const logMap = new Map<string, number>();
  if (activityLog && activityLog.length > 0) {
    activityLog.forEach(log => {
      if (log.activity_date) {
        const dStr = log.activity_date.substring(0, 10); // "YYYY-MM-DD"
        logMap.set(dStr, (logMap.get(dStr) || 0) + (log.lessons_done || 0));
      }
    });
  }

  const monthNamesAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let wk = 0; wk < 53; wk++) {
    const weekDays: GeneratedDay[] = [];
    for (let dy = 0; dy < 7; dy++) {
      const dayOffset = (wk * 7) + dy;
      const currentDay = new Date(startSunday.getTime() + dayOffset * 24 * 60 * 60 * 1000);
      
      const yyyy = currentDay.getFullYear();
      const mm = String(currentDay.getMonth() + 1).padStart(2, '0');
      const dd = String(currentDay.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      
      const mName = monthNamesAbbr[currentDay.getMonth()];
      const formattedDate = `${mName} ${dd}, ${yyyy}`;
      
      let count = logMap.get(dateStr) || 0;
      
      // Seed deterministic green cells if no custom user logged event
      if (!logMap.has(dateStr)) {
        const hash = hashIntVal(dateStr);
        const rolled = hash % 100;
        if (rolled < 2) {
          count = 4;
        } else if (rolled < 6) {
          count = 3;
        } else if (rolled < 13) {
          count = 2;
        } else if (rolled < 23) {
          count = 1;
        } else {
          count = 0;
        }
      }
      
      weekDays.push({
        date: dateStr,
        count,
        dayIndex: dy,
        formattedDate
      });
    }
    weeks.push(weekDays);
  }

  // Find when months change column index to position labels above
  const columnsWithMonthLabels: { [key: number]: string } = {};
  let lastMonth = -1;
  let lastLabelWeekIndex = -999;
  for (let wk = 0; wk < 53; wk++) {
    const SunDay = new Date(startSunday.getTime() + wk * 7 * 24 * 60 * 60 * 1000);
    const mIdx = SunDay.getMonth();
    if (mIdx !== lastMonth && (wk - lastLabelWeekIndex >= 3)) {
      columnsWithMonthLabels[wk] = monthNamesAbbr[mIdx];
      lastMonth = mIdx;
      lastLabelWeekIndex = wk;
    }
  }

  // Count total logged or seeded lessons in the matrix
  let totalLessons = 0;
  weeks.forEach(week => {
    week.forEach(day => {
      totalLessons += day.count;
    });
  });

  // Purple HEX #915EFF intensity scales
  const getDotIntensityClass = (count: number) => {
    if (isLightTheme) {
      if (count <= 0) return 'bg-[#ebedf0]/90 border border-gray-150 hover:bg-neutral-200';
      if (count === 1) return 'bg-[#ebd9ff] border border-transparent';
      if (count === 2) return 'bg-[#c899ff] border border-transparent';
      if (count === 3) return 'bg-[#915eff] border border-transparent';
      return 'bg-[#5d17db] border border-transparent';
    } else {
      if (count <= 0) return 'bg-[#161b22] border border-[#272b33]/40 hover:bg-[#1a1f26]';
      if (count === 1) return 'bg-[#29174f] border border-transparent';
      if (count === 2) return 'bg-[#512c9c] border border-transparent';
      if (count === 3) return 'bg-[#915eff] border border-transparent';
      return 'bg-[#ad87ff] border border-transparent';
    }
  };

  // Log focus session
  const handleLogFocusSession = async () => {
    setIsSubmitting(true);
    setNotification(null);

    const email = userProfile?.email || 'namita@singh.com';
    const computedXpGained = lessonsDone * 100;
    
    try {
      const supabase = createClient();
      const todayStr = '2026-05-31';

      // 1. Log into Supabase activity_log
      const { data: logData, error: logError } = await supabase
        .from('activity_log')
        .insert({
          user_email: email,
          activity_date: todayStr,
          lessons_done: lessonsDone,
          submissions_count: lessonsDone,
        })
        .select();

      if (logError) throw logError;

      // 2. Load latest user row from Supabase
      const { data: userRows, error: fetchErr } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .limit(1);

      let updatedProfile: UserProfile | null = null;

      if (!fetchErr && userRows && userRows.length > 0) {
        const userRow = userRows[0];
        
        const nextXp = (userRow.total_xp || 0) + computedXpGained;
        const nextHours = Number(userRow.total_hours_learned || 0) + hoursFocused;
        const nextCompleted = (userRow.courses_completed || 0) + 1;
        const newStreak = (userRow.streak_days || 0) + 1;

        const { error: saveErr } = await supabase
          .from('users')
          .update({
            total_xp: nextXp,
            total_hours_learned: nextHours,
            courses_completed: nextCompleted,
            streak_days: newStreak,
            last_login: new Date().toISOString()
          })
          .eq('email', email);

        if (!saveErr) {
          updatedProfile = {
            ...userProfile,
            id: userRow.id,
            name: userRow.name || 'Namita Singh',
            email: email,
            avatar_url: userRow.avatar_url,
            bio: userRow.bio,
            student_id: userRow.student_id,
            grade_level: userRow.grade_level,
            major: userRow.major,
            university: userRow.university,
            total_xp: nextXp,
            total_hours_learned: nextHours,
            courses_completed: nextCompleted,
            streak_days: newStreak,
            rank_percent: userRow.rank_percent || 'Top 5%',
            certificates_earned: userRow.certificates_earned || 2,
            is_pro_member: userRow.is_pro_member
          };
        }
      }

      if (onActivityLogged && logData && logData.length > 0) {
        onActivityLogged(logData[0] as ActivityLog);
      }
      if (onProfileUpdate && updatedProfile) {
        onProfileUpdate(updatedProfile);
      }

      setNotification({
        type: 'success',
        message: `Registered! +${computedXpGained} XP & +${hoursFocused} study hours synced to profile.`
      });

      setTimeout(() => {
        setIsLogging(false);
        setNotification(null);
      }, 3500);

    } catch (err: any) {
      console.error('Error logging focus session to Supabase:', err);
      // Fallback
      const fallbackLogged: ActivityLog = {
        id: Math.random().toString(),
        activity_date: '2026-05-31',
        lessons_done: lessonsDone,
        submissions_count: lessonsDone,
        user_email: email,
        created_at: new Date().toISOString()
      };

      if (onActivityLogged) onActivityLogged(fallbackLogged);
      if (onProfileUpdate && userProfile) {
        onProfileUpdate({
          ...userProfile,
          total_xp: userProfile.total_xp + computedXpGained,
          total_hours_learned: (userProfile.total_hours_learned || 0) + hoursFocused,
          streak_days: userProfile.streak_days + 1
        });
      }

      setNotification({
        type: 'success',
        message: `Simulation registered! +${computedXpGained} XP logged locally during development.`
      });

      setTimeout(() => {
        setIsLogging(false);
        setNotification(null);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.article
      id="activity-tile"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative col-span-1 lg:col-span-4 overflow-hidden rounded-[32px] p-8 shadow-[0_24px_50px_rgba(0,0,0,0.8)] group cursor-default ${
        isLightTheme 
          ? 'bg-white border border-zinc-200 shadow-[0_12px_40px_rgba(0,0,0,0.04)] text-zinc-900' 
          : 'bg-zinc-950 border border-zinc-800 text-zinc-100'
      }`}
    >
      {/* Glow effect only in Dark mode */}
      {!isLightTheme && (
        <div 
          id="activity-glow-radial"
          className="absolute inset-0 bg-radial-gradient from-[#915eff]/5 via-[#915eff]/0 to-transparent pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity duration-500" 
        />
      )}

      <div className="relative z-10 flex flex-col gap-6" id="activity-inner-workflow">
        {/* Header Ribbon */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5 ${
          isLightTheme ? 'border-zinc-200' : 'border-zinc-900'
        }`} id="activity-header">
          <div>
            <h3 className="font-sans text-lg font-black tracking-wide flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#915eff] shrink-0" /> Focus Activity Matrix
            </h3>
            <p className={`text-xs mt-0.5 font-sans ${isLightTheme ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Visualize yearly focused iterations and knowledge integrations.
            </p>
          </div>

          <div className="flex items-center gap-2" id="activity-cta-actions">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-mono ${
              isLightTheme ? 'bg-zinc-50 border-zinc-200 text-zinc-600' : 'bg-zinc-900 border-[#915eff]/10 text-zinc-400'
            }`}>
              <TrendingUp className="w-3.5 h-3.5 text-[#915eff] shrink-0" /> Year-Long Matrix
            </div>
          </div>
        </div>

        {/* Heatmap Section */}
        <div className="flex flex-col space-y-4" id="heatmap-section-wrapper">
          
          {/* Outer scroll area for the 53 columns matrix */}
          <div className="w-full overflow-x-auto pb-4 scrollbar-none" id="matrix-scroll-wrapper">
            <div className="min-w-[760px] pb-1 space-y-1.5" id="matrix-scroll-interior">
              
              {/* 1. Month Names header aligned with week columns */}
              <div className="flex gap-[3px] pl-[34px] text-[10px] font-sans font-semibold text-zinc-500 h-4 relative select-none">
                {Array.from({ length: 53 }).map((_, colIdx) => {
                  const label = columnsWithMonthLabels[colIdx];
                  return (
                    <div key={colIdx} className="w-[11px] shrink-0 text-left relative">
                      {label && (
                        <span className="absolute left-0 bottom-0 whitespace-nowrap text-[10px] font-sans text-zinc-500">
                          {label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 2. Grid with day index labels and 7-cell vertical week columns */}
              <div className="flex gap-[3px]">
                {/* Mon, Wed, Fri Day Names labels spaced to match cells height */}
                <div className="flex flex-col gap-[3px] w-[31px] shrink-0 text-left select-none text-[10px] font-sans text-zinc-500">
                  <div className="h-[11px] leading-[11px] text-transparent">Sun</div>
                  <div className="h-[11px] leading-[11px] font-sans text-zinc-500">Mon</div>
                  <div className="h-[11px] leading-[11px] text-transparent">Tue</div>
                  <div className="h-[11px] leading-[11px] font-sans text-zinc-500">Wed</div>
                  <div className="h-[11px] leading-[11px] text-transparent">Thu</div>
                  <div className="h-[11px] leading-[11px] font-sans text-zinc-500">Fri</div>
                  <div className="h-[11px] leading-[11px] text-transparent">Sat</div>
                </div>

                {/* 53 Columns of Weeks */}
                <div className="flex gap-[3px] flex-1">
                  {weeks.map((week, wkIdx) => (
                    <div key={wkIdx} className="flex flex-col gap-[3px]" id={`week-col-${wkIdx}`}>
                      {week.map((day, dyIdx) => (
                        <div key={dyIdx} className="relative shrink-0">
                          <button
                            onMouseEnter={() => setHoveredDay({ week: wkIdx, day: dyIdx, data: day })}
                            onMouseLeave={() => setHoveredDay(null)}
                            id={`dot-${wkIdx}-${dyIdx}`}
                            aria-label={`Syllabus logs: ${day.count} contributions on ${day.formattedDate}`}
                            className={`w-[11px] h-[11px] rounded-[1.5px] transition-all duration-150 cursor-pointer ${getDotIntensityClass(day.count)}`}
                          />

                          {/* Hover Tooltip Popup */}
                          <AnimatePresence>
                            {hoveredDay?.week === wkIdx && hoveredDay?.day === dyIdx && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 3 }}
                                className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-30 border p-2 px-3 rounded-lg shadow-xl pointer-events-none whitespace-nowrap text-center text-[11px] font-sans font-semibold leading-relaxed ${
                                  isLightTheme 
                                    ? 'bg-white border-zinc-200 text-zinc-800' 
                                    : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                                }`}
                                id="heatmap-tooltip-panel"
                              >
                                <div className="text-[10px] text-zinc-500 font-mono tracking-tight">{day.formattedDate}</div>
                                <div className="font-sans mt-0.5">
                                  {day.count === 0 ? 'No contributions' : `${day.count} contributions`}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* 3. Bottom Row: Learn-more link & the exact GitHub spectrum legend */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 font-sans gap-3 pt-3 border-t border-zinc-900/10">
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("This shows registered daily learning sprints. Lessons done, syllabus subtasks, and study hours are aggregated dynamically into your daily academic matrix.");
              }}
              className="hover:text-[#915eff] hover:underline transition-colors cursor-pointer text-zinc-500 text-[11px] font-sans"
            >
              Learn how we count contributions
            </a>
            <div className="flex items-center gap-1.5" id="legend-swatches">
              <span className="text-zinc-500 text-[10px] font-sans font-medium pr-1 select-none">Less</span>
              <div className={`w-[11px] h-[11px] rounded-[1.5px] ${getDotIntensityClass(0)}`} />
              <div className={`w-[11px] h-[11px] rounded-[1.5px] ${getDotIntensityClass(1)}`} />
              <div className={`w-[11px] h-[11px] rounded-[1.5px] ${getDotIntensityClass(2)}`} />
              <div className={`w-[11px] h-[11px] rounded-[1.5px] ${getDotIntensityClass(3)}`} />
              <div className={`w-[11px] h-[11px] rounded-[1.5px] ${getDotIntensityClass(4)}`} />
              <span className="text-zinc-500 text-[10px] font-sans font-medium pl-1 select-none">More</span>
            </div>
          </div>

        </div>

      </div>
    </motion.article>
  );
}
