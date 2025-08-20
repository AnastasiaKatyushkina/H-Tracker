import { docToHabit } from '../../utils/habitConverter';
import type { Habit, HabitFormData } from './habits.types';
import { DEFAULT_MONTHLY_DAY } from '../../types/types';

export const processHabitData = (data: Record<string, unknown>, id: string): Habit | null => {
  return docToHabit(data, id);
};

export const prepareHabitData = (
  data: HabitFormData,
  userId: string,
  userName?: string | null
): Record<string, unknown> => {
  const daysOfWeek = data.targetFrequency === 'weekly' ? data.daysOfWeek || null : null;
  const monthlyDay =
    data.targetFrequency === 'monthly' ? data.monthlyDay || DEFAULT_MONTHLY_DAY : null;

  return {
    title: data.title,
    description: data.description || null,
    category: data.category,
    targetFrequency: data.targetFrequency,
    userId,
    creationDate: new Date().toISOString(),
    completionHistory: {},
    daysOfWeek,
    monthlyDay,
    ...(userName && { userName }),
  };
};

export const updateHabitsArray = (habits: Habit[], updatedHabit: Habit): Habit[] => {
  const index = habits.findIndex((h) => h.id === updatedHabit.id);
  if (index !== -1) {
    return [...habits.slice(0, index), updatedHabit, ...habits.slice(index + 1)];
  }
  return habits;
};

export const removeHabitFromArray = (habits: Habit[], id: string): Habit[] => {
  return habits.filter((habit) => habit.id !== id);
};

export const habitToRecord = (habit: {
  title: string;
  description: string | null;
  category: string;
  targetFrequency: string;
  daysOfWeek: number[] | null;
  monthlyDay: number | null;
  userId: string;
  creationDate: string;
  completionHistory: Record<string, unknown>;
  userName?: string;
  originalHabitId?: string;
}): Record<string, unknown> => {
  const record: Record<string, unknown> = {
    title: habit.title,
    description: habit.description,
    category: habit.category,
    targetFrequency: habit.targetFrequency,
    userId: habit.userId,
    creationDate: habit.creationDate,
    completionHistory: habit.completionHistory,
    daysOfWeek: habit.daysOfWeek,
    monthlyDay: habit.monthlyDay,
  };

  if (habit.userName !== undefined) {
    record.userName = habit.userName;
  }

  if (habit.originalHabitId !== undefined) {
    record.originalHabitId = habit.originalHabitId;
  }

  return record;
};
