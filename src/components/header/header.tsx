import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { navigationEntries } from '../../types/types';
import { auth } from '../../app/firebaseConfig';
import { useStore } from '../../app/RootStore';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { MobileMenu } from './mobileMenu';
import { DesktopNavigation } from './desktopNavigation';

export const Header = observer(() => {
  const { uiStore, userStore } = useStore();
  const theme = useTheme();
  const location = useLocation();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isAuthenticated = !!userStore.currentUser;
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const currentPage =
    navigationEntries.find((entry) => entry.path === location.pathname)?.id || 'todo';

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await auth.signOut();
      uiStore.showSnackbar('Вы успешно вышли из системы', 'success');
    } catch {
      uiStore.showSnackbar('Ошибка при выходе из системы', 'error');
    } finally {
      setIsLoggingOut(false);
      setIsMobileOpen(false);
    }
  }

  return (
    <>
      <AppBar
        position='fixed'
        elevation={2}
        sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
        <Toolbar sx={{ height: 64 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            {isMobile && isAuthenticated && (
              <IconButton
                edge='start'
                aria-label='open menu'
                onClick={() => setIsMobileOpen(true)}
                size='large'
                sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant='h6' noWrap fontWeight={700}>
              H-Tracker
            </Typography>
          </Box>
          {!isMobile && isAuthenticated ? (
            <DesktopNavigation currentPage={currentPage} />
          ) : (
            <Box sx={{ flexGrow: 1 }} />
          )}
          {isAuthenticated ? (
            <Button
              variant='outlined'
              startIcon={isLoggingOut ? <CircularProgress size={20} /> : <LogoutIcon />}
              onClick={handleLogout}
              disabled={isLoggingOut}
              sx={{ textTransform: 'none' }}>
              {isLoggingOut ? 'Выход...' : 'Выйти'}
            </Button>
          ) : (
            <Button
              variant='contained'
              startIcon={<LoginIcon />}
              component={Link}
              to='/login'
              sx={{ textTransform: 'none' }}>
              Войти
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {isMobile && isAuthenticated && (
        <MobileMenu
          isOpen={isMobileOpen}
          onClose={() => setIsMobileOpen(false)}
          currentPage={currentPage}
          handleLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
      )}
      <Toolbar />
    </>
  );
});
