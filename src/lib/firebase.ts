import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';
export { onAuthStateChanged };
import { getFirestore, doc, getDoc, getDocFromCache, setDoc, updateDoc } from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { UserProfile } from '../types';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore using specific databaseId if provided
export const db = firebaseConfigJson.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfigJson.firestoreDatabaseId)
  : getFirestore(app);

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.warn('signInWithPopup failed or blocked, trying signInWithRedirect:', error);
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
      try {
        await signInWithRedirect(auth, googleProvider);
      } catch (redirectError) {
        console.error('Redirect sign-in error:', redirectError);
        throw redirectError;
      }
    } else {
      throw error;
    }
  }
};

// Sign Out
export const logoutUser = async () => {
  return firebaseSignOut(auth);
};

// Firestore Error Handler helper for debugging security rules and permission failures
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  
  // Suppress alarming console.error logs when the client is offline or network times out
  if (
    errMsg.toLowerCase().includes('offline') || 
    errMsg.toLowerCase().includes("backend didn't respond") ||
    errMsg.toLowerCase().includes('could not reach cloud firestore')
  ) {
    console.warn(`Firestore Offline/Network Warning (${operationType} ${path}):`, errMsg);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error Details:', JSON.stringify(errInfo));
}

// Fetch or initialize user profile document in Firestore
export const syncUserProfileDoc = async (firebaseUser: User): Promise<UserProfile> => {
  const userRef = doc(db, 'users', firebaseUser.uid);
  try {
    let snap;
    try {
      snap = await getDoc(userRef);
    } catch (netErr) {
      console.warn('Online getDoc failed, attempting cache fetch:', netErr);
      try {
        snap = await getDocFromCache(userRef);
      } catch (cacheErr) {
        console.warn('Offline cache fetch failed as well:', cacheErr);
      }
    }

    if (snap && snap.exists()) {
      const data = snap.data() as Partial<UserProfile>;
      return {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || data.displayName || 'Learner',
        email: firebaseUser.email || data.email || '',
        photoURL: firebaseUser.photoURL || data.photoURL || '',
        nativeLanguage: data.nativeLanguage || 'हिन्दी',
        streakDays: data.streakDays ?? 1,
        xpPoints: data.xpPoints ?? 100,
        level: data.level || 'L1',
        totalSpeakingMinutes: data.totalSpeakingMinutes ?? 0,
        completedLessonsCount: data.completedLessonsCount ?? 0,
      };
    } else {
      // Create new profile record for first-time login
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || 'Learner',
        email: firebaseUser.email || '',
        photoURL: firebaseUser.photoURL || '',
        nativeLanguage: 'हिन्दी',
        streakDays: 1,
        xpPoints: 100,
        level: 'L1',
        totalSpeakingMinutes: 0,
        completedLessonsCount: 0,
      };
      setDoc(userRef, {
        ...newProfile,
        updatedAt: new Date().toISOString(),
      }).catch((err) => handleFirestoreError(err, OperationType.CREATE, `users/${firebaseUser.uid}`));
      return newProfile;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
    return {
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName || 'Learner',
      email: firebaseUser.email || '',
      photoURL: firebaseUser.photoURL || '',
      nativeLanguage: 'हिन्दी',
      streakDays: 1,
      xpPoints: 100,
      level: 'L1',
      totalSpeakingMinutes: 0,
      completedLessonsCount: 0,
    };
  }
};

export const updateUserLanguageInFirestore = async (uid: string, nativeLanguage: string) => {
  if (!uid) return;
  const userRef = doc(db, 'users', uid);
  try {
    await updateDoc(userRef, {
      nativeLanguage,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
};

// Award XP and increment user practice stats
export const awardUserXpAndStats = async (
  uid: string, 
  addedXp: number, 
  addedMinutes: number = 1
) => {
  if (!uid || !auth.currentUser) return;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      const currentXp = data.xpPoints || 0;
      const currentMinutes = data.totalSpeakingMinutes || 0;
      const currentLessons = data.completedLessonsCount || 0;

      const newXp = currentXp + addedXp;
      let newLevel = 'L1';
      if (newXp > 800) newLevel = 'L4 - Master Speaker';
      else if (newXp > 400) newLevel = 'L3 - Conversationalist';
      else if (newXp > 200) newLevel = 'L2 - Elementary';

      await updateDoc(userRef, {
        xpPoints: newXp,
        totalSpeakingMinutes: currentMinutes + addedMinutes,
        completedLessonsCount: currentLessons + 1,
        level: newLevel,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
  }
};

// Save Practice Log entry to Firestore
export const savePracticeLogToFirestore = async (logData: Omit<import('../types').PracticeLog, 'id'>) => {
  if (!auth.currentUser) return null;
  try {
    const { collection, addDoc } = await import('firebase/firestore');
    const logsCol = collection(db, 'practice_logs');
    const docRef = await addDoc(logsCol, {
      ...logData,
      userId: auth.currentUser.uid, // Guarantee auth owner match
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'practice_logs');
    return null;
  }
};

// Fetch practice logs for user from Firestore
export const fetchUserPracticeLogs = async (userId: string): Promise<import('../types').PracticeLog[]> => {
  if (!userId || !auth.currentUser) return [];
  try {
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const logsCol = collection(db, 'practice_logs');
    const q = query(
      logsCol,
      where('userId', '==', auth.currentUser.uid)
    );
    const snapshot = await getDocs(q);
    const logs: import('../types').PracticeLog[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      logs.push({
        id: d.id,
        userId: data.userId,
        topic: data.topic || 'General Practice',
        accuracyScore: data.accuracyScore ?? 90,
        durationMinutes: data.durationMinutes ?? 3,
        correctionsCount: data.correctionsCount ?? 1,
        correctedSample: data.correctedSample || '',
        regionalExplanation: data.regionalExplanation || '',
        timestamp: data.timestamp || new Date().toLocaleDateString(),
      });
    });
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'practice_logs');
    return [];
  }
};
