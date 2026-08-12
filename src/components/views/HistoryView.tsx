import React, { useState, useEffect } from 'react';
import { 
  History, CheckCircle2, Clock, Volume2, Sparkles, Award, 
  HelpCircle, RefreshCw, X, TrendingUp, BookOpen, Mic, ShieldAlert, Brain
} from 'lucide-react';
import { UserProfile, ThemeMode, PracticeLog } from '../../types';
import { fetchUserPracticeLogs } from '../../lib/firebase';
import { MistakeVaultView } from './MistakeVaultView';

interface HistoryViewProps {
  user: UserProfile;
  theme: ThemeMode;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ user, theme }) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'logs' | 'vault'>('vault');
  const [logs, setLogs] = useState<PracticeLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLog, setSelectedLog] = useState<PracticeLog | null>(null);

  useEffect(() => {
    const loadLogs = async () => {
      setIsLoading(true);
      if (user.uid) {
        const fetched = await fetchUserPracticeLogs(user.uid);
        if (fetched && fetched.length > 0) {
          setLogs(fetched);
        } else {
          // Default fallback sample logs if Firestore is clean
          setLogs([
            {
              id: 'log-1',
              userId: user.uid || 'guest',
              topic: 'Talking About Past Activities',
              accuracyScore: 92,
              durationMinutes: 4,
              correctionsCount: 2,
              correctedSample: 'Yesterday I went to the market and bought fresh fruits.',
              regionalExplanation: 'Past actions ke liye verb "went" use karein (go nahi).',
              timestamp: 'Today, 10:30 AM',
            },
            {
              id: 'log-2',
              userId: user.uid || 'guest',
              topic: 'Job Interview Essentials',
              accuracyScore: 88,
              durationMinutes: 6,
              correctionsCount: 3,
              correctedSample: 'I have 3 years of experience in software development.',
              regionalExplanation: 'Experience batate waqt "I am having" ki jagah "I have" bolein.',
              timestamp: 'Yesterday, 6:15 PM',
            },
            {
              id: 'log-3',
              userId: user.uid || 'guest',
              topic: 'Pronunciation & Accent Training',
              accuracyScore: 95,
              durationMinutes: 3,
              correctionsCount: 1,
              correctedSample: 'We need to discuss the project schedule.',
              regionalExplanation: '"Discuss about" nahi, keval "Discuss" kahein.',
              timestamp: 'Aug 7, 2026',
            },
          ]);
        }
      } else {
        setLogs([
          {
            id: 'log-demo-1',
            userId: 'demo',
            topic: 'Talking About Past Activities',
            accuracyScore: 90,
            durationMinutes: 5,
            correctionsCount: 2,
            correctedSample: 'I went to work early yesterday.',
            regionalExplanation: 'Hindi: kal beet chuke samay ke liye past tense verb use hoti hai.',
            timestamp: 'Today, 10:00 AM',
          },
        ]);
      }
      setIsLoading(false);
    };

    loadLogs();
  }, [user.uid]);

  // Aggregate stats
  const totalLogsCount = logs.length;
  const avgAccuracy = totalLogsCount > 0 
    ? Math.round(logs.reduce((acc, curr) => acc + curr.accuracyScore, 0) / totalLogsCount) 
    : 90;
  const totalSpokenMins = logs.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  return (
    <div className="flex-1 px-4 pt-3 pb-24 space-y-4">
      {/* Top Tab Switcher */}
      <div className={`p-1 rounded-2xl border flex items-center gap-1 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <button
          onClick={() => setActiveTab('vault')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'vault'
              ? 'bg-indigo-500 text-slate-950 shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Mistake Vault & SRS</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'logs'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Practice Logs</span>
        </button>
      </div>

      {/* TAB 1: MISTAKE VAULT & SRS FLASHCARDS */}
      {activeTab === 'vault' && (
        <MistakeVaultView
          user={user}
          theme={theme}
        />
      )}

      {/* TAB 2: PRACTICE LOGS & STATS */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold font-heading flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-400" />
              <span>Practice Logs & Feedback</span>
            </h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {totalLogsCount} Saved
            </span>
          </div>

      {/* Aggregate Stats Bar */}
      <div className={`p-4 rounded-2xl border grid grid-cols-3 gap-2 text-center ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Sessions
          </span>
          <span className="text-base font-extrabold text-emerald-400 font-heading">
            {totalLogsCount}
          </span>
        </div>

        <div className="border-x border-slate-800">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Avg Accuracy
          </span>
          <span className="text-base font-extrabold text-amber-400 font-heading">
            {avgAccuracy}%
          </span>
        </div>

        <div>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Time Spoken
          </span>
          <span className="text-base font-extrabold text-teal-400 font-heading">
            {totalSpokenMins} mins
          </span>
        </div>
      </div>

      {/* Logs List */}
      {isLoading ? (
        <div className="py-12 text-center space-y-2 text-slate-400 text-xs">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-400" />
          <span>Fetching practice logs from Firestore...</span>
        </div>
      ) : logs.length === 0 ? (
        <div className="py-12 text-center space-y-2 text-slate-400 text-xs">
          <Mic className="w-8 h-8 text-slate-600 mx-auto" />
          <p>No practice sessions recorded yet.</p>
          <p className="text-[11px] text-slate-500">
            Start speaking in Practice tab to log your AI feedback!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              onClick={() => setSelectedLog(log)}
              className={`p-4 rounded-2xl border cursor-pointer space-y-2.5 transition-all active:scale-[0.99] ${
                isDark 
                  ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700' 
                  : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-medium text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {log.timestamp.includes('T') ? new Date(log.timestamp).toLocaleDateString() : log.timestamp}
                </span>

                <span className="font-extrabold text-xs px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  {log.accuracyScore}% Score
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-100">{log.topic}</h3>

              {log.correctedSample && (
                <p className="text-xs text-slate-300 line-clamp-1 italic bg-slate-950/40 p-2 rounded-xl border border-slate-800/80">
                  "{log.correctedSample}"
                </p>
              )}

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                <span className="text-slate-400 text-[11px]">
                  {log.durationMinutes} min spoken • {log.correctionsCount} AI tips
                </span>

                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <span>View Details</span>
                  <Sparkles className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4 animate-in fade-in">
          <div className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl border p-5 space-y-4 animate-in slide-in-from-bottom duration-200 ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Award className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400">
                    Accuracy Score: {selectedLog.accuracyScore}/100
                  </span>
                  <h3 className="text-base font-extrabold font-heading">
                    {selectedLog.topic}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corrected expression */}
            {selectedLog.correctedSample && (
              <div className="space-y-1 bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 text-xs">
                <div className="font-extrabold text-emerald-400 uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Model English Expression</span>
                </div>
                <p className="text-sm font-semibold text-slate-100">
                  "{selectedLog.correctedSample}"
                </p>
              </div>
            )}

            {/* Regional Explanation */}
            {selectedLog.regionalExplanation && (
              <div className="space-y-1 bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20 text-xs">
                <div className="font-extrabold text-amber-400 uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Regional Language Tutor Note</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedLog.regionalExplanation}
                </p>
              </div>
            )}

            <button
              onClick={() => setSelectedLog(null)}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 text-slate-200 font-extrabold text-xs hover:bg-slate-700 transition-colors"
            >
              Close Log Details
            </button>
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
};
