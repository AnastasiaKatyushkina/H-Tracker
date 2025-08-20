import { observer } from 'mobx-react-lite';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import { useStore } from '../app/RootStore';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { MotivationalQuote } from '../components/toDo/motivationalQuote';
import { TodayHabitsList } from '../components/toDo/todayHabitsList';
import { MOTIVATIONAL_QUOTES } from '../types/types';
import type { Habit } from '../types/types';

const ToDoPage = observer(() => {
  const { habitsStore, userStore } = useStore();

  const shouldHabitBeDoneToday = useCallback((habit: Habit): boolean => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const dayOfMonth = today.getDate();

    if (habit.targetFrequency === 'daily') return true;
    if (habit.targetFrequency === 'weekly' && habit.daysOfWeek?.includes(adjustedDayOfWeek))
      return true;
    if (habit.targetFrequency === 'monthly' && habit.monthlyDay === dayOfMonth) return true;
    return false;
  }, []);

  const isHabitCompletedToday = useCallback((habit: Habit): boolean => {
    const todayKey = format(new Date(), 'yyyy-MM-dd');
    return habit.completionHistory?.[todayKey]?.completed || false;
  }, []);

  const todayHabits = useMemo(() => {
    return habitsStore.userHabits.filter(shouldHabitBeDoneToday).map((habit) => ({
      ...habit,
      completed: isHabitCompletedToday(habit),
    }));
  }, [habitsStore.userHabits, shouldHabitBeDoneToday, isHabitCompletedToday]);

  const handleToggleHabit = useCallback(
    async (habitId: string, completed: boolean) => {
      const todayKey = format(new Date(), 'yyyy-MM-dd');
      await habitsStore.updateHabitCompletion(habitId, todayKey, completed);
    },
    [habitsStore]
  );

  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [currentDate] = useState(format(new Date(), 'EEEE, d MMMM', { locale: ru }));

  useEffect(() => {
    if (!motivationalQuote) {
      const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
      setMotivationalQuote(MOTIVATIONAL_QUOTES[randomIndex]);
    }
  }, [motivationalQuote]);

  useEffect(() => {
    if (userStore.currentUser && habitsStore.userHabits.length === 0) {
      habitsStore.loadUserHabits(userStore.currentUser.uid);
    }
  }, [userStore.currentUser, habitsStore]);

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 800,
        mx: 'auto',
      }}>
      {userStore.currentUser ? (
        <>
          <Typography variant='h4' component='h1' gutterBottom>
            {userStore.currentUser
              ? `Добрый день, ${userStore.currentUser.displayName || 'пользователь'}!`
              : 'Добро пожаловать в трекер привычек!'}
          </Typography>
          <Typography variant='h5' color='text.secondary' sx={{ mb: 3 }}>
            {currentDate}
          </Typography>
          <MotivationalQuote quote={motivationalQuote} />
          <Typography variant='h5' sx={{ mb: 3 }}>
            Ваши привычки на сегодня
          </Typography>
          <TodayHabitsList
            habits={todayHabits}
            isLoading={habitsStore.isUserHabitsLoading}
            onToggleHabit={handleToggleHabit}
          />
        </>
      ) : (
        <>
          <Typography variant='h5' sx={{ mb: 3, mt: 4 }}>
            Авторизуйтесь, чтобы начать отслеживать свои привычки
          </Typography>
          <Button variant='contained' startIcon={<LoginIcon />} component={Link} to='/login'>
            Войти
          </Button>
        </>
      )}
    </Box>
  );
});

export default ToDoPage;
