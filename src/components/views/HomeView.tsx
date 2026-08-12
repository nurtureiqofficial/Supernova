import React, { useState } from 'react';
import { 
  Play, Headphones, Mic, Sparkles, ChevronRight, Award, 
  MessageSquare, BookOpen, Volume2, Filter, X, Zap, CheckCircle2, Star, Target, Compass
} from 'lucide-react';
import { UserProfile, ThemeMode, LessonModule, CEFRUnitLesson } from '../../types';
import { CEFR_STAGES } from '../../data/cefrSyllabus';
import novaAvatarUrl from '../../assets/images/nova_ai_teacher_1786287491962.jpg';

interface HomeViewProps {
  user: UserProfile;
  theme: ThemeMode;
  onStartLesson: (lessonId: string, lessonTitle?: string, lessonContext?: any) => void;
  onSelectLanguage: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  theme,
  onStartLesson,
  onSelectLanguage,
}) => {
  const isDark = theme === 'dark';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModuleModal, setActiveModuleModal] = useState<LessonModule | null>(null);
  const [showStudentGuide, setShowStudentGuide] = useState<boolean>(false);
  const [showAllModules, setShowAllModules] = useState<boolean>(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState<'shadowing' | 'speedDrills' | 'voiceClub'>('shadowing');
  
  // Phase 4: Onboarding State
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [selectedLevel, setSelectedLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [selectedGoal, setSelectedGoal] = useState<string>('Daily Fluent Conversation');
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(() => {
    return localStorage.getItem('supernova_onboarded') === 'true';
  });

  // Auto show onboarding on first launch if not completed
  React.useEffect(() => {
    if (!isOnboardingCompleted && user.completedLessonsCount === 0) {
      setShowStudentGuide(true);
    }
  }, [isOnboardingCompleted, user.completedLessonsCount]);

  // Helper to find next recommended CEFR lesson based on user's progress
  const getNextRecommendedCefrLesson = (): { stageCode: string; stageName: string; unitNumber: number; unitTitle: string; lesson: CEFRUnitLesson } | null => {
    // Look through current user level first, then higher levels
    const targetStage = CEFR_STAGES.find(s => s.code === (user.cefrLevel || 'A1')) || CEFR_STAGES[0];
    
    // Find first uncompleted lesson in current stage
    for (const unit of targetStage.units) {
      for (const lesson of unit.lessons) {
        if (!lesson.isCompleted || lesson.isCurrent) {
          return {
            stageCode: targetStage.code,
            stageName: targetStage.name,
            unitNumber: unit.unitNumber,
            unitTitle: unit.unitTitle,
            lesson
          };
        }
      }
    }

    // Fallback: search across all stages for first uncompleted lesson
    for (const stage of CEFR_STAGES) {
      for (const unit of stage.units) {
        for (const lesson of unit.lessons) {
          if (!lesson.isCompleted) {
            return {
              stageCode: stage.code,
              stageName: stage.name,
              unitNumber: unit.unitNumber,
              unitTitle: unit.unitTitle,
              lesson
            };
          }
        }
      }
    }

    // Default first lesson
    const firstStage = CEFR_STAGES[0];
    const firstUnit = firstStage.units[0];
    return {
      stageCode: firstStage.code,
      stageName: firstStage.name,
      unitNumber: firstUnit.unitNumber,
      unitTitle: firstUnit.unitTitle,
      lesson: firstUnit.lessons[0]
    };
  };

  const nextCefrInfo = getNextRecommendedCefrLesson();

  const modulesList: (LessonModule & { targetPhrases?: string[]; cefrTag?: string })[] = [
    {
      id: 'module-daily-1',
      title: 'Talking About Past Activities',
      titleRegional: 'Past actions के बारे में बताना सीखें',
      category: 'daily',
      level: 'Beginner',
      cefrTag: 'A1 Beginner',
      durationMinutes: 5,
      xpReward: 50,
      progressPercent: 20,
      description: 'Master past tense verbs ("went", "saw", "enjoyed") in everyday casual conversations.',
      iconName: 'Headphones',
      accentColor: 'from-emerald-500 to-teal-600',
      targetPhrases: ['"I went to the market yesterday"', '"We enjoyed the dinner"', '"I met my old friends"'],
    },
    {
      id: 'module-daily-2',
      title: 'Daily Scenarios: Ordering Food',
      titleRegional: 'Restaurant में Order देना सीखें',
      category: 'daily',
      level: 'Beginner',
      cefrTag: 'A1 Beginner',
      durationMinutes: 5,
      xpReward: 60,
      progressPercent: 0,
      description: 'Practice polite ordering phrases and asking for recommendations with Nova.',
      iconName: 'MessageSquare',
      accentColor: 'from-amber-500 to-orange-600',
      targetPhrases: ['"Could I have the menu please?"', '"What do you recommend?"', '"Check please!"'],
    },
    {
      id: 'module-interview-1',
      title: 'Job Interview Essentials',
      titleRegional: 'Interview में आत्मविश्वास से बोलें',
      category: 'interview',
      level: 'Intermediate',
      cefrTag: 'B1 Intermediate',
      durationMinutes: 8,
      xpReward: 100,
      progressPercent: 0,
      description: 'Confidently answer "Tell me about yourself" and highlight professional strengths.',
      iconName: 'Mic',
      accentColor: 'from-blue-500 to-indigo-600',
      targetPhrases: ['"I have 3 years of experience in..."', '"My key strength is problem-solving"', '"I look forward to..."'],
    },
    {
      id: 'module-pronunciation-1',
      title: 'Pronunciation & Word Stress',
      titleRegional: 'सही उच्चारण और Word Accent सीखें',
      category: 'pronunciation',
      level: 'Beginner',
      cefrTag: 'A2 Pre-Int',
      durationMinutes: 6,
      xpReward: 75,
      progressPercent: 0,
      description: 'Fix common Indian English pronunciation slips like "discuss" vs "discass".',
      iconName: 'Volume2',
      accentColor: 'from-purple-500 to-pink-600',
      targetPhrases: ['"Discuss (dis-cuss)"', '"Develop (de-vel-op)"', '"Schedule (skej-ool)"'],
    },
    {
      id: 'module-listening-1',
      title: 'Listening Comprehension: Fast Speech',
      titleRegional: 'अंग्रेजी ध्यान से सुनें और समझें',
      category: 'listening',
      level: 'Intermediate',
      cefrTag: 'B2 Upper-Int',
      durationMinutes: 7,
      xpReward: 85,
      progressPercent: 0,
      description: 'Train your ear to recognize native English contractions, linking words, and fast accents.',
      iconName: 'Headphones',
      accentColor: 'from-teal-500 to-cyan-600',
      targetPhrases: ['"Gonna" = Going to', '"Wanna" = Want to', '"Gotta" = Got to'],
    },
    {
      id: 'module-daily-3',
      title: 'Workplace Small Talk & Coffee Break',
      titleRegional: 'Office में सहकर्मियों से बातचीत करें',
      category: 'daily',
      level: 'Intermediate',
      cefrTag: 'B1 Intermediate',
      durationMinutes: 5,
      xpReward: 65,
      progressPercent: 0,
      description: 'Learn casual office conversations, asking about weekend plans, and team bonding phrases.',
      iconName: 'MessageSquare',
      accentColor: 'from-amber-500 to-yellow-600',
      targetPhrases: ['"How was your weekend?"', '"Any big plans for tonight?"', '"Let\'s grab coffee!"'],
    },
    {
      id: 'module-interview-2',
      title: 'Answering "Why Should We Hire You?"',
      titleRegional: 'Interview में खुद को साबित करना सीखें',
      category: 'interview',
      level: 'Advanced',
      cefrTag: 'B2 Upper-Int',
      durationMinutes: 7,
      xpReward: 95,
      progressPercent: 0,
      description: 'Structure impact-driven answers highlighting past achievements with confidence.',
      iconName: 'Mic',
      accentColor: 'from-blue-600 to-indigo-700',
      targetPhrases: ['"I bring a proven track record of..."', '"My skill set aligns perfectly with..."'],
    },
    {
      id: 'module-pronunciation-2',
      title: 'Silent Letters & Tongue Twisters',
      titleRegional: 'Silent letters और मुश्किल शब्दों का अभ्यास',
      category: 'pronunciation',
      level: 'Intermediate',
      cefrTag: 'B1 Intermediate',
      durationMinutes: 6,
      xpReward: 70,
      progressPercent: 0,
      description: 'Master silent letters in words like "Knee", "Doubt", "Receipt", "Subtle", and "Wednesday".',
      iconName: 'Volume2',
      accentColor: 'from-purple-600 to-indigo-600',
      targetPhrases: ['"Doubt (dowt)"', '"Receipt (re-seet)"', '"Subtle (sut-l)"'],
    },
  ];

  const categories = [
    { id: 'all', label: 'All Modules' },
    { id: 'daily', label: 'Daily Practice' },
    { id: 'interview', label: 'Job Interviews' },
    { id: 'pronunciation', label: 'Pronunciation' },
    { id: 'listening', label: 'Listening' },
  ];

  const filteredModules = selectedCategory === 'all'
    ? modulesList
    : modulesList.filter((m) => m.category === selectedCategory);

  const displayedModules = (!showAllModules && selectedCategory === 'all')
    ? filteredModules.slice(0, 4)
    : filteredModules;

  return (
    <div className="flex-1 px-4 pt-3 pb-24 space-y-5">
      {/* Student Guide Roadmap Button */}
      <button
        onClick={() => setShowStudentGuide(true)}
        className={`w-full p-4 rounded-3xl border transition-all active:scale-[0.99] flex items-center justify-between shadow-md group ${
          isDark
            ? 'bg-gradient-to-r from-[#1c193c] via-[#24204d] to-[#16142e] border-[#2e285a] text-amber-300 hover:border-[#2563eb]/60'
            : 'bg-gradient-to-r from-[#fef8f3] via-[#f9f3ea] to-[#f4eeea] border-[#eee5d8] text-slate-900 hover:border-[#2563eb]/40 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#2563eb]/15 text-[#2563eb] font-bold flex items-center justify-center text-lg border border-[#2563eb]/30 shrink-0 shadow-inner group-hover:scale-110 transition-transform">
            🧭
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                isDark ? 'bg-[#2563eb]/20 text-[#3b82f6] border-[#2563eb]/30' : 'bg-[#e0dbfa] text-[#1d4ed8] border-[#c7beea]'
              }`}>
                Guide • मार्गदर्शिका
              </span>
            </div>
            <div className={`text-xs sm:text-sm font-black mt-0.5 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              📖 How to Use Supernova • ऐप का उपयोग कैसे करें
            </div>
          </div>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform border ${
          isDark ? 'bg-[#2563eb]/15 border-[#2563eb]/30 text-[#3b82f6]' : 'bg-[#2563eb]/10 border-[#2563eb]/20 text-[#2563eb]'
        }`}>
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>

      {/* PHASE 1: "START HERE" Single Primary Action Card (Hero Banner matching uploaded app UI) */}
      {nextCefrInfo && (
        <div className={`relative rounded-3xl overflow-hidden p-6 border shadow-xl space-y-4 backdrop-blur-xl ${
          isDark 
            ? 'bg-gradient-to-br from-[#1c193c] via-[#24204d] to-[#16142e] border-[#2e285a] text-white shadow-indigo-950/40' 
            : 'bg-gradient-to-br from-[#fbf7f1] via-[#f7f0e8] to-[#ede7f8] border-[#e8ded0] text-slate-900 shadow-slate-200/80'
        }`}>
          {/* Subtle Ambient Accent Light Glows */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#2563eb]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#ff7854]/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Header Tag & XP Bonus */}
          <div className="flex items-center justify-between relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#2563eb]/15 text-[#2563eb] text-[11px] font-black px-3.5 py-1.5 rounded-full border border-[#2563eb]/30 uppercase tracking-wider shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-[#2563eb] text-[#2563eb] animate-pulse" />
              <span>START HERE • पढ़ाई का अगला कदम</span>
            </div>
            <span className="text-[11px] font-black bg-[#ff7854]/15 text-[#ea580c] px-3 py-1 rounded-full border border-[#ff7854]/30 shadow-sm flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              +{nextCefrInfo.lesson.xpReward} XP
            </span>
          </div>

          {/* Primary Journey Content */}
          <div className="relative z-10 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-[#2563eb] font-extrabold uppercase tracking-wide">
              <span className="px-2.5 py-0.5 rounded-full bg-[#e0dbfa] border border-[#c7beea] text-[10px] text-[#1d4ed8] font-black">
                {nextCefrInfo.stageCode} STAGE
              </span>
              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Unit {nextCefrInfo.unitNumber}: {nextCefrInfo.unitTitle}</span>
            </div>
            <h2 className={`text-xl sm:text-2xl font-black font-heading leading-tight tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {nextCefrInfo.lesson.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#2563eb] font-bold flex items-center gap-1.5">
              <span>💡</span>
              <span>{nextCefrInfo.lesson.titleRegional}</span>
            </p>
          </div>

          {/* Key Objective Pill */}
          <div className={`relative z-10 p-3.5 rounded-2xl border text-xs space-y-1 shadow-inner ${
            isDark ? 'bg-[#141228]/90 border-[#282352] text-slate-200' : 'bg-white/80 border-slate-200/90 text-slate-700'
          }`}>
            <div className="text-[10px] font-black text-[#2563eb] uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#2563eb]" />
              <span>Speaking Objective • आज का लक्ष्य:</span>
            </div>
            <p className={`text-xs font-semibold italic pl-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              "{nextCefrInfo.lesson.speakingGoal}"
            </p>
          </div>

          {/* Electric Cobalt Blue Primary CTA Button matching reference image */}
          <button
            onClick={() => onStartLesson(nextCefrInfo.lesson.id, nextCefrInfo.lesson.title, nextCefrInfo.lesson)}
            className="w-full relative z-10 py-4 px-5 rounded-2xl font-black text-sm bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] text-white shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:brightness-110 group"
          >
            <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-white text-white shrink-0" />
            </div>
            <span className="tracking-wide">▶ CONTINUE YOUR JOURNEY (पढ़ाई शुरू करें)</span>
          </button>
        </div>
      )}

      {/* PHASE 2: 3-Step Daily Routine Bar */}
      <div className={`p-5 rounded-3xl border shadow-lg space-y-3.5 ${
        isDark 
          ? 'bg-[#181635] border-[#292354] text-white' 
          : 'bg-white border-slate-200/80 text-slate-900 shadow-slate-200/50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#2563eb]/15 text-[#2563eb] font-black flex items-center justify-center text-base border border-[#2563eb]/30 shadow-sm">
              ✨
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#2563eb]">
                Daily Routine • दैनिक 3 कदम
              </div>
              <h3 className="text-sm font-black font-heading tracking-tight">
                Today's 3-Step Daily Checklist
              </h3>
            </div>
          </div>
          <span className="text-[10px] font-black px-3 py-1 rounded-full bg-[#2563eb]/15 text-[#2563eb] border border-[#2563eb]/30 uppercase tracking-wider">
            {user.completedLessonsCount > 0 && (user.totalSpeakingMinutes || 0) > 0 ? '🎉 All Done!' : 'In Progress'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Step 1 */}
          <div 
            onClick={() => {
              if (nextCefrInfo) {
                onStartLesson(nextCefrInfo.lesson.id, nextCefrInfo.lesson.title, nextCefrInfo.lesson);
              }
            }}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between gap-2.5 ${
              user.completedLessonsCount > 0 
                ? 'bg-[#2563eb]/10 border-[#2563eb]/40 text-[#2563eb] shadow-sm' 
                : isDark ? 'bg-[#131128] border-[#282352] hover:border-[#2563eb]/40' : 'bg-[#FAF6F0] border-slate-200 hover:border-[#2563eb]/40'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-sm ${
                user.completedLessonsCount > 0 ? 'bg-[#2563eb] text-white' : 'bg-[#2563eb]/15 text-[#2563eb] border border-[#2563eb]/30'
              }`}>
                {user.completedLessonsCount > 0 ? <CheckCircle2 className="w-5 h-5 text-white" /> : '1'}
              </div>
              <div className="truncate">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Step 1</div>
                <div className="text-xs font-black truncate">📖 1 Daily Lesson</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => onStartLesson('challenge-coffee', 'Ordering Coffee at Starbucks', {
              scenario: 'Starbucks Coffee Shop Order',
              targetGoal: 'Practice ordering drinks in English'
            })}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between gap-2.5 ${
              (user.totalSpeakingMinutes || 0) > 0 
                ? 'bg-[#2563eb]/10 border-[#2563eb]/40 text-[#2563eb] shadow-sm' 
                : isDark ? 'bg-[#131128] border-[#282352] hover:border-amber-500/40' : 'bg-[#FAF6F0] border-slate-200 hover:border-amber-500/40'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-sm ${
                (user.totalSpeakingMinutes || 0) > 0 ? 'bg-[#2563eb] text-white' : 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
              }`}>
                {(user.totalSpeakingMinutes || 0) > 0 ? <CheckCircle2 className="w-5 h-5 text-white" /> : '2'}
              </div>
              <div className="truncate">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Step 2</div>
                <div className="text-xs font-black truncate">🗣️ 2-Min AI Call</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => {
              const vocabElement = document.getElementById('word-of-the-day');
              if (vocabElement) {
                vocabElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between gap-2.5 ${
              isDark ? 'bg-[#12112a] border-[#282559] hover:border-[#ff2a88]/40' : 'bg-slate-50 border-slate-200 hover:border-purple-500/40'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 bg-[#ff2a88]/20 text-[#ff2a88] border border-[#ff2a88]/30 shadow-sm">
                3
              </div>
              <div className="truncate">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Step 3</div>
                <div className="text-xs font-black truncate">🔊 1 Word & Audio</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
          </div>
        </div>
      </div>

      {/* 30-Day Lesson Challenge Progress Card */}
      <div className={`p-4 rounded-3xl border shadow-lg space-y-2.5 ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>30 Lesson Goal Challenge</span>
          </span>
          <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            {user.completedLessonsCount} / 30 Completed
          </span>
        </div>

        <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 transition-all duration-500 shadow-sm shadow-emerald-500/50"
            style={{ width: `${Math.max(8, (user.completedLessonsCount / 30) * 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Featured Practice Hub (Compact Interactive Tab Switcher) */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/50 border border-slate-800 shadow-2xl text-white space-y-3.5 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-inner">
              ⚡
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                Featured Practice Hub
              </span>
              <h3 className="text-sm sm:text-base font-black font-heading text-slate-100">
                Specialized English Gyms
              </h3>
            </div>
          </div>
          <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/40 uppercase tracking-wider">
            Interactive
          </span>
        </div>

        {/* Tab Selection Switcher Buttons */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-950/90 rounded-2xl border border-slate-800/90 text-[11px] font-black">
          <button
            onClick={() => setActiveFeatureTab('shadowing')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeFeatureTab === 'shadowing'
                ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🗣️ Shadowing</span>
          </button>
          <button
            onClick={() => setActiveFeatureTab('speedDrills')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeFeatureTab === 'speedDrills'
                ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🧠 Speed Drills</span>
          </button>
          <button
            onClick={() => setActiveFeatureTab('voiceClub')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeFeatureTab === 'voiceClub'
                ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🎙️ Voice Club</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeFeatureTab === 'shadowing' && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-amber-300 flex items-center gap-1">
                <span>🗣️ Shadowing & Phonetics Gym</span>
              </h4>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                0.75x–1.25x Speed
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Shadow native English speakers at custom speeds and master tricky pronunciations (V vs W, Silent letters).
            </p>
            <button
              onClick={() => onStartLesson('module-pronunciation-1')}
              className="w-full mt-1 py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-amber-300 font-black text-xs border border-amber-500/40 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-md"
            >
              <span>Open Shadowing & Phonetics Gym</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>
        )}

        {activeFeatureTab === 'speedDrills' && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-amber-300 flex items-center gap-1">
                <span>🧠 "Thinking in English" Speed Drills</span>
              </h4>
              <span className="text-[10px] font-black text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                ⚡ 3-5s Rapid Reflex
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Break the habit of translating Hindi in your head! Train rapid 1-second English speech reflexes.
            </p>
            <button
              onClick={() => onStartLesson('module-daily-1')}
              className="w-full mt-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-400 to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-md shadow-amber-500/20"
            >
              <span>Start Anti-Translation Speed Drills</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>
        )}

        {activeFeatureTab === 'voiceClub' && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-amber-300 flex items-center gap-1">
                <span>🎙️ 3-Minute Voice Club (Live Practice)</span>
              </h4>
              <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 animate-pulse">
                ● 48 Online Now
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Match with friendly peer English learners for a 3-minute rapid conversation card call.
            </p>
            <button
              onClick={() => onStartLesson('module-daily-1')}
              className="w-full mt-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-md shadow-emerald-500/25"
            >
              <span>Join 3-Minute Voice Club Room (+50 XP)</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>
        )}
      </div>

      {/* Word of the Day Widget */}
      <div id="word-of-the-day" className={`p-5 rounded-3xl border shadow-xl space-y-3 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950 border-purple-800/50' 
          : 'bg-gradient-to-br from-purple-50 via-white to-slate-50 border-purple-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-purple-500/20 text-purple-300 font-black flex items-center justify-center text-base border border-purple-500/30 shadow-sm">
              🔊
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                Vocab Booster • दैनिक शब्द
              </div>
              <h3 className="text-sm font-black font-heading tracking-tight">
                Word of the Day (आज का मुख्य शब्द)
              </h3>
            </div>
          </div>
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
            +10 XP
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-base font-black text-purple-300 font-heading">
              Confident <span className="text-xs font-normal text-slate-400">(Adjective • विशेषण)</span>
            </span>
            <button 
              onClick={() => {
                if ('speechSynthesis' in window) {
                  const utterance = new SpeechSynthesisUtterance("Confident");
                  utterance.lang = "en-US";
                  window.speechSynthesis.speak(utterance);
                }
              }}
              className="p-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-colors flex items-center gap-1 font-extrabold text-[10px]"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen</span>
            </button>
          </div>
          <p className="text-emerald-400 font-semibold text-[11px]">
            💡 अर्थ: आत्मविश्वासी (Feeling or showing certainty about oneself)
          </p>
          <p className="text-slate-300 pt-0.5 italic text-[11px]">
            "She felt confident before her job interview with Nova AI."
          </p>
        </div>
      </div>

      {/* Interactive Category Filter Pills & Modules */}
      <div className="space-y-3.5 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black font-heading tracking-tight">
            Learning Modules
          </h3>
          <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            {filteredModules.length} Available
          </span>
        </div>

        {/* Filter Scrollable Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setShowAllModules(false);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all active:scale-95 shadow-sm ${
                selectedCategory === cat.id
                  ? 'bg-[#2563eb] text-white font-black shadow-blue-500/25'
                  : isDark 
                    ? 'bg-[#181635] text-slate-300 border border-[#282352] hover:bg-[#201d45] hover:border-[#2563eb]/40' 
                    : 'bg-[#FAF6F0] text-slate-700 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Module Cards Grid */}
        <div className="space-y-3 pt-1">
          {displayedModules.map((mod) => (
            <div
              key={mod.id}
              onClick={() => setActiveModuleModal(mod)}
              className={`p-4 sm:p-5 rounded-3xl border cursor-pointer transition-all active:scale-[0.99] group hover:border-[#2563eb]/50 shadow-md ${
                isDark 
                  ? 'bg-gradient-to-br from-[#181635] via-[#1f1c42] to-[#121028] border-[#282352]' 
                  : 'bg-white border-slate-200/90 shadow-sm hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3.5">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {mod.cefrTag && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#e0dbfa] text-[#1d4ed8] border border-[#c7beea]">
                        {mod.cefrTag}
                      </span>
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/20">
                      {mod.durationMinutes} mins
                    </span>
                    <span className="text-[10px] font-black text-[#ea580c] bg-[#ff7854]/15 px-2 py-0.5 rounded-full border border-[#ff7854]/30 flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-[#ea580c]" />
                      +{mod.xpReward} XP
                    </span>
                  </div>

                  <h4 className={`font-black text-sm sm:text-base pt-0.5 font-heading transition-colors ${
                    isDark ? 'text-slate-100 group-hover:text-[#3b82f6]' : 'text-slate-900 group-hover:text-[#2563eb]'
                  }`}>
                    {mod.title}
                  </h4>
                  {mod.titleRegional && (
                    <p className="text-xs text-[#2563eb] font-semibold flex items-center gap-1">
                      <span>💡</span>
                      <span>{mod.titleRegional}</span>
                    </p>
                  )}
                  <p className={`text-xs leading-relaxed line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {mod.description}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartLesson(mod.id);
                  }}
                  className="shrink-0 w-12 h-12 rounded-2xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white flex flex-col items-center justify-center font-black text-[10px] shadow-lg shadow-blue-500/25 group-hover:scale-105 active:scale-95 transition-transform"
                >
                  <Play className="w-5 h-5 fill-white text-white mb-0.5" />
                  <span>START</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All / Show Fewer Toggle Button */}
        {selectedCategory === 'all' && filteredModules.length > 4 && (
          <button
            onClick={() => setShowAllModules(!showAllModules)}
            className={`w-full mt-2 py-3 px-4 rounded-2xl border font-black text-xs flex items-center justify-center gap-2 active:scale-98 transition-all ${
              isDark
                ? 'bg-slate-800/80 border-slate-700/80 text-emerald-400 hover:bg-slate-800 hover:border-emerald-500/50'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            {showAllModules ? (
              <span>Show Fewer Modules ↑</span>
            ) : (
              <div className="flex items-center gap-1.5">
                <span>View All ({filteredModules.length} Modules) ↓</span>
                <span className="text-[10px] font-normal text-slate-400">
                  (Showing top 4 popular)
                </span>
              </div>
            )}
          </button>
        )}
      </div>

      {/* Interactive Lesson Drawer Modal when clicking a card */}
      {activeModuleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4">
          <div className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl border p-5 space-y-4 animate-in slide-in-from-bottom duration-200 ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <BookOpen className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400">
                    {activeModuleModal.level} • {activeModuleModal.durationMinutes} Minutes
                  </span>
                  <h3 className="text-base font-extrabold font-heading">
                    {activeModuleModal.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveModuleModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeModuleModal.titleRegional && (
              <p className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                💡 {activeModuleModal.titleRegional}
              </p>
            )}

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeModuleModal.description}
            </p>

            {/* Target Phrases Preview */}
            {activeModuleModal.targetPhrases && (
              <div className="space-y-1.5 bg-slate-950/40 p-3 rounded-2xl border border-slate-800 text-xs">
                <div className="font-bold text-amber-400 flex items-center gap-1 text-[11px] uppercase">
                  <Target className="w-3.5 h-3.5" />
                  <span>Phrases you will speak:</span>
                </div>
                <ul className="space-y-1 text-slate-300 pl-1">
                  {activeModuleModal.targetPhrases.map((phrase, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{phrase}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-extrabold text-amber-400 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400" />
                Reward: +{activeModuleModal.xpReward} XP
              </span>
              <span className="text-slate-400">Voice Practice Mode</span>
            </div>

            <button
              onClick={() => {
                const modId = activeModuleModal.id;
                setActiveModuleModal(null);
                onStartLesson(modId);
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-98 transition-transform"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Start Speaking with Nova</span>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 4: First-Time Student Interactive Onboarding Wizard Modal */}
      {showStudentGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className={`w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border p-5 sm:p-6 space-y-5 animate-in slide-in-from-bottom duration-200 ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3.5 border-slate-800 sticky top-0 bg-slate-900/90 backdrop-blur z-10">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  🎯
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    Step {onboardingStep} of 2 • Setup Your Journey
                  </span>
                  <h3 className="text-base font-extrabold font-heading text-slate-100">
                    {onboardingStep === 1 
                      ? 'आपका वर्तमान इंग्लिश लेवल क्या है?' 
                      : 'आपका मुख्य लक्ष्य क्या है?'}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowStudentGuide(false);
                  localStorage.setItem('supernova_onboarded', 'true');
                  setIsOnboardingCompleted(true);
                }}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: Level Selection */}
            {onboardingStep === 1 && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  अपनी ज़रूरत के अनुसार अपना शुरुआती लेवल चुनें ताकि Nova AI आपको सही स्तर से सिखा सके:
                </p>

                <div className="space-y-2.5 pt-1">
                  {/* Beginner */}
                  <div
                    onClick={() => setSelectedLevel('Beginner')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all active:scale-98 space-y-1 ${
                      selectedLevel === 'Beginner'
                        ? 'bg-emerald-500/15 border-emerald-500/80 ring-2 ring-emerald-500/30 text-white'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🟢</span>
                        <span className="font-extrabold text-sm text-emerald-300">Beginner (A1 - A2)</span>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                        शुरुआती
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 pl-6">
                      बेसिक शब्द और सेंटेंस समझ आते हैं पर खुद बोलते समय हिचकिचाहट होती है।
                    </p>
                  </div>

                  {/* Intermediate */}
                  <div
                    onClick={() => setSelectedLevel('Intermediate')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all active:scale-98 space-y-1 ${
                      selectedLevel === 'Intermediate'
                        ? 'bg-amber-500/15 border-amber-500/80 ring-2 ring-amber-500/30 text-white'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🟡</span>
                        <span className="font-extrabold text-sm text-amber-300">Intermediate (B1 - B2)</span>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                        मध्यम
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 pl-6">
                      अक्सर इंग्लिश बोल लेते हैं पर सही ग्रामर, वोकैबलरी और फ्लुएंसी में सुधार चाहिए।
                    </p>
                  </div>

                  {/* Advanced */}
                  <div
                    onClick={() => setSelectedLevel('Advanced')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all active:scale-98 space-y-1 ${
                      selectedLevel === 'Advanced'
                        ? 'bg-purple-500/15 border-purple-500/80 ring-2 ring-purple-500/30 text-white'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🟣</span>
                        <span className="font-extrabold text-sm text-purple-300">Advanced (C1 - C2)</span>
                      </div>
                      <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                        उच्च
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 pl-6">
                      कॉन्फ़िडेंट इंग्लिश बोलते हैं, जॉब इंटरव्यू क्रैक करना है और बिना अटके बात करनी है।
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setOnboardingStep(2)}
                  className="w-full mt-4 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-transform"
                >
                  <span>अगला कदम: लक्ष्य चुनें (Next Step → Goal)</span>
                </button>
              </div>
            )}

            {/* STEP 2: Goal Selection */}
            {onboardingStep === 2 && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  इंग्लिश सीखने के पीछे आपका मुख्य उद्देश्य क्या है?
                </p>

                <div className="space-y-2.5 pt-1">
                  {[
                    { title: 'Daily Fluent Conversation', hindi: 'रोज़मर्रा की बातचीत में बिना अटके इंग्लिश बोलना', icon: '🗣️' },
                    { title: 'Job Interview & Career Growth', hindi: 'नौकरी के इंटरव्यू पास करना व प्रमोशन पाना', icon: '💼' },
                    { title: 'Public Speaking & Office Small Talk', hindi: 'ऑफिस मीटिंग्स व स्टेज पर आत्मविश्वास से बोलना', icon: '🎙️' },
                    { title: 'Travel & Abroad Preparation', hindi: 'विदेश यात्रा व विदेशी नागरिकों से आत्मविश्वास से बात करना', icon: '✈️' },
                  ].map((item) => (
                    <div
                      key={item.title}
                      onClick={() => setSelectedGoal(item.title)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all active:scale-98 flex items-center gap-3 ${
                        selectedGoal === item.title
                          ? 'bg-emerald-500/15 border-emerald-500/80 ring-2 ring-emerald-500/30 text-white'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="text-xl shrink-0">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-emerald-300">{item.title}</div>
                        <div className="text-[11px] text-slate-400 font-medium">{item.hindi}</div>
                      </div>
                      {selectedGoal === item.title && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                    </div>
                  ))}
                </div>

                {/* Selected Summary Badge */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/30 text-xs text-slate-300 space-y-1">
                  <div className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest">
                    🎉 Personalized Path Configured!
                  </div>
                  <div className="text-[11px] font-semibold text-white">
                    Level: <span className="text-emerald-300 font-bold">{selectedLevel}</span> • Goal: <span className="text-emerald-300 font-bold">{selectedGoal}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setOnboardingStep(1)}
                    className="py-3 px-4 rounded-2xl bg-slate-800 text-slate-300 font-extrabold text-xs"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => {
                      setShowStudentGuide(false);
                      localStorage.setItem('supernova_onboarded', 'true');
                      setIsOnboardingCompleted(true);
                      if (nextCefrInfo) {
                        onStartLesson(nextCefrInfo.lesson.id, nextCefrInfo.lesson.title, nextCefrInfo.lesson);
                      }
                    }}
                    className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-transform"
                  >
                    <span>▶ START YOUR JOURNEY NOW</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

