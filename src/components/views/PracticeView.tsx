import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, Sparkles, RefreshCw, AlertCircle, CheckCircle2, 
  Radio, Send, BookOpen, MessageSquare, Play, Square, Award, Zap, HelpCircle, Brain, Users
} from 'lucide-react';
import { UserProfile, ThemeMode } from '../../types';
import novaAvatarUrl from '../../assets/images/nova_ai_teacher_1786287491962.jpg';
import { convertFloat32ToInt16PcmBase64, playPcmChunk, stopAllActiveAudio } from '../../lib/audioUtils';
import { savePracticeLogToFirestore, awardUserXpAndStats } from '../../lib/firebase';
import { ShadowingView } from './ShadowingView';
import { ThinkingInEnglishView } from './ThinkingInEnglishView';
import { RoleplayScenariosView } from './RoleplayScenariosView';
import { PeerVoiceClubView } from './PeerVoiceClubView';

interface PracticeViewProps {
  user: UserProfile;
  theme: ThemeMode;
  selectedModuleId?: string | null;
  selectedLessonTitle?: string | null;
  selectedLessonContext?: any | null;
}

interface FeedbackResult {
  correctedText: string;
  accuracyScore: number;
  grammarIssues: string[];
  regionalExplanation: string;
  pronunciationTip: string;
  encouragement: string;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ 
  user, 
  theme, 
  selectedModuleId,
  selectedLessonTitle,
  selectedLessonContext
}) => {
  const isDark = theme === 'dark';

  // State
  const [activeTab, setActiveTab] = useState<'live' | 'roleplay' | 'p2p' | 'shadowing' | 'thinking' | 'text'>('live');
  const [selectedTopic, setSelectedTopic] = useState<string>('Talking About Past Activities');
  const [activeTopicContext, setActiveTopicContext] = useState<any | null>(null);
  const [nativeLang, setNativeLang] = useState<string>(user.nativeLanguage || 'Hindi');
  const [enableCodeSwitching, setEnableCodeSwitching] = useState<boolean>(true);
  const [soundBoostLevel, setSoundBoostLevel] = useState<number>(2.8); // Default 2.8x volume boost
  const [xpToast, setXpToast] = useState<string | null>(null);

  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isNovaSpeaking, setIsNovaSpeaking] = useState<boolean>(false);
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [novaTranscript, setNovaTranscript] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('Tap Start to begin live spoken practice with Nova');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Regional Language Options (Alphabetical A-Z)
  const regionalLanguages = [
    { code: 'Angika', label: 'Angika (अंगिका)' },
    { code: 'Assamese', label: 'Assamese / Asami (অসমীয়া)' },
    { code: 'Bengali', label: 'Bengali (বাংলা)' },
    { code: 'Bhojpuri', label: 'Bhojpuri (भोजपुरी)' },
    { code: 'Bodo', label: 'Bodo (बड़ो)' },
    { code: 'Bundeli', label: 'Bundeli (बुंदेली)' },
    { code: 'Chhattisgarhi', label: 'Chhattisgarhi (छत्तीसगढ़ी)' },
    { code: 'Dogri', label: 'Dogri (डोगरी)' },
    { code: 'Garhwali', label: 'Garhwali (गढ़वाली)' },
    { code: 'Gujarati', label: 'Gujarati (ગુજરાતી)' },
    { code: 'Haryanvi', label: 'Haryanvi (हरियाणवी)' },
    { code: 'Himachali', label: 'Himachali / Pahari (हिमाचली)' },
    { code: 'Hindi', label: 'Hindi (हिंदी)' },
    { code: 'Hinglish', label: 'Hinglish (Hindi + English)' },
    { code: 'Kannada', label: 'Kannada (ಕನ್ನಡ)' },
    { code: 'Kashmiri', label: 'Kashmiri (कश्मीरी / کٲشُر)' },
    { code: 'Khortha', label: 'Khortha (खोरठा)' },
    { code: 'Konkani', label: 'Konkani (कोंकणी)' },
    { code: 'Kumaoni', label: 'Kumaoni (कुमाऊँनी)' },
    { code: 'Magahi', label: 'Magahi (मगही)' },
    { code: 'Maithili', label: 'Maithili (मैथिली)' },
    { code: 'Malayalam', label: 'Malayalam (മലയാളം)' },
    { code: 'Manipuri', label: 'Manipuri / Meitei (मणिपुरी)' },
    { code: 'Marathi', label: 'Marathi (मराठी)' },
    { code: 'Mizo', label: 'Mizo (मिज़ो)' },
    { code: 'Nagamese', label: 'Nagamese (नागामीज़)' },
    { code: 'Nepali', label: 'Nepali (नेपाली)' },
    { code: 'Odia', label: 'Odia / Odiya (ଓଡ଼ିଆ)' },
    { code: 'Punjabi', label: 'Punjabi (ਪੰਜਾਬੀ)' },
    { code: 'Rajasthani', label: 'Rajasthani / Marwari (मारवाड़ी)' },
    { code: 'Sanskrit', label: 'Sanskrit (संस्कृतम्)' },
    { code: 'Santhali', label: 'Santhali (संथाली)' },
    { code: 'Sindhi', label: 'Sindhi (सिंधी / سنڌي)' },
    { code: 'Tamil', label: 'Tamil (தமிழ்)' },
    { code: 'Telugu', label: 'Telugu (తెలుగు)' },
    { code: 'Tulu', label: 'Tulu (ತುಳು)' },
    { code: 'Urdu', label: 'Urdu (اردو)' },
  ].sort((a, b) => a.code.localeCompare(b.code));

  // Sync native language when user profile changes
  useEffect(() => {
    if (user.nativeLanguage) {
      setNativeLang(user.nativeLanguage);
    }
  }, [user.nativeLanguage]);

  // Text Mode / AI Evaluation State
  const [inputText, setInputText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiFeedback, setAiFeedback] = useState<FeedbackResult | null>(null);

  // Refs for WebSockets & Web Audio
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  // Sync topic & lesson context if selected from Roadmap or Home
  useEffect(() => {
    if (selectedLessonContext) {
      setActiveTopicContext(selectedLessonContext);
      setSelectedTopic(selectedLessonContext.title || selectedLessonTitle || 'Selected CEFR Lesson');
    } else if (selectedLessonTitle) {
      setSelectedTopic(selectedLessonTitle);
      setActiveTopicContext({ title: selectedLessonTitle });
    } else if (selectedModuleId) {
      if (selectedModuleId.includes('interview')) {
        setSelectedTopic('Job Interview Essentials');
        setActiveTopicContext({ title: 'Job Interview Essentials', speakingGoal: 'Master common interview questions and confident speaking' });
      } else if (selectedModuleId.includes('pronunciation')) {
        setSelectedTopic('Pronunciation & Accent Training');
        setActiveTopicContext({ title: 'Pronunciation & Accent Training', speakingGoal: 'Improve clarity, word stress, and phonetic accuracy' });
      } else if (selectedModuleId.includes('listening')) {
        setSelectedTopic('Listening & Fast Speech Comprehension');
        setActiveTopicContext({ title: 'Listening & Fast Speech Comprehension', speakingGoal: 'Understand connected speech and native accents' });
      } else {
        setSelectedTopic('Talking About Past Activities');
        setActiveTopicContext({ title: 'Talking About Past Activities', speakingGoal: 'Use simple past tense naturally in daily conversation' });
      }
    }
  }, [selectedLessonContext, selectedLessonTitle, selectedModuleId]);

  // Clean up WebSockets and Audio Contexts on unmount
  useEffect(() => {
    return () => {
      stopLiveSession();
    };
  }, []);

  // Stop Live Session
  const stopLiveSession = async () => {
    stopAllActiveAudio(outputAudioCtxRef.current, nextStartTimeRef, activeSourcesRef);

    if (processorRef.current) {
      try { processorRef.current.disconnect(); } catch (e) {}
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      try { inputAudioCtxRef.current.close(); } catch (e) {}
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      try { outputAudioCtxRef.current.close(); } catch (e) {}
      outputAudioCtxRef.current = null;
    }
    if (wsRef.current) {
      try { wsRef.current.close(); } catch (e) {}
      wsRef.current = null;
    }

    if (isLiveConnected) {
      // Save practice log & award XP for completing a live session
      if (user.uid) {
        await savePracticeLogToFirestore({
          userId: user.uid,
          topic: selectedTopic,
          accuracyScore: 92,
          durationMinutes: 2,
          correctionsCount: novaTranscript ? 1 : 0,
          correctedSample: userTranscript || 'Live audio conversation completed.',
          regionalExplanation: `Live Gemini 3.1 session completed in ${nativeLang}`,
          timestamp: new Date().toISOString(),
        });
        await awardUserXpAndStats(user.uid, 50, 2);
        setXpToast('🎉 +50 XP Earned! Practice log saved to Firestore.');
        setTimeout(() => setXpToast(null), 4000);
      }
    }

    setIsLiveConnected(false);
    setIsRecording(false);
    setIsNovaSpeaking(false);
    setStatusMessage('Live audio session ended');
  };

  // Start Gemini Live WebSocket Session
  const startLiveSession = async () => {
    try {
      setErrorMessage(null);
      setStatusMessage('Connecting to Nova AI Live Server...');

      // 1. Establish WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // Prepare Audio Context for output playback at 24kHz
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });
      outputAudioCtxRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      ws.onopen = async () => {
        setStatusMessage('Initializing Gemini Live Audio Session...');
        ws.send(
          JSON.stringify({
            type: 'init',
            nativeLanguage: nativeLang,
            enableCodeSwitching: enableCodeSwitching,
            topic: selectedTopic,
            topicContext: activeTopicContext,
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'connected') {
            setIsLiveConnected(true);
            setStatusMessage('Nova is ready! Tap Mic & start speaking.');
            startMicrophoneStream();
          } else if (msg.type === 'audio' && msg.audio) {
            setIsNovaSpeaking(true);
            if (outputAudioCtxRef.current) {
              playPcmChunk(outputAudioCtxRef.current, msg.audio, nextStartTimeRef, activeSourcesRef, soundBoostLevel);
            }
          } else if (msg.type === 'output_transcript' && msg.text) {
            setNovaTranscript((prev) => prev + ' ' + msg.text);
          } else if (msg.type === 'input_transcript' && msg.text) {
            setUserTranscript(msg.text);
          } else if (msg.type === 'turn_complete') {
            setIsNovaSpeaking(false);
          } else if (msg.type === 'interrupted') {
            setIsNovaSpeaking(false);
            stopAllActiveAudio(outputAudioCtxRef.current, nextStartTimeRef, activeSourcesRef);
          } else if (msg.type === 'error') {
            setErrorMessage(msg.message || 'Gemini Live error encountered.');
            stopLiveSession();
          }
        } catch (err) {
          console.error('Error parsing WS message:', err);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        setErrorMessage('Could not connect to Live Audio Server. You can try Text Evaluation below.');
        stopLiveSession();
      };

      ws.onclose = () => {
        setIsLiveConnected(false);
        setIsRecording(false);
        setIsNovaSpeaking(false);
      };
    } catch (err: any) {
      console.error('Failed to start live session:', err);
      setErrorMessage(err.message || 'Could not start live voice session.');
      stopLiveSession();
    }
  };

  // Start Mic Recording & Stream 16kHz PCM Audio to WebSocket
  const startMicrophoneStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      inputAudioCtxRef.current = inputCtx;

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(inputCtx.destination);

      processor.onaudioprocess = (e) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          const base64Pcm = convertFloat32ToInt16PcmBase64(inputData);
          wsRef.current.send(
            JSON.stringify({
              type: 'audio',
              audio: base64Pcm,
            })
          );
        }
      };

      setIsRecording(true);
      setStatusMessage('🎙️ Listening... Speak naturally to Nova!');
    } catch (err: any) {
      console.error('Microphone access error:', err);
      setErrorMessage('Microphone access denied or unavailable.');
    }
  };

  // AI REST Speech / Text Evaluation Call
  const handleAnalyzeText = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userText: inputText,
          nativeLanguage: user.nativeLanguage || 'Hindi',
          targetTopic: selectedTopic,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setAiFeedback(json.data);

        if (user.uid) {
          await savePracticeLogToFirestore({
            userId: user.uid,
            topic: selectedTopic,
            accuracyScore: json.data.accuracyScore || 85,
            durationMinutes: 1,
            correctionsCount: json.data.grammarIssues?.length || 1,
            correctedSample: json.data.correctedText || '',
            regionalExplanation: json.data.regionalExplanation || '',
            timestamp: new Date().toISOString(),
          });
          await awardUserXpAndStats(user.uid, 50, 1);
          setXpToast('🎉 +50 XP Earned! Logged in Firestore.');
          setTimeout(() => setXpToast(null), 4000);
        }
      } else {
        setErrorMessage(json.error || 'Failed to analyze text');
      }
    } catch (err: any) {
      console.error('Error analyzing text:', err);
      setErrorMessage('Network error during evaluation.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 px-4 pt-3 pb-24 space-y-4">
      {/* XP Toast Notification */}
      {xpToast && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold flex items-center justify-between shadow-lg shadow-emerald-500/10 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{xpToast}</span>
          </div>
          <button
            onClick={() => setXpToast(null)}
            className="text-slate-400 hover:text-slate-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className={`p-1 rounded-2xl border flex items-center gap-1 overflow-x-auto scrollbar-none ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <button
          onClick={() => setActiveTab('live')}
          className={`shrink-0 flex-1 py-2 px-2 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'live'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Live Voice</span>
        </button>

        <button
          onClick={() => setActiveTab('p2p')}
          className={`shrink-0 flex-1 py-2 px-2 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'p2p'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-emerald-300" />
          <span>3-Min Voice Club</span>
        </button>

        <button
          onClick={() => setActiveTab('roleplay')}
          className={`shrink-0 flex-1 py-2 px-2 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'roleplay'
              ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>AI Roleplay</span>
        </button>

        <button
          onClick={() => setActiveTab('shadowing')}
          className={`shrink-0 flex-1 py-2 px-2 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'shadowing'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Shadowing</span>
        </button>

        <button
          onClick={() => setActiveTab('thinking')}
          className={`shrink-0 flex-1 py-2 px-2 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'thinking'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>Speed Drills</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`shrink-0 flex-1 py-2 px-2 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'text'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Evaluator</span>
        </button>
      </div>

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-slate-400 hover:text-slate-200 text-xs font-bold px-2 py-0.5 rounded bg-slate-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: GEMINI LIVE VOICE MULTIMODAL STUDIO */}
      {activeTab === 'live' && (
        <div className="space-y-4">
          {/* Synchronized CEFR Roadmap Topic Banner */}
          {activeTopicContext && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border-2 border-emerald-500/60 shadow-lg text-white space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    🎯 Roadmap Topic Synced
                  </span>
                  {activeTopicContext.cefrTag && (
                    <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
                      {activeTopicContext.cefrTag}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-extrabold text-slate-400">
                  Nova AI Ready
                </span>
              </div>

              <div>
                <h3 className="text-sm font-black font-heading text-slate-100">
                  {activeTopicContext.title || selectedTopic}
                </h3>
                {activeTopicContext.titleRegional && (
                  <p className="text-xs font-semibold text-emerald-400">
                    💡 {activeTopicContext.titleRegional}
                  </p>
                )}
              </div>

              {(activeTopicContext.speakingGoal || activeTopicContext.grammarFocus) && (
                <div className="pt-1 text-[11px] text-slate-300 space-y-0.5 border-t border-slate-800/80">
                  {activeTopicContext.speakingGoal && (
                    <p><strong className="text-emerald-400">Goal: </strong>{activeTopicContext.speakingGoal}</p>
                  )}
                  {activeTopicContext.grammarFocus && (
                    <p><strong className="text-amber-400">Grammar: </strong>{activeTopicContext.grammarFocus}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Regional Explanation & Code-Switching Controls Card */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold font-heading text-slate-200 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Regional Tutor Mode
              </span>

              <button
                onClick={() => setEnableCodeSwitching(!enableCodeSwitching)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all ${
                  enableCodeSwitching
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                Code-Switching: {enableCodeSwitching ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[11px] font-bold text-slate-400 shrink-0">
                Explanations in:
              </label>
              <select
                value={nativeLang}
                onChange={(e) => setNativeLang(e.target.value)}
                disabled={isLiveConnected}
                className={`flex-1 p-2 rounded-xl text-xs font-bold border focus:outline-none ${
                  isDark 
                    ? 'bg-slate-950 border-slate-800 text-slate-100' 
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                {regionalLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Nova AI Voice Volume Booster Control */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Nova Sound Volume:
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSoundBoostLevel(1.2)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold border transition-all ${
                    soundBoostLevel === 1.2 
                      ? 'bg-slate-700 text-slate-100 border-slate-600' 
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  100% Normal
                </button>
                <button
                  onClick={() => setSoundBoostLevel(2.8)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold border transition-all ${
                    soundBoostLevel === 2.8 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  🔊 280% High (Rec)
                </button>
                <button
                  onClick={() => setSoundBoostLevel(3.8)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold border transition-all ${
                    soundBoostLevel === 3.8 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  ⚡ 380% Max Loud
                </button>
              </div>
            </div>
          </div>

          {/* Nova Teacher Header */}
          <div className={`p-5 rounded-3xl border text-center space-y-3 relative overflow-hidden ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="relative inline-block mx-auto">
              <img 
                src={novaAvatarUrl} 
                alt="Nova AI Teacher" 
                className={`w-20 h-20 rounded-2xl object-cover ring-4 mx-auto transition-all ${
                  isNovaSpeaking 
                    ? 'ring-emerald-400 scale-105 shadow-xl shadow-emerald-500/30' 
                    : 'ring-emerald-500/30 shadow-md'
                }`}
              />
              {isLiveConnected && (
                <>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-900 animate-ping"></span>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
                </>
              )}
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-base font-extrabold font-heading">Nova AI Teacher</h2>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  Gemini 3.1 Live
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Topic: <span className="text-emerald-400 font-bold">{selectedTopic}</span>
              </p>
            </div>

            {/* Live Audio Visualizer Animation */}
            <div className="flex items-center justify-center gap-1.5 h-10 py-1 px-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              {isNovaSpeaking ? (
                <>
                  <span className="w-1.5 h-6 rounded-full bg-emerald-400 animate-bounce"></span>
                  <span className="w-1.5 h-9 rounded-full bg-teal-400 animate-bounce delay-100"></span>
                  <span className="w-1.5 h-7 rounded-full bg-emerald-300 animate-bounce delay-150"></span>
                  <span className="w-1.5 h-10 rounded-full bg-emerald-400 animate-bounce delay-200"></span>
                  <span className="w-1.5 h-5 rounded-full bg-teal-300 animate-bounce delay-75"></span>
                  <span className="text-xs text-emerald-400 font-bold pl-2 animate-pulse">
                    Nova is speaking...
                  </span>
                </>
              ) : isRecording ? (
                <>
                  <span className="w-1.5 h-4 rounded-full bg-rose-500 animate-pulse"></span>
                  <span className="w-1.5 h-8 rounded-full bg-rose-400 animate-pulse delay-75"></span>
                  <span className="w-1.5 h-6 rounded-full bg-rose-500 animate-pulse delay-150"></span>
                  <span className="text-xs text-rose-400 font-bold pl-2">
                    Listening to your voice...
                  </span>
                </>
              ) : (
                <span className="text-xs text-slate-400 font-medium">
                  {statusMessage}
                </span>
              )}
            </div>
          </div>

          {/* Live Transcripts Box */}
          {(userTranscript || novaTranscript) && (
            <div className={`p-4 rounded-2xl border space-y-3 ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Live Conversation Transcript
              </h4>

              {userTranscript && (
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                  <span className="font-bold text-emerald-400">You: </span>
                  <span className="text-slate-200">{userTranscript}</span>
                </div>
              )}

              {novaTranscript && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <span className="font-bold text-emerald-400">Nova: </span>
                  <span className="text-slate-200">{novaTranscript}</span>
                </div>
              )}
            </div>
          )}

          {/* Main Control Action Button */}
          <div className="pt-2 text-center space-y-3">
            {!isLiveConnected ? (
              <button
                onClick={startLiveSession}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-98 transition-transform"
              >
                <Radio className="w-5 h-5 fill-slate-950" />
                <span>Start Live Voice Practice</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={stopLiveSession}
                    className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                    title="End Session"
                  >
                    <Square className="w-6 h-6 fill-rose-400" />
                  </button>

                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/30 ring-8 ring-emerald-500/20">
                      <Mic className="w-9 h-9" />
                    </div>
                  </div>
                </div>

                <p className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                  Live session active • Speak naturally into mic
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: PEER-TO-PEER 3-MINUTE VOICE CLUB */}
      {activeTab === 'p2p' && (
        <PeerVoiceClubView
          user={user}
          theme={theme}
        />
      )}

      {/* TAB: ROLEPLAY SCENARIOS & DYNAMIC AI AVATARS */}
      {activeTab === 'roleplay' && (
        <RoleplayScenariosView
          user={user}
          theme={theme}
        />
      )}

      {/* TAB 2: SHADOWING & PHONETICS LAB */}
      {activeTab === 'shadowing' && (
        <ShadowingView
          user={user}
          theme={theme}
          onStartLivePractice={() => setActiveTab('live')}
        />
      )}

      {/* TAB 3: THINKING IN ENGLISH SPEED DRILLS */}
      {activeTab === 'thinking' && (
        <ThinkingInEnglishView
          user={user}
          theme={theme}
        />
      )}

      {/* TAB 2: AI SPEECH & GRAMMAR EVALUATOR */}
      {activeTab === 'text' && (
        <div className="space-y-4">
          <div className={`p-4 rounded-2xl border space-y-3 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold font-heading flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Instant AI Speech & Grammar Evaluator
              </h3>
              <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                {user.nativeLanguage || 'Hindi'} Mode
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Type or paste what you spoke to get detailed grammar score, natural phrasing, and regional language explanation ({user.nativeLanguage || 'Hindi'}).
            </p>

            <div className="space-y-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder='e.g., "Yesterday I will go to office and meeting my manager."'
                rows={3}
                className={`w-full p-3 rounded-xl border text-xs resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                  isDark 
                    ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-600' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                }`}
              />

              <button
                onClick={handleAnalyzeText}
                disabled={isAnalyzing || !inputText.trim()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98 transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Evaluate My Sentence</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Feedback Card */}
          {aiFeedback && (
            <div className={`p-4 rounded-2xl border space-y-3 animate-in slide-in-from-bottom duration-200 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between border-b pb-2 border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-400">
                  <Award className="w-4 h-4" />
                  <span>AI Feedback Report</span>
                </div>

                <div className="flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  <span>Score: {aiFeedback.accuracyScore}/100</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Corrected Text */}
                <div className="flex items-start gap-2 text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block text-[11px] uppercase tracking-wider text-emerald-400">
                      Natural English Expression:
                    </span>
                    <span className="font-semibold text-sm text-slate-100">
                      "{aiFeedback.correctedText}"
                    </span>
                  </div>
                </div>

                {/* Regional Explanation */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-amber-400">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Explanation in {user.nativeLanguage || 'Hindi'}:</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-200">
                    {aiFeedback.regionalExplanation}
                  </p>
                </div>

                {/* Pronunciation Tip */}
                {aiFeedback.pronunciationTip && (
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200">
                    <div className="font-bold text-purple-400 mb-0.5">
                      🗣️ Pronunciation Tip:
                    </div>
                    <p className="text-xs text-slate-200">
                      {aiFeedback.pronunciationTip}
                    </p>
                  </div>
                )}

                {/* Encouragement */}
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 italic text-[11px] text-center">
                  "{aiFeedback.encouragement}"
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
