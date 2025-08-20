import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useStore } from '../app/RootStore';
import { BackButton } from '../components/backButton//backButton';
import { NewHabitForm } from '../components/newHabit/newHabitForm';
import { CATEGORIES, DAYS_OF_WEEK, DEFAULT_FREQUENCY, DEFAULT_MONTHLY_DAY } from '../types/types';
import type { HabitFormData, Frequency } from '../types/types';

const initialFormData: HabitFormData = {
  title: '',
  description: '',
  category: CATEGORIES[0],
  targetFrequency: DEFAULT_FREQUENCY,
  daysOfWeek: [],
  monthlyDay: DEFAULT_MONTHLY_DAY,
};

const NewHabitPage = observer(() => {
  const { habitsStore, userStore, uiStore } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<HabitFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (userStore.currentUser) {
      setIsCheckingAuth(false);
    } else {
      navigate('/login');
    }
  }, [userStore.currentUser, navigate]);

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, title: value }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleFrequencyChange = (value: Frequency) => {
    setFormData((prev) => ({ ...prev, targetFrequency: value }));
  };

  const handleDayToggle = (dayIndex: number) => {
    setFormData((prev) => {
      const currentDays = prev.daysOfWeek ?? [];
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
  };

  const handleMonthlyDayChange = (value: number) => {
    setFormData((prev) => ({ ...prev, monthlyDay: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (userStore.currentUser) {
      try {
        const userName = userStore.currentUser.displayName || null;
        const result = await habitsStore.createHabit(formData, userStore.currentUser.uid, userName);

        if (result.status === 'success') {
          uiStore.showSnackbar('Привычка успешно создана!', 'success');
          navigate('/profile');
        } else if (result.status === 'error') {
          uiStore.showSnackbar(`Ошибка: ${result.error}`, 'error');
        }
      } catch (error) {
        uiStore.showSnackbar('Неизвестная ошибка при создании привычки', 'error');
        console.error('Ошибка при создании привычки:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth) {
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
        Новая привычка
      </Typography>
      <NewHabitForm
        formData={formData}
        isSubmitting={isSubmitting}
        categories={CATEGORIES}
        daysOfWeek={DAYS_OF_WEEK}
        onTitleChange={handleTitleChange}
        onDescriptionChange={handleDescriptionChange}
        onCategoryChange={handleCategoryChange}
        onFrequencyChange={handleFrequencyChange}
        onDayToggle={handleDayToggle}
        onMonthlyDayChange={handleMonthlyDayChange}
        onSubmit={handleSubmit}
      />
    </Box>
  );
});

export default NewHabitPage;
