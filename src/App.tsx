import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { NavTab, ThemeMode, UserProfile, CEFRLevelCode } from './types';
import { 
  auth, 
  onAuthStateChanged, 
  signInWithGoogle, 
  logoutUser, 
  syncUserProfileDoc,
  updateUserLanguageInFirestore
} from './lib/firebase';
import { MobileContainer } from './components/MobileContainer';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LoginScreen } from './components/LoginScreen';
import { InitializingScreen } from './components/InitializingScreen';
import { HomeView } from './components/views/HomeView';
import { RoadmapView } from './components/views/RoadmapView';
import { PracticeView } from './components/views/PracticeView';
import { HistoryView } from './components/views/HistoryView';
import { ProfileView } from './components/views/ProfileView';
import { FluencyAnalyticsView } from './components/views/FluencyAnalyticsView';
import { scheduleDailyReminder } from './lib/notificationUtils';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Auth & User Profile State
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    displayName: 'Learner',
    email: '',
    photoURL: '',
    nativeLanguage: 'हिन्दी',
    streakDays: 1,
    xpPoints: 100,
    level: 'L1 - Elementary',
    totalSpeakingMinutes: 0,
    completedLessonsCount: 0,
    cefrLevel: 'A1',
  });

  // Sync dark class on html root element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Initialize Local Daily Speaking Goal Notification Scheduler
  useEffect(() => {
    scheduleDailyReminder();
  }, []);

  // Listen to Firebase auth state persistence
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser) {
        try {
          const profile = await syncUserProfileDoc(currentUser);
          setUserProfile(profile);
        } catch (err) {
          console.error('Error syncing user profile from Firestore:', err);
        }
      }
      setAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const loggedUser = await signInWithGoogle();
      if (loggedUser) {
        const profile = await syncUserProfileDoc(loggedUser);
        setUserProfile(profile);
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setLoginError(err.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setFirebaseUser(null);
      setActiveTab('home');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLessonTitle, setSelectedLessonTitle] = useState<string | null>(null);
  const [selectedLessonContext, setSelectedLessonContext] = useState<any | null>(null);

  const handleStartLesson = (lessonId: string, lessonTitle?: string, lessonContext?: any) => {
    console.log('Starting lesson:', lessonId, lessonTitle, lessonContext);
    setSelectedModuleId(lessonId);
    setSelectedLessonTitle(lessonTitle || null);
    setSelectedLessonContext(lessonContext || null);
    setActiveTab('practice');
  };

  const handleUpdateCefrLevel = (levelCode: CEFRLevelCode) => {
    setUserProfile((prev) => ({
      ...prev,
      cefrLevel: levelCode,
      level: levelCode === 'A1' ? 'L1 - Beginner' : levelCode === 'A2' ? 'L2 - Elementary' : levelCode === 'B1' ? 'L3 - Intermediate' : levelCode === 'B2' ? 'L4 - Upper-Inter' : 'L5 - Advanced'
    }));
  };

  const handleSelectLanguage = async (langNative?: string) => {
    if (langNative) {
      setUserProfile((prev) => ({ ...prev, nativeLanguage: langNative }));
      if (firebaseUser?.uid) {
        try {
          await updateUserLanguageInFirestore(firebaseUser.uid, langNative);
        } catch (err) {
          console.error('Failed to update language in Firestore:', err);
        }
      }
    } else {
      setActiveTab('profile');
    }
  };

  return (
    <MobileContainer theme={theme}>
      {/* Auth Splash Loading State */}
      {authChecking ? (
        <InitializingScreen />
      ) : !firebaseUser ? (
        /* Mobile Login Screen Overlay when logged out */
        <LoginScreen
          onGoogleLogin={handleGoogleLogin}
          isLoading={isLoggingIn}
          errorMsg={loginError}
        />
      ) : (
        /* Authenticated App Shell */
        <>
          {/* Header Bar */}
          <Header
            user={userProfile}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onProfileClick={() => setActiveTab('profile')}
          />

          {/* Dynamic Content Body Area depending on Active Tab */}
          <main className="flex-1 flex flex-col">
            {activeTab === 'home' && (
              <HomeView
                user={userProfile}
                theme={theme}
                onStartLesson={handleStartLesson}
                onSelectLanguage={() => handleSelectLanguage()}
              />
            )}

            {activeTab === 'roadmap' && (
              <RoadmapView
                user={userProfile}
                theme={theme}
                onStartLesson={handleStartLesson}
                onUpdateCefrLevel={handleUpdateCefrLevel}
              />
            )}

            {activeTab === 'practice' && (
              <PracticeView
                user={userProfile}
                theme={theme}
                selectedModuleId={selectedModuleId}
                selectedLessonTitle={selectedLessonTitle}
                selectedLessonContext={selectedLessonContext}
              />
            )}

            {activeTab === 'analytics' && (
              <FluencyAnalyticsView
                user={userProfile}
                theme={theme}
              />
            )}

            {activeTab === 'history' && (
              <HistoryView
                user={userProfile}
                theme={theme}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                user={userProfile}
                theme={theme}
                onToggleTheme={handleToggleTheme}
                onSelectLanguage={(lang) => handleSelectLanguage(lang)}
                onLogout={handleLogout}
              />
            )}
          </main>

          {/* Bottom Navigation Bar */}
          <BottomNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            theme={theme}
          />
        </>
      )}
    </MobileContainer>
  );
}
