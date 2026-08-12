import React from 'react';
import { ThemeMode } from '../types';

interface MobileContainerProps {
  children: React.ReactNode;
  theme: ThemeMode;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ children, theme }) => {
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-0 sm:p-4 md:p-6 transition-colors duration-300 ${
      isDark ? 'bg-[#0d0b1a] text-slate-100' : 'bg-[#e4e2f2] text-slate-900'
    }`}>
      {/* Outer Phone Frame (Visible on Tablet/Desktop screens for native app look) */}
      <div className={`w-full max-w-[430px] h-screen sm:h-[880px] sm:max-h-[92vh] sm:rounded-[48px] sm:border-[10px] ${
        isDark ? 'sm:border-[#201d40] bg-[#16142e] shadow-2xl shadow-indigo-950/80' : 'sm:border-[#282252] bg-[#FAF6F0] shadow-2xl shadow-indigo-900/20'
      } relative flex flex-col overflow-hidden transition-all duration-300`}>

        {/* Smartphone Camera Notch / Dynamic Island Simulation (Desktop preview mode) */}
        <div className="hidden sm:flex absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-[#0d0b1a] rounded-b-2xl z-50 items-center justify-center gap-2 px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1e1b40] ring-1 ring-[#2d285e]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb]/60"></div>
        </div>

        {/* Inner Scrollable Mobile Screen Viewport */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden relative scroll-smooth bg-inherit">
          {children}
        </div>
      </div>
    </div>
  );
};
