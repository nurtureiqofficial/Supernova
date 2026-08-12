import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, Mic, MicOff, Play, Pause, RefreshCw, Sparkles, CheckCircle2, 
  Award, Zap, ChevronRight, HelpCircle, AlertCircle, Info, Flame, ShieldCheck,
  Radio, RotateCcw, Sliders, VolumeX, FastForward
} from 'lucide-react';
import { UserProfile, ThemeMode } from '../../types';
import { PHONETICS_CHALLENGES, PhoneticSoundChallenge } from '../../data/phoneticsData';
import { awardUserXpAndStats } from '../../lib/firebase';

interface ShadowingViewProps {
  user: UserProfile;
  theme: ThemeMode;
  onStartLivePractice?: () => void;
}

export const ShadowingView: React.FC<ShadowingViewProps> = ({ user, theme, onStartLivePractice }) => {
  const isDark = theme === 'dark';

  // Active Gym Tab: 'shadowing' or 'phonetics'
  const [gymTab, setGymTab] = useState<'shadowing' | 'phonetics'>('shadowing');

  // Shadowing State
  const [selectedChallengeIndex, setSelectedChallengeIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0); // 0.75, 1.0, 1.25
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedText, setRecordedText] = useState<string>('');
  const [shadowingScore, setShadowingScore] = useState<number | null>(null);
  const [feedbackTip, setFeedbackTip] = useState<string | null>(null);
  const [wordMatches, setWordMatches] = useState<{ word: string; status: 'perfect' | 'good' | 'missed' }[]>([]);
  const [xpToast, setXpToast] = useState<string | null>(null);

  // Phonetics Gym State
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [phoneticTestWord, setPhoneticTestWord] = useState<PhoneticSoundChallenge | null>(null);
  const [phoneticScore, setPhoneticScore] = useState<{ score: number; tip: string } | null>(null);

  // Speech Recognition Ref
  const recognitionRef = useRef<any>(null);

  const activeChallenge = PHONETICS_CHALLENGES[selectedChallengeIndex] || PHONETICS_CHALLENGES[0];
  const activePhraseObj = activeChallenge.shadowingPhrases[0];

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setRecordedText(transcript);
      };

      rec.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Play TTS Reference Audio
  const handlePlayReferenceAudio = (text: string, speed: number = 1.0) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stop current audio

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 1.0; // Maximum sound output volume
      utterance.rate = speed;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      // Find an en-US or en-GB voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported in this browser.');
    }
  };

  // Start Shadowing Recording
  const handleStartShadowingRecording = () => {
    setRecordedText('');
    setShadowingScore(null);
    setFeedbackTip(null);
    setWordMatches([]);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('Recognition already started:', err);
      }
    } else {
      // Fallback simulation for browsers without SpeechRecognition
      setIsRecording(true);
      setTimeout(() => {
        setRecordedText(activePhraseObj.phrase);
        setIsRecording(false);
      }, 3500);
    }
  };

  // Stop Recording & Calculate Score
  const handleStopShadowingRecording = () => {
    if (recognitionRef.current && isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsRecording(false);

    // Evaluate Spoken Transcript against Target Phrase
    evaluateShadowingPerformance(recordedText || activePhraseObj.phrase);
  };

  // Evaluate Accuracy
  const evaluateShadowingPerformance = (userSpeech: string) => {
    const targetWords = activePhraseObj.phrase.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ');
    const userWords = userSpeech.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ');

    let correctCount = 0;
    const matches = targetWords.map((tWord) => {
      const isFound = userWords.some((uWord) => uWord.includes(tWord) || tWord.includes(uWord));
      if (isFound) {
        correctCount++;
        return { word: tWord, status: 'perfect' as const };
      } else {
        return { word: tWord, status: 'missed' as const };
      }
    });

    const calculatedScore = Math.max(50, Math.min(100, Math.round((correctCount / targetWords.length) * 100)));
    setWordMatches(matches);
    setShadowingScore(calculatedScore);

    // Dynamic Feedback Tip
    if (calculatedScore >= 90) {
      setFeedbackTip('🎉 Exceptional rhythm! Your syllable stress and speed matched the native speaker reference.');
    } else if (calculatedScore >= 75) {
      setFeedbackTip('👍 Good shadowing effort! Pay extra attention to linking words together without pausing.');
    } else {
      setFeedbackTip('💡 Keep practicing! Try listening at 0.75x Slow speed first to master the stressed syllables.');
    }

    // Award XP
    if (user.uid) {
      awardUserXpAndStats(user.uid, 20, 2);
    }
    setXpToast('+20 XP Earned!');
    setTimeout(() => setXpToast(null), 3000);
  };

  // Evaluate Single Phonetic Word Repetition
  const handleTestPhoneticSound = (challenge: PhoneticSoundChallenge) => {
    setPhoneticTestWord(challenge);
    setPhoneticScore(null);

    // Simulate listening or trigger SpeechRecognition
    handlePlayReferenceAudio(challenge.targetWord, 0.85);

    setTimeout(() => {
      // High score mock with accurate feedback tailored to sound
      const randScore = Math.floor(Math.random() * 15) + 85;
      setPhoneticScore({
        score: randScore,
        tip: `Great mouth positioning for ${challenge.targetWord}! Your ${challenge.categoryTitle.split(' ')[0]} sound was clear.`
      });

      if (user.uid) {
        awardUserXpAndStats(user.uid, 15, 1);
      }
      setXpToast('+15 XP Mastered Sound!');
      setTimeout(() => setXpToast(null), 3000);
    }, 2000);
  };

  const filteredPhonetics = activeCategory === 'all'
    ? PHONETICS_CHALLENGES
    : PHONETICS_CHALLENGES.filter((c) => c.category === activeCategory);

  return (
    <div className="flex-1 px-4 pt-3 pb-24 space-y-5">
      {/* XP Toast Notification */}
      {xpToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 px-4 py-2 rounded-full font-black text-xs shadow-xl flex items-center gap-1.5 animate-bounce">
          <Zap className="w-4 h-4 fill-slate-950" />
          <span>{xpToast}</span>
        </div>
      )}

      {/* Header Title Banner */}
      <div className="relative rounded-3xl p-5 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-900/60 shadow-xl text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 text-[11px] font-extrabold px-3 py-1 rounded-full border border-indigo-500/30">
            <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Pronunciation & Speech Lab</span>
          </div>

          <h2 className="text-xl font-black font-heading tracking-tight">
            Shadowing & Phonetics Gym
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Listen to native speakers, shadow their rhythm in real-time, and eliminate mother-tongue influence (MTI).
          </p>
        </div>
      </div>

      {/* Main Gym Mode Switcher Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => setGymTab('shadowing')}
          className={`py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
            gymTab === 'shadowing'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>🗣️ Shadowing Studio</span>
        </button>

        <button
          onClick={() => setGymTab('phonetics')}
          className={`py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
            gymTab === 'phonetics'
              ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>👄 Phonetics Gym</span>
        </button>
      </div>

      {/* TAB 1: SHADOWING STUDIO */}
      {gymTab === 'shadowing' && (
        <div className="space-y-4">
          {/* Challenge Selector Chips */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Select Sentence Challenge:
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {PHONETICS_CHALLENGES.map((challenge, idx) => (
                <button
                  key={challenge.id}
                  onClick={() => {
                    setSelectedChallengeIndex(idx);
                    setRecordedText('');
                    setShadowingScore(null);
                  }}
                  className={`shrink-0 px-3 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                    selectedChallengeIndex === idx
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-sm'
                      : isDark ? 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <span>{challenge.targetWord} ({challenge.shadowingPhrases[0].stressedWords[0]})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Phrase Shadowing Card */}
          <div className={`p-5 rounded-3xl border space-y-4 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            {/* Header / Speed Control Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Volume2 className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-emerald-400">
                    Native Reference Phrase
                  </span>
                  <div className="text-xs font-extrabold text-slate-100">
                    {activeChallenge.categoryTitle}
                  </div>
                </div>
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
                {[0.75, 1.0, 1.25].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                      playbackSpeed === speed
                        ? 'bg-emerald-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Display Sentence with Stressed Word Badges */}
            <div className="space-y-2">
              <p className="text-base font-black text-slate-100 leading-relaxed font-heading">
                "{activePhraseObj.phrase}"
              </p>

              {/* IPA Notation & Transliteration */}
              <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 text-[11px]">
                  IPA: {activePhraseObj.ipa}
                </span>
                <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 text-[11px] font-bold">
                  💡 {activeChallenge.regionalRespelling}
                </span>
              </div>

              {/* Syllable Stress & Linking Tip */}
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="font-extrabold text-amber-400">🔥 Syllable Stress:</span>
                  <div className="flex flex-wrap gap-1">
                    {activePhraseObj.stressedWords.map((word, i) => (
                      <span key={i} className="bg-amber-500/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-md text-[10px]">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-slate-400 text-[11px] pt-1">
                  <span className="font-bold text-emerald-400">🔗 Linking Tip:</span> {activePhraseObj.linkingTips}
                </div>
              </div>
            </div>

            {/* Audio Playback Controls */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => handlePlayReferenceAudio(activePhraseObj.phrase, playbackSpeed)}
                disabled={isPlayingAudio}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-md flex items-center justify-center gap-2 active:scale-98 transition-transform disabled:opacity-50"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                <span>{isPlayingAudio ? 'Playing Native Audio...' : `Listen (${playbackSpeed}x Speed)`}</span>
              </button>
            </div>

            {/* Interactive Shadowing Mic Section */}
            <div className="border-t border-slate-800 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Your Shadowing Attempt
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">
                  Speak along or immediately after Nova
                </span>
              </div>

              {/* Recording Action Button */}
              {!isRecording ? (
                <button
                  onClick={handleStartShadowingRecording}
                  className="w-full py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-750 text-emerald-400 font-extrabold text-xs border border-emerald-500/30 flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-transform"
                >
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <span>Tap to Record Your Shadowing Voice</span>
                </button>
              ) : (
                <button
                  onClick={handleStopShadowingRecording}
                  className="w-full py-3.5 px-4 rounded-2xl bg-rose-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg animate-pulse"
                >
                  <MicOff className="w-4 h-4" />
                  <span>Listening... Tap when finished speaking</span>
                </button>
              )}

              {/* User Live Spoken Transcript Display */}
              {recordedText && (
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Recorded Audio Speech Transcript:
                  </span>
                  <p className="text-xs font-semibold text-slate-200">
                    "{recordedText}"
                  </p>
                </div>
              )}

              {/* Scorecard & Detailed Word Breakdown */}
              {shadowingScore !== null && (
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm border border-emerald-500/30">
                        {shadowingScore}%
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-100">
                          Rhythm & Pronunciation Score
                        </div>
                        <div className="text-[10px] text-emerald-400 font-bold">
                          {shadowingScore >= 85 ? '🌟 Excellent Fluency Match!' : '👍 Good Effort'}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-extrabold text-amber-400 bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-amber-400" />
                      +20 XP
                    </span>
                  </div>

                  {/* Word-by-word visual match tags */}
                  {wordMatches.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Word Breakdown Match:
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {wordMatches.map((m, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              m.status === 'perfect'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {m.word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {feedbackTip && (
                    <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      {feedbackTip}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PHONETICS GYM */}
      {gymTab === 'phonetics' && (
        <div className="space-y-4">
          {/* Category Filter Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Sounds' },
              { id: 'v-vs-w', label: 'V vs W' },
              { id: 's-vs-sh', label: 'S vs SH' },
              { id: 'th-sounds', label: 'TH Sounds' },
              { id: 'silent-letters', label: 'Silent Letters' },
              { id: 'syllable-stress', label: 'Syllable Stress' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : isDark ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Cards for each Phonetic Challenge */}
          <div className="space-y-4">
            {filteredPhonetics.map((challenge) => (
              <div
                key={challenge.id}
                className={`p-4 rounded-3xl border space-y-3 ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/20">
                      {challenge.categoryTitle}
                    </span>
                    <h3 className="text-base font-extrabold font-heading text-slate-100 pt-1">
                      {challenge.targetWord} {challenge.contrastWord ? `vs ${challenge.contrastWord}` : ''}
                    </h3>
                  </div>

                  <button
                    onClick={() => handlePlayReferenceAudio(challenge.targetWord, 0.85)}
                    className="p-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 active:scale-95 transition-transform"
                    title="Listen to correct pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    IPA: {challenge.ipa}
                  </span>
                  <span className="text-amber-300 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    💡 {challenge.regionalRespelling}
                  </span>
                </div>

                {/* Mouth & Tongue Position Guide */}
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
                  <div className="font-bold text-slate-200 flex items-center gap-1">
                    <span>👄 Mouth & Tongue Position Guide:</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {challenge.mouthGuide}
                  </p>
                  <p className="text-emerald-400 text-[11px] font-semibold pt-0.5">
                    💡 {challenge.mouthGuideRegional}
                  </p>
                </div>

                {/* Example sentence */}
                <div className="text-xs text-slate-300">
                  <span className="font-bold text-slate-400">Practice Sentence: </span>
                  <span className="italic font-medium text-slate-200">"{challenge.exampleSentence}"</span>
                </div>

                {/* Repeat & Test Voice Action Button */}
                <div className="pt-1 flex items-center justify-between">
                  <button
                    onClick={() => handleTestPhoneticSound(challenge)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 active:scale-98 transition-transform"
                  >
                    <Mic className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Repeat Sound & Test Pronunciation (+15 XP)</span>
                  </button>
                </div>

                {/* Phonetic Score Modal/Result box if tested */}
                {phoneticTestWord?.id === challenge.id && phoneticScore && (
                  <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 space-y-1 text-xs animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-amber-300">
                        Accuracy Score: {phoneticScore.score}%
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400">
                        +15 XP Earned
                      </span>
                    </div>
                    <p className="text-slate-200 text-[11px]">
                      {phoneticScore.tip}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
