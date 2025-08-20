import { makeAutoObservable } from 'mobx';
import type { UserStoreState, AppUser, UserOperationStatus } from './user.types';
import { initAuthListenerAction } from './user.actions';
import { isAuthenticatedSelector } from './user.selectors';
import type { UserUpdateData } from './user.types';

export class UserStoreImplementation implements UserStoreState {
  currentUser: AppUser | null = null;
  operationStatus: UserOperationStatus = { status: 'idle' };
  isLoading = true;

  constructor() {
    makeAutoObservable(this);
    this.initAuthListener();
  }

  private initAuthListener() {
    initAuthListenerAction(this);
  }

  get isAuthenticated() {
    return isAuthenticatedSelector(this);
  }

  async signUp(email: string, password: string, displayName: string) {
    const { signUpAction } = await import('./user.actions');
    return signUpAction(this, { email, password, displayName });
  }

  async login(email: string, password: string) {
    const { loginAction } = await import('./user.actions');
    return loginAction(this, { email, password });
  }

  async signOut() {
    const { signOutAction } = await import('./user.actions');
    return signOutAction(this);
  }

  async updateUserProfile(data: UserUpdateData) {
    const { updateUserProfileAction } = await import('./user.actions');
    return updateUserProfileAction(this, data);
  }

  getCurrentUser(): AppUser | null {
    return this.currentUser;
  }
}

export type UserStore = UserStoreImplementation;

export const createUserStore = (): UserStoreImplementation => {
  return new UserStoreImplementation();
};
