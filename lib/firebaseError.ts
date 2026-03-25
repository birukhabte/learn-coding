type FirebaseLikeError = {
  code?: string;
  message?: string;
};

type FirestoreLikeError = FirebaseLikeError & {
  name?: string;
};

export function getFirebaseAuthErrorMessage(
  error: FirebaseLikeError,
  fallbackMessage: string
) {
  switch (error.code) {
    case 'auth/configuration-not-found':
      return 'Email/password sign-in is not enabled in Firebase Console. Open Authentication > Sign-in method and enable Email/Password for this project.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is disabled in Firebase Console. Open Authentication > Sign-in method and enable it for this project.';
    case 'auth/email-already-in-use':
      return 'Email already registered. Please login or use a different email';
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later';
    default:
      return error.message || fallbackMessage;
  }
}

export function isFirestoreOfflineError(error: FirestoreLikeError) {
  const message = (error.message || '').toLowerCase();

  return (
    error.code === 'unavailable' ||
    error.code === 'failed-precondition' ||
    message.includes('client is offline') ||
    message.includes('failed to get document') ||
    message.includes('offline')
  );
}