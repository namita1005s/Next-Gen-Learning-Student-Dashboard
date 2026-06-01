'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCw, Volume2, VolumeX, Sparkles, Brain, Compass, HelpCircle } from 'lucide-react';

interface AudioPreset {
  id: string;
  name: string;
  description: string;
  type: 'sine' | 'triangle' | 'binaural';
  freq1: number;
  freq2: number;
}

const AUDIO_PRESETS: AudioPreset[] = [
  { id: 'zen', name: 'Zen Waves', description: 'Deep alpha binaural waves', type: 'binaural', freq1: 150, freq2: 160 },
  { id: 'focus', name: 'Beta Focus', description: 'High concentration beats', type: 'binaural', freq1: 200, freq2: 215 },
  { id: 'cosmic', name: 'Cosmic Hum', description: 'Theta cosmic relaxation', type: 'triangle', freq1: 100, freq2: 104 },
  { id: 'warmth', name: 'Warm Meadow', description: 'Calming grounded sound', type: 'sine', freq1: 120, freq2: 120 },
];

export default function DeepFocusTile() {
  // Focus Timer States
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [totalDuration, setTotalDuration] = useState(25 * 60);

  // Audio Synthesizer States
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activePreset, setActivePreset] = useState<AudioPreset>(AUDIO_PRESETS[0]);
  const [volume, setVolume] = useState(0.3);

  // Synthesizer Web Audio references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Focus Timer logic
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer finished!
          setIsActive(false);
          setIsPlayingAudio(false);
          stopAmbientSynthesizer();
          if (typeof window !== 'undefined') {
            try {
              const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-600.wav');
              audio.volume = 0.5;
              audio.play();
            } catch (e) {
              console.log('Audio alert blocked by browser');
            }
          }
          clearInterval(interval);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  // Adjust total duration if preset selected
  const setTimerPreset = (mints: number) => {
    setIsActive(false);
    setMinutes(mints);
    setSeconds(0);
    setTotalDuration(mints * 60);
  };

  const toggleTimer = () => {
    if (!isActive && minutes === 0 && seconds === 0) {
      setTimerPreset(25);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
    setTotalDuration(25 * 60);
  };

  const progressPercentage = totalDuration > 0 
    ? ((minutes * 60 + seconds) / totalDuration) * 100 
    : 100;

  // Web Audio Synth control
  const startAmbientSynthesizer = () => {
    if (typeof window === 'undefined') return;

    try {
      // Create Context if missing
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Stop previous oscs safely
      stopAmbientSynthesizer();

      // Create main gain node for volume
      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(volume, ctx.currentTime);
      mainGain.connect(ctx.destination);
      gainNodeRef.current = mainGain;

      // Lowpass filter to make it cozy and sound like deep rain or cosmic hum
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, ctx.currentTime);
      filter.connect(mainGain);

      // Create Oscillator 1 (Left ear)
      const osc1 = ctx.createOscillator();
      const panner1 = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      osc1.type = activePreset.type === 'binaural' ? 'sine' : activePreset.type;
      osc1.frequency.setValueAtTime(activePreset.freq1, ctx.currentTime);
      
      if (panner1) {
        panner1.pan.setValueAtTime(-0.8, ctx.currentTime);
        osc1.connect(panner1);
        panner1.connect(filter);
      } else {
        osc1.connect(filter);
      }

      // Create Oscillator 2 (Right ear)
      const osc2 = ctx.createOscillator();
      const panner2 = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      osc2.type = activePreset.type === 'binaural' ? 'sine' : activePreset.type;
      osc2.frequency.setValueAtTime(activePreset.freq2, ctx.currentTime);

      if (panner2) {
        panner2.pan.setValueAtTime(0.8, ctx.currentTime);
        osc2.connect(panner2);
        panner2.connect(filter);
      } else {
        osc2.connect(filter);
      }

      osc1.start();
      osc2.start();

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
      setIsPlayingAudio(true);
    } catch (err) {
      console.warn('Web Audio compilation / initialization blocked: ', err);
    }
  };

  const stopAmbientSynthesizer = () => {
    try {
      if (osc1Ref.current) {
        osc1Ref.current.stop();
        osc1Ref.current.disconnect();
        osc1Ref.current = null;
      }
      if (osc2Ref.current) {
        osc2Ref.current.stop();
        osc2Ref.current.disconnect();
        osc2Ref.current = null;
      }
      setIsPlayingAudio(false);
    } catch (e) {
      // already stopped
    }
  };

  const toggleAudioSynth = () => {
    if (isPlayingAudio) {
      stopAmbientSynthesizer();
    } else {
      startAmbientSynthesizer();
    }
  };

  // Upd volume dynamically
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Upd oscillators on preset shift
  useEffect(() => {
    if (isPlayingAudio) {
      startAmbientSynthesizer();
    }
  }, [activePreset]);

  // Cleanup synthesizer on component unmount
  useEffect(() => {
    return () => {
      try {
        if (osc1Ref.current) osc1Ref.current.stop();
        if (osc2Ref.current) osc2Ref.current.stop();
        if (audioCtxRef.current) audioCtxRef.current.close();
      } catch (e) {
        // do nothing
      }
    };
  }, []);

  return (
    <motion.article
      id="deep-focus-tile"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative col-span-1 lg:col-span-2 overflow-hidden bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.6)] group cursor-default"
    >
      {/* Decorative Brand Spot Glow */}
      <div 
        id="focus-bg-glow"
        className="absolute inset-0 bg-radial-gradient from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none opacity-50 group-hover:opacity-75 transition-opacity duration-500" 
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 h-full" id="focus-tile-inner">
        
        {/* Left Side: Interactive Circle Countdowns / Config */}
        <div className="flex flex-col items-center flex-1 w-full text-center" id="focus-timer-section">
          <div className="relative flex items-center justify-center w-40 h-40 mb-4" id="circle-visualizer-container">
            {/* SVG circle track and indicator */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-zinc-800 fill-none"
                strokeWidth="4"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-indigo-500 fill-none"
                strokeWidth="5"
                strokeDasharray="276"
                animate={{ strokeDashoffset: 276 - (276 * progressPercentage) / 100 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>

            {/* In-circle clock readout */}
            <div className="absolute flex flex-col items-center justify-center" id="clock-readout">
              <span className="text-3xl font-black font-sans text-white tracking-tighter" id="countdown-nums">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#aa7dff]">
                {isActive ? 'Session Live' : 'Focus Mode'}
              </span>
            </div>
          </div>

          {/* Preset Buttons row */}
          <div className="flex gap-2 mb-4" id="preset-buttons-row">
            {[15, 25, 45].map((m) => (
              <button
                key={m}
                onClick={() => setTimerPreset(m)}
                id={`preset-${m}-btn`}
                className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                  minutes === m && seconds === 0
                    ? 'bg-indigo-500/20 text-[#aa7dff] border-indigo-500/40 shadow-[0_0_12px_rgba(145,94,255,0.2)]'
                    : 'bg-zinc-950/40 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>

          {/* Action Triggers */}
          <div className="flex items-center gap-3" id="timer-action-controls">
            <button
              onClick={toggleTimer}
              id="timer-play-pause-btn"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-sans font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_4px_20px_rgba(145,94,255,0.45)]'
              }`}
            >
              {isActive ? (
                <>
                  <Pause size={14} className="fill-current" /> Pause
                </>
              ) : (
                <>
                  <Play size={14} className="fill-current" /> Focus Up
                </>
              )}
            </button>

            <button
              onClick={resetTimer}
              id="timer-reset-btn"
              className="p-2.5 bg-zinc-950/60 hover:bg-zinc-800 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Reset Timer"
            >
              <RotateCw size={14} />
            </button>
          </div>
        </div>

        {/* Right Side: Cozy Ambient Synthesizer Panels */}
        <div className="flex flex-col flex-1 w-full justify-between h-full space-y-4" id="cozy-ambient-synth-panel">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/10">
                <Brain size={14} />
              </span>
              <h4 className="font-extrabold text-white text-sm tracking-wide">Destiny Sound Machine</h4>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Synthesize client-side alpha & cosmic binary waves customized for high flow focus blocks.
            </p>
          </div>

          {/* Synthesizer Selector Grid */}
          <div className="grid grid-cols-2 gap-2" id="synth-presets-grid">
            {AUDIO_PRESETS.map((p) => {
              const selected = activePreset.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePreset(p)}
                  id={`preset-audio-${p.id}`}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selected
                      ? 'bg-indigo-500/10 border-indigo-500/40 shadow-sm'
                      : 'bg-zinc-950/40 border-zinc-800/60 hover:border-zinc-800/80 hover:bg-zinc-800/30'
                  }`}
                >
                  <div className={`font-semibold text-xs leading-tight ${selected ? 'text-[#aa7dff]' : 'text-zinc-300'}`}>
                    {p.name}
                  </div>
                  <div className="text-[9px] text-zinc-500 font-mono mt-0.5 mt-1">{p.description}</div>
                </button>
              );
            })}
          </div>

          {/* Visual animation synth player & Volume */}
          <div className="flex items-center justify-between gap-4 p-3 bg-zinc-950/50 border border-zinc-800/40 rounded-2xl" id="synth-player-bar">
            <button
              onClick={toggleAudioSynth}
              id="sound-synth-play-toggle"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                isPlayingAudio
                  ? 'bg-[#915eff]/20 text-white border-[#915eff]/30 hover:bg-[#915eff]/30'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 size={13} className="text-[#aa7dff]" /> Ambient playing
                </>
              ) : (
                <>
                  <VolumeX size={13} className="text-zinc-500" /> Sound Muted
                </>
              )}
            </button>

            {/* Visual audio wave animation bars */}
            <div className="flex items-end gap-0.5 h-4 px-1" id="audio-visualizer-bars">
              {[0.6, 0.9, 0.4, 0.7, 0.5, 0.8, 0.3].map((val, i) => (
                <motion.div
                  key={i}
                  animate={isPlayingAudio ? { height: ['15%', '100%', '15%'] } : { height: '15%' }}
                  transition={
                    isPlayingAudio
                      ? {
                          duration: 0.6 + i * 0.1,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }
                      : {}
                  }
                  className="w-0.5 bg-[#aa7dff] rounded-t-sm"
                  style={{ height: '15%', transformOrigin: 'bottom' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
