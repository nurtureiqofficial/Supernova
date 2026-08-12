import React from 'react';
import { Home, Compass, Mic, BarChart3, User } from 'lucide-react';
import { NavTab, ThemeMode } from '../types';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  theme: ThemeMode;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  theme,
}) => {
  const isDark = theme === 'dark';

  const navItems = [
    { id: 'home' as NavTab, label: 'Home', subLabel: 'Dashboard', icon: Home },
    { id: 'roadmap' as NavTab, label: 'Roadmap', subLabel: 'Level Map', icon: Compass },
    { id: 'practice' as NavTab, label: 'Practice', subLabel: 'AI Voice', icon: Mic, isCenter: true },
    { id: 'analytics' as NavTab, label: 'Activity', subLabel: 'Stats', icon: BarChart3 },
    { id: 'profile' as NavTab, label: 'Profile', subLabel: 'Account', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-1 safe-bottom pointer-events-none">
      <div className={`max-w-md mx-auto pointer-events-auto rounded-3xl px-2 py-1.5 shadow-2xl border backdrop-blur-xl transition-all duration-300 ${
        isDark 
          ? 'bg-[#181635]/95 border-[#282352] text-slate-300 shadow-[#0a091d]/80' 
          : 'bg-white/95 border-slate-200/90 text-slate-700 shadow-xl shadow-slate-300/40'
      }`}>
        <div className="flex items-center justify-between px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            if (item.isCenter) {
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className="flex flex-col items-center justify-center -mt-5 group focus:outline-none relative"
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 active:scale-90 ${
                    isActive
                      ? 'bg-gradient-to-tr from-[#1d4ed8] to-[#2563eb] text-white ring-4 ring-[#2563eb]/30 shadow-lg shadow-[#2563eb]/40 scale-105'
                      : 'bg-gradient-to-tr from-[#2563eb] to-[#3b82f6] text-white hover:brightness-110 shadow-md shadow-blue-600/30'
                  }`}>
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-[10px] font-black mt-1 tracking-tight ${
                    isActive ? (isDark ? 'text-[#3b82f6]' : 'text-[#2563eb]') : (isDark ? 'text-slate-400' : 'text-slate-500')
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 active:scale-95 relative ${
                  isActive 
                    ? (isDark ? 'text-[#3b82f6] font-extrabold' : 'text-[#2563eb] font-extrabold') 
                    : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800')
                }`}
              >
                {isActive && (
                  <span className={`absolute -top-1 w-7 h-1 rounded-full shadow-sm ${
                    isDark ? 'bg-[#3b82f6]' : 'bg-[#2563eb]'
                  }`} />
                )}
                <div className={`p-1.5 rounded-xl transition-all ${
                  isActive ? (isDark ? 'bg-[#2563eb]/20 text-[#3b82f6]' : 'bg-[#2563eb]/10 text-[#2563eb]') : ''
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                </div>
                <span className="text-[10px] font-bold tracking-tight mt-0.5">{item.label}</span>
                <span className={`text-[8px] leading-none ${
                  isActive ? (isDark ? 'text-[#3b82f6] font-black' : 'text-[#2563eb] font-black') : 'text-slate-400 font-medium'
                }`}>
                  {item.subLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
