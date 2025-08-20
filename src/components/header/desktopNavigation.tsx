import { Box, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { navigationEntries } from '../../types/types';

export type Props = {
  currentPage: string;
};

export function DesktopNavigation({ currentPage }: Props) {
  return (
    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
      <Stack direction='row' spacing={1} alignItems='center'>
        {navigationEntries.map(({ id, title, path }) => (
          <Button
            key={id}
            component={Link}
            to={path}
            color={currentPage === id ? 'primary' : 'inherit'}
            variant={currentPage === id ? 'contained' : 'text'}
            sx={{
              textTransform: 'none',
              borderRadius: 1,
              px: 2,
              py: 1,
            }}>
            {title}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}
