import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Flame, ShieldAlert, Award, Volume2, Mic, MicOff, Send, RotateCcw, 
  CheckCircle2, AlertTriangle, Sparkles, Brain, Clock, ChevronRight, HelpCircle, 
  BarChart3, MessageSquare, Zap, Activity
} from 'lucide-react';
import { UserProfile, ThemeMode } from '../../types';
import { ROLEPLAY_PERSONAS, RoleplayPersona } from '../../data/roleplayScenariosData';
import { savePracticeLogToFirestore, awardUserXpAndStats } from '../../lib/firebase';

interface RoleplayScenariosViewProps {
  user: UserProfile;
  theme: ThemeMode;
}

interface DialogueTurn {
  sender: 'avatar' | 'user';
  text: string;
  timestamp: string;
}

interface RoleplayScorecard {
  overallScore: number;
  poiseScore: number;
  vocabularyScore: number;
  fillerWordCount: number;
  fillerWordsFound: string[];
  strengths: string[];
  areasToImprove: string[];
  regionalTutorTip: string;
}

export const RoleplayScenariosView: React.FC<RoleplayScenariosViewProps> = ({ user, theme }) => {
  const isDark = theme === 'dark';

  const [selectedPersona, setSelectedPersona] = useState<RoleplayPersona>(ROLEPLAY_PERSONAS[0]);
  const [sessionState, setSessionState] = useState<'selection' | 'active' | 'scorecard'>('selection');

  // Active Dialogue State
  const [dialogueHistory, setDialogueHistory] = useState<DialogueTurn[]>([]);
  const [userInputText, setUserInputText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState<boolean>(false);
  const [stressMeter, setStressMeter] = useState<number>(30); // 0-100%
  const [showHintDrawer, setShowHintDrawer] = useState<boolean>(false);
  const [scorecard, setScorecard] = useState<RoleplayScorecard | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [dialogueHistory, isAiLoading]);

  // Speech Recognition setup
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
        setUserInputText(transcript);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Text-To-Speech for Avatar Voice
  const speakAvatarLine = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 1.0;
      utterance.lang = 'en-US';
      utterance.rate = selectedPersona.pressureLevel === 'High' ? 1.05 : 0.95;
      
      utterance.onstart = () => setIsAvatarSpeaking(true);
      utterance.onend = () => setIsAvatarSpeaking(false);
      utterance.onerror = () => setIsAvatarSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Start Roleplay Session
  const handleStartRoleplay = (persona: RoleplayPersona) => {
    setSelectedPersona(persona);
    setSessionState('active');
    setDialogueHistory([
      {
        sender: 'avatar',
        text: persona.openingLine,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
    setStressMeter(persona.pressureLevel === 'High' ? 65 : persona.pressureLevel === 'Medium' ? 45 : 20);
    setUserInputText('');
    setScorecard(null);

    // Speak opening line
    speakAvatarLine(persona.openingLine);
  };

  // Toggle Mic
  const toggleMicrophone = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsRecording(false);
    } else {
      setUserInputText('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
        } catch (e) {
          console.warn('Mic start failed:', e);
        }
      }
    }
  };

  // Send User Message & Trigger AI Persona Response
  const handleSendMessage = async () => {
    if (!userInputText.trim()) return;

    const userMsg = userInputText.trim();
    setUserInputText('');
    
    // Stop recording if active
    if (isRecording && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      setIsRecording(false);
    }

    const newTurn: DialogueTurn = {
      sender: 'user',
      text: userMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...dialogueHistory, newTurn];
    setDialogueHistory(updatedHistory);
    setIsAiLoading(true);

    // Calculate real-time stress fluctuation based on filler words
    const lowerUserMsg = userMsg.toLowerCase();
    const fillers = ['basically', 'actually', 'um', 'uh', 'like', 'you know'];
    let fillerCount = 0;
    fillers.forEach(f => {
      if (lowerUserMsg.includes(f)) fillerCount++;
    });

    if (fillerCount > 0) {
      setStressMeter(prev => Math.min(100, prev + 15));
    } else {
      setStressMeter(prev => Math.max(10, prev - 8));
    }

    try {
      // Call backend API for Gemini roleplay turn
      const response = await fetch('/api/generate-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userText: `[Roleplay Context: Persona ${selectedPersona.name} (${selectedPersona.title}). Scenario: ${selectedPersona.scenarioTitle}]. User said: "${userMsg}". Respond in character as ${selectedPersona.name} in 2 natural, crisp spoken sentences keeping the pressure level ${selectedPersona.pressureLevel}.`,
          nativeLanguage: user.nativeLanguage || 'Hindi',
          targetTopic: selectedPersona.scenarioTitle,
        }),
      });

      const json = await response.json();
      setIsAiLoading(false);

      let replyText = '';
      if (json.success && json.data?.correctedText) {
        replyText = `Understood. ${json.data.correctedText}`;
      } else {
        replyText = `Thank you for sharing that. As ${selectedPersona.title}, I need to ensure we cover all details. How do you plan to handle the next milestone?`;
      }

      const avatarTurn: DialogueTurn = {
        sender: 'avatar',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setDialogueHistory(prev => [...prev, avatarTurn]);
      speakAvatarLine(replyText);
    } catch (err) {
      setIsAiLoading(false);
      const fallbackReply = `Right. Let us stay focused on the key goal here. Please explain your core strategy in one sentence.`;
      const avatarTurn: DialogueTurn = {
        sender: 'avatar',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setDialogueHistory(prev => [...prev, avatarTurn]);
      speakAvatarLine(fallbackReply);
    }
  };

  // Complete Roleplay & Generate Performance Scorecard
  const handleFinishRoleplay = async () => {
    window.speechSynthesis.cancel();

    // Analyze dialogue
    const userTurns = dialogueHistory.filter(d => d.sender === 'user');
    const fullText = userTurns.map(u => u.text).join(' ').toLowerCase();

    const fillerList = ['basically', 'actually', 'um', 'uh', 'like', 'you know'];
    const foundFillers: string[] = [];
    fillerList.forEach(f => {
      if (fullText.includes(f)) foundFillers.push(f);
    });

    const overallScore = Math.max(70, Math.min(98, 100 - (foundFillers.length * 6) - (stressMeter > 70 ? 12 : 0)));
    const poiseScore = Math.max(65, 100 - Math.round(stressMeter * 0.4));
    const vocabularyScore = Math.min(95, 75 + (userTurns.length * 5));

    const generatedCard: RoleplayScorecard = {
      overallScore,
      poiseScore,
      vocabularyScore,
      fillerWordCount: foundFillers.length,
      fillerWordsFound: foundFillers,
      strengths: [
        'Maintained active participation in high-pressure dialogue',
        'Responded promptly without breaking conversation flow',
        'Used professional tone suited for the scenario'
      ],
      areasToImprove: [
        foundFillers.length > 0 
          ? `Reduce filler words: ${foundFillers.join(', ')}`
          : 'Further refine complex sentence connectors (e.g. "Consequently", "In hindsight")',
        'Practice keeping answers concise under 45 seconds'
      ],
      regionalTutorTip: selectedPersona.regionalTutorAdvice,
    };

    setScorecard(generatedCard);
    setSessionState('scorecard');

    // Save practice log to Firestore
    if (user.uid) {
      await savePracticeLogToFirestore({
        userId: user.uid,
        topic: `Roleplay: ${selectedPersona.name} (${selectedPersona.scenarioTitle})`,
        accuracyScore: overallScore,
        durationMinutes: 3,
        correctionsCount: foundFillers.length,
        correctedSample: userTurns[userTurns.length - 1]?.text || 'Roleplay scenario completed.',
        regionalExplanation: selectedPersona.regionalTutorAdvice,
        timestamp: new Date().toISOString(),
      });
      await awardUserXpAndStats(user.uid, selectedPersona.xpReward, 3);
    }
  };

  return (
    <div className="flex-1 px-4 pt-3 pb-24 space-y-5">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl p-5 bg-gradient-to-br from-rose-950 via-slate-900 to-slate-950 border border-rose-800/60 shadow-xl text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 text-[11px] font-extrabold px-3 py-1 rounded-full border border-rose-500/30">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>High-Pressure Roleplay Arena</span>
          </div>

          <h2 className="text-xl font-black font-heading tracking-tight">
            Dynamic AI Avatars & Pressure Simulator
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Practice real-world job interviews, client pushback, salary negotiations, and airport border control with realistic AI personas.
          </p>
        </div>
      </div>

      {/* VIEW 1: PERSONA & SCENARIO SELECTION GRID */}
      {sessionState === 'selection' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select AI Roleplay Persona:
            </span>
            <span className="text-xs font-extrabold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
              6 Scenarios Available
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {ROLEPLAY_PERSONAS.map((persona) => (
              <div
                key={persona.id}
                className={`p-4 rounded-3xl border space-y-3 transition-all hover:border-rose-500/40 ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
                      {persona.avatarEmoji}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold font-heading text-slate-100">
                          {persona.name}
                        </h3>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                          persona.pressureLevel === 'High' 
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
                            : persona.pressureLevel === 'Medium'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {persona.pressureLevel} Pressure 🔥
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-400">
                        {persona.title} • {persona.organization}
                      </p>
                      <p className="text-[11px] text-rose-400 font-semibold pt-0.5">
                        🗣️ Accent: {persona.accent}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 shrink-0">
                    +{persona.xpReward} XP
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    🎯 Scenario Objective:
                  </span>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {persona.scenarioDescription}
                  </p>
                </div>

                <button
                  onClick={() => handleStartRoleplay(persona)}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-rose-500/10 flex items-center justify-center gap-1.5 active:scale-98 transition-transform"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Start Roleplay with {persona.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: ACTIVE ROLEPLAY INTERACTIVE SIMULATOR */}
      {sessionState === 'active' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Active Persona Header Card */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="text-3xl p-2 rounded-2xl bg-slate-950 border border-slate-800 block">
                    {selectedPersona.avatarEmoji}
                  </span>
                  {isAvatarSpeaking && (
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-ping" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-100 font-heading">
                    {selectedPersona.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-bold">
                    {selectedPersona.title} • {selectedPersona.organization}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHintDrawer(!showHintDrawer)}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Hints</span>
                </button>

                <button
                  onClick={handleFinishRoleplay}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-extrabold hover:bg-rose-500/30"
                >
                  End & Evaluate
                </button>
              </div>
            </div>

            {/* Stress / Tension Meter */}
            <div className="space-y-1 pt-1 border-t border-slate-800">
              <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider">
                <span className="text-slate-400 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-rose-400" />
                  <span>Real-Time Stress Meter</span>
                </span>
                <span className={stressMeter > 65 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                  {stressMeter > 75 ? '⚠️ High Stress (Take a breath)' : stressMeter > 45 ? '⚡ Moderate Tension' : '🟢 Calm & Poised'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div 
                  className={`h-full transition-all duration-500 ${
                    stressMeter > 75 ? 'bg-rose-500' : stressMeter > 45 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${stressMeter}%` }}
                ></div>
              </div>
            </div>

            {/* In-Game Hint Drawer */}
            {showHintDrawer && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5 animate-in fade-in">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] block">
                  💡 In-Game Tactical Advice:
                </span>
                <ul className="space-y-1 text-slate-200 list-disc list-inside">
                  {selectedPersona.suggestedHints.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Dialogue Conversation Stream */}
          <div className="min-h-[260px] max-h-[360px] overflow-y-auto p-4 rounded-3xl bg-slate-950/90 border border-slate-800 space-y-3 scrollbar-thin">
            {dialogueHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div className={`p-2 rounded-2xl text-xs font-bold shrink-0 self-start ${
                  msg.sender === 'user' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {msg.sender === 'user' ? 'You' : selectedPersona.avatarEmoji}
                </div>

                <div className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                  msg.sender === 'user' 
                    ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30' 
                    : 'bg-slate-900 text-slate-100 border border-slate-800'
                }`}>
                  <p className="leading-relaxed font-medium">{msg.text}</p>
                  <span className="text-[9px] font-mono text-slate-400 block text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isAiLoading && (
              <div className="flex items-center gap-2 text-xs text-rose-400 font-bold p-3 bg-slate-900 rounded-2xl w-fit animate-pulse border border-slate-800">
                <Brain className="w-4 h-4 animate-spin" />
                <span>{selectedPersona.name} is formulating response...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Controls */}
          <div className="flex gap-2 items-center">
            <button
              onClick={toggleMicrophone}
              className={`p-3.5 rounded-2xl font-bold text-xs flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-rose-500 text-slate-950 animate-pulse shadow-lg shadow-rose-500/30'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-750'
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              placeholder={isRecording ? 'Listening to your speech...' : 'Type or speak your answer...'}
              value={userInputText}
              onChange={(e) => setUserInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-rose-500"
            />

            <button
              onClick={handleSendMessage}
              disabled={!userInputText.trim()}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-extrabold text-xs disabled:opacity-40"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: POST-ROLEPLAY PERFORMANCE SCORECARD */}
      {sessionState === 'scorecard' && scorecard && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-5 rounded-3xl bg-slate-900 border border-rose-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{selectedPersona.avatarEmoji}</span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-rose-400 tracking-wider">
                    Roleplay Evaluation Report
                  </span>
                  <h3 className="text-base font-extrabold text-slate-100 font-heading">
                    {selectedPersona.name} Scenario
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Overall Grade</span>
                <div className="text-2xl font-black text-emerald-400">
                  {scorecard.overallScore}%
                </div>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Poise & Stress</div>
                <div className="text-base font-extrabold text-indigo-400 pt-0.5">{scorecard.poiseScore}%</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Vocabulary</div>
                <div className="text-base font-extrabold text-emerald-400 pt-0.5">{scorecard.vocabularyScore}%</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Fillers Used</div>
                <div className="text-base font-extrabold text-amber-400 pt-0.5">{scorecard.fillerWordCount}</div>
              </div>
            </div>

            {/* Strengths & Areas to Improve */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Key Spoken Strengths:</span>
                </span>
                <ul className="list-disc list-inside text-slate-200 space-y-0.5">
                  {scorecard.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Areas to Refine:</span>
                </span>
                <ul className="list-disc list-inside text-slate-200 space-y-0.5">
                  {scorecard.areasToImprove.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Regional Tutor Tip */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed space-y-1">
              <span className="font-bold text-amber-400 text-[10px] uppercase block">
                💡 Regional Language Tutor Advice:
              </span>
              <p>{scorecard.regionalTutorTip}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSessionState('selection')}
                className="flex-1 py-3 px-3 rounded-2xl bg-slate-800 text-slate-200 font-extrabold text-xs border border-slate-700 flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Choose Another Scenario</span>
              </button>

              <button
                onClick={() => handleStartRoleplay(selectedPersona)}
                className="flex-1 py-3 px-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Retry Scenario</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
