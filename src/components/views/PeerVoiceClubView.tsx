import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Radio, Mic, MicOff, PhoneOff, Volume2, Clock, Sparkles, 
  Award, MessageSquare, ThumbsUp, RotateCcw, CheckCircle2, AlertCircle, 
  Brain, ShieldAlert, Heart, Zap, Globe, Flame, Send, ChevronRight
} from 'lucide-react';
import { UserProfile, ThemeMode } from '../../types';
import { PEER_LEARNERS, VOICE_CLUB_TOPICS, PeerLearner, VoiceClubTopic } from '../../data/peerVoiceClubData';
import { savePracticeLogToFirestore, awardUserXpAndStats } from '../../lib/firebase';

interface PeerVoiceClubViewProps {
  user: UserProfile;
  theme: ThemeMode;
}

interface ChatMessage {
  sender: 'me' | 'peer';
  text: string;
  time: string;
}

export const PeerVoiceClubView: React.FC<PeerVoiceClubViewProps> = ({ user, theme }) => {
  const isDark = theme === 'dark';

  // Room / Match States: 'lobby' | 'matching' | 'in_call' | 'post_call'
  const [callState, setCallState] = useState<'lobby' | 'matching' | 'in_call' | 'post_call'>('lobby');
  const [activePeer, setActivePeer] = useState<PeerLearner>(PEER_LEARNERS[0]);
  const [activeTopic, setActiveTopic] = useState<VoiceClubTopic>(VOICE_CLUB_TOPICS[0]);

  // Audio / Call Controls
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [timerSeconds, setTimerSeconds] = useState<number>(180); // 3 minutes = 180 seconds
  const [callActive, setCallActive] = useState<boolean>(false);

  // Live Speech Recognition & Audio Waves
  const [mySpokenText, setMySpokenText] = useState<string>('');
  const [peerSpokenText, setPeerSpokenText] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [quickInput, setQuickInput] = useState<string>('');

  // Post Call Rating
  const [starRating, setStarRating] = useState<number>(5);
  const [selectedBadges, setSelectedBadges] = useState<string[]>(['Fluent Speaker 🗣️', 'Great Listener 🎧']);

  const timerIntervalRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const peerSimulationTimeoutRef = useRef<any>(null);

  // Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setMySpokenText(transcript);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // 3-Minute Timer Countdown Handler
  useEffect(() => {
    if (callState === 'in_call' && timerSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            handleEndCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [callState, timerSeconds]);

  // Simulate Peer Spoken Responses during call
  useEffect(() => {
    if (callState === 'in_call') {
      const peerPhrases = [
        `"That is a great point about ${activeTopic.title}! In my opinion, work-life balance is super essential."`,
        `"I completely agree with you. When I was studying last year, I faced a similar situation."`,
        `"How do you usually handle stress when working long hours in English meetings?"`,
        `"I loved your vocabulary choice! Could you repeat that phrase again?"`
      ];

      let phraseIdx = 0;
      const simulatePeerSpeech = () => {
        if (phraseIdx < peerPhrases.length) {
          setPeerSpokenText(peerPhrases[phraseIdx]);
          phraseIdx++;
          peerSimulationTimeoutRef.current = setTimeout(simulatePeerSpeech, 14000);
        }
      };

      peerSimulationTimeoutRef.current = setTimeout(simulatePeerSpeech, 4000);
    }

    return () => {
      if (peerSimulationTimeoutRef.current) clearTimeout(peerSimulationTimeoutRef.current);
    };
  }, [callState, activeTopic]);

  // Start Matching Flow
  const handleStartMatching = () => {
    setCallState('matching');

    // Pick random peer and topic after 2.5s simulation
    setTimeout(() => {
      const randomPeer = PEER_LEARNERS[Math.floor(Math.random() * PEER_LEARNERS.length)];
      const randomTopic = VOICE_CLUB_TOPICS[Math.floor(Math.random() * VOICE_CLUB_TOPICS.length)];

      setActivePeer(randomPeer);
      setActiveTopic(randomTopic);
      setTimerSeconds(180);
      setCallState('in_call');
      setMySpokenText('');
      setPeerSpokenText(`"Hi ${user.displayName || 'friend'}! Ready to practice English together on '${randomTopic.title}'?"`);
      setChatMessages([]);

      // Start mic if available
      if (recognitionRef.current && !isMuted) {
        try { recognitionRef.current.start(); } catch (e) {}
      }
    }, 2500);
  };

  // End Call & Transition to Scorecard
  const handleEndCall = async () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (peerSimulationTimeoutRef.current) clearTimeout(peerSimulationTimeoutRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    setCallState('post_call');

    // Save practice log and award XP
    if (user.uid) {
      await savePracticeLogToFirestore({
        userId: user.uid,
        topic: `3-Min Voice Club with ${activePeer.name}`,
        accuracyScore: 88,
        durationMinutes: 3,
        correctionsCount: 0,
        correctedSample: `Completed peer English conversation on "${activeTopic.title}" with ${activePeer.name} (${activePeer.location}).`,
        regionalExplanation: `Peer practice boosts conversational confidence without anxiety.`,
        timestamp: new Date().toISOString(),
      });
      await awardUserXpAndStats(user.uid, 50, 3);
    }
  };

  // Send Quick Reactions / Chat Message in call
  const handleSendQuickReaction = (reaction: string) => {
    const newMsg: ChatMessage = {
      sender: 'me',
      text: reaction,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);

    // Peer auto response to reaction
    setTimeout(() => {
      const peerReply: ChatMessage = {
        sender: 'peer',
        text: '🙌 Thanks! Loved talking with you.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, peerReply]);
    }, 1500);
  };

  // Format Seconds (180 -> 03:00)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 px-4 pt-3 pb-24 space-y-5">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl p-5 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border border-emerald-800/60 shadow-xl text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold px-3 py-1 rounded-full border border-emerald-500/30">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Live Peer Voice Club</span>
            </div>

            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              ● 48 Learners Online
            </span>
          </div>

          <h2 className="text-xl font-black font-heading tracking-tight">
            3-Minute Rapid English Pairing
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Connect with friendly peer learners from India & around the world for 3 minutes of high-energy spoken English practice. Zero judgment!
          </p>
        </div>
      </div>

      {/* STATE 1: LOBBY & MATCHMAKING LAUNCHER */}
      {callState === 'lobby' && (
        <div className="space-y-4">
          {/* Pairing Feature Cards */}
          <div className={`p-5 rounded-3xl border space-y-4 text-center ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Users className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-100 font-heading">
                Ready for a Quick 3-Min Conversation?
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                We will match you with a learner at your CEFR level and give both of you a fun conversation topic card.
              </p>
            </div>

            <button
              onClick={handleStartMatching}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-98 transition-transform"
            >
              <Radio className="w-5 h-5 animate-pulse" />
              <span>Match with Peer Partner (+50 XP)</span>
            </button>
          </div>

          {/* Featured Voice Club Topics */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block px-1">
              Today's Conversation Cards:
            </span>

            <div className="grid grid-cols-1 gap-2.5">
              {VOICE_CLUB_TOPICS.map((topic) => (
                <div
                  key={topic.id}
                  className={`p-3.5 rounded-2xl border space-y-2 ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {topic.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-bold">
                      3 Mins
                    </span>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-100 font-heading">
                    "{topic.title}"
                  </h4>

                  <p className="text-[11px] text-slate-400 italic">
                    ❓ "{topic.icebreakerQuestions[0]}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: MATCHING SPINNER SIMULATION */}
      {callState === 'matching' && (
        <div className={`p-8 rounded-3xl border text-center space-y-6 animate-in fade-in ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
            <div className="relative w-24 h-24 rounded-full bg-emerald-500/30 border-2 border-emerald-400 flex items-center justify-center text-3xl">
              🎙️
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-100 font-heading">
              Searching for Available Peer Learner...
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Matching based on CEFR level (B1/B2) and regional conversation preferences.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-xs text-emerald-400 font-extrabold">
            <Radio className="w-4 h-4 animate-spin" />
            <span>Found Active Partner! Connecting audio...</span>
          </div>
        </div>
      )}

      {/* STATE 3: LIVE 3-MINUTE VOICE CALL ROOM */}
      {callState === 'in_call' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Top Timer Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2 text-emerald-400">
              <Clock className="w-4 h-4 animate-pulse" />
              <span>3-Min Voice Club Session</span>
            </div>

            <div className="text-base font-black font-mono text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-xl border border-emerald-500/30">
              ⏱️ {formatTime(timerSeconds)}
            </div>
          </div>

          {/* Active Call Avatars & Waves */}
          <div className="grid grid-cols-2 gap-3">
            {/* Peer Learner Card */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-2 relative overflow-hidden">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-3xl relative">
                {activePeer.avatarEmoji}
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-slate-100 font-heading">
                  {activePeer.name}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold">
                  📍 {activePeer.location}
                </p>
                <span className="text-[9px] font-extrabold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 inline-block mt-1">
                  {activePeer.cefrLevel}
                </span>
              </div>
            </div>

            {/* You (User Card) */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-2 relative">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-3xl relative">
                {user.avatarEmoji || '🧑‍💻'}
                <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-slate-900 rounded-full ${
                  isMuted ? 'bg-rose-500' : 'bg-emerald-500'
                }`} />
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-slate-100 font-heading">
                  You ({user.displayName || 'Learner'})
                </h4>
                <p className="text-[10px] text-slate-400 font-bold">
                  📍 India
                </p>
                <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block mt-1">
                  {user.cefrLevel || 'B1 Learner'}
                </span>
              </div>
            </div>
          </div>

          {/* Conversation Card Topic */}
          <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider block">
              💡 Current Icebreaker Topic Card:
            </span>
            <h3 className="text-sm font-extrabold text-slate-100 font-heading">
              "{activeTopic.title}"
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              ❓ Prompt: "{activeTopic.icebreakerQuestions[0]}"
            </p>

            {/* Vocabulary Helper Chips */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 w-full">Useful Spoken Words:</span>
              {activeTopic.suggestedVocab.map((v, i) => (
                <span key={i} className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                  {v.word} ({v.meaningHindi})
                </span>
              ))}
            </div>
          </div>

          {/* Live Transcript Box */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
              🗣️ Live Speech Captions:
            </span>
            {peerSpokenText && (
              <div className="text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-slate-800 italic">
                <strong className="text-indigo-400 not-italic">{activePeer.name}:</strong> {peerSpokenText}
              </div>
            )}
            {mySpokenText && (
              <div className="text-emerald-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 italic">
                <strong className="text-emerald-400 not-italic">You:</strong> "{mySpokenText}"
              </div>
            )}
          </div>

          {/* Quick Reaction Buttons */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {['👏 Great point!', '💡 Good vocab!', '💯 Super fluent!', '🙌 Agree with you!'].map((react, i) => (
              <button
                key={i}
                onClick={() => handleSendQuickReaction(react)}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-700 active:scale-95"
              >
                {react}
              </button>
            ))}
          </div>

          {/* Call Action Bar Controls */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-2xl font-bold transition-all ${
                isMuted ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-slate-800 text-slate-200 border border-slate-700'
              }`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <button
              onClick={handleEndCall}
              className="p-4 rounded-2xl bg-rose-500 text-slate-950 font-black shadow-lg shadow-rose-500/30 flex items-center gap-2 px-6 active:scale-95"
            >
              <PhoneOff className="w-6 h-6" />
              <span className="text-xs">End Call</span>
            </button>

            <button
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`p-4 rounded-2xl font-bold transition-all ${
                !isSpeakerOn ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-200 border border-slate-700'
              }`}
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* STATE 4: POST CALL PEER FEEDBACK & XP SCORECARD */}
      {callState === 'post_call' && (
        <div className={`p-5 rounded-3xl border space-y-5 animate-in fade-in ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-3xl">
              🎉
            </div>

            <h3 className="text-base font-extrabold text-slate-100 font-heading">
              3-Minute Voice Practice Completed!
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Great session with <strong>{activePeer.name}</strong> from {activePeer.location}.
            </p>
          </div>

          {/* XP Reward Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-emerald-400" />
              <div>
                <span className="font-extrabold text-slate-100 block">Session Reward Earned</span>
                <span className="text-slate-400 text-[11px]">+3 Mins Logged to Fluency Analytics</span>
              </div>
            </div>

            <span className="text-base font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
              +50 XP ⚡
            </span>
          </div>

          {/* Rate Peer Experience */}
          <div className="space-y-2 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Rate conversation experience with {activePeer.name}:
            </span>

            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setStarRating(star)}
                  className={`text-2xl transition-transform hover:scale-125 ${
                    star <= starRating ? 'text-amber-400' : 'text-slate-700'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Send Peer Compliment Badges */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Send Compliment Badge to {activePeer.name}:
            </span>

            <div className="flex flex-wrap gap-2">
              {['Fluent Speaker 🗣️', 'Clear Accent 🎙️', 'Great Listener 🎧', 'Super Friendly 😊'].map((badge) => (
                <button
                  key={badge}
                  onClick={() => {
                    if (selectedBadges.includes(badge)) {
                      setSelectedBadges(prev => prev.filter(b => b !== badge));
                    } else {
                      setSelectedBadges(prev => [...prev, badge]);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedBadges.includes(badge)
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {badge}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCallState('lobby')}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Another 3-Min Session</span>
          </button>
        </div>
      )}
    </div>
  );
};
