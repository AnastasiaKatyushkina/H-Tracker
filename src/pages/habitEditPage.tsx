import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useStore } from '../app/RootStore';
import { BackButton } from '../components/backButton/backButton';
import { NewHabitForm } from '../components/newHabit/newHabitForm';
import { CATEGORIES, DAYS_OF_WEEK, DEFAULT_MONTHLY_DAY, DEFAULT_FREQUENCY } from '../types/types';
import type { Habit, HabitFormData, CompletionHistory, Frequency } from '../types/types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../app/firebaseConfig';

interface FirestoreHabit {
  userId?: string;
  userName?: string | null;
  title?: string;
  description?: string | null;
  category?: string;
  targetFrequency?: Frequency | number;
  daysOfWeek?: number[] | null;
  monthlyDay?: number | null;
  creationDate?: string;
  completionHistory?:
    | Record<string, { completed: boolean; date: string }>
    | Record<string, boolean>;
  notificationEnabled?: boolean;
  addedByUsers?: string[];
  originalHabitId?: string | null;
}

function docToHabit(docData: FirestoreHabit, id: string): Habit {
  const now = new Date();
  const formattedDate =
    now.getFullYear() +
    '-' +
    String(now.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(now.getDate()).padStart(2, '0');

  const completionHistory: CompletionHistory = {};
  if (docData.completionHistory) {
    Object.entries(docData.completionHistory).forEach(([date, value]) => {
      completionHistory[date] = typeof value === 'boolean' ? { completed: value, date } : value;
    });
  }

  const targetFrequency =
    typeof docData.targetFrequency === 'number'
      ? docData.targetFrequency === 1
        ? 'daily'
        : docData.targetFrequency === 7
          ? 'weekly'
          : 'monthly'
      : docData.targetFrequency || DEFAULT_FREQUENCY;

  return {
    id,
    userId: docData.userId || '',
    userName: docData.userName || null,
    title: docData.title || '',
    description: docData.description || null,
    category: docData.category || CATEGORIES[0],
    targetFrequency,
    daysOfWeek: docData.daysOfWeek || null,
    monthlyDay: docData.monthlyDay || null,
    creationDate: docData.creationDate || formattedDate,
    completionHistory,
    addedByUsers: docData.addedByUsers || [],
    originalHabitId: docData.originalHabitId || null,
  };
}

const initialFormData: HabitFormData = {
  title: '',
  description: '',
  category: CATEGORIES[0],
  targetFrequency: DEFAULT_FREQUENCY,
  daysOfWeek: [],
  monthlyDay: DEFAULT_MONTHLY_DAY,
};

const HabitEditPage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { habitsStore, userStore, uiStore } = useStore();
  const currentUserId = userStore.currentUser?.uid || '';

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<HabitFormData>(initialFormData);

  useEffect(() => {
    const loadHabit = async () => {
      if (!id) {
        navigate('/habits');
        return;
      }

      setIsLoading(true);
      try {
        let habit = habitsStore.userHabits.find((h: Habit) => h.id === id);

        if (!habit) {
          const habitDoc = await getDoc(doc(db, 'habits', id));
          if (habitDoc.exists()) {
            const data = habitDoc.data();
            habit = docToHabit(data, habitDoc.id);
          }
        }

        if (!habit || habit.userId !== currentUserId) {
          uiStore.showSnackbar('У вас нет прав для редактирования этой привычки', 'error');
          navigate('/habits');
          return;
        }

        setFormData({
          title: habit.title,
          description: habit.description || '',
          category: habit.category,
          targetFrequency: habit.targetFrequency,
          daysOfWeek: habit.daysOfWeek || [],
          monthlyDay: habit.monthlyDay || DEFAULT_MONTHLY_DAY,
        });
      } catch (error) {
        console.error('Ошибка загрузки привычки:', error);
        uiStore.showSnackbar('Ошибка загрузки привычки', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadHabit();
  }, [id, currentUserId, navigate, habitsStore.userHabits, uiStore]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsSubmitting(true);
    try {
      await habitsStore.updateHabit(id, formData);
      navigate('/profile');
    } catch (error) {
      console.error('Ошибка обновления привычки:', error);
      uiStore.showSnackbar('Ошибка обновления привычки', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <BackButton />
      <Typography variant='h4' component='h1' gutterBottom sx={{ mb: 3 }}>
        Редактировать привычку
      </Typography>
      <NewHabitForm
        formData={formData}
        isSubmitting={isSubmitting}
        categories={CATEGORIES}
        daysOfWeek={DAYS_OF_WEEK}
        onTitleChange={(value) => setFormData((prev) => ({ ...prev, title: value }))}
        onDescriptionChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
        onCategoryChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
        onFrequencyChange={(value) => setFormData((prev) => ({ ...prev, targetFrequency: value }))}
        onDayToggle={(dayIndex) => {
          setFormData((prev) => {
            const currentDays = prev.daysOfWeek || [];

            if (currentDays.includes(dayIndex)) {
              return {
                ...prev,
                daysOfWeek: currentDays.filter((day) => day !== dayIndex),
              };
            }

            return {
              ...prev,
              daysOfWeek: [...currentDays, dayIndex],
            };
          });
        }}
        onMonthlyDayChange={(value) => setFormData((prev) => ({ ...prev, monthlyDay: value }))}
        onSubmit={handleSubmit}
      />
    </Box>
  );
});

export default HabitEditPage;
