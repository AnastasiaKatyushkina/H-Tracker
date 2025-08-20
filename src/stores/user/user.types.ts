import type { User, AuthError } from 'firebase/auth';
import type { AppUser, UserUpdateData } from '../../types/types';
import { FieldValue } from 'firebase/firestore';

export type { AppUser, UserUpdateData };

export interface UserStoreState {
  currentUser: AppUser | null;
  operationStatus: UserOperationStatus;
  isLoading: boolean;
}

export type FirebaseUser = User;
export type FirebaseAuthError = AuthError;

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export type OperationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UserOperationStatus {
  status: OperationStatus;
  user?: AppUser;
  error?: string;
}

export type UserUpdateFields = {
  displayName?: string;
  photoURL?: string | null;
  lastLogin?: string;
  updatedAt?: FieldValue;
};
