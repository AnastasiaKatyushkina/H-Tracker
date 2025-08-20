import type { FirebaseUser, FirebaseAuthError, AppUser } from './user.types';
import { getFirebaseErrorMessage } from '../../utils/authUtils';
import type { UserUpdateData, UserUpdateFields } from './user.types';
import { serverTimestamp } from 'firebase/firestore';

export const isAppUser = (obj: unknown): obj is AppUser => {
  return (
    !!obj &&
    typeof obj === 'object' &&
    'uid' in obj &&
    typeof obj.uid === 'string' &&
    'email' in obj &&
    (typeof obj.email === 'string' || obj.email === null) &&
    'displayName' in obj &&
    typeof obj.displayName === 'string'
  );
};

export const isAuthError = (error: unknown): error is FirebaseAuthError => {
  return typeof error === 'object' && error !== null && 'code' in error;
};

export const createAppUser = (firebaseUser: FirebaseUser, displayName?: string): AppUser => {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || null,
    displayName: displayName || firebaseUser.displayName || '',
    photoURL: firebaseUser.photoURL || null,
  };
};

export const getErrorMessage = (error: unknown): string => {
  return isAuthError(error) ? getFirebaseErrorMessage(error) : 'Operation failed';
};

export const prepareUserUpdateData = (data: UserUpdateData): UserUpdateFields => {
  const updateData: UserUpdateFields = {};

  if (data.displayName !== undefined) {
    updateData.displayName = data.displayName;
  }

  if (data.photoURL !== undefined) {
    updateData.photoURL = data.photoURL;
  }

  updateData.updatedAt = serverTimestamp();

  return updateData;
};
