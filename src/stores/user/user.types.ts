import type { User, AuthError } from 'firebase/auth';
import type { AppUser, UserUpdateData } from '../../types/types';

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
