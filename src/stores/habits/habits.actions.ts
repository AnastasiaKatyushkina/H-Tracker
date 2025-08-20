import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../app/firebaseConfig';
import { runInAction } from 'mobx';
import type { Habit, HabitFormData, HabitOperationStatus } from './habits.types';
import { DEFAULT_MONTHLY_DAY } from '../../types/types';
import {
  processHabitData,
  prepareHabitData,
  updateHabitsArray,
  removeHabitFromArray,
} from './habits.helpers';
import { HabitsStoreImplementation } from './habits.store';
import { logAnalyticsEvent, logError } from '../../analytics/analytics';
import { AnalyticsEvents } from '../../analytics/analytics';

export const loadAllHabitsAction = async (store: HabitsStoreImplementation) => {
  try {
    runInAction(() => {
      store.isAllHabitsLoading = true;
      store.allHabitsError = null;
    });

    const habitsCollection = collection(db, 'habits');
    const querySnapshot = await getDocs(habitsCollection);

    const habits: Habit[] = [];
    querySnapshot.forEach((doc) => {
      const habit = processHabitData(doc.data(), doc.id);
      if (habit) habits.push(habit);
    });

    runInAction(() => {
      store.allHabits = habits;
    });
  } catch (error) {
    runInAction(() => {
      store.allHabitsError = error instanceof Error ? error.message : 'Ошибка загрузки привычек';
    });
  } finally {
    runInAction(() => {
      store.isAllHabitsLoading = false;
    });
  }
};

export const loadUserHabitsAction = async (store: HabitsStoreImplementation, userId: string) => {
  try {
    runInAction(() => {
      store.isUserHabitsLoading = true;
      store.userHabitsError = null;
    });

    const habitsCollection = collection(db, 'habits');
    const q = query(habitsCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const habits: Habit[] = [];
    querySnapshot.forEach((doc) => {
      const habit = processHabitData(doc.data(), doc.id);
      if (habit) habits.push(habit);
    });

    runInAction(() => {
      store.userHabits = habits;
    });
  } catch (error) {
    runInAction(() => {
      store.userHabitsError =
        error instanceof Error ? error.message : 'Ошибка загрузки ваших привычек';
    });
  } finally {
    runInAction(() => {
      store.isUserHabitsLoading = false;
    });
  }
};

export const createHabitAction = async (
  store: HabitsStoreImplementation,
  data: HabitFormData,
  userId: string,
  userName?: string | null
): Promise<HabitOperationStatus> => {
  try {
    runInAction(() => {
      store.operationStatus = { status: 'loading' };
    });

    const habitData = prepareHabitData(data, userId, userName);
    const docRef = await addDoc(collection(db, 'habits'), habitData);
    const newHabit = processHabitData(habitData, docRef.id);

    if (!newHabit) {
      throw new Error('Failed to create habit object');
    }

    logAnalyticsEvent(AnalyticsEvents.HABIT_CREATED, {
      habit_id: docRef.id,
      category: data.category,
      frequency: data.targetFrequency,
      user_id: userId,
    });

    runInAction(() => {
      store.allHabits.push(newHabit);
      store.userHabits.push(newHabit);
      store.operationStatus = { status: 'success', habit: newHabit };
    });

    return store.operationStatus;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка создания привычки';

    logError(error as Error, { context: 'habit_creation' });

    runInAction(() => {
      store.operationStatus = { status: 'error', error: message };
    });
    return store.operationStatus;
  }
};

export const updateHabitAction = async (
  store: HabitsStoreImplementation,
  id: string,
  data: HabitFormData
): Promise<HabitOperationStatus> => {
  try {
    runInAction(() => {
      store.operationStatus = { status: 'loading' };
    });

    const habitRef = doc(db, 'habits', id);

    const daysOfWeek = data.targetFrequency === 'weekly' ? data.daysOfWeek || null : null;
    const monthlyDay =
      data.targetFrequency === 'monthly' ? data.monthlyDay || DEFAULT_MONTHLY_DAY : null;

    await updateDoc(habitRef, {
      title: data.title,
      description: data.description || null,
      category: data.category,
      targetFrequency: data.targetFrequency,
      daysOfWeek,
      monthlyDay,
    });

    logAnalyticsEvent(AnalyticsEvents.HABIT_UPDATED, {
      habit_id: id,
      category: data.category,
      target_frequency: data.targetFrequency,
    });

    runInAction(() => {
      const index = store.userHabits.findIndex((h: Habit) => h.id === id);
      if (index !== -1) {
        const updatedHabit = {
          ...store.userHabits[index],
          title: data.title,
          description: data.description || null,
          category: data.category,
          targetFrequency: data.targetFrequency,
          daysOfWeek,
          monthlyDay,
        };
        store.userHabits = updateHabitsArray(store.userHabits, updatedHabit);
      }

      store.operationStatus = { status: 'success' };
    });

    return store.operationStatus;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Update failed';

    logError(error as Error, { context: 'habit_update' });

    runInAction(() => {
      store.operationStatus = { status: 'error', error: message };
    });

    return store.operationStatus;
  }
};

export const addHabitToUserAction = async (
  store: HabitsStoreImplementation,
  habitId: string,
  userId: string
): Promise<HabitOperationStatus> => {
  try {
    runInAction(() => {
      store.operationStatus = { status: 'loading' };
    });

    const habitDoc = await getDoc(doc(db, 'habits', habitId));
    if (!habitDoc.exists()) {
      throw new Error('Привычка не найдена');
    }

    const originalHabit = processHabitData(habitDoc.data(), habitDoc.id);
    if (!originalHabit) {
      throw new Error('Invalid habit data');
    }

    const habitData = {
      title: originalHabit.title,
      description: originalHabit.description || null,
      category: originalHabit.category,
      targetFrequency: originalHabit.targetFrequency,
      daysOfWeek: originalHabit.daysOfWeek || null,
      monthlyDay: originalHabit.monthlyDay || DEFAULT_MONTHLY_DAY,
      userId,
      creationDate: new Date().toISOString(),
      completionHistory: {},
      originalHabitId: habitId,
    };

    const newHabitRef = await addDoc(collection(db, 'habits'), habitData);
    await updateDoc(doc(db, 'habits', habitId), {
      addedByUsers: arrayUnion(userId),
    });

    const newHabit = processHabitData(habitData, newHabitRef.id);
    if (!newHabit) {
      throw new Error('Failed to create habit object');
    }

    runInAction(() => {
      store.userHabits.push(newHabit);

      const originalIndex = store.allHabits.findIndex((h: Habit) => h.id === habitId);
      if (originalIndex !== -1) {
        const updatedOriginal = {
          ...store.allHabits[originalIndex],
          addedByUsers: [...(store.allHabits[originalIndex].addedByUsers || []), userId],
        };
        store.allHabits = updateHabitsArray(store.allHabits, updatedOriginal);
      }

      store.operationStatus = { status: 'success', habit: newHabit };
    });

    return store.operationStatus;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка добавления привычки';

    runInAction(() => {
      store.operationStatus = { status: 'error', error: message };
    });

    return store.operationStatus;
  }
};

export const deleteHabitAction = async (
  store: HabitsStoreImplementation,
  id: string
): Promise<HabitOperationStatus> => {
  try {
    runInAction(() => {
      store.operationStatus = { status: 'loading' };
    });

    await deleteDoc(doc(db, 'habits', id));

    logAnalyticsEvent(AnalyticsEvents.HABIT_DELETED, {
      habit_id: id,
    });

    runInAction(() => {
      store.userHabits = removeHabitFromArray(store.userHabits, id);
      store.allHabits = removeHabitFromArray(store.allHabits, id);
      store.operationStatus = { status: 'success' };
    });

    return store.operationStatus;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка удаления';

    logError(error as Error, { context: 'habit_deletion' });

    runInAction(() => {
      store.operationStatus = { status: 'error', error: message };
    });

    return store.operationStatus;
  }
};

export const fetchHabitByIdAction = async (id: string): Promise<Habit | null> => {
  try {
    const habitDoc = await getDoc(doc(db, 'habits', id));
    if (habitDoc.exists()) {
      return processHabitData(habitDoc.data(), id);
    }
    return null;
  } catch (error) {
    console.error('Ошибка загрузки привычки:', error);
    return null;
  }
};

export const updateHabitCompletionAction = async (
  store: HabitsStoreImplementation,
  habitId: string,
  dateKey: string,
  completed: boolean
): Promise<HabitOperationStatus> => {
  try {
    runInAction(() => {
      store.operationStatus = { status: 'loading' };
    });

    const habitRef = doc(db, 'habits', habitId);

    const completionData = {
      completed,
      date: new Date().toISOString(),
    };

    await updateDoc(habitRef, {
      [`completionHistory.${dateKey}`]: completionData,
    });

    runInAction(() => {
      const updateHabit = (habit: Habit): Habit => {
        return {
          ...habit,
          completionHistory: {
            ...habit.completionHistory,
            [dateKey]: completionData,
          },
        };
      };

      store.userHabits = store.userHabits.map((habit: Habit) =>
        habit.id === habitId ? updateHabit(habit) : habit
      );

      store.allHabits = store.allHabits.map((habit: Habit) =>
        habit.id === habitId ? updateHabit(habit) : habit
      );

      store.operationStatus = { status: 'success' };
    });

    return store.operationStatus;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка при обновлении привычки';

    runInAction(() => {
      store.operationStatus = { status: 'error', error: message };
    });

    return store.operationStatus;
  }
};
