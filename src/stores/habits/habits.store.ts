import { makeAutoObservable } from 'mobx';
import type {
  HabitsStoreState,
  Habit,
  FilterCategory,
  HabitOperationStatus,
  HabitFormData,
} from './habits.types';
import {
  loadAllHabitsAction,
  loadUserHabitsAction,
  createHabitAction,
  updateHabitAction,
  addHabitToUserAction,
  deleteHabitAction,
  fetchHabitByIdAction,
  updateHabitCompletionAction,
} from './habits.actions';
import { filteredHabitsSelector } from './habits.selectors';

export class HabitsStoreImplementation implements HabitsStoreState {
  habits: Habit[] = [];
  selectedHabit: Habit | null = null;
  operationStatus: HabitOperationStatus = { status: 'idle' };
  allHabits: Habit[] = [];
  userHabits: Habit[] = [];
  filterCategory: FilterCategory = 'Все';
  isAllHabitsLoading = false;
  isUserHabitsLoading = false;
  allHabitsError: string | null = null;
  userHabitsError: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get filteredHabits() {
    return filteredHabitsSelector(this);
  }

  setHabits(habits: Habit[]) {
    this.habits = habits;
  }

  setSelectedHabit(habit: Habit | null) {
    this.selectedHabit = habit;
  }

  async loadAllHabits() {
    await loadAllHabitsAction(this);
  }

  async loadUserHabits(userId: string) {
    await loadUserHabitsAction(this, userId);
  }

  setFilterCategory(category: FilterCategory) {
    this.filterCategory = category;
  }

  async createHabit(data: HabitFormData, userId: string, userName?: string | null) {
    return await createHabitAction(this, data, userId, userName);
  }

  async updateHabit(id: string, data: HabitFormData) {
    return await updateHabitAction(this, id, data);
  }

  async addHabitToUser(habitId: string, userId: string) {
    return await addHabitToUserAction(this, habitId, userId);
  }

  async deleteHabit(id: string) {
    return await deleteHabitAction(this, id);
  }

  async fetchHabitById(id: string) {
    return await fetchHabitByIdAction(id);
  }

  async updateHabitCompletion(habitId: string, dateKey: string, completed: boolean) {
    return await updateHabitCompletionAction(this, habitId, dateKey, completed);
  }
}

export type HabitsStore = HabitsStoreImplementation;

export const createHabitsStore = (): HabitsStoreImplementation => {
  return new HabitsStoreImplementation();
};
