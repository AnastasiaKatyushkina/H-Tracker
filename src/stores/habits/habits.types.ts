import { CATEGORIES } from '../../types/types';
import type { Habit, HabitFormData } from '../../types/types';
import type { FirestoreHabitData } from '../../utils/habitConverter';

export type { Habit, HabitFormData, FirestoreHabitData };

export type FilterCategory = (typeof CATEGORIES)[number] | 'Все';

export type OperationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface HabitOperationStatus {
  status: OperationStatus;
  habit?: Habit;
  error?: string;
}

export interface HabitsStoreState {
  habits: Habit[];
  selectedHabit: Habit | null;
  operationStatus: HabitOperationStatus;
  allHabits: Habit[];
  userHabits: Habit[];
  filterCategory: FilterCategory;
  isAllHabitsLoading: boolean;
  isUserHabitsLoading: boolean;
  allHabitsError: string | null;
  userHabitsError: string | null;
}
