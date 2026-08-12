import React, { useState, useEffect } from 'react';
import { Sparkles, Mic, Bot, ShieldCheck, Zap } from 'lucide-react';
import novaAvatarUrl from '../assets/images/nova_ai_teacher_1786287491962.jpg';

const LOADING_STEPS = [
  'Connecting to Supernova AI Engine...',
  'Initializing Multimodal Voice Tutor...',
  'Loading CEFR Learning Roadmap...',
  'Syncing Native Language Guidance...',
  'Setting Up Your AI Practice Room...'
];

export const InitializingScreen: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return 92;
        return prev + Math.floor(Math.random() * 8) + 3;
      });
    }, 300);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 min-h-full relative overflow-hidden select-none">
      {/* Ambient Background Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/3 left-1/3 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Badge */}
      <div className="pt-8 z-10 flex flex-col items-center text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-widest uppercase shadow-lg shadow-emerald-500/10">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          <span>India's #1 AI Spoken English App</span>
        </div>
      </div>

      {/* Center Animated Logo & Ring Avatar */}
      <div className="my-auto z-10 flex flex-col items-center text-center space-y-6 max-w-xs">
        {/* Glowing Orb Avatar Stack */}
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Aura */}
          <div className="absolute w-36 h-36 rounded-full bg-gradient-to-r from-emerald-500/30 via-teal-500/20 to-amber-500/30 blur-xl animate-ping opacity-75"></div>

          {/* Rotating Gradient Spinner Border */}
          <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-emerald-400 via-teal-300 to-amber-400 animate-spin shadow-2xl shadow-emerald-500/30">
            <div className="w-full h-full rounded-full bg-slate-950 p-1">
              <img
                src={novaAvatarUrl}
                alt="Nova AI Teacher"
                className="w-full h-full rounded-full object-cover shadow-inner"
              />
            </div>
          </div>

          {/* Floating Live Badge */}
          <div className="absolute -bottom-1 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1 border border-emerald-300/40">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
            <span>Nova AI</span>
          </div>
        </div>

        {/* Brand Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black font-heading tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
            Supernova AI
          </h1>
          <p className="text-xs font-semibold text-slate-400 tracking-wide">
            Spoken English AI Tutor • पर्सनल AI शिक्षक
          </p>
        </div>

        {/* Dynamic Loading Status Text & Animated Progress Bar */}
        <div className="w-full space-y-3 pt-2">
          {/* Animated Progress Track */}
          <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
            </div>
          </div>

          {/* Step Text Indicator */}
          <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-emerald-400 transition-all duration-300 min-h-[20px]">
            <Bot className="w-4 h-4 animate-bounce text-emerald-400 shrink-0" />
            <span className="animate-pulse">{LOADING_STEPS[currentStepIndex]}</span>
          </div>
        </div>
      </div>

      {/* Footer Feature Pills */}
      <div className="pb-4 z-10 flex items-center justify-center gap-3 text-[10px] font-extrabold text-slate-400 border-t border-slate-800/80 pt-4 w-full max-w-xs">
        <div className="flex items-center gap-1">
          <Mic className="w-3 h-3 text-emerald-400" />
          <span>Real-time Voice</span>
        </div>
        <span className="text-slate-700">•</span>
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>CEFR Level A1-C2</span>
        </div>
        <span className="text-slate-700">•</span>
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-teal-400" />
          <span>Secure</span>
        </div>
      </div>
    </div>
  );
};
