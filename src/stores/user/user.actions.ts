import { runInAction } from 'mobx';
import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, getFirestore, serverTimestamp } from 'firebase/firestore';
import { app } from '../../app/firebaseConfig';
import type {
  AppUser,
  SignUpData,
  LoginData,
  UserUpdateData,
  UserOperationStatus,
} from './user.types';
import { isAppUser, createAppUser, getErrorMessage, prepareUserUpdateData } from './user.helpers';
import type { UserStoreImplementation } from './user.store';
import { logAnalyticsEvent, setUserAnalyticsProperties, logError } from '../../analytics/analytics';
import { AnalyticsEvents } from '../../analytics/analytics';

const auth = getAuth(app);
const db = getFirestore(app);

export const initAuthListenerAction = (store: UserStoreImplementation) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const user = await fetchUserProfileAction(firebaseUser.uid);
      runInAction(() => {
        store.currentUser = user;
        store.isLoading = false;
      });
    } else {
      runInAction(() => {
        store.currentUser = null;
        store.isLoading = false;
      });
    }
  });
};

export const fetchUserProfileAction = async (uid: string): Promise<AppUser | null> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (isAppUser(userData)) {
        return userData;
      }
    }

    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;

    const newUser = createAppUser(firebaseUser);
    await setDoc(doc(db, 'users', uid), newUser);
    return newUser;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const signUpAction = async (
  store: UserStoreImplementation,
  data: SignUpData
): Promise<UserOperationStatus> => {
  try {
    setOperationStatusAction(store, 'loading');

    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);

    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: data.displayName });
    }

    const newUser = createAppUser(userCredential.user, data.displayName);
    await setDoc(doc(db, 'users', newUser.uid), {
      ...newUser,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    logAnalyticsEvent(AnalyticsEvents.USER_SIGNUP, {
      method: 'email',
      user_id: newUser.uid,
    });
    setUserAnalyticsProperties(newUser.uid, {
      email: newUser.email,
      displayName: newUser.displayName,
    });

    runInAction(() => {
      store.currentUser = newUser;
      setOperationStatusAction(store, 'success', null, newUser);
    });

    return store.operationStatus;
  } catch (error) {
    const message = getErrorMessage(error);

    logError(error as Error, { context: 'user_signup' });

    return setOperationStatusAction(store, 'error', message);
  }
};

export const loginAction = async (
  store: UserStoreImplementation,
  data: LoginData
): Promise<UserOperationStatus> => {
  try {
    setOperationStatusAction(store, 'loading');

    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    const uid = userCredential.user.uid;

    const user = await fetchUserProfileAction(uid);
    if (!user) {
      throw new Error('User profile not found');
    }

    const lastLogin = new Date().toISOString();
    await updateDoc(doc(db, 'users', uid), {
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const updatedUser = {
      ...user,
      lastLogin,
    };

    logAnalyticsEvent(AnalyticsEvents.USER_LOGIN, {
      method: 'email',
      user_id: uid,
    });

    runInAction(() => {
      store.currentUser = updatedUser;
      setOperationStatusAction(store, 'success', null, updatedUser);
    });

    return store.operationStatus;
  } catch (error) {
    const message = getErrorMessage(error);

    logError(error as Error, { context: 'user_login' });

    return setOperationStatusAction(store, 'error', message);
  }
};

export const signOutAction = async (store: UserStoreImplementation): Promise<void> => {
  try {
    await signOut(auth);
    runInAction(() => {
      store.currentUser = null;
    });
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const updateUserProfileAction = async (
  store: UserStoreImplementation,
  data: UserUpdateData
): Promise<UserOperationStatus> => {
  try {
    if (!store.currentUser) {
      return setOperationStatusAction(store, 'error', 'User not authenticated');
    }

    setOperationStatusAction(store, 'loading');

    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: data.displayName,
        photoURL: data.photoURL,
      });
    }

    const updateData = prepareUserUpdateData(data);
    await updateDoc(doc(db, 'users', store.currentUser.uid), updateData);

    setUserAnalyticsProperties(store.currentUser.uid, {
      displayName: data.displayName,
      photoURL: data.photoURL,
    });

    runInAction(() => {
      if (store.currentUser) {
        store.currentUser = {
          ...store.currentUser,
          displayName: data.displayName || store.currentUser.displayName,
          photoURL: data.photoURL || store.currentUser.photoURL,
        };
        setOperationStatusAction(store, 'success', null, store.currentUser);
      }
    });

    return store.operationStatus;
  } catch (error) {
    const message = getErrorMessage(error);

    logError(error as Error, { context: 'user_profile_update' });

    return setOperationStatusAction(store, 'error', message);
  }
};

export const setOperationStatusAction = (
  store: UserStoreImplementation,
  status: 'idle' | 'loading' | 'success' | 'error',
  error?: string | null,
  user?: AppUser
): UserOperationStatus => {
  runInAction(() => {
    switch (status) {
      case 'success':
        if (!user) {
          throw new Error('User must be provided for success status');
        }
        store.operationStatus = { status, user };
        break;
      case 'error':
        store.operationStatus = { status, error: error || 'Unknown error' };
        break;
      default:
        store.operationStatus = { status };
    }
  });
  return store.operationStatus;
};
