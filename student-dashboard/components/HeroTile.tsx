'use client';

import { motion } from 'motion/react';
import { Flame, Sparkles, BookOpen, Clock, Award } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  streak_days: number;
  total_xp: number;
}

interface HeroTileProps {
  index?: number;
  userProfile?: UserProfile;
}

export default function HeroTile({ index = 0, userProfile }: HeroTileProps) {
  const displayName = userProfile?.name ? userProfile.name.split(' ')[0] : 'Alex';
  const streakDays = userProfile?.streak_days ?? 7;
  const totalXp = userProfile?.total_xp !== undefined ? userProfile.total_xp.toLocaleString() : '1,240';

  return (
    <motion.article
      id="hero-tile"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015, y: -2 }}
      transition={{ 
        initial: { duration: 0.5, delay: index * 0.1, ease: 'easeOut' },
        whileHover: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      className="relative col-span-1 lg:col-span-2 overflow-hidden bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-[32px] p-8 shadow-[0_12px_30px_rgba(0,0,0,0.5)] group cursor-default"
    >
      {/* Dynamic Background mesh glow */}
      <div 
        id="hero-glow-layer"
        className="absolute inset-0 bg-radial-gradient from-violet-600/10 via-indigo-600/5 to-transparent pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity duration-500" 
      />

      <div className="relative z-10 flex flex-col justify-between h-full gap-6" id="hero-content">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider bg-violet-500/20 text-violet-300 rounded-full border border-violet-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Live Learning
              </span>
            </div>
            <h1 className="font-sans text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Welcome back, <span className="bg-gradient-to-r from-violet-400 via-indigo-200 to-fuchsia-300 bg-clip-text text-transparent">{displayName}!</span>
            </h1>
            <p className="text-zinc-400 mt-2 text-sm max-w-md font-sans">
              Keep pushing forward. Your skills are sharpening and you are making great progress in your software learning dashboard.
            </p>
          </div>

          <div id="hero-streak-container" className="flex-shrink-0 flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-full flex items-center gap-2 shadow-lg">
              <span className="text-lg flex items-center">🔥</span>
              <span className="font-bold text-sm text-zinc-100">{streakDays} day streak</span>
            </div>
            <div className="px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-full flex items-center gap-2 shadow-lg">
              <span className="text-lg flex items-center">🏆</span>
              <span className="font-bold text-sm text-zinc-100">{totalXp} XP</span>
            </div>
          </div>
        </div>

        {/* Mini stats row */}
        <div className="grid grid-cols-3 gap-3 border-t border-zinc-800/40 pt-6" id="hero-mini-stats">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-950/50 rounded-xl border border-zinc-800/40 text-zinc-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 font-mono">Courses</div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-200">4 Active</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-950/50 rounded-xl border border-zinc-800/40 text-zinc-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 font-mono">Time spent</div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-200">12.5 hrs</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-950/50 rounded-xl border border-zinc-800/40 text-zinc-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 font-mono">Rank</div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-200">Top 5%</div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}