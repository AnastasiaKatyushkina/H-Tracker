import {
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { TodayHabit } from '../../types/types';

export type TodayHabitItemProps = {
  habit: TodayHabit;
  onToggle: (habitId: string, completed: boolean) => void;
};

export function TodayHabitItem({ habit, onToggle }: TodayHabitItemProps) {
  const theme = useTheme();
  return (
    <Card
      sx={{
        bgcolor: habit.completed ? alpha(theme.palette.success.light, 0.2) : 'background.paper',
      }}>
      <CardContent>
        <FormControlLabel
          control={
            <Checkbox
              checked={habit.completed}
              onChange={(e) => onToggle(habit.id, e.target.checked)}
              color='primary'
            />
          }
          label={
            <Box>
              <Typography variant='h6' component='div'>
                {habit.title}
              </Typography>
              {habit.description && (
                <Typography variant='body2' color='text.secondary'>
                  {habit.description}
                </Typography>
              )}
            </Box>
          }
          sx={{
            width: '100%',
            alignItems: 'flex-start',
            '& .MuiFormControlLabel-label': { flexGrow: 1 },
          }}
        />
      </CardContent>
    </Card>
  );
}
