// lib/quizService.ts - COMPLETE AND WORKING VERSION
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy,
  Timestamp,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { db, firebaseReady } from './firebase';
import { isFirestoreOfflineError } from './firebaseError';

export interface QuizAttempt {
  id?: string;
  userId: string;
  language: string;
  chapterId: string;
  chapterTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentage: number;
  answers: {
    questionId: number;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
  }[];
  timestamp: Timestamp;
  timeSpent?: number;
}

export interface QuizStats {
  totalAttempts: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  averageScore: number;
  languageStats: {
    [language: string]: {
      attempts: number;
      correctAnswers: number;
      wrongAnswers: number;
    };
  };
}

export async function saveQuizAttempt(attempt: Omit<QuizAttempt, 'id'>): Promise<string> {
  try {
    if (!firebaseReady || !db) {
      throw new Error('Firebase is not configured. Add the required NEXT_PUBLIC_FIREBASE_* variables to .env and restart the dev server.');
    }

    const docRef = await addDoc(collection(db, 'quizAttempts'), {
      ...attempt,
      timestamp: Timestamp.now(),
    });
    
    await updateUserQuizStats(attempt.userId, attempt);
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
    throw error;
  }
}

async function updateUserQuizStats(userId: string, attempt: Omit<QuizAttempt, 'id'>) {
  try {
    if (!firebaseReady || !db) {
      return;
    }

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentStats = userData.quizStats || {
        totalAttempts: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        averageScore: 0,
        languageStats: {}
      };

      const languageStats = currentStats.languageStats || {};
      
      if (!languageStats[attempt.language]) {
        languageStats[attempt.language] = {
          attempts: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
        };
      }
      
      languageStats[attempt.language].attempts += 1;
      languageStats[attempt.language].correctAnswers += attempt.correctAnswers;
      languageStats[attempt.language].wrongAnswers += attempt.wrongAnswers;
      
      const newTotalAttempts = currentStats.totalAttempts + 1;
      const newTotalQuestions = currentStats.totalQuestions + attempt.totalQuestions;
      const newCorrectAnswers = currentStats.correctAnswers + attempt.correctAnswers;
      const newWrongAnswers = currentStats.wrongAnswers + attempt.wrongAnswers;
      
      const newAverageScore = newTotalQuestions > 0 
        ? Math.round((newCorrectAnswers / newTotalQuestions) * 100)
        : 0;
      
      await updateDoc(userRef, {
        'quizStats.totalAttempts': newTotalAttempts,
        'quizStats.totalQuestions': newTotalQuestions,
        'quizStats.correctAnswers': newCorrectAnswers,
        'quizStats.wrongAnswers': newWrongAnswers,
        'quizStats.averageScore': newAverageScore,
        'quizStats.languageStats': languageStats,
      });
    }
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
}

export async function getUserQuizAttempts(userId: string): Promise<QuizAttempt[]> {
  try {
    if (!firebaseReady || !db) {
      return [];
    }

    const q = query(
      collection(db, 'quizAttempts'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const attempts: QuizAttempt[] = [];
    
    querySnapshot.forEach((doc) => {
      attempts.push({
        id: doc.id,
        ...doc.data(),
      } as QuizAttempt);
    });
    
    return attempts;
  } catch (error) {
    if (isFirestoreOfflineError(error as Error)) {
      return [];
    }

    console.error('Error fetching quiz attempts:', error);
    return [];
  }
}

export async function getUserQuizAttemptsByLanguage(
  userId: string, 
  language: string
): Promise<QuizAttempt[]> {
  try {
    if (!firebaseReady || !db) {
      return [];
    }

    const q = query(
      collection(db, 'quizAttempts'),
      where('userId', '==', userId),
      where('language', '==', language),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const attempts: QuizAttempt[] = [];
    
    querySnapshot.forEach((doc) => {
      attempts.push({
        id: doc.id,
        ...doc.data(),
      } as QuizAttempt);
    });
    
    return attempts;
  } catch (error) {
    if (isFirestoreOfflineError(error as Error)) {
      return [];
    }

    console.error('Error fetching quiz attempts by language:', error);
    return [];
  }
}

export async function getUserQuizStats(userId: string): Promise<QuizStats> {
  try {
    if (!firebaseReady || !db) {
      return {
        totalAttempts: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        averageScore: 0,
        languageStats: {},
      };
    }

    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      const stats = userDoc.data().quizStats;
      
      if (stats) {
        return {
          totalAttempts: stats.totalAttempts || 0,
          totalQuestions: stats.totalQuestions || 0,
          correctAnswers: stats.correctAnswers || 0,
          wrongAnswers: stats.wrongAnswers || 0,
          averageScore: stats.averageScore || 0,
          languageStats: stats.languageStats || {},
        };
      }
    }
    
    return {
      totalAttempts: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      averageScore: 0,
      languageStats: {},
    };
  } catch (error) {
    if (isFirestoreOfflineError(error as Error)) {
      return {
        totalAttempts: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        averageScore: 0,
        languageStats: {},
      };
    }

    console.error('Error fetching user quiz stats:', error);
    return {
      totalAttempts: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      averageScore: 0,
      languageStats: {},
    };
  }
}

export async function getChapterAttempts(
  userId: string,
  language: string,
  chapterId: string
): Promise<QuizAttempt[]> {
  try {
    if (!firebaseReady || !db) {
      return [];
    }

    const q = query(
      collection(db, 'quizAttempts'),
      where('userId', '==', userId),
      where('language', '==', language),
      where('chapterId', '==', chapterId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const attempts: QuizAttempt[] = [];
    
    querySnapshot.forEach((doc) => {
      attempts.push({
        id: doc.id,
        ...doc.data(),
      } as QuizAttempt);
    });
    
    return attempts;
  } catch (error) {
    if (isFirestoreOfflineError(error as Error)) {
      return [];
    }

    console.error('Error fetching chapter attempts:', error);
    return [];
  }
}