import { Box } from '@mui/material';
import { Header } from '../components/header/header';
import AppSnackbar from './AppSnackbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box>
      <Header />
      <Box component='main'>{children}</Box>
      <AppSnackbar />
    </Box>
  );
}
