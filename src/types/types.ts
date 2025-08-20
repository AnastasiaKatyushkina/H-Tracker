export type Frequency = 'daily' | 'weekly' | 'monthly';

export type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

export type DrawerState = 'open' | 'closed';

export type AuthMode = 'login' | 'register';

export type CompletionHistory = Record<
  string,
  {
    completed: boolean;
    date: string;
  }
>;

export interface Habit {
  id: string;
  userId: string;
  userName: string | null;
  title: string;
  description: string | null;
  category: (typeof CATEGORIES)[number];
  targetFrequency: Frequency;
  daysOfWeek: number[] | null;
  monthlyDay: number | null;
  creationDate: string;
  completionHistory: CompletionHistory;
  addedByUsers?: string[];
  originalHabitId: string | null;
}

export interface HabitFormData {
  title: string;
  description?: string;
  category: (typeof CATEGORIES)[number];
  targetFrequency: Frequency;
  daysOfWeek?: number[];
  monthlyDay?: number;
}

export const CATEGORIES = [
  'Здоровье',
  'Спорт',
  'Образование',
  'Продуктивность',
  'Финансы',
  'Отношения',
  'Досуг',
  'Другое',
];

export const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export interface SnackbarState {
  isOpen: boolean;
  message: string;
  severity: SnackbarSeverity;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface UserUpdateData {
  displayName?: string;
  photoURL?: string;
}

export const DEFAULT_FREQUENCY = 'daily';

export const DEFAULT_MONTHLY_DAY = 1;

export type NavigationEntry = {
  id: string;
  title: string;
  path: string;
};

export const navigationEntries: NavigationEntry[] = [
  { id: 'todo', title: 'Домашняя', path: '/' },
  { id: 'habits', title: 'Привычки', path: '/habits' },
  { id: 'profile', title: 'Профиль', path: '/profile' },
];

export type AuthResponse = {
  success: boolean;
  user?: AppUser;
  error?: string;
};

export type DeleteDialogProps = {
  open: boolean;
  habitToDelete: Habit | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export type HabitCardProps = {
  habit: Habit;
  onEdit: (habitId: string) => void;
  onDelete: (habit: Habit) => void;
};

export type ProfileSectionProps = {
  displayName: string;
  photoURL: string;
  email: string;
  editMode: boolean;
  onDisplayNameChange: (value: string) => void;
  onPhotoURLChange: (value: string) => void;
  onEditModeToggle: () => void;
  onSaveProfile: () => Promise<boolean>;
};

export type TodayHabit = Habit & {
  completed: boolean;
};

export const MOTIVATIONAL_QUOTES = [
  'Маленькие ежедневные улучшения приводят к большим результатам',
  'Успех — это сумма небольших усилий, повторяемых изо дня в день',
  'Привычка — это не что иное, как мысль, закрепленная действием',
  'Лучший способ предсказать будущее — создать его',
  'Не откладывай на завтра то, что можно сделать сегодня',
  'Терпение, настойчивость и пот создают непобедимую комбинацию успеха',
  'Каждый день — это новая возможность изменить свою жизнь',
  'Сила воли — это мышца, которую нужно тренировать ежедневно',
  'Путь к успеху состоит из ежедневных маленьких побед',
  'Ты сильнее, чем думаешь. Продолжай двигаться вперед!',
];

export type LoginFormProps = {
  mode: AuthMode;
  email: string;
  password: string;
  error: string;
  isLoading: boolean;
  isFormSubmitted: boolean;
  isEmailTouched: boolean;
  isPasswordTouched: boolean;
  isEmailValid: boolean;
  isPasswordValid: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onEmailBlur: () => void;
  onPasswordBlur: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onModeChange: () => void;
  onGoogleLogin: () => void;
};

export type NewHabitFormProps = {
  formData: HabitFormData;
  isSubmitting: boolean;
  categories: typeof CATEGORIES;
  daysOfWeek: typeof DAYS_OF_WEEK;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onFrequencyChange: (value: Frequency) => void;
  onDayToggle: (dayIndex: number) => void;
  onMonthlyDayChange: (value: number) => void;
  onSubmit: (e: React.FormEvent) => void;
};
