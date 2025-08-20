import type { HabitsStoreState, FilterCategory } from './habits.types';
import { CATEGORIES } from '../../types/types';

export const filteredHabitsSelector = (state: HabitsStoreState) => {
  if (state.filterCategory === 'Все') {
    return state.allHabits;
  }
  return state.allHabits.filter((habit) => habit.category === state.filterCategory);
};

export const getUserHabitsSelector = (state: HabitsStoreState) => {
  return state.userHabits;
};

export const getAllHabitsSelector = (state: HabitsStoreState) => {
  return state.allHabits;
};

export const getSelectedHabitSelector = (state: HabitsStoreState) => {
  return state.selectedHabit;
};

export const getOperationStatusSelector = (state: HabitsStoreState) => {
  return state.operationStatus;
};

export const getLoadingStateSelector = (state: HabitsStoreState) => {
  return {
    isAllHabitsLoading: state.isAllHabitsLoading,
    isUserHabitsLoading: state.isUserHabitsLoading,
  };
};

export const getErrorStateSelector = (state: HabitsStoreState) => {
  return {
    allHabitsError: state.allHabitsError,
    userHabitsError: state.userHabitsError,
  };
};

export const getFilterCategorySelector = (state: HabitsStoreState) => {
  return state.filterCategory;
};

export const getAvailableCategoriesSelector = (): FilterCategory[] => {
  const allCategories: FilterCategory[] = ['Все', ...CATEGORIES];
  return allCategories;
};
