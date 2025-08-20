import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { useStore } from '../app/RootStore';
import HabitCard from '../components/habits/habitCard';
import HabitsFilter from '../components/habits/habitsFilter';
import { reaction } from 'mobx';
import type { Habit } from '../types/types';

const HabitsPage = observer(() => {
  const { habitsStore, userStore } = useStore();
  const currentUserId = userStore.currentUser?.uid || '';

  useEffect(() => {
    habitsStore.loadAllHabits();
    if (currentUserId) {
      habitsStore.loadUserHabits(currentUserId);
    }
  }, [habitsStore, currentUserId]);

  useEffect(() => {
    const disposer = reaction(
      () => habitsStore.operationStatus.status,
      (status) => {
        if (status === 'success') {
          habitsStore.loadAllHabits();
          if (currentUserId) {
            habitsStore.loadUserHabits(currentUserId);
          }
        }
      }
    );

    return () => disposer();
  }, [habitsStore, currentUserId]);

  const filteredHabits = habitsStore.filteredHabits.filter(
    (habit: Habit) => habit.userId !== currentUserId
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}>
        <Typography variant='h4' component='h1'>
          Библиотека привычек
        </Typography>
        <Button component={Link} to='/habits/new' variant='contained' sx={{ flexShrink: 0 }}>
          Добавить привычку
        </Button>
      </Box>
      <HabitsFilter />
      {habitsStore.isAllHabitsLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {habitsStore.allHabitsError && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {habitsStore.allHabitsError}
        </Alert>
      )}
      {!habitsStore.isAllHabitsLoading && filteredHabits.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant='h6' color='textSecondary'>
            Привычки не найдены
          </Typography>
          <Typography variant='body1' sx={{ mt: 1 }}>
            Попробуйте изменить фильтр или создать новую привычку
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 3,
          mt: 3,
        }}>
        {filteredHabits.map((habit: Habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </Box>
    </Box>
  );
});

export default HabitsPage;
