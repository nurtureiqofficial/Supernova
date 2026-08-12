import React, { useState } from 'react';
import { 
  Sparkles, Award, Lock, CheckCircle2, Play, ChevronRight, Star,
  BookOpen, HelpCircle, ShieldCheck, Flame, Zap, ArrowRight, X, Check, RefreshCw, Search, Filter
} from 'lucide-react';
import { UserProfile, ThemeMode, CEFRLevelCode, CEFRUnitLesson } from '../../types';
import { CEFR_STAGES } from '../../data/cefrSyllabus';

interface RoadmapViewProps {
  user: UserProfile;
  theme: ThemeMode;
  onStartLesson: (lessonId: string, lessonTitle?: string, lessonContext?: any) => void;
  onUpdateCefrLevel: (level: CEFRLevelCode) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  user,
  theme,
  onStartLesson,
  onUpdateCefrLevel,
}) => {
  const isDark = theme === 'dark';
  const [selectedLevelCode, setSelectedLevelCode] = useState<CEFRLevelCode>(
    user.cefrLevel || 'A1'
  );
  const [selectedLessonModal, setSelectedLessonModal] = useState<CEFRUnitLesson | null>(null);
  const [showPlacementTestModal, setShowPlacementTestModal] = useState<boolean>(false);
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({});
  const [testResultLevel, setTestResultLevel] = useState<CEFRLevelCode | null>(null);

  // Requirement 3: Direct Filter & Search in Roadmap
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [topicFilter, setTopicFilter] = useState<string>('all');

  const topicFilterOptions = [
    { id: 'all', label: 'All Lessons 🎯' },
    { id: 'interview', label: 'Interview & Career 💼' },
    { id: 'grammar', label: 'Grammar & Rules 📝' },
    { id: 'vocab', label: 'Vocab & Phrases 💬' },
    { id: 'pronunciation', label: 'Pronunciation 🎙️' },
    { id: 'daily', label: 'Daily Fluency 🗣️' },
  ];

  const matchesFilter = (lesson: CEFRUnitLesson) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const titleMatch = lesson.title.toLowerCase().includes(q) || lesson.titleRegional.toLowerCase().includes(q);
      const goalMatch = lesson.speakingGoal.toLowerCase().includes(q);
      const grammarMatch = lesson.grammarFocus.toLowerCase().includes(q);
      const vocabMatch = lesson.vocabFocus.toLowerCase().includes(q);
      if (!titleMatch && !goalMatch && !grammarMatch && !vocabMatch) return false;
    }

    if (topicFilter === 'interview') {
      const text = (lesson.title + ' ' + lesson.speakingGoal + ' ' + lesson.vocabFocus).toLowerCase();
      return text.includes('interview') || text.includes('career') || text.includes('work') || text.includes('office') || text.includes('business') || text.includes('meeting') || text.includes('job');
    }
    if (topicFilter === 'grammar') {
      const text = (lesson.title + ' ' + lesson.grammarFocus + ' ' + lesson.speakingGoal).toLowerCase();
      return text.includes('grammar') || text.includes('tense') || text.includes('verb') || text.includes('conditional') || text.includes('passive') || text.includes('preposition') || text.includes('structure');
    }
    if (topicFilter === 'vocab') {
      const text = (lesson.title + ' ' + lesson.vocabFocus).toLowerCase();
      return text.includes('vocab') || text.includes('word') || text.includes('phrase') || text.includes('collocation') || text.includes('idiom') || text.includes('slang');
    }
    if (topicFilter === 'pronunciation') {
      const text = (lesson.title + ' ' + lesson.speakingGoal + ' ' + lesson.vocabFocus).toLowerCase();
      return text.includes('pronunciation') || text.includes('accent') || text.includes('sound') || text.includes('stress') || text.includes('phonetic') || text.includes('silent');
    }
    if (topicFilter === 'daily') {
      const text = (lesson.title + ' ' + lesson.speakingGoal).toLowerCase();
      return text.includes('daily') || text.includes('greeting') || text.includes('routine') || text.includes('food') || text.includes('family') || text.includes('travel') || text.includes('shopping') || text.includes('casual');
    }

    return true;
  };

  const activeStage = CEFR_STAGES.find((s) => s.code === selectedLevelCode) || CEFR_STAGES[0];

  // Placement Test Questions (5 Diagnostic Questions)
  const placementQuestions = [
    {
      id: 1,
      question: 'Which sentence is grammatically correct?',
      options: [
        'I am going to office yesterday.',
        'I went to the office yesterday.',
        'I have go to office yesterday.',
        'I will went to office yesterday.'
      ],
      correctIdx: 1,
      levelPoints: 'A1'
    },
    {
      id: 2,
      question: 'How do you politely order coffee at a restaurant?',
      options: [
        'Give me one coffee now.',
        'I want coffee fast.',
        'Could I have a hot coffee, please?',
        'Bring coffee to my table.'
      ],
      correctIdx: 2,
      levelPoints: 'A1'
    },
    {
      id: 3,
      question: 'Choose the best response in a job interview: "Tell me about yourself."',
      options: [
        'My name is Rahul and I like watching movies on Sunday.',
        'I bring 3 years of hands-on software experience and strong problem-solving skills.',
        'I am looking for high salary job only.',
        'My father is shopkeeper in Delhi.'
      ],
      correctIdx: 1,
      levelPoints: 'B1'
    },
    {
      id: 4,
      question: 'What does the corporate idiom "Let\'s touch base tomorrow" mean?',
      options: [
        'Let\'s play baseball tomorrow.',
        'Let\'s touch the ground together.',
        'Let\'s connect briefly to talk or update each other tomorrow.',
        'Let\'s cancel our meeting.'
      ],
      correctIdx: 2,
      levelPoints: 'B2'
    },
    {
      id: 5,
      question: 'Which phrase expresses polite disagreement in an official meeting?',
      options: [
        'You are completely wrong!',
        'I see your point; however, we might face timeline constraints.',
        'Your idea is bad.',
        'Shut up and listen to me.'
      ],
      correctIdx: 1,
      levelPoints: 'C1'
    }
  ];

  const handleCalculateTestResult = () => {
    let score = 0;
    placementQuestions.forEach((q) => {
      if (testAnswers[q.id] === q.correctIdx) {
        score += 1;
      }
    });

    let assignedLevel: CEFRLevelCode = 'A1';
    if (score === 5) assignedLevel = 'C1';
    else if (score === 4) assignedLevel = 'B2';
    else if (score === 3) assignedLevel = 'B1';
    else if (score === 2) assignedLevel = 'A2';
    else assignedLevel = 'A1';

    setTestResultLevel(assignedLevel);
  };

  return (
    <div className="flex-1 px-4 pt-3 pb-24 space-y-5">
      {/* Header Banner */}
      <div className={`relative rounded-3xl p-5 border shadow-md overflow-hidden transition-colors ${
        isDark 
          ? 'bg-gradient-to-br from-[#1c193c] via-[#24204d] to-[#16142e] border-[#2e285a] text-white shadow-indigo-950/40' 
          : 'bg-gradient-to-br from-[#fbf7f1] via-[#f7f0e8] to-[#ede7f8] border-[#e8ded0] text-slate-900 shadow-slate-200/80'
      }`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#2563eb]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 bg-[#2563eb]/15 text-[#2563eb] text-xs font-extrabold px-3 py-1 rounded-full border border-[#2563eb]/30">
              <Award className="w-3.5 h-3.5" />
              <span>CEFR International Syllabus</span>
            </div>

            <button
              onClick={() => {
                setTestAnswers({});
                setTestResultLevel(null);
                setShowPlacementTestModal(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 shadow-sm active:scale-95 transition-all ${
                isDark 
                  ? 'bg-[#211e47] hover:bg-[#2b275b] text-amber-300 border-[#2d285e]' 
                  : 'bg-white hover:bg-slate-50 text-amber-600 border-slate-200/90'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Test My Level</span>
            </button>
          </div>

          <div>
            <h2 className={`text-xl font-black font-heading tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              English Speaking Roadmap
            </h2>
            <p className={`text-xs leading-relaxed mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Step-by-step CEFR syllabus designed to take you from A1 Beginner to C1 Fluent speaker.
            </p>
          </div>

          {/* Active Level Badge Indicator */}
          <div className={`pt-1 flex items-center justify-between p-3 rounded-2xl border ${
            isDark ? 'bg-[#131128] border-[#282352]' : 'bg-white/90 border-slate-200/90 shadow-sm'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{activeStage.badgeIcon}</span>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563eb]">
                  Current Target Stage
                </div>
                <div className={`text-sm font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {activeStage.code} - {activeStage.name}
                </div>
              </div>
            </div>

            <span className="text-xs font-extrabold text-[#ea580c] bg-[#ff7854]/15 px-2.5 py-1 rounded-lg border border-[#ff7854]/30">
              {activeStage.completedLessons} / {activeStage.totalLessons} Done
            </span>
          </div>
        </div>
      </div>

      {/* CEFR Level Selector Tabs (A1 -> C1) */}
      <div className="space-y-2">
        <label className={`text-xs font-bold uppercase tracking-wider block px-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Select CEFR Level:
        </label>
        <div className={`grid grid-cols-5 gap-1.5 p-1.5 rounded-2xl border ${
          isDark ? 'bg-[#181635]/80 border-[#282352]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          {CEFR_STAGES.map((stage) => {
            const isSelected = stage.code === selectedLevelCode;
            return (
              <button
                key={stage.code}
                onClick={() => setSelectedLevelCode(stage.code)}
                className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95 ${
                  isSelected
                    ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/25'
                    : isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-[#211e47]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className="text-[10px]">{stage.badgeIcon}</span>
                <span>{stage.code}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Level Description Banner */}
      <div className={`p-4 rounded-2xl border space-y-1.5 ${
        isDark ? 'bg-[#181635] border-[#282352]' : 'bg-white border-slate-200/90 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#2563eb] flex items-center gap-1.5">
            <span>Level {activeStage.code}: {activeStage.name}</span>
          </h3>
          <span className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {activeStage.units.length} Learning Units
          </span>
        </div>
        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {activeStage.description}
        </p>
        <p className="text-xs font-semibold text-[#2563eb] pt-0.5">
          💡 {activeStage.descriptionRegional}
        </p>
      </div>

      {/* Requirement 3: Direct Search Bar & Topic Filter Pills */}
      <div className="space-y-2.5 pt-1">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons by topic, grammar, vocabulary..."
            className={`w-full pl-10 pr-9 py-2.5 rounded-2xl text-xs font-semibold outline-none transition-all ${
              isDark 
                ? 'bg-[#181635] border border-[#282352] text-slate-100 placeholder-slate-500 focus:border-[#2563eb]' 
                : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#2563eb] shadow-sm'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Topic Filter Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {topicFilterOptions.map((f) => (
            <button
              key={f.id}
              onClick={() => setTopicFilter(f.id)}
              className={`px-3.5 py-2 rounded-2xl text-[11px] font-black whitespace-nowrap transition-all active:scale-95 shadow-sm ${
                topicFilter === f.id
                  ? 'bg-[#2563eb] text-white font-black shadow-blue-500/25'
                  : isDark 
                    ? 'bg-[#181635] text-slate-300 border border-[#282352] hover:bg-[#201d45] hover:border-[#2563eb]/40' 
                    : 'bg-[#FAF6F0] text-slate-700 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step-by-Step Interactive Syllabus Path (Units & Lessons) */}
      <div className="space-y-6 pt-2">
        {activeStage.units.map((unit) => {
          const visibleLessons = unit.lessons.filter(matchesFilter);
          if (visibleLessons.length === 0) return null;

          return (
            <div key={unit.unitNumber} className="space-y-3">
              {/* Unit Header */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                isDark ? 'bg-[#181635] border-[#282352]' : 'bg-white border-slate-200/90 shadow-sm'
              }`}>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#1d4ed8] bg-[#e0dbfa] px-2.5 py-0.5 rounded-full border border-[#c7beea]">
                    Unit {unit.unitNumber}
                  </span>
                  <h4 className={`text-sm font-extrabold font-heading pt-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    {unit.unitTitle}
                  </h4>
                  <p className="text-xs font-semibold text-[#2563eb]">
                    {unit.unitTitleRegional}
                  </p>
                </div>
              </div>

              {/* Vertical Connected Lesson Nodes Path */}
              <div className="relative pl-6 space-y-4 border-l-2 border-[#2563eb]/30 ml-4">
                {visibleLessons.map((lesson, idx) => {
                  return (
                    <div key={lesson.id} className="relative group">
                      {/* Node Dot / Icon */}
                      <div className={`absolute -left-[31px] top-4 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ring-4 ${
                        lesson.isCompleted
                          ? 'bg-[#2563eb] text-white ring-[#2563eb]/30 shadow-md shadow-blue-500/25'
                          : lesson.isCurrent
                          ? 'bg-[#ff7854] text-white ring-[#ff7854]/40 animate-pulse'
                          : isDark ? 'bg-[#181635] text-slate-500 ring-[#282352] border border-[#282352]' : 'bg-slate-200 text-slate-500 ring-slate-100 border border-slate-300'
                      }`}>
                        {lesson.isCompleted ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : lesson.isLocked ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>

                      {/* Lesson Card Container */}
                      <div
                        onClick={() => setSelectedLessonModal(lesson)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.99] ${
                          lesson.isCurrent
                            ? isDark 
                              ? 'bg-[#1c193c] border-[#ff7854]/60 shadow-lg shadow-[#ff7854]/10 ring-1 ring-[#ff7854]/30' 
                              : 'bg-white border-[#ff7854]/60 shadow-lg shadow-[#ff7854]/10 ring-1 ring-[#ff7854]/30'
                            : lesson.isCompleted
                            ? isDark ? 'bg-[#181635]/90 border-[#2563eb]/40 hover:border-[#2563eb]/60' : 'bg-white border-[#2563eb]/40 hover:border-[#2563eb]/60 shadow-sm'
                            : isDark ? 'bg-[#181635]/60 border-[#282352] opacity-80' : 'bg-white border-slate-200/90 shadow-sm'
                        }`}
                      >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              lesson.isCompleted
                                ? 'bg-[#2563eb]/15 text-[#2563eb]'
                                : lesson.isCurrent
                                ? 'bg-[#ff7854]/15 text-[#ea580c] font-extrabold'
                                : isDark ? 'bg-[#211e47] text-slate-400' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {lesson.isCompleted ? 'Completed' : lesson.isCurrent ? 'Active Now' : 'Step ' + (idx + 1)}
                            </span>

                            <span className="text-[10px] font-bold text-[#ea580c] bg-[#ff7854]/15 px-2 py-0.5 rounded-full border border-[#ff7854]/30 flex items-center gap-0.5">
                              <Zap className="w-3 h-3 fill-[#ea580c]" />
                              +{lesson.xpReward} XP
                            </span>
                          </div>

                          <h5 className={`font-extrabold text-sm pt-0.5 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                            {lesson.title}
                          </h5>
                          <p className="text-xs text-[#2563eb] font-semibold">
                            {lesson.titleRegional}
                          </p>

                          <div className={`pt-1 text-xs line-clamp-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            <span className={`font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Goal: </span>
                            {lesson.speakingGoal}
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartLesson(lesson.id, lesson.title, lesson);
                          }}
                          className={`shrink-0 h-11 px-3.5 rounded-2xl flex items-center justify-center gap-1.5 font-extrabold text-[11px] shadow-md transition-transform active:scale-95 ${
                            lesson.isCurrent || lesson.isCompleted
                              ? 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-blue-500/20'
                              : isDark ? 'bg-[#211e47] text-slate-300 border border-[#2d285e]' : 'bg-[#FAF6F0] text-slate-700 border border-slate-200'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Practice Topic</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {activeStage.units.every(u => u.lessons.filter(matchesFilter).length === 0) && (
        <div className={`text-center py-10 px-4 rounded-3xl border space-y-3 ${
          isDark ? 'bg-[#181635] border-[#282352]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-[#2563eb]/15 text-[#2563eb] flex items-center justify-center mx-auto text-xl">
            🔍
          </div>
          <h4 className={`text-sm font-extrabold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>No lessons matched your search</h4>
          <p className={`text-xs max-w-xs mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Try searching with different keywords like "Grammar", "Interview", "Past", or reset your filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setTopicFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#2563eb] text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-transform"
          >
            Reset Search & Filters
          </button>
        </div>
      )}
    </div>

      {/* Interactive Lesson Detail Drawer Modal */}
      {selectedLessonModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl border p-5 space-y-4 ${
            isDark ? 'bg-[#181635] border-[#282352] text-slate-100' : 'bg-[#FAF6F0] border-slate-200 text-slate-900 shadow-2xl'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-[#282352]' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#2563eb]/15 text-[#2563eb] border border-[#2563eb]/30">
                  <BookOpen className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-[#2563eb]">
                    CEFR Syllabus • {selectedLessonModal.durationMins} Mins
                  </span>
                  <h3 className={`text-base font-extrabold font-heading ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    {selectedLessonModal.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedLessonModal(null)}
                className={`p-1.5 rounded-full ${isDark ? 'hover:bg-[#211e47] text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Regional Explanation Title */}
            <div className="p-3 rounded-2xl bg-[#2563eb]/10 border border-[#2563eb]/20 text-xs font-bold text-[#2563eb]">
              💡 {selectedLessonModal.titleRegional}
            </div>

            {/* Speaking Goal & Grammar Focus Card */}
            <div className={`space-y-2 p-3.5 rounded-2xl border text-xs ${
              isDark ? 'bg-[#131128] border-[#282352]' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div>
                <span className="font-extrabold text-[#ea580c] uppercase text-[10px] tracking-wider block">
                  🎯 Speaking Goal:
                </span>
                <p className={`font-medium pt-0.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {selectedLessonModal.speakingGoal}
                </p>
              </div>

              <div className={`pt-2 border-t ${isDark ? 'border-[#282352]' : 'border-slate-100'}`}>
                <span className="font-extrabold text-[#2563eb] uppercase text-[10px] tracking-wider block">
                  📘 Grammar & Vocabulary Focus:
                </span>
                <p className={`pt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {selectedLessonModal.grammarFocus} • {selectedLessonModal.vocabFocus}
                </p>
              </div>
            </div>

            {/* Target Spoken Phrases List */}
            <div className={`space-y-1.5 p-3 rounded-2xl border text-xs ${
              isDark ? 'bg-[#131128] border-[#282352]' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <span className={`font-bold text-[11px] uppercase tracking-wide block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Target Speaking Phrases:
              </span>
              <ul className={`space-y-1 pl-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {selectedLessonModal.targetPhrases.map((phrase, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
                    <span>{phrase}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Start Practice CTA Button */}
            <button
              onClick={() => {
                const lessonId = selectedLessonModal.id;
                const lessonTitle = selectedLessonModal.title;
                const lessonObj = selectedLessonModal;
                setSelectedLessonModal(null);
                onStartLesson(lessonId, lessonTitle, lessonObj);
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-98 transition-transform"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              <span>Practice This Topic with Nova AI (+{selectedLessonModal.xpReward} XP)</span>
            </button>
          </div>
        </div>
      )}

      {/* Placement Diagnostic Test Modal */}
      {showPlacementTestModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-md rounded-3xl border p-5 space-y-4 max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-[#181635] border-[#282352] text-slate-100' : 'bg-[#FAF6F0] border-slate-200 text-slate-900 shadow-2xl'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-[#282352]' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#2563eb]" />
                <h3 className="font-extrabold text-base">CEFR Level Diagnostic Test</h3>
              </div>
              <button
                onClick={() => setShowPlacementTestModal(false)}
                className={`p-1 rounded-full ${isDark ? 'hover:bg-[#211e47] text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!testResultLevel ? (
              <div className="space-y-4">
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Answer these 5 quick diagnostic questions to automatically discover your current CEFR level!
                </p>

                {placementQuestions.map((q, idx) => (
                  <div key={q.id} className={`p-3.5 rounded-2xl border space-y-2 text-xs ${
                    isDark ? 'bg-[#131128] border-[#282352]' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <p className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {idx + 1}. {q.question}
                    </p>
                    <div className="space-y-1.5 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = testAnswers[q.id] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => setTestAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                            className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                              isChosen
                                ? 'bg-[#2563eb]/20 border-[#2563eb] text-[#2563eb] font-bold'
                                : isDark ? 'bg-[#181635] border-[#282352] text-slate-300 hover:bg-[#211e47]' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  disabled={Object.keys(testAnswers).length < placementQuestions.length}
                  onClick={handleCalculateTestResult}
                  className="w-full py-3 rounded-2xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 disabled:opacity-50 active:scale-95 transition-transform"
                >
                  Evaluate My CEFR Level
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="w-16 h-16 rounded-3xl bg-[#2563eb]/20 border border-[#2563eb]/40 text-[#2563eb] flex items-center justify-center mx-auto text-2xl font-black shadow-lg">
                  {testResultLevel}
                </div>

                <div className="space-y-1">
                  <h4 className={`text-lg font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    Your Evaluated CEFR Level: {testResultLevel}
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Great job! We have set your learning roadmap target to level {testResultLevel}.
                  </p>
                </div>

                <button
                  onClick={() => {
                    onUpdateCefrLevel(testResultLevel);
                    setSelectedLevelCode(testResultLevel);
                    setShowPlacementTestModal(false);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition-transform"
                >
                  Apply & Lock Level {testResultLevel}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
