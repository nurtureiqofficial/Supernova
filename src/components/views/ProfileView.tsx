import React, { useState, useEffect } from 'react';
import { User, Flame, Award, Globe, Clock, ShieldCheck, Moon, Sun, Check, LogOut, ChevronDown, ChevronUp, Bell, BellRing, Target, Sparkles, Volume2 } from 'lucide-react';
import { UserProfile, ThemeMode, NotificationSettings } from '../../types';
import {
  getNotificationSettings,
  saveNotificationSettings,
  requestNotificationPermission,
  sendTestReminderNotification
} from '../../lib/notificationUtils';

interface ProfileViewProps {
  user: UserProfile;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onSelectLanguage: (lang: string) => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  theme,
  onToggleTheme,
  onSelectLanguage,
  onLogout,
}) => {
  const isDark = theme === 'dark';
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Local notification reminder state
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(() => getNotificationSettings());
  const [testToast, setTestToast] = useState<string | null>(null);

  const handleToggleReminder = async () => {
    const nextState = !notifSettings.reminderEnabled;
    if (nextState) {
      const granted = await requestNotificationPermission();
      if (!granted && 'Notification' in window && Notification.permission === 'denied') {
        setTestToast('⚠️ Allow browser notifications for daily streak alerts');
        setTimeout(() => setTestToast(null), 4000);
      }
    }
    const updated = { ...notifSettings, reminderEnabled: nextState };
    setNotifSettings(updated);
    saveNotificationSettings(updated);
  };

  const handleUpdateReminderTime = (time: string) => {
    const updated = { ...notifSettings, reminderTime: time };
    setNotifSettings(updated);
    saveNotificationSettings(updated);
  };

  const handleUpdateDailyGoal = (mins: number) => {
    const updated = { ...notifSettings, dailyGoalMins: mins };
    setNotifSettings(updated);
    saveNotificationSettings(updated);
  };

  const handleTestNotification = async () => {
    await requestNotificationPermission();
    sendTestReminderNotification();
    setTestToast('🔔 Test notification sound & alert triggered!');
    setTimeout(() => setTestToast(null), 3500);
  };

  // Alphabetically sorted list of all supported Indian regional languages (A-Z)
  const languages = [
    { name: 'अंगिका (Angika)', native: 'अंगिका' },
    { name: 'অসমীয়া (Assamese / Asami)', native: 'Assamese' },
    { name: 'বাংলা (Bengali)', native: 'বাংলা' },
    { name: 'भोजपुरी (Bhojpuri)', native: 'भोजपुरी' },
    { name: 'बड़ो (Bodo)', native: 'Bodo' },
    { name: 'बुंदेली (Bundeli)', native: 'बुंदेली' },
    { name: 'छत्तीसगढ़ी (Chhattisgarhi)', native: 'Chhattisgarhi' },
    { name: 'डोगरी (Dogri)', native: 'Dogri' },
    { name: 'गढ़वाली (Garhwali)', native: 'गढ़वाली' },
    { name: 'ગુજરાતી (Gujarati)', native: 'ગુજરાતી' },
    { name: 'हरियाणवी (Haryanvi)', native: 'Haryanvi' },
    { name: 'हिमाचली / पहाड़ी (Himachali / Pahari)', native: 'Himachali' },
    { name: 'हिन्दी (Hindi)', native: 'हिन्दी' },
    { name: 'Hinglish (Hindi + English)', native: 'Hinglish' },
    { name: 'ಕನ್ನಡ (Kannada)', native: 'ಕನ್ನಡ' },
    { name: 'کٲشُر / कश्मीरी (Kashmiri)', native: 'Kashmiri' },
    { name: 'खोरठा (Khortha)', native: 'खोरठा' },
    { name: 'कोंकणी (Konkani)', native: 'Konkani' },
    { name: 'कुमाऊँनी (Kumaoni)', native: 'कुमाऊँनी' },
    { name: 'मगही (Magahi)', native: 'मगही' },
    { name: 'मैथिली (Maithili)', native: 'मैथिली' },
    { name: 'മലയാളം (Malayalam)', native: 'മലയാളം' },
    { name: 'মৈতৈলোন্ / मणिपुरी (Manipuri / Meitei)', native: 'Manipuri' },
    { name: 'मराठी (Marathi)', native: 'मराठी' },
    { name: 'Mizo (मिज़ो)', native: 'Mizo' },
    { name: 'Nagamese (नागामीज़)', native: 'Nagamese' },
    { name: 'नेपाली (Nepali)', native: 'Nepali' },
    { name: 'ଓଡ଼ିଆ (Odia / Odiya)', native: 'Odia' },
    { name: 'ਪੰਜਾਬੀ (Punjabi)', native: 'Punjabi' },
    { name: 'राजस्थानी / मारवाड़ी (Rajasthani / Marwari)', native: 'Rajasthani' },
    { name: 'संस्कृतम् (Sanskrit)', native: 'Sanskrit' },
    { name: 'संथाली (Santhali)', native: 'Santhali' },
    { name: 'سنڌي / सिंधी (Sindhi)', native: 'Sindhi' },
    { name: 'தமிழ் (Tamil)', native: 'தமிழ்' },
    { name: 'తెలుగు (Telugu)', native: 'తెలుగు' },
    { name: 'ತುಳು (Tulu)', native: 'Tulu' },
    { name: 'اردو (Urdu)', native: 'Urdu' },
  ].sort((a, b) => {
    const getEng = (str: string) => {
      const match = str.match(/\(([^)]+)\)/);
      return match ? match[1].toLowerCase() : str.toLowerCase();
    };
    return getEng(a.name).localeCompare(getEng(b.name));
  });

  const selectedLangObj = languages.find(
    (l) => user.nativeLanguage && (user.nativeLanguage.includes(l.native) || l.native.includes(user.nativeLanguage))
  ) || languages.find((l) => l.native === 'हिन्दी') || languages[0];

  return (
    <div className="flex-1 px-4 pt-3 pb-24 space-y-5">
      {/* User Header Profile Card */}
      <div className={`p-5 rounded-3xl border text-center space-y-3 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="relative inline-block mx-auto">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName} 
              className="w-20 h-20 rounded-full object-cover ring-4 ring-emerald-500/50 shadow-md mx-auto"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-2xl flex items-center justify-center ring-4 ring-emerald-500/50 mx-auto">
              {user.displayName.charAt(0) || 'U'}
            </div>
          )}
          <span className="absolute bottom-0 right-0 bg-amber-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full border border-slate-900 shadow">
            {user.level}
          </span>
        </div>

        <div>
          <h2 className="text-base font-extrabold font-heading">{user.displayName}</h2>
          <p className="text-xs text-slate-400">{user.email || 'Learner Account'}</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
          <div className="p-2 rounded-2xl bg-slate-950/40 text-center">
            <Flame className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <div className="text-sm font-extrabold">{user.streakDays} Days</div>
            <div className="text-[10px] text-slate-400 uppercase">Streak</div>
          </div>

          <div className="p-2 rounded-2xl bg-slate-950/40 text-center">
            <Award className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <div className="text-sm font-extrabold">{user.xpPoints}</div>
            <div className="text-[10px] text-slate-400 uppercase">XP Earned</div>
          </div>

          <div className="p-2 rounded-2xl bg-slate-950/40 text-center">
            <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <div className="text-sm font-extrabold">{user.totalSpeakingMinutes}m</div>
            <div className="text-[10px] text-slate-400 uppercase">Speaking</div>
          </div>
        </div>
      </div>

      {/* Select Native Language for AI Explanations */}
      <div className={`p-4 rounded-3xl border space-y-3 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-sm text-emerald-400">
            <Globe className="w-4 h-4" />
            <span>Explanations Language (Mother Tongue)</span>
          </div>
          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <span>Collapse</span>
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-xs text-slate-400">
          Select your native language so Nova explains grammar & corrections in your regional language:
        </p>

        {!isExpanded ? (
          /* Single Selected Language Card (Hides other buttons until 'Change' is tapped) */
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 ring-2 ring-emerald-500/30">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                  Selected Language
                </div>
                <div className="text-sm font-extrabold text-slate-100">
                  {selectedLangObj?.name || user.nativeLanguage || 'Hindi'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-extrabold flex items-center gap-1 border border-slate-700/80 transition-all active:scale-95 shadow-sm"
            >
              <span>Change</span>
              <ChevronDown className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        ) : (
          /* Expanded Alphabetical Language Options Grid (A-Z) */
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between px-1">
              <span>All Languages (A-Z Alphabetical):</span>
              <span className="text-emerald-400">{languages.length} Available</span>
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
              {languages.map((lang) => {
                const isSelected = user.nativeLanguage && (user.nativeLanguage.includes(lang.native) || lang.native.includes(user.nativeLanguage));
                return (
                  <button
                    key={lang.name}
                    onClick={() => {
                      onSelectLanguage(lang.native);
                      setIsExpanded(false); // Hide other buttons upon selection!
                    }}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold flex items-center justify-between transition-all active:scale-98 ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-sm'
                        : isDark ? 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{lang.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Daily Speaking Goal & Streak Protection Reminders */}
      <div className={`p-4 rounded-3xl border space-y-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-sm text-amber-400">
            <BellRing className="w-4 h-4 animate-bounce" />
            <span>Daily Goal & Streak Reminders</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 text-[10px] font-black text-amber-300">
            <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>Streak Booster</span>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Set your daily speaking target and schedule local reminders so you never break your daily habit.
        </p>

        {/* Toast Feedback */}
        {testToast && (
          <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{testToast}</span>
          </div>
        )}

        {/* Target Speaking Goal Minutes */}
        <div className="space-y-2">
          <label className="text-[11px] font-extrabold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              Daily Practice Target:
            </span>
            <span className="text-emerald-400 font-black">{notifSettings.dailyGoalMins} Mins/Day</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[5, 10, 15, 30].map((mins) => (
              <button
                key={mins}
                onClick={() => handleUpdateDailyGoal(mins)}
                className={`py-2 px-1 rounded-xl text-xs font-black border transition-all active:scale-95 ${
                  notifSettings.dailyGoalMins === mins
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                    : isDark ? 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Daily Local Notification */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/40 border border-slate-800 text-xs">
          <div className="space-y-0.5">
            <span className="font-extrabold flex items-center gap-2 text-slate-200">
              <Bell className="w-4 h-4 text-emerald-400" />
              Local Daily Reminder
            </span>
            <p className="text-[10px] text-slate-400">
              {notifSettings.reminderEnabled ? `Active • Reminds daily at ${notifSettings.reminderTime}` : 'Disabled'}
            </p>
          </div>
          <button
            onClick={handleToggleReminder}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              notifSettings.reminderEnabled ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
              notifSettings.reminderEnabled ? 'translate-x-6' : 'translate-x-0'
            }`}></div>
          </button>
        </div>

        {/* Preferred Notification Time Picker */}
        {notifSettings.reminderEnabled && (
          <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Select Reminder Time:
              </span>
              <input
                type="time"
                value={notifSettings.reminderTime}
                onChange={(e) => handleUpdateReminderTime(e.target.value)}
                className="bg-slate-800 text-emerald-400 font-mono font-bold text-xs px-2.5 py-1 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 font-bold">Quick Time:</span>
              {[
                { label: '8:00 AM', val: '08:00' },
                { label: '2:00 PM', val: '14:00' },
                { label: '8:00 PM', val: '20:00' },
                { label: '10:00 PM', val: '22:00' },
              ].map((preset) => (
                <button
                  key={preset.val}
                  onClick={() => handleUpdateReminderTime(preset.val)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                    notifSettings.reminderTime === preset.val
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Test Notification Button */}
            <button
              onClick={handleTestNotification}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-extrabold flex items-center justify-center gap-2 active:scale-98 transition-all shadow-sm"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>🔔 Test Reminder Notification & Sound</span>
            </button>
          </div>
        )}
      </div>

      {/* Appearance & Settings */}
      <div className={`p-4 rounded-3xl border space-y-3 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <h3 className="font-extrabold text-sm">App Preferences</h3>
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/40 text-xs">
          <span className="font-semibold flex items-center gap-2">
            {isDark ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-indigo-500" />}
            Dark Theme Mode
          </span>
          <button
            onClick={onToggleTheme}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              isDark ? 'bg-emerald-500' : 'bg-slate-400'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
              isDark ? 'translate-x-6' : 'translate-x-0'
            }`}></div>
          </button>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full mt-2 py-3 px-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-rose-500/20 active:scale-98 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Supernova AI</span>
          </button>
        )}
      </div>
    </div>
  );
};
