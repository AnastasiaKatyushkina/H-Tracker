import { observer } from 'mobx-react-lite';
import { Box, Button, ButtonGroup, Typography, useMediaQuery, useTheme } from '@mui/material';
import { CATEGORIES } from '../../types/types';
import { useStore } from '../../app/RootStore';

const HabitsFilter = observer(() => {
  const { habitsStore } = useStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const categories = ['Все', ...CATEGORIES];

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant='subtitle1' sx={{ mb: 1 }}>
        Фильтр по категориям:
      </Typography>
      {isMobile ? (
        <Box sx={{ overflowX: 'auto', display: 'flex', pb: 1 }}>
          {categories.map((category) => (
            <Button
              key={category}
              variant={habitsStore.filterCategory === category ? 'contained' : 'outlined'}
              onClick={() => habitsStore.setFilterCategory(category)}
              size='small'>
              {category}
            </Button>
          ))}
        </Box>
      ) : (
        <ButtonGroup variant='outlined' size='small'>
          {categories.map((category) => (
            <Button
              key={category}
              variant={habitsStore.filterCategory === category ? 'contained' : 'outlined'}
              onClick={() => habitsStore.setFilterCategory(category)}>
              {category}
            </Button>
          ))}
        </ButtonGroup>
      )}
    </Box>
  );
});

export default HabitsFilter;
