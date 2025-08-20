import type { UserStoreState, AppUser } from './user.types';

export const getCurrentUserSelector = (state: UserStoreState): AppUser | null => {
  return state.currentUser;
};

export const getOperationStatusSelector = (state: UserStoreState) => {
  return state.operationStatus;
};

export const getLoadingStateSelector = (state: UserStoreState) => {
  return state.isLoading;
};

export const isAuthenticatedSelector = (state: UserStoreState): boolean => {
  return state.currentUser !== null;
};

export const getUserDisplayNameSelector = (state: UserStoreState): string => {
  return state.currentUser?.displayName || '';
};

export const getUserEmailSelector = (state: UserStoreState): string | null => {
  return state.currentUser?.email || null;
};
