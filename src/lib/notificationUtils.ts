import { NotificationSettings } from '../types';

const STORAGE_KEY = 'supernova_reminder_settings';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  reminderEnabled: true,
  reminderTime: '20:00', // 8:00 PM default
  dailyGoalMins: 15,
};

export function getNotificationSettings(): NotificationSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load notification settings', e);
  }
  return DEFAULT_NOTIFICATION_SETTINGS;
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    // Re-schedule reminder with updated settings
    scheduleDailyReminder();
  } catch (e) {
    console.error('Failed to save notification settings', e);
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notifications.');
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

export function sendLocalNotification(title: string, options?: NotificationOptions) {
  // Play subtle reminder sound effect using Web Audio API
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  } catch (err) {
    // Audio Context fail silent
  }

  // Send Browser Notification if permitted
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'daily-speaking-reminder',
        ...options,
      });
    } catch (e) {
      console.error('Failed to send browser notification', e);
    }
  }
}

let timerId: NodeJS.Timeout | null = null;

export function scheduleDailyReminder() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  const settings = getNotificationSettings();
  if (!settings.reminderEnabled) return;

  // Check every 30 seconds if it's time to notify
  timerId = setInterval(() => {
    const currentSettings = getNotificationSettings();
    if (!currentSettings.reminderEnabled) return;

    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMins = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMins}`;

    const todayStr = now.toISOString().split('T')[0];

    // Trigger if time matches and hasn't notified today
    if (
      currentTimeStr === currentSettings.reminderTime &&
      currentSettings.lastNotificationDate !== todayStr
    ) {
      // Mark as notified for today
      saveNotificationSettings({
        ...currentSettings,
        lastNotificationDate: todayStr,
      });

      sendLocalNotification('🔥 Keep Your Streak Alive! Nova is waiting!', {
        body: `It's time for your ${currentSettings.dailyGoalMins}-minute daily English speaking goal. Practice now to extend your streak!`,
      });
    }
  }, 30000);
}

export function sendTestReminderNotification() {
  const settings = getNotificationSettings();
  sendLocalNotification('🔥 Supernova AI Daily Reminder (Test)', {
    body: `Time for your daily ${settings.dailyGoalMins}-min English practice! Keep your streak strong!`,
  });
}
