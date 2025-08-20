import {
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  CircularProgress,
} from '@mui/material';
import type { NewHabitFormProps } from '../../types/types';

export function NewHabitForm({
  formData,
  isSubmitting,
  categories,
  daysOfWeek,
  onTitleChange,
  onDescriptionChange,
  onCategoryChange,
  onFrequencyChange,
  onDayToggle,
  onMonthlyDayChange,
  onSubmit,
}: NewHabitFormProps) {
  return (
    <Box component='form' onSubmit={onSubmit} sx={{ width: '100%' }}>
      <TextField
        name='title'
        label='Название привычки'
        fullWidth
        required
        value={formData.title}
        onChange={(e) => onTitleChange(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        name='description'
        label='Описание'
        fullWidth
        multiline
        rows={3}
        value={formData.description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Категория</InputLabel>
        <Select
          value={formData.category}
          label='Категория'
          onChange={(e) => onCategoryChange(e.target.value)}>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Частота выполнения</InputLabel>
        <Select
          value={formData.targetFrequency}
          label='Частота выполнения'
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'daily' || value === 'weekly' || value === 'monthly') {
              onFrequencyChange(value);
            }
          }}>
          <MenuItem value='daily'>Ежедневно</MenuItem>
          <MenuItem value='weekly'>Еженедельно</MenuItem>
          <MenuItem value='monthly'>Раз в месяц</MenuItem>
        </Select>
      </FormControl>
      {formData.targetFrequency === 'weekly' && (
        <Box sx={{ mb: 2 }}>
          <Typography variant='subtitle1' gutterBottom>
            Дни недели
          </Typography>
          <FormGroup row>
            {daysOfWeek.map((day, index) => (
              <FormControlLabel
                key={day}
                control={
                  <Checkbox
                    checked={formData.daysOfWeek?.includes(index) || false}
                    onChange={() => onDayToggle(index)}
                  />
                }
                label={day}
              />
            ))}
          </FormGroup>
        </Box>
      )}
      {formData.targetFrequency === 'monthly' && (
        <TextField
          name='monthlyDay'
          label='День месяца'
          type='number'
          fullWidth
          required
          value={formData.monthlyDay || 1}
          onChange={(e) => onMonthlyDayChange(Number(e.target.value))}
          slotProps={{
            htmlInput: {
              min: 1,
              max: 31,
            },
          }}
          sx={{ mb: 2 }}
        />
      )}
      <Button
        type='submit'
        variant='contained'
        color='primary'
        fullWidth
        size='large'
        disabled={isSubmitting}>
        {isSubmitting ? <CircularProgress size={24} /> : 'Сохранить'}
      </Button>
    </Box>
  );
}
