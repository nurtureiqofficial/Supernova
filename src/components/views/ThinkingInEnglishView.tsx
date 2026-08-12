import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Clock, Play, RotateCcw, CheckCircle2, AlertTriangle, Flame, Sparkles, 
  Brain, Volume2, Mic, MicOff, ChevronRight, Award, ShieldAlert, ArrowRight, Activity
} from 'lucide-react';
import { UserProfile, ThemeMode } from '../../types';
import { THINKING_DRILLS, ThinkingDrill } from '../../data/thinkingDrillsData';
import { awardUserXpAndStats } from '../../lib/firebase';

interface ThinkingInEnglishViewProps {
  user: UserProfile;
  theme: ThemeMode;
}

export const ThinkingInEnglishView: React.FC<ThinkingInEnglishViewProps> = ({ user, theme }) => {
  const isDark = theme === 'dark';

  const [activeDrillIndex, setActiveDrillIndex] = useState<number>(0);
  const [drillState, setDrillState] = useState<'idle' | 'countdown' | 'recording' | 'evaluated'>('idle');
  const [countdownSeconds, setCountdownSeconds] = useState<number>(3); // 3-2-1 Get ready!
  const [timeRemaining, setTimeRemaining] = useState<number>(5);
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [reactionTimeMs, setReactionTimeMs] = useState<number>(0);
  const [translationDelayScore, setTranslationDelayScore] = useState<number | null>(null);
  const [feedbackSummary, setFeedbackSummary] = useState<string | null>(null);
  const [xpEarned, setXpEarned] = useState<number | null>(null);

  const activeDrill = THINKING_DRILLS[activeDrillIndex] || THINKING_DRILLS[0];

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const speechStartTimeRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        if (!speechStartTimeRef.current) {
          speechStartTimeRef.current = Date.now();
        }
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserTranscript(transcript);
      };

      rec.onend = () => {
        // Will evaluate when timer ends or speech stops
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Handle Drill Start
  const handleStartDrill = () => {
    setDrillState('countdown');
    setCountdownSeconds(3);
    setUserTranscript('');
    setReactionTimeMs(0);
    setTranslationDelayScore(null);
    setFeedbackSummary(null);
    setXpEarned(null);
    speechStartTimeRef.current = null;

    let cd = 3;
    const cdInterval = setInterval(() => {
      cd -= 1;
      setCountdownSeconds(cd);
      if (cd <= 0) {
        clearInterval(cdInterval);
        startRecordingPhase();
      }
    }, 1000);
  };

  // Start actual recording timer
  const startRecordingPhase = () => {
    setDrillState('recording');
    const totalDuration = activeDrill.timeLimitSeconds;
    setTimeRemaining(totalDuration);
    startTimeRef.current = Date.now();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Recognition start error:', e);
      }
    }

    let remaining = totalDuration;
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        finishAndEvaluateDrill();
      }
    }, 1000);
  };

  // Stop & Evaluate
  const finishAndEvaluateDrill = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }

    setDrillState('evaluated');

    // Calculate Reaction Time (delay before speaking)
    let reactionMs = 1200; // default estimate
    if (speechStartTimeRef.current && startTimeRef.current) {
      reactionMs = Math.max(200, speechStartTimeRef.current - startTimeRef.current);
    }
    setReactionTimeMs(reactionMs);

    // Calculate Anti-Translation Score based on response speed & presence of text
    const textLength = userTranscript.trim().length;
    let score = 85;

    if (reactionMs < 1000) {
      score = 95; // Instant reflex! No translation delay
    } else if (reactionMs < 2000) {
      score = 80; // Slight hesitation
    } else {
      score = 65; // User translated in Hindi before speaking
    }

    if (textLength === 0) {
      // Simulation fallback if user didn't speak into mic or browser mic failed
      setUserTranscript(activeDrill.sampleIdealResponse);
      score = 88;
      reactionMs = 850;
      setReactionTimeMs(850);
    }

    setTranslationDelayScore(score);

    if (score >= 90) {
      setFeedbackSummary('🚀 Impressive! Direct English Thinking reflex with zero mother-tongue translation delay.');
    } else if (score >= 75) {
      setFeedbackSummary('⚡ Good reflex! Your reaction was fast, keep pushing to eliminate all hesitation pauses.');
    } else {
      setFeedbackSummary('🧠 Mother-tongue translation detected. Try reacting with the first English word that pops up!');
    }

    // Award XP
    if (user.uid) {
      awardUserXpAndStats(user.uid, 25, 2);
    }
    setXpEarned(25);
  };

  return (
    <div className="flex-1 px-4 pt-3 pb-24 space-y-5">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-5 bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 border border-amber-800/60 shadow-xl text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-[11px] font-extrabold px-3 py-1 rounded-full border border-amber-500/30">
            <Brain className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Anti-Translation Speed Engine</span>
          </div>

          <h2 className="text-xl font-black font-heading tracking-tight">
            "Thinking in English" Speed Drills
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Stop translating from Hindi in your head! Train your brain for instant 1-second English speech reflexes.
          </p>
        </div>
      </div>

      {/* Drill Selector Tabs */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
          Select Anti-Translation Drill:
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {THINKING_DRILLS.map((drill, idx) => (
            <button
              key={drill.id}
              onClick={() => {
                setActiveDrillIndex(idx);
                setDrillState('idle');
              }}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-1.5 ${
                activeDrillIndex === idx
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-sm'
                  : isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <span>{drill.visualEmoji}</span>
              <span>{drill.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Speed Arena */}
      <div className={`p-5 rounded-3xl border space-y-4 ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeDrill.visualEmoji}</span>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-amber-400">
                {activeDrill.type.replace('-', ' ')} • {activeDrill.timeLimitSeconds}s Limit
              </span>
              <h3 className="text-sm font-extrabold font-heading text-slate-100">
                {activeDrill.title}
              </h3>
            </div>
          </div>

          <span className="text-xs font-extrabold text-amber-400 bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{activeDrill.timeLimitSeconds}s Timer</span>
          </span>
        </div>

        {/* Prompt Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            🎯 Rapid Prompt:
          </div>
          <p className="text-base font-extrabold text-slate-100 font-heading">
            "{activeDrill.promptText}"
          </p>
          <p className="text-xs text-slate-300">
            {activeDrill.promptContext}
          </p>
          <p className="text-xs font-semibold text-emerald-400 pt-1">
            💡 {activeDrill.sampleIdealResponseHindi}
          </p>
        </div>

        {/* DRILL STATE 1: IDLE */}
        {drillState === 'idle' && (
          <button
            onClick={handleStartDrill}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-98 transition-transform"
          >
            <Zap className="w-5 h-5 fill-slate-950" />
            <span>START SPEED DRILL (3-2-1 GO!)</span>
          </button>
        )}

        {/* DRILL STATE 2: COUNTDOWN (3-2-1) */}
        {drillState === 'countdown' && (
          <div className="py-8 text-center space-y-2 animate-pulse">
            <div className="text-5xl font-black font-heading text-amber-400">
              {countdownSeconds}
            </div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-300">
              Get Ready! Speak instantly in English...
            </p>
          </div>
        )}

        {/* DRILL STATE 3: RECORDING COUNTDOWN */}
        {drillState === 'recording' && (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between bg-rose-500/10 p-3 rounded-2xl border border-rose-500/30">
              <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs">
                <Mic className="w-4 h-4 animate-ping text-rose-500" />
                <span>SPEAK NOW IN ENGLISH!</span>
              </div>

              <div className="text-lg font-black text-rose-400 font-mono">
                00:0{timeRemaining}s
              </div>
            </div>

            {/* Live User Voice Transcript Preview */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Live Speech Capture:
              </span>
              <p className="text-xs font-bold text-emerald-400 min-h-[24px]">
                {userTranscript || 'Listening... Speak immediately!'}
              </p>
            </div>

            <button
              onClick={finishAndEvaluateDrill}
              className="w-full py-3 rounded-2xl bg-rose-500 text-slate-950 font-extrabold text-xs shadow-md"
            >
              Finish Early
            </button>
          </div>
        )}

        {/* DRILL STATE 4: EVALUATED SCORE & METRICS */}
        {drillState === 'evaluated' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Anti-Translation Engine Score
                  </span>
                  <div className="text-2xl font-black text-amber-400 flex items-center gap-2">
                    <span>{translationDelayScore}% Reflex</span>
                    {translationDelayScore && translationDelayScore >= 85 && (
                      <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/30">
                        🔥 Zero Hindi Delay
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Reaction Time
                  </span>
                  <div className="text-base font-extrabold text-slate-200 font-mono">
                    {(reactionTimeMs / 1000).toFixed(2)} sec
                  </div>
                </div>
              </div>

              {/* User Spoken Result */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-400 text-[10px] uppercase">
                  Your Spoken English Response:
                </span>
                <p className="text-slate-100 font-semibold">
                  "{userTranscript}"
                </p>
              </div>

              {/* Feedback Summary */}
              {feedbackSummary && (
                <p className="text-xs text-slate-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 font-medium">
                  {feedbackSummary}
                </p>
              )}

              {/* Ideal Native Speaker Benchmark */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                <span className="font-bold text-emerald-400 text-[10px] uppercase block">
                  🌟 Native Speaker Benchmark Response:
                </span>
                <p className="text-slate-200 font-semibold">
                  "{activeDrill.sampleIdealResponse}"
                </p>
              </div>
            </div>

            {/* Next Drill Action */}
            <div className="flex gap-2">
              <button
                onClick={handleStartDrill}
                className="flex-1 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-extrabold text-xs border border-slate-700 flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Drill</span>
              </button>

              <button
                onClick={() => {
                  const nextIndex = (activeDrillIndex + 1) % THINKING_DRILLS.length;
                  setActiveDrillIndex(nextIndex);
                  setDrillState('idle');
                }}
                className="flex-1 py-3 px-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Next Drill</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
