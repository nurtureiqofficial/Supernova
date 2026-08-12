export type NavTab = 'home' | 'roadmap' | 'practice' | 'history' | 'profile' | 'analytics';

export type ThemeMode = 'dark' | 'light';

export type CEFRLevelCode = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface CEFRUnitLesson {
  id: string;
  title: string;
  titleRegional: string;
  speakingGoal: string;
  grammarFocus: string;
  vocabFocus: string;
  durationMins: number;
  xpReward: number;
  isCompleted?: boolean;
  isCurrent?: boolean;
  isLocked?: boolean;
  targetPhrases: string[];
}

export interface CEFRLevelUnit {
  unitNumber: number;
  unitTitle: string;
  unitTitleRegional: string;
  description: string;
  lessons: CEFRUnitLesson[];
}

export interface CEFRLevelStage {
  code: CEFRLevelCode;
  name: string;
  description: string;
  descriptionRegional: string;
  color: string;
  badgeIcon: string;
  totalLessons: number;
  completedLessons: number;
  units: CEFRLevelUnit[];
}

export interface NotificationSettings {
  reminderEnabled: boolean;
  reminderTime: string; // "HH:MM" 24h format e.g. "20:00"
  dailyGoalMins: number; // e.g. 5, 10, 15, 30
  lastNotificationDate?: string;
}

export interface UserProfile {
  uid?: string;
  displayName: string;
  email: string;
  photoURL: string;
  nativeLanguage: string;
  streakDays: number;
  xpPoints: number;
  level: string;
  totalSpeakingMinutes: number;
  completedLessonsCount: number;
  cefrLevel?: CEFRLevelCode;
  notificationSettings?: NotificationSettings;
}

export interface LessonModule {
  id: string;
  title: string;
  titleRegional?: string;
  category: 'daily' | 'interview' | 'grammar' | 'pronunciation' | 'listening';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  xpReward: number;
  progressPercent: number;
  description: string;
  iconName: string;
  accentColor: string;
  isLocked?: boolean;
}

export interface SpeakingFeedback {
  id: string;
  timestamp: string;
  originalText: string;
  correctedText: string;
  explanationText: string;
  explanationRegional?: string;
  category: 'grammar' | 'pronunciation' | 'vocabulary';
  audioSampleUrl?: string;
}

export interface PracticeLog {
  id: string;
  userId: string;
  topic: string;
  accuracyScore: number;
  durationMinutes: number;
  correctionsCount: number;
  correctedSample?: string;
  regionalExplanation?: string;
  timestamp: string;
}
