import React from 'react';
import { Flame, Sun, Moon, Volume2, VolumeX, Sparkles, Rocket } from 'lucide-react';
import { UserProfile, ThemeMode } from '../types';

interface HeaderProps {
  user: UserProfile;
  theme: ThemeMode;
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  onProfileClick,
}) => {
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 px-4 pt-3 pb-3 transition-colors duration-200 border-b backdrop-blur-xl ${
      isDark 
        ? 'bg-[#16142e]/95 border-[#282352] text-slate-100' 
        : 'bg-[#FAF6F0]/95 border-[#eee7dc] text-slate-900 shadow-sm'
    }`}>
      {/* Top Mobile Status Bar */}
      <div className="flex items-center justify-between mb-2 text-[10px] font-black tracking-widest uppercase opacity-80">
        <div className={`flex items-center gap-1.5 ${isDark ? 'text-[#3b82f6]' : 'text-[#2563eb]'}`}>
          <Rocket className="w-3 h-3 text-[#2563eb] animate-pulse" />
          <span>SUPERNOVA AI COURSE</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-ping"></span>
          <span className={isDark ? 'text-[#3b82f6]' : 'text-[#2563eb]'}>LIVE B1-B2</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        {/* User Profile & Level */}
        <button 
          onClick={onProfileClick}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="relative">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName} 
                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-[#2563eb]/60 group-hover:ring-[#2563eb] transition-all shadow-md"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-[#2563eb]/15 text-[#2563eb] font-black flex items-center justify-center ring-2 ring-[#2563eb]/40">
                {user.displayName.charAt(0) || 'U'}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white font-black text-[9px] px-1.5 py-0.5 rounded-full flex items-center shadow-md shrink-0 whitespace-nowrap border border-white/20">
              <Sparkles className="w-2.5 h-2.5 mr-0.5 fill-white" />
              <span>{user.level ? user.level.split(' ')[0] : 'B1'}</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className={`font-black text-sm leading-tight line-clamp-1 transition-colors ${
              isDark ? 'group-hover:text-[#3b82f6] text-slate-100' : 'group-hover:text-[#2563eb] text-slate-900'
            }`}>
              {user.displayName}
            </span>
            <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {user.xpPoints} XP • {user.nativeLanguage}
            </span>
          </div>
        </button>

        {/* Right side controls: Streak Counter & Mode Toggles */}
        <div className="flex items-center gap-2">
          {/* Flame Streak Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-sm ${
            isDark 
              ? 'bg-[#ff7854]/15 text-[#ff7854] border border-[#ff7854]/30' 
              : 'bg-[#ff7854]/10 text-[#ea580c] border border-[#ff7854]/30'
          }`}>
            <Flame className="w-4 h-4 fill-[#f97316] text-[#ea580c] animate-bounce" />
            <span>{user.streakDays}</span>
            <span className="text-[9px] uppercase font-bold opacity-80">Days</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label="Toggle sound effects"
            className={`p-2 rounded-2xl transition-all ${
              isDark 
                ? 'bg-[#211e47] hover:bg-[#2b275b] text-slate-300 border border-[#2d285e]' 
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 shadow-sm'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#2563eb]" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Theme Switcher Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme mode"
            className={`p-2 rounded-2xl transition-all ${
              isDark 
                ? 'bg-[#211e47] hover:bg-[#2b275b] text-amber-400 border border-[#2d285e]' 
                : 'bg-white hover:bg-slate-100 text-amber-500 border border-slate-200/80 shadow-sm'
            }`}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 fill-indigo-100" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
