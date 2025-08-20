import { Box, Typography, CircularProgress, Card } from '@mui/material';
import { TodayHabitItem } from './todayHabitItem';
import type { TodayHabit } from '../../types/types';
import { observer } from 'mobx-react-lite';

export type TodayHabitsListProps = {
  habits: TodayHabit[];
  isLoading: boolean;
  onToggleHabit: (habitId: string, completed: boolean) => void;
};

export const TodayHabitsList = observer(
  ({ habits, isLoading, onToggleHabit }: TodayHabitsListProps) => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (habits.length === 0) {
      return (
        <Card sx={{ bgcolor: 'background.paper', p: 3, textAlign: 'center' }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Сегодня нет привычек для выполнения
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Вы можете добавить новые привычки или отдохнуть сегодня
          </Typography>
        </Card>
      );
    }

    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
        {habits.map((habit) => (
          <TodayHabitItem key={habit.id} habit={habit} onToggle={onToggleHabit} />
        ))}
      </Box>
    );
  }
);
