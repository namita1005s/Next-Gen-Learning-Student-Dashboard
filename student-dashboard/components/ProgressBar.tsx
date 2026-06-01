'use client';

import { motion } from 'motion/react';

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full h-2 bg-neutral-800/80 rounded-full overflow-hidden" id="progress-bar-container">
      <motion.div
        id="progress-bar-fill"
        className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 rounded-full"
        initial={{ scaleX: 0, transformOrigin: 'left' }}
        animate={{ scaleX: progress / 100 }}
        transition={{ type: 'spring', stiffness: 60, damping: 14, delay: 0.2 }}
      />
    </div>
  );
}
