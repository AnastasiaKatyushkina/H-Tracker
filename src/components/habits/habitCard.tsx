import { observer } from 'mobx-react-lite';
import { Card, CardContent, Typography, Chip, Button, Box, CircularProgress } from '@mui/material';
import { useStore } from '../../app/RootStore';
import type { Habit } from '../../types/types';

type Props = {
  habit: Habit;
};

const HabitCard = observer(({ habit }: Props) => {
  const { habitsStore, userStore } = useStore();
  const currentUserId = userStore.currentUser?.uid || '';

  const isAddedToProfile = habit.addedByUsers?.includes(currentUserId) || false;

  const handleAddHabit = async () => {
    if (!currentUserId) return;
    await habitsStore.addHabitToUser(habit.id, currentUserId);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant='h6' component='h3' gutterBottom>
          {habit.title}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Chip
            label={habit.category}
            size='small'
            color='primary'
            variant='outlined'
            sx={{ mr: 1 }}
          />
          <Chip
            label={
              habit.targetFrequency === 'daily'
                ? 'Ежедневно'
                : habit.targetFrequency === 'weekly'
                  ? 'Еженедельно'
                  : 'Ежемесячно'
            }
            size='small'
          />
        </Box>
        {habit.description && (
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            {habit.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
          <Button
            variant='contained'
            size='small'
            onClick={handleAddHabit}
            disabled={isAddedToProfile || habitsStore.operationStatus.status === 'loading'}>
            {habitsStore.operationStatus.status === 'loading' ? (
              <CircularProgress size={20} />
            ) : isAddedToProfile ? (
              'Уже в вашем профиле'
            ) : (
              'Добавить к себе'
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
});

export default HabitCard;
