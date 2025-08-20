import { Box } from '@mui/material';
import AppSnackbar from './AppSnackbar';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box>
      <Box component='main'>{children}</Box>
      <AppSnackbar />
    </Box>
  );
}
