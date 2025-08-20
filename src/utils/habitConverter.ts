import { CATEGORIES } from '../types/types';
import type { Habit, Frequency, CompletionHistory } from '../types/types';
import type { DocumentData } from 'firebase/firestore';

export interface FirestoreHabitData {
  title: string;
  description: string | null;
  category: string;
  targetFrequency: Frequency;
  userId: string;
  creationDate: string;
  completionHistory: CompletionHistory;
  daysOfWeek: number[] | null;
  monthlyDay: number | null;
  userName?: string;
  addedByUsers?: string[];
  originalHabitId?: string | null;
}

const isString = (value: unknown): value is string => typeof value === 'string';
const isNumber = (value: unknown): value is number => typeof value === 'number';
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;
const isFrequency = (value: unknown): value is Frequency =>
  isString(value) && ['daily', 'weekly', 'monthly'].includes(value);
const isValidCategory = (value: unknown): value is string =>
  isString(value) && CATEGORIES.includes(value);

const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((item) => isNumber(item));

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => isString(item));

const isCompletionHistory = (value: unknown): value is CompletionHistory => {
  if (!isObject(value)) return false;

  for (const key in value) {
    const entry = value[key];
    if (!isObject(entry)) return false;
    if (typeof entry.completed !== 'boolean') return false;
    if (!isString(entry.date)) return false;
  }

  return true;
};

export const docToHabit = (docData: DocumentData, id: string): Habit | null => {
  try {
    if (!isString(docData.title)) throw new Error('Invalid title');
    if (!isString(docData.category)) throw new Error('Invalid category');
    if (!isFrequency(docData.targetFrequency)) throw new Error('Invalid targetFrequency');
    if (!isString(docData.userId)) throw new Error('Invalid userId');
    if (!isString(docData.creationDate)) throw new Error('Invalid creationDate');

    const daysOfWeek = isNumberArray(docData.daysOfWeek) ? docData.daysOfWeek : null;
    const addedByUsers = isStringArray(docData.addedByUsers) ? docData.addByUsers : [];
    const userName = isString(docData.userName) ? docData.userName : null;
    const description = isString(docData.description) ? docData.description : null;
    const originalHabitId = isString(docData.originalHabitId) ? docData.originalHabitId : null;

    const monthlyDay = isNumber(docData.monthlyDay)
      ? Math.min(31, Math.max(1, docData.monthlyDay))
      : null;

    const completionHistory = isCompletionHistory(docData.completionHistory)
      ? docData.completionHistory
      : {};

    return {
      id,
      userId: docData.userId,
      userName,
      title: docData.title,
      description,
      category: isValidCategory(docData.category) ? docData.category : CATEGORIES[0],
      targetFrequency: docData.targetFrequency,
      daysOfWeek,
      monthlyDay,
      creationDate: docData.creationDate,
      completionHistory,
      addedByUsers,
      originalHabitId,
    };
  } catch (error) {
    console.error('Error converting document to Habit:', error);
    return null;
  }
};
