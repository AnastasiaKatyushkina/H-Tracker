import {
  SwipeableDrawer,
  Box,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  CircularProgress,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { navigationEntries } from '../../types/types';

export type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  handleLogout: () => Promise<void>;
  isLoggingOut: boolean;
};

export function MobileMenu({ isOpen, onClose, currentPage, handleLogout, isLoggingOut }: Props) {
  return (
    <SwipeableDrawer
      anchor='left'
      open={isOpen}
      onClose={onClose}
      onOpen={() => {}}
      ModalProps={{ keepMounted: true }}>
      <Box
        sx={{ width: 280, bgcolor: 'background.paper', height: '100%' }}
        role='presentation'
        onKeyDown={(e) => e.key === 'Escape' && onClose()}>
        <Toolbar sx={{ px: 2 }}>
          <Typography variant='h6' noWrap fontWeight={700}>
            H-Tracker
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {navigationEntries.map(({ id, title, path }) => (
            <ListItem key={id} disablePadding>
              <ListItemButton
                component={Link}
                to={path}
                selected={currentPage === id}
                onClick={onClose}
                sx={{
                  '&.Mui-selected': { bgcolor: 'action.selected' },
                }}>
                <ListItemText primary={title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box p={2}>
          <Button
            fullWidth
            variant='outlined'
            color='error'
            startIcon={isLoggingOut ? <CircularProgress size={20} /> : <LogoutIcon />}
            onClick={handleLogout}
            disabled={isLoggingOut}
            sx={{ textTransform: 'none', py: 1, borderRadius: 1 }}>
            {isLoggingOut ? 'Выход...' : 'Выйти из аккаунта'}
          </Button>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
}
