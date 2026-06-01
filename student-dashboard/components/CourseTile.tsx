'use client';

import { motion } from 'motion/react';
import { Globe, Code2, Palette, Zap, Cpu, Terminal, BookOpen, Layers, CheckCircle2, BarChart3, Server } from 'lucide-react';
import { Course } from '../types';
import ProgressBar from './ProgressBar';

interface CourseTileProps {
  course: Course;
  index: number;
}

// Map icon_name to Lucide components
const getCourseIcon = (iconName: string) => {
  const name = iconName?.toLowerCase();
  const iconProps = { size: 20, className: "w-5 h-5" };
  
  switch (name) {
    case 'globe': return <Globe {...iconProps} className="w-5 h-5 text-cyan-400" />;
    case 'code2': return <Code2 {...iconProps} className="w-5 h-5 text-emerald-400" />;
    case 'palette': return <Palette {...iconProps} className="w-5 h-5 text-rose-400" />;
    case 'zap': return <Zap {...iconProps} className="w-5 h-5 text-amber-400" />;
    case 'cpu': return <Cpu {...iconProps} className="w-5 h-5 text-indigo-400" />;
    case 'terminal': return <Terminal {...iconProps} className="w-5 h-5 text-violet-400" />;
    case 'layers': return <Layers {...iconProps} className="w-5 h-5 text-fuchsia-400" />;
    case 'barchart3':
    case 'bar-chart-3':
    case 'barchart': return <BarChart3 {...iconProps} className="w-5 h-5 text-amber-400" />;
    case 'server': return <Server {...iconProps} className="w-5 h-5 text-blue-400" />;
    default: return <BookOpen {...iconProps} className="w-5 h-5 text-neutral-400" />;
  }
};

// Dynamic gradient mesh colors based on course type
const getMeshGradient = (iconName: string) => {
  const name = iconName?.toLowerCase();
  
  switch (name) {
    case 'globe': return 'from-cyan-500/10 via-teal-500/5 to-transparent';
    case 'code2': return 'from-emerald-500/10 via-green-500/5 to-transparent';
    case 'palette': return 'from-rose-500/10 via-fuchsia-500/5 to-transparent';
    case 'zap': return 'from-amber-500/10 via-orange-500/5 to-transparent';
    case 'cpu': return 'from-indigo-500/10 via-blue-500/5 to-transparent';
    case 'terminal': return 'from-violet-500/10 via-purple-500/5 to-transparent';
    case 'layers': return 'from-fuchsia-500/10 via-rose-500/5 to-transparent';
    default: return 'from-neutral-500/10 via-neutral-600/5 to-transparent';
  }
};

export default function CourseTile({ course, index }: CourseTileProps) {
  const meshGradient = getMeshGradient(course.icon_name);
  const isCompleted = course.progress === 100;

  // SVG circular progress calculation for a much larger circle
  const radius = 32;
  const stroke = 5;
  const circumference = 2 * Math.PI * radius; // ~201.06
  const strokeDashoffset = circumference - (course.progress / 100) * circumference;
  
  // Animation variants for consistency
  const tileVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.02, y: -2 }
  };

  return (
    <motion.article
      id={`course-tile-${course.id}`}
      variants={tileVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ 
        initial: { duration: 0.5, delay: index * 0.1, ease: 'easeOut' },
        animate: { duration: 0.5, delay: index * 0.1, ease: 'easeOut' },
        hover: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      className="relative col-span-1 overflow-hidden bg-zinc-900 rounded-[32px] p-6 border border-zinc-800 shadow-[0_12px_30px_rgba(0,0,0,0.4)] group cursor-pointer hover:border-indigo-500/50 transition-colors duration-300 h-full flex flex-col justify-between min-h-[320px]"
    >
      {/* Decorative subtle mesh backdrop gradient */}
      <div 
        id={`course-glow-${course.id}`}
        className={`absolute inset-0 bg-gradient-to-br ${meshGradient} pointer-events-none opacity-45 group-hover:opacity-80 transition-opacity duration-500`} 
      />

      {/* Decorative micro noise grainy pattern */}
      <div 
        id="tile-grain-texture"
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px] opacity-10" 
      />

      {/* Top Header Row with Icon and Course Tag */}
      <div className="relative z-10 w-full flex items-center justify-between" id="tile-card-header">
        <div className="w-10 h-10 rounded-xl bg-zinc-950/80 border border-zinc-850 flex items-center justify-center transition-all duration-300 shadow-sm group-hover:bg-indigo-500/15 group-hover:border-indigo-500/30">
          {getCourseIcon(course.icon_name)}
        </div>
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-500 bg-zinc-950/60 py-1 px-2.5 rounded-full border border-zinc-850">
          Syllabus
        </span>
      </div>

      {/* Middle Section: Centered Big Progress Circle */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center my-6" id="tile-card-middle">
        <div className="relative flex items-center justify-center w-24 h-24" id={`circle-gauge-${course.id}`}>
          {/* Outer glow ring */}
          <div className={`absolute inset-0.5 rounded-full bg-gradient-to-tr ${isCompleted ? 'from-emerald-500/5 to-teal-500/5 group-hover:from-emerald-500/10 group-hover:to-teal-500/10' : 'from-indigo-500/5 to-purple-500/5 group-hover:from-indigo-500/10 group-hover:to-purple-500/10'} duration-500 blur-sm pointer-events-none`} />
          
          <svg className="w-24 h-24 transform -rotate-90">
            {/* Background circle track */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-zinc-800 text-zinc-800"
              strokeWidth={stroke}
              fill="transparent"
            />
            {/* Foreground progress circle with dynamic colors */}
            <motion.circle
              cx="48"
              cy="48"
              r={radius}
              className={isCompleted ? 'stroke-emerald-400' : 'stroke-indigo-500'}
              strokeWidth={stroke}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          
          {/* Percentage in the Center */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-xl font-mono font-extrabold tracking-tight ${isCompleted ? 'text-emerald-400 font-black' : 'text-zinc-100'}`}>
              {course.progress}%
            </span>
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-500 -mt-0.5">done</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Title of Course and Status */}
      <div className="relative z-10 w-full mt-auto text-center" id="tile-card-footer">
        <h3 className="font-sans text-base font-extrabold text-zinc-100 group-hover:text-white transition-colors duration-200 line-clamp-2 tracking-wide leading-snug">
          {course.title}
        </h3>
        <div className="mt-3 flex items-center justify-center gap-1.5" id={`status-action-${course.id}`}>
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono font-extrabold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-1 px-3 rounded-md animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Completed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 py-1 px-3 rounded-md transition-colors duration-300 group-hover:bg-indigo-500/20 group-hover:text-indigo-300">
              Resume Code →
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}