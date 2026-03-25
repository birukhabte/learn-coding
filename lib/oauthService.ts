
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  AuthError,
} from 'firebase/auth';
import { auth, firebaseReady } from './firebase';
import { getUserProfile, createUserProfile } from './userService';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Set scopes for better user data
googleProvider.addScope('profile');
googleProvider.addScope('email');

export async function signInWithGoogle() {
  try {
    if (!firebaseReady || !auth) {
      throw new Error('Firebase is not configured. Add the required NEXT_PUBLIC_FIREBASE_* variables to .env and restart the dev server.');
    }

    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user profile exists
    const existingProfile = await getUserProfile(user.uid);

    // If no profile, create one with OAuth data
    if (!existingProfile) {
      const [firstName, ...lastNameParts] = (user.displayName || 'User').split(' ');
      const lastName = lastNameParts.join(' ') || '';

      await createUserProfile(user.uid, {
        firstName: firstName || 'User',
        lastName: lastName || '',
        email: user.email || '',
        avatarUrl: user.photoURL || '',
      });
    }

    return result;
  } catch (error) {
    throw handleAuthError(error as AuthError);
  }
}

export async function signInWithGithub() {
  try {
    if (!firebaseReady || !auth) {
      throw new Error('Firebase is not configured. Add the required NEXT_PUBLIC_FIREBASE_* variables to .env and restart the dev server.');
    }

    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;

    // Check if user profile exists
    const existingProfile = await getUserProfile(user.uid);

    // If no profile, create one with OAuth data
    if (!existingProfile) {
      const [firstName, ...lastNameParts] = (user.displayName || user.email?.split('@')[0] || 'User').split(' ');
      const lastName = lastNameParts.join(' ') || '';

      await createUserProfile(user.uid, {
        firstName: firstName || 'User',
        lastName: lastName || '',
        email: user.email || '',
        avatarUrl: user.photoURL || '',
      });
    }

    return result;
  } catch (error) {
    throw handleAuthError(error as AuthError);
  }
}

function handleAuthError(error: AuthError): string {
  switch (error.code) {
    case 'auth/popup-closed-by-user':
      return 'Sign in popup was closed. Please try again.';
    case 'auth/popup-blocked':
      return 'Sign in popup was blocked. Please check your browser settings.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email. Please sign in with the original method.';
    case 'auth/operation-not-allowed':
      return 'This sign in method is not enabled. Please contact support.';
    case 'auth/user-disabled':
      return 'Your account has been disabled. Please contact support.';
    default:
      return error.message || 'An error occurred during sign in. Please try again.';
  }
}