'use client';

import { motion } from 'motion/react';
import { User, Mail, Calendar, MapPin, Phone, GraduationCap, Award, Flame, BookOpen } from 'lucide-react';
import { UserProfile } from '../types';

interface StudentProfileTileProps {
  userProfile?: UserProfile;
}

export default function StudentProfileTile({ userProfile }: StudentProfileTileProps) {
  // Load fields from context with fallbacks matched to the user's information and standard academic data
  const name = userProfile?.name || 'Namita Singh';
  const email = userProfile?.email || 'namita@singh.com';
  const avatarUrl = userProfile?.avatar_url || 'https://api.dicebear.com/10.x/dylan/svg?seed=Felix';
  const bio = userProfile?.bio || 'Passionate full-stack developer and lifelong learner. Love building beautiful web applications and exploring new technologies.';
  
  const studentPassId = userProfile?.student_pass_id || userProfile?.student_id || 'STU-2024-001';
  const className = userProfile?.class_name || userProfile?.major || 'Computer Science & Engineering';
  const institution = userProfile?.institution || userProfile?.university || 'Indian Institute of Technology';
  const gender = userProfile?.gender || 'Female';
  const dateOfBirth = userProfile?.date_of_birth || '2002-06-10';
  const phone = userProfile?.phone || '+91 94672 81345';
  const address = userProfile?.address || 'Lucknow, India';
  const admissionDate = userProfile?.admission_date || '2023-06-20';
  
  // Stats (Streak and XP are kept as clean inline badges for context)
  const streak = userProfile?.streak_days !== undefined ? userProfile.streak_days : 7;
  const xp = userProfile?.total_xp !== undefined ? userProfile.total_xp : 1240;

  // Let's model the exact table from the uploaded image with real database column values:
  const profileDetails = [
    { label: 'Name:', value: name, icon: <User className="w-4 h-4 text-zinc-500" /> },
    { label: 'Gender:', value: gender, icon: <GraduationCap className="w-4 h-4 text-zinc-500" /> },
    { label: 'Date of Birth:', value: dateOfBirth, icon: <Calendar className="w-4 h-4 text-zinc-500" /> },
    { label: 'Email:', value: email, icon: <Mail className="w-4 h-4 text-zinc-500" /> },
    { label: 'Admission date:', value: admissionDate, icon: <Calendar className="w-4 h-4 text-zinc-500" /> },
    { label: 'Class:', value: className, icon: <BookOpen className="w-4 h-4 text-zinc-500" /> },
    { label: 'Address:', value: address, icon: <MapPin className="w-4 h-4 text-zinc-500" /> },
    { label: 'Phone:', value: phone, icon: <Phone className="w-4 h-4 text-zinc-500" /> },
  ];

  return (
    <motion.article
      id="student-profile-tile"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative w-full overflow-hidden bg-zinc-950 border border-zinc-800 rounded-[32px] p-8 shadow-[0_24px_50px_rgba(0,0,0,0.8)] group cursor-default"
    >
      {/* Decorative gradients */}
      <div 
        id="profile-glow shadow-indigo"
        className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-violet-600/10 blur-[80px] pointer-events-none animate-pulse" 
      />
      <div 
        id="profile-glow shadow-purple"
        className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-indigo-600/5 blur-[80px] pointer-events-none" 
      />

      <div className="relative z-10 space-y-6" id="profile-container-inner">
        {/* Title */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4" id="profile-card-header">
          <h2 className="text-xl font-bold font-sans text-white tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full" />
            About me
          </h2>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full text-[10px] font-mono flex items-center gap-1">
              🔥 {streak} Days
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-mono flex items-center gap-1">
              🏆 {xp} XP
            </span>
          </div>
        </div>

        {/* Top Segment: Avatar + Name + Bio Stack layout */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5" id="profile-top-segment">
          {/* Avatar frame */}
          <div className="relative shrink-0" id="profile-avatar-frame">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-500 to-fuchsia-500 p-0.5 shadow-lg shadow-black/80">
              <div className="w-full h-full rounded-full bg-zinc-900 overflow-hidden flex items-center justify-center">
                <img 
                  src={avatarUrl} 
                  alt={name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Namita';
                  }}
                />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-zinc-950 rounded-full flex items-center justify-center text-[8px]" title="Active">
              ✓
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
            <h3 className="font-sans text-2xl font-extrabold text-white tracking-tight leading-tight flex items-center gap-2 justify-center sm:justify-start">
              {name}
            </h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-xl">
              {bio}
            </p>
          </div>
        </div>

        {/* Bottom table of fields cleanly listed */}
        <div className="mt-8 border-t border-zinc-900/80 pt-6" id="profile-tabular-details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {profileDetails.map((detail, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between py-2 border-b border-zinc-900 last:border-0 hover:bg-zinc-900/20 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {detail.icon}
                  <span className="text-xs font-medium text-zinc-400 font-sans">{detail.label}</span>
                </div>
                <span className="text-xs font-semibold text-zinc-200 font-sans truncate pr-2" title={detail.value}>
                  {detail.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info containing ID, university */}
        <div className="mt-4 pt-4 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center text-[10px] text-zinc-500 font-mono gap-2" id="profile-card-footer">
          <span>INSTITUTION: {institution}</span>
          <span>STUDENT PASS ID: {studentPassId}</span>
        </div>
      </div>
    </motion.article>
  );
}
