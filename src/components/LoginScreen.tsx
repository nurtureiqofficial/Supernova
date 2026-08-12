import React, { useState } from 'react';
import { Sparkles, Shield, ArrowRight, Globe, Mic, Volume2 } from 'lucide-react';
import novaAvatarUrl from '../assets/images/nova_ai_teacher_1786287491962.jpg';

interface LoginScreenProps {
  onGoogleLogin: () => Promise<void>;
  isLoading: boolean;
  errorMsg: string | null;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onGoogleLogin,
  isLoading,
  errorMsg,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between px-5 py-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 min-h-full">
      {/* Top Mobile Branding & Badges */}
      <div className="space-y-4 text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>India's #1 AI Spoken English App</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight leading-snug">
          Learn English Anytime <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            With Your Own AI Teacher
          </span>
        </h1>
      </div>

      {/* Center Hero Avatar Illustration */}
      <div className="my-6 relative flex flex-col items-center">
        {/* Glow Ring */}
        <div className="absolute w-52 h-52 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 p-2 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md max-w-[280px] text-center space-y-3">
          <div className="relative mx-auto w-36 h-36">
            <img 
              src={novaAvatarUrl} 
              alt="Nova AI Teacher" 
              className="w-full h-full rounded-2xl object-cover ring-4 ring-emerald-500/40 shadow-xl"
            />
            {/* Floating Speech Bubbles for Regional Languages */}
            <div className="absolute -top-2 -left-4 bg-slate-800 border border-slate-700 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
              अ
            </div>
            <div className="absolute -top-3 -right-2 bg-slate-800 border border-slate-700 text-teal-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
              ആ
            </div>
            <div className="absolute -bottom-2 -left-2 bg-slate-800 border border-slate-700 text-amber-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
              અ
            </div>
            <div className="absolute -bottom-2 -right-2 bg-slate-800 border border-slate-700 text-blue-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
              த
            </div>
          </div>

          <div>
            <h2 className="text-base font-extrabold font-heading">
              Hi, I'm Nova!
            </h2>
            <p className="text-xs text-slate-300 px-2 leading-relaxed">
              Your 24/7 AI English teacher with live voice feedback in your mother tongue.
            </p>
          </div>
        </div>
      </div>

      {/* Features bullet points */}
      <div className="space-y-2 text-xs text-slate-300 max-w-xs mx-auto">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <Mic className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Real-time voice correction & pronunciation coach</span>
        </div>
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <Globe className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Explanations in Hindi, Tamil, Telugu, & 8+ languages</span>
        </div>
      </div>

      {/* Login CTA Area */}
      <div className="space-y-3 pt-4 border-t border-slate-800/80">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        <button
          onClick={onGoogleLogin}
          disabled={isLoading}
          className="w-full py-3.5 px-5 rounded-2xl bg-white text-slate-900 font-extrabold text-sm shadow-xl flex items-center justify-center gap-3 active:scale-98 transition-transform disabled:opacity-60"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              <span>Signing in with Google...</span>
            </div>
          ) : (
            <>
              {/* Google G Logo */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
              <ArrowRight className="w-4 h-4 ml-auto text-slate-400" />
            </>
          )}
        </button>

        <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
          <Shield className="w-3 h-3 text-emerald-500" />
          <span>Secure authentication synced with Firebase Cloud</span>
        </p>
      </div>
    </div>
  );
};
