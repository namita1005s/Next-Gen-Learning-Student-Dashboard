'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Lightbulb, CheckSquare, Plus, CheckCircle, RotateCw } from 'lucide-react';

interface Quote {
  text: string;
  author: string;
}

const INSIGHTS_QUOTES: Quote[] = [
  { text: "Your past does not define you; your daily focused micro-habits reshape your destiny.", author: "IMotive Catalyst" },
  { text: "The architectural depth of your software design reflects the clarity of your vision.", author: "Systems Sage" },
  { text: "There are no limits to human interface design when your mindset is pure craftsmanship.", author: "Design Visionary" },
  { text: "Energy flows where focus goes. Guard your time like the precious resource it is.", author: "Flow Master" },
  { text: "Do not wait for perfect conditions to start. Start, and you will create perfect conditions.", author: "Action Pioneer" },
];

export default function MindsetGymTile() {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [affirmations, setAffirmations] = useState([
    { id: 1, text: "Execute 2 focus hours on system designs", completed: true },
    { id: 2, text: "Drink water and clear brain fog", completed: false },
    { id: 3, text: "Master complex Framer Motion transitions", completed: false },
  ]);
  const [newAffirmationText, setNewAffirmationText] = useState('');

  const nextQuote = () => {
    setQuoteIdx((prev) => (prev + 1) % INSIGHTS_QUOTES.length);
  };

  const toggleAffirmation = (id: number) => {
    setAffirmations(
      affirmations.map((aff) =>
        aff.id === id ? { ...aff, completed: !aff.completed } : aff
      )
    );
  };

  const addAffirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAffirmationText.trim()) return;
    setAffirmations([
      ...affirmations,
      { id: Date.now(), text: newAffirmationText.trim(), completed: false },
    ]);
    setNewAffirmationText('');
  };

  const currentQuote = INSIGHTS_QUOTES[quoteIdx];
  const completedCount = affirmations.filter((a) => a.completed).length;
  const progressRatio = affirmations.length > 0 ? (completedCount / affirmations.length) * 100 : 0;

  return (
    <motion.article
      id="mindset-gym-tile"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative col-span-1 lg:col-span-2 overflow-hidden bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.6)] group cursor-default"
    >
      {/* Dynamic Background mesh glow */}
      <div 
        id="mindset-bg-glow"
        className="absolute inset-0 bg-radial-gradient from-violet-600/10 via-fuchsia-600/5 to-transparent pointer-events-none opacity-45 group-hover:opacity-70 transition-opacity duration-500" 
      />

      <div className="relative z-10 flex flex-col md:flex-row gap-8 h-full" id="mindset-tile-inner">
        
        {/* Left Section: Curated Quote Wheel */}
        <div className="flex-1 flex flex-col justify-between space-y-6" id="quote-wheel-panel">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Destiny Catalyst
              </span>
              <button
                onClick={nextQuote}
                id="refresh-quote-btn"
                className="p-1.5 rounded-lg bg-zinc-950/40 text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
                title="Transform Quote"
              >
                <RotateCw size={12} />
              </button>
            </div>

            <div className="min-h-32 flex flex-col justify-center relative" id="quote-text-container">
              <AnimatePresence mode="wait">
                <motion.div
                  key={quoteIdx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <p className="text-zinc-100 font-sans font-medium text-base italic leading-relaxed tracking-wide">
                    &ldquo;{currentQuote.text}&rdquo;
                  </p>
                  <p className="text-xs text-[#aa7dff] font-mono leading-none">
                    &mdash; {currentQuote.author}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Accountability Stats indicator */}
          <div className="p-4 bg-zinc-950/40 border border-zinc-800/40 rounded-2xl flex items-center justify-between" id="quote-insight-stat">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-[#aa7dff]">
                <Trophy size={16} />
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-mono block">MIND INTEGRATION</span>
                <span className="text-sm font-bold text-zinc-200">Level 8 Clarity</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-white">{completedCount}/{affirmations.length}</span>
              <span className="text-[10px] text-zinc-500 font-mono block">tasks unified</span>
            </div>
          </div>
        </div>

        {/* Right Section: Interactive Action Steps / Affirmations list */}
        <div className="flex-1 flex flex-col justify-between h-full space-y-4" id="affirmations-list-panel">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-violet-500/10 rounded-lg text-violet-400 border border-violet-500/10">
                <CheckSquare size={14} />
              </span>
              <h4 className="font-extrabold text-white text-sm tracking-wide">Daily Mindset Alignment</h4>
            </div>
            <p className="text-zinc-400 text-xs">
              Tick your destiny targets as they manifest in real-time focus blocks.
            </p>
          </div>

          {/* Action-Step list */}
          <div className="space-y-2 max-h-40 overflow-y-auto" id="affirmations-scoller">
            {affirmations.map((aff) => (
              <button
                key={aff.id}
                onClick={() => toggleAffirmation(aff.id)}
                id={`affirmation-toggle-${aff.id}`}
                className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  aff.completed
                    ? 'bg-[#915eff]/5 border-indigo-500/20 text-zinc-400 line-through'
                    : 'bg-zinc-950/40 border-zinc-800 hover:border-zinc-700 text-zinc-200'
                }`}
              >
                <div className={`p-0.5 rounded-full border transition-colors ${
                  aff.completed 
                    ? 'bg-[#915eff] border-[#915eff] text-white' 
                    : 'border-zinc-600 text-transparent'
                }`}>
                  <CheckCircle size={10} className="stroke-current" />
                </div>
                <span className="text-xs font-sans tracking-wide truncate">{aff.text}</span>
              </button>
            ))}
          </div>

          {/* Simple Form Input to add user custom targets to stay accountable */}
          <form onSubmit={addAffirmation} className="flex gap-2" id="new-affirmation-form">
            <input
              type="text"
              value={newAffirmationText}
              onChange={(e) => setNewAffirmationText(e.target.value)}
              placeholder="Inject next destiny target..."
              className="flex-1 px-3 py-2 bg-zinc-950/70 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 font-sans focus:outline-none focus:border-indigo-500 transition-colors"
              id="new-affirmation-input"
            />
            <button
              type="submit"
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-md transition-colors"
              id="new-affirmation-submit"
            >
              <Plus size={14} />
            </button>
          </form>
        </div>
      </div>
    </motion.article>
  );
}
