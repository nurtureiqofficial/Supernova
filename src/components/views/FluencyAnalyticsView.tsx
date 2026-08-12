import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Clock, Zap, Award, Target, Brain, Flame, 
  Activity, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, 
  ChevronRight, Volume2, ArrowUpRight, Globe, Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, CartesianGrid
} from 'recharts';
import { UserProfile, ThemeMode, PracticeLog } from '../../types';
import { fetchUserPracticeLogs } from '../../lib/firebase';

interface FluencyAnalyticsViewProps {
  user: UserProfile;
  theme: ThemeMode;
}

// Sample weekly analytics data
const WEEKLY_TREND_DATA = [
  { day: 'Mon', minutes: 12, accuracy: 72, wpm: 108, xp: 40 },
  { day: 'Tue', minutes: 18, accuracy: 78, wpm: 115, xp: 60 },
  { day: 'Wed', minutes: 15, accuracy: 75, wpm: 112, xp: 50 },
  { day: 'Thu', minutes: 25, accuracy: 84, wpm: 122, xp: 90 },
  { day: 'Fri', minutes: 20, accuracy: 82, wpm: 120, xp: 75 },
  { day: 'Sat', minutes: 30, accuracy: 88, wpm: 128, xp: 110 },
  { day: 'Sun', minutes: 35, accuracy: 91, wpm: 132, xp: 130 },
];

// CEFR Skill Radar Data
const SKILL_RADAR_DATA = [
  { skill: 'Fluency & Flow', score: 82, fullMark: 100 },
  { skill: 'Grammar', score: 76, fullMark: 100 },
  { skill: 'Vocabulary', score: 85, fullMark: 100 },
  { skill: 'Pronunciation', score: 72, fullMark: 100 },
  { skill: 'Pressure Poise', score: 68, fullMark: 100 },
  { skill: 'Thinking Speed', score: 80, fullMark: 100 },
];

// CEFR Milestones Checklist
interface CEFRMilestone {
  id: string;
  title: string;
  category: 'Grammar' | 'Vocabulary' | 'Pronunciation' | 'Fluency';
  isMastered: boolean;
  description: string;
}

const CEFR_MILESTONES: CEFRMilestone[] = [
  {
    id: 'm1',
    title: 'Eliminate Direct Translation ("Myself John")',
    category: 'Grammar',
    isMastered: true,
    description: 'Use reflexive pronouns correctly without replacing subject pronouns.'
  },
  {
    id: 'm2',
    title: 'Stative Verbs ("I have" vs "I am having")',
    category: 'Grammar',
    isMastered: true,
    description: 'Avoid continuous tense with possession verbs.'
  },
  {
    id: 'm3',
    title: 'Silent Letter Mastery (Wednesday, Receipt)',
    category: 'Pronunciation',
    isMastered: true,
    description: 'Pronounce silent consonant markers correctly.'
  },
  {
    id: 'm4',
    title: 'Speech Pace Above 110 WPM',
    category: 'Fluency',
    isMastered: true,
    description: 'Maintain steady conversational English cadence.'
  },
  {
    id: 'm5',
    title: 'Complex Conditionals (If I had known...)',
    category: 'Grammar',
    isMastered: false,
    description: 'Form third conditional structures seamlessly in speech.'
  },
  {
    id: 'm6',
    title: 'Corporate Collocations ("Address the concern")',
    category: 'Vocabulary',
    isMastered: false,
    description: 'Use professional multi-word collocations in meeting contexts.'
  },
  {
    id: 'm7',
    title: 'Hesitation Ratio Below 5%',
    category: 'Fluency',
    isMastered: false,
    description: 'Eliminate filler pauses like "basically" and "actually".'
  }
];

export const FluencyAnalyticsView: React.FC<FluencyAnalyticsViewProps> = ({ user, theme }) => {
  const isDark = theme === 'dark';

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');
  const [logs, setLogs] = useState<PracticeLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [milestones, setMilestones] = useState<CEFRMilestone[]>(CEFR_MILESTONES);

  // Load practice logs to render real metrics if available
  useEffect(() => {
    const loadLogs = async () => {
      if (user.uid) {
        try {
          const userLogs = await fetchUserPracticeLogs(user.uid);
          setLogs(userLogs);
        } catch (err) {
          console.warn('Could not load practice logs for analytics:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    loadLogs();
  }, [user.uid]);

  // Aggregate stats calculation
  const totalLogsCount = logs.length;
  const avgAccuracy = logs.length > 0 
    ? Math.round(logs.reduce((acc, curr) => acc + (curr.accuracyScore || 0), 0) / logs.length)
    : 82;

  const toggleMilestone = (id: string) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, isMastered: !m.isMastered } : m));
  };

  const masteredCount = milestones.filter(m => m.isMastered).length;
  const milestoneProgressPercent = Math.round((masteredCount / milestones.length) * 100);

  return (
    <div className="flex-1 px-4 pt-3 pb-24 space-y-5">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl p-5 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-800/60 shadow-xl text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 text-[11px] font-extrabold px-3 py-1 rounded-full border border-indigo-500/30">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>CEFR Fluency Intelligence Engine</span>
            </div>

            <div className="flex bg-slate-900/80 p-0.5 rounded-xl border border-slate-800 text-[10px] font-extrabold text-slate-300">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-2 py-1 rounded-lg transition-all ${timeRange === '7d' ? 'bg-indigo-500 text-slate-950' : 'hover:text-white'}`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-2 py-1 rounded-lg transition-all ${timeRange === '30d' ? 'bg-indigo-500 text-slate-950' : 'hover:text-white'}`}
              >
                30 Days
              </button>
            </div>
          </div>

          <h2 className="text-xl font-black font-heading tracking-tight">
            Advanced Spoken Fluency Analytics
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Real-time diagnostics tracking your speech tempo (WPM), hesitation ratio, vocabulary diversity, and CEFR level progression.
          </p>
        </div>
      </div>

      {/* OVERALL CEFR LEVEL PROGRESS CARD */}
      <div className={`p-5 rounded-3xl border space-y-4 ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-md">
              {user.cefrLevel || 'B1'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-100 font-heading">
                  CEFR Band {user.cefrLevel || 'B1'} (Intermediate)
                </h3>
                <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  On Track to B2
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Overall Spoken Mastery Score: <strong className="text-indigo-400 font-bold">{avgAccuracy}/100</strong>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Next Target</span>
            <span className="text-xs font-black text-amber-400">CEFR B2 (Vantage)</span>
          </div>
        </div>

        {/* Level Progression Progress Bar */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
          <div className="flex justify-between text-xs font-extrabold">
            <span className="text-slate-400">B1 Band Proficiency</span>
            <span className="text-indigo-400">{milestoneProgressPercent}% Milestones Mastered</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-emerald-400 to-amber-400 transition-all duration-500"
              style={{ width: `${milestoneProgressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 4 CORE FLUENCY DIAGNOSTIC GAUGES */}
      <div className="grid grid-cols-2 gap-3">
        {/* Gauge 1: Speech Tempo (WPM) */}
        <div className={`p-4 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Speech Tempo</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Optimal
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-100 font-heading">125</span>
            <span className="text-xs text-slate-400 font-bold">WPM</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Target: 110–140 WPM for natural conversational rhythm.
          </p>
        </div>

        {/* Gauge 2: Hesitation Ratio */}
        <div className={`p-4 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Hesitation Ratio</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Low Pauses
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-100 font-heading">4.2%</span>
            <span className="text-xs text-slate-400 font-bold">silence</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Low hesitation! Minimal filler words like "basically".
          </p>
        </div>

        {/* Gauge 3: Vocabulary Diversity */}
        <div className={`p-4 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Brain className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lexical Diversity</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Rich TTR
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-100 font-heading">78%</span>
            <span className="text-xs text-slate-400 font-bold">unique</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Type-Token Ratio shows varied non-repetitive vocabulary.
          </p>
        </div>

        {/* Gauge 4: Grammar & Syntax Accuracy */}
        <div className={`p-4 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Grammar Precision</span>
            </span>
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
              +6% vs last week
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-100 font-heading">88%</span>
            <span className="text-xs text-slate-400 font-bold">correct</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Strong sentence structure with rare preposition errors.
          </p>
        </div>
      </div>

      {/* CHART 1: WEEKLY PRACTICE & WPM TREND CHART */}
      <div className={`p-4 sm:p-5 rounded-3xl border space-y-3 ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-extrabold font-heading text-slate-100">
              Weekly Practice Minutes & Speech Pace
            </h3>
          </div>
          <span className="text-xs text-emerald-400 font-bold">
            Total: 150m Spoken
          </span>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WEEKLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="minutesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="wpmGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                  borderColor: isDark ? '#334155' : '#e2e8f0',
                  borderRadius: '12px',
                  fontSize: '12px'
                }} 
              />
              <Area type="monotone" dataKey="minutes" name="Practice Mins" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#minutesGrad)" />
              <Area type="monotone" dataKey="wpm" name="Words / Min" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#wpmGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-6 text-xs text-slate-400 pt-1 font-bold">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
            <span>Practice Duration (Minutes)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
            <span>Speech Pace (WPM)</span>
          </div>
        </div>
      </div>

      {/* CHART 2: CEFR SKILL RADAR CHART */}
      <div className={`p-4 sm:p-5 rounded-3xl border space-y-3 ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-extrabold font-heading text-slate-100">
              5-Axis CEFR Competency Radar
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400">
            Target: Balanced 85%+
          </span>
        </div>

        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={SKILL_RADAR_DATA}>
              <PolarGrid stroke={isDark ? '#334155' : '#e2e8f0'} />
              <PolarAngleAxis dataKey="skill" stroke="#94a3b8" fontSize={11} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" fontSize={9} />
              <Radar name="Your Mastery" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.35} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1">
          💡 <strong className="text-amber-400">AI Tutor Analysis:</strong> Your vocabulary and flow are strong (82%+), but practicing in <strong>High-Pressure Roleplays</strong> will boost your pressure poise score from 68% to 80%+.
        </div>
      </div>

      {/* CEFR TIER MILESTONE CHECKLIST */}
      <div className={`p-5 rounded-3xl border space-y-4 ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold font-heading text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>CEFR B1 → B2 Level Milestones</span>
            </h3>
            <p className="text-xs text-slate-400">
              Tap tasks to mark mastered spoken concepts as you practice:
            </p>
          </div>

          <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 shrink-0">
            {masteredCount} / {milestones.length} Done
          </span>
        </div>

        <div className="space-y-2.5">
          {milestones.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleMilestone(item.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                item.isMastered 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' 
                  : isDark ? 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                item.isMastered 
                  ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                  : 'border-slate-700 bg-slate-900'
              }`}>
                {item.isMastered && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-extrabold ${item.isMastered ? 'line-through text-emerald-300' : 'text-slate-100'}`}>
                    {item.title}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {item.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
