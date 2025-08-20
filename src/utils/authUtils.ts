import type { UserCredential } from 'firebase/auth';
import type { AppUser } from '../types/types';

export const getFirebaseErrorMessage = (error: { code: string; message?: string }): string => {
  switch (error.code) {
    case 'auth/invalid-credential':
      return 'Неверный email или пароль';
    case 'auth/user-not-found':
      return 'Пользователь с таким email не найден';
    case 'auth/wrong-password':
      return 'Неверный пароль';
    case 'auth/email-already-in-use':
      return 'Email уже используется';
    case 'auth/too-many-requests':
      return 'Слишком много попыток. Попробуйте позже';
    case 'auth/weak-password':
      return 'Пароль должен содержать не менее 6 символов';
    case 'auth/invalid-email':
      return 'Некорректный email';
    case 'auth/network-request-failed':
      return 'Ошибка сети. Проверьте подключение к интернету';
    case 'auth/operation-not-allowed':
      return 'Этот метод аутентификации отключен';
    default:
      return error.message || 'Ошибка аутентификации';
  }
};

export const mapUserCredentialToAppUser = (userCredential: UserCredential): AppUser => ({
  uid: userCredential.user.uid,
  email: userCredential.user.email,
  displayName: userCredential.user.displayName || '',
  photoURL: userCredential.user.photoURL || null,
});

const isAuthError = (error: unknown): error is { code: string; message: string } => {
  if (error === null || typeof error !== 'object') return false;
  return 'code' in error && 'message' in error;
};

export const handleAuthOperation = async <T extends () => Promise<UserCredential>>(
  operation: T
): Promise<{
  success: boolean;
  user?: AppUser;
  error?: string;
}> => {
  try {
    const result = await operation();
    return {
      success: true,
      user: mapUserCredentialToAppUser(result),
    };
  } catch (error: unknown) {
    let errorMessage = 'Неизвестная ошибка';

    if (isAuthError(error)) {
      errorMessage = getFirebaseErrorMessage(error);
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};
