import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Sparkles, Volume2, RotateCcw, CheckCircle2, XCircle, 
  Plus, Filter, Clock, Award, Brain, ChevronRight, HelpCircle, Flame, Check, RefreshCw
} from 'lucide-react';
import { UserProfile, ThemeMode } from '../../types';
import { INITIAL_MISTAKES, MistakeItem } from '../../data/mistakeVaultData';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType, awardUserXpAndStats } from '../../lib/firebase';

interface MistakeVaultViewProps {
  user: UserProfile;
  theme: ThemeMode;
}

export const MistakeVaultView: React.FC<MistakeVaultViewProps> = ({ user, theme }) => {
  const isDark = theme === 'dark';

  const [mistakes, setMistakes] = useState<MistakeItem[]>(INITIAL_MISTAKES);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [mode, setMode] = useState<'review' | 'inventory'>('review');

  // SRS Flashcard Quiz State
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [reviewedTodayCount, setReviewedTodayCount] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Modal for adding custom mistake
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newIncorrect, setNewIncorrect] = useState<string>('');
  const [newCorrect, setNewCorrect] = useState<string>('');
  const [newHindi, setNewHindi] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'grammar' | 'pronunciation' | 'direct-translation' | 'vocabulary'>('grammar');

  // Sync / Load from Firestore if user is authenticated
  useEffect(() => {
    const loadUserVault = async () => {
      if (user.uid && auth.currentUser) {
        try {
          const vaultRef = doc(db, 'mistake_vaults', user.uid);
          const snap = await getDoc(vaultRef);
          if (snap.exists() && snap.data()?.items) {
            setMistakes(snap.data()?.items);
          }
        } catch (err) {
          console.warn('Could not load user vault from Firestore:', err);
        }
      }
    };
    loadUserVault();
  }, [user.uid]);

  // Persist Vault changes to Firestore
  const saveVaultToFirestore = async (updatedItems: MistakeItem[]) => {
    if (user.uid && auth.currentUser) {
      try {
        const vaultRef = doc(db, 'mistake_vaults', user.uid);
        await setDoc(vaultRef, {
          userId: user.uid,
          items: updatedItems,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `mistake_vaults/${user.uid}`);
      }
    }
  };

  // Filtered list based on category
  const dueItems = mistakes.filter((m) => m.nextReviewDate === 'Today' || m.srsLevel < 5);
  const filteredInventory = mistakes.filter((m) => {
    if (activeCategory === 'all') return true;
    return m.category === activeCategory;
  });

  const currentFlashcard = dueItems[currentCardIndex] || mistakes[0];

  // Speech TTS Handler
  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop active speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // SRS Review Feedback Rating Handler
  const handleRateFlashcard = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentFlashcard) return;

    let newLevel = currentFlashcard.srsLevel;
    let newMastery = currentFlashcard.masteryPercent;
    let nextReview = 'In 1 day';

    if (rating === 'again') {
      newLevel = 0;
      newMastery = Math.max(0, newMastery - 10);
      nextReview = 'Today';
    } else if (rating === 'hard') {
      newLevel = Math.min(5, newLevel + 1);
      newMastery = Math.min(100, newMastery + 15);
      nextReview = 'In 1 day';
    } else if (rating === 'good') {
      newLevel = Math.min(5, newLevel + 1);
      newMastery = Math.min(100, newMastery + 25);
      nextReview = 'In 3 days';
    } else if (rating === 'easy') {
      newLevel = Math.min(5, newLevel + 2);
      newMastery = Math.min(100, newMastery + 40);
      nextReview = newLevel >= 5 ? 'Mastered' : 'In 7 days';
    }

    const updatedList = mistakes.map((item) => {
      if (item.id === currentFlashcard.id) {
        return {
          ...item,
          srsLevel: newLevel,
          masteryPercent: newMastery,
          nextReviewDate: nextReview,
          lastReviewedAt: new Date().toISOString(),
        };
      }
      return item;
    });

    setMistakes(updatedList);
    saveVaultToFirestore(updatedList);

    setReviewedTodayCount((prev) => prev + 1);
    setIsFlipped(false);

    // Award XP
    if (user.uid) {
      awardUserXpAndStats(user.uid, 10, 1);
    }

    // Move to next due card
    if (currentCardIndex + 1 < dueItems.length) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  // Add Custom Mistake
  const handleAddMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncorrect.trim() || !newCorrect.trim()) return;

    const newItem: MistakeItem = {
      id: `usr-mstk-${Date.now()}`,
      category: newCategory,
      categoryLabel: newCategory === 'grammar' ? 'Grammar & Syntax' : newCategory === 'pronunciation' ? 'Pronunciation' : newCategory === 'direct-translation' ? 'Direct Translation' : 'Vocabulary',
      incorrectPhrase: newIncorrect.trim(),
      correctPhrase: newCorrect.trim(),
      explanationHindi: newHindi.trim() || 'Custom user logged mistake.',
      srsLevel: 0,
      nextReviewDate: 'Today',
      masteryPercent: 0,
    };

    const updated = [newItem, ...mistakes];
    setMistakes(updated);
    saveVaultToFirestore(updated);

    // Reset Form
    setNewIncorrect('');
    setNewCorrect('');
    setNewHindi('');
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 px-4 pt-3 pb-24 space-y-5">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl p-5 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-800/60 shadow-xl text-white overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 text-[11px] font-extrabold px-3 py-1 rounded-full border border-indigo-500/30">
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
              <span>Personalized Mistake Vault</span>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-xl border border-emerald-500/30 flex items-center gap-1 active:scale-95 transition-transform"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Mistake</span>
            </button>
          </div>

          <h2 className="text-xl font-black font-heading tracking-tight">
            Spaced Repetition (SRS) Vault
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Never repeat the same grammar or pronunciation mistake twice! Review customized flashcards spaced mathematically over time.
          </p>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className={`p-1 rounded-2xl border flex items-center gap-1 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <button
          onClick={() => setMode('review')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            mode === 'review'
              ? 'bg-indigo-500 text-slate-950 shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>SRS Flashcards ({dueItems.length} Due)</span>
        </button>

        <button
          onClick={() => setMode('inventory')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            mode === 'inventory'
              ? 'bg-indigo-500 text-slate-950 shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Vault Inventory ({mistakes.length})</span>
        </button>
      </div>

      {/* MODE 1: SRS FLASHCARD QUIZ */}
      {mode === 'review' && (
        <div className="space-y-4">
          {dueItems.length === 0 ? (
            <div className={`p-8 rounded-3xl border text-center space-y-3 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-base font-extrabold font-heading text-slate-100">
                All Mistake Flashcards Reviewed!
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Awesome job! You have cleared all SRS review items for today. Check back tomorrow or practice live to log new expressions.
              </p>
              <button
                onClick={() => setMode('inventory')}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-emerald-400 font-extrabold text-xs border border-slate-700"
              >
                Browse All Vault Items
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold px-1">
                <span>Card {currentCardIndex + 1} of {dueItems.length}</span>
                <span className="text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                  SRS Level {currentFlashcard.srsLevel}/5
                </span>
              </div>

              {/* Interactive Flashcard */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className={`min-h-[220px] p-6 rounded-3xl border cursor-pointer transition-all duration-300 relative flex flex-col justify-between ${
                  isFlipped 
                    ? isDark ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-emerald-50 border-emerald-300 shadow-md'
                    : isDark ? 'bg-slate-900 border-indigo-500/40 hover:border-indigo-400' : 'bg-white border-indigo-200 shadow-md'
                }`}
              >
                {/* Header Tag on Card */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/15 px-2.5 py-1 rounded-lg border border-indigo-500/30">
                    {currentFlashcard.categoryLabel}
                  </span>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {isFlipped ? 'Answer Revealed' : 'Tap Card to Flip 🔄'}
                  </span>
                </div>

                {/* SIDE A: INCORRECT / CHALLENGE */}
                {!isFlipped ? (
                  <div className="py-6 space-y-2 text-center">
                    <span className="text-[10px] font-extrabold uppercase text-rose-400 tracking-wider">
                      ⚠️ Common Error Expression:
                    </span>
                    <p className="text-lg font-black text-rose-400 font-heading">
                      "{currentFlashcard.incorrectPhrase}"
                    </p>
                    <p className="text-xs text-slate-400 italic pt-2">
                      How would you express this correctly in natural English?
                    </p>
                  </div>
                ) : (
                  /* SIDE B: CORRECT / SOLUTION */
                  <div className="py-4 space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Natural English Expression:</span>
                        </span>

                        {/* Audio Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeakText(currentFlashcard.correctPhrase);
                          }}
                          className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                            isSpeaking 
                              ? 'bg-emerald-500 text-slate-950 animate-pulse' 
                              : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40'
                          }`}
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>Listen</span>
                        </button>
                      </div>

                      <p className="text-lg font-black text-emerald-300 font-heading">
                        "{currentFlashcard.correctPhrase}"
                      </p>
                      {currentFlashcard.phoneticSpelling && (
                        <p className="text-xs font-mono text-slate-400">
                          Phonetics: {currentFlashcard.phoneticSpelling}
                        </p>
                      )}
                    </div>

                    {/* Regional Explanation */}
                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                      💡 <strong className="text-amber-400">Tutor Note:</strong> {currentFlashcard.explanationHindi}
                    </div>
                  </div>
                )}

                {/* Footer Hint */}
                <div className="text-center text-[10px] text-slate-500 font-semibold pt-2 border-t border-slate-800/60">
                  {isFlipped ? 'Rate difficulty below to schedule next review' : 'Click to reveal model English answer'}
                </div>
              </div>

              {/* SRS INTERVAL RATING BUTTONS (Shown after flip) */}
              {isFlipped && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
                    How well did you know this?
                  </span>

                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => handleRateFlashcard('again')}
                      className="py-3 px-2 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 text-center active:scale-95 transition-all"
                    >
                      <div className="text-xs font-black">Again</div>
                      <div className="text-[9px] text-rose-400 font-medium">Today</div>
                    </button>

                    <button
                      onClick={() => handleRateFlashcard('hard')}
                      className="py-3 px-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-center active:scale-95 transition-all"
                    >
                      <div className="text-xs font-black">Hard</div>
                      <div className="text-[9px] text-amber-400 font-medium">1 Day</div>
                    </button>

                    <button
                      onClick={() => handleRateFlashcard('good')}
                      className="py-3 px-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-center active:scale-95 transition-all"
                    >
                      <div className="text-xs font-black">Good</div>
                      <div className="text-[9px] text-emerald-400 font-medium">3 Days</div>
                    </button>

                    <button
                      onClick={() => handleRateFlashcard('easy')}
                      className="py-3 px-2 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30 text-center active:scale-95 transition-all"
                    >
                      <div className="text-xs font-black">Easy</div>
                      <div className="text-[9px] text-indigo-400 font-medium">7 Days</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODE 2: VAULT INVENTORY & MISTAKE CATALOG */}
      {mode === 'inventory' && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Mistakes' },
              { id: 'grammar', label: 'Grammar' },
              { id: 'pronunciation', label: 'Pronunciation' },
              { id: 'direct-translation', label: 'Direct Translation' },
              { id: 'vocabulary', label: 'Vocabulary' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                  activeCategory === cat.id
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-sm'
                    : isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* List of Mistake Items */}
          <div className="space-y-3">
            {filteredInventory.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border space-y-2.5 ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] uppercase font-extrabold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                    {item.categoryLabel}
                  </span>

                  <span className="text-[11px] font-bold text-slate-400">
                    Next Review: {item.nextReviewDate}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-rose-400 line-through">
                    "{item.incorrectPhrase}"
                  </div>
                  <div className="text-sm font-extrabold text-emerald-400 flex items-center justify-between">
                    <span>"{item.correctPhrase}"</span>
                    <button
                      onClick={() => handleSpeakText(item.correctPhrase)}
                      className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  💡 {item.explanationHindi}
                </p>

                {/* SRS Mastery Progress Bar */}
                <div className="space-y-1 pt-1 border-t border-slate-800/60">
                  <div className="flex justify-between text-[10px] font-extrabold text-slate-400">
                    <span>SRS Memory Level: {item.srsLevel}/5</span>
                    <span>{item.masteryPercent}% Mastered</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                      style={{ width: `${item.masteryPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD MISTAKE MODAL FORM */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4 animate-in fade-in">
          <div className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl border p-5 space-y-4 animate-in slide-in-from-bottom duration-200 ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <h3 className="text-base font-extrabold font-heading text-indigo-400 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span>Log Custom Mistake to Vault</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMistake} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Category:
                </label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-semibold"
                >
                  <option value="grammar">Grammar & Prepositions</option>
                  <option value="pronunciation">Pronunciation & Silent Letters</option>
                  <option value="direct-translation">Direct Hindi Translation</option>
                  <option value="vocabulary">Vocabulary & Phrases</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-rose-400 block mb-1">
                  Incorrect Phrase / Error Spoken:
                </label>
                <input
                  type="text"
                  placeholder="e.g. What is your good name?"
                  value={newIncorrect}
                  onChange={(e) => setNewIncorrect(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-emerald-400 block mb-1">
                  Correct Natural English Expression:
                </label>
                <input
                  type="text"
                  placeholder="e.g. May I know your name?"
                  value={newCorrect}
                  onChange={(e) => setNewCorrect(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-amber-400 block mb-1">
                  Regional Hindi Tutor Explanation:
                </label>
                <textarea
                  placeholder="e.g. English mein 'good name' nahi puchte, 'May I know your name' bole."
                  value={newHindi}
                  onChange={(e) => setNewHindi(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 h-20"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-extrabold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-indigo-500 text-slate-950 font-extrabold shadow-md"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
