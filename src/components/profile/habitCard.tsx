import { Card, CardContent, CardActions, Typography, IconButton, Box, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { HabitCardProps } from '../../types/types';

export function HabitCard({ habit, onEdit, onDelete }: HabitCardProps) {
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
        <Typography variant='caption' color='text.secondary'>
          Создано: {new Date(habit.creationDate).toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <IconButton onClick={() => onEdit(habit.id)} color='primary'>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(habit)} color='error'>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
