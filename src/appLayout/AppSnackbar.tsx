import { Alert, Snackbar } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useStore } from '../app/RootStore';

const AppSnackbar = observer(() => {
  const { uiStore } = useStore();

  const handleClose = () => {
    uiStore.closeSnackbar();
  };

  return (
    <Snackbar
      open={uiStore.snackbar.isOpen}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert
        onClose={handleClose}
        severity={uiStore.snackbar.severity}
        variant='filled'
        sx={{ width: '100%' }}>
        {uiStore.snackbar.message}
      </Alert>
    </Snackbar>
  );
});

export default AppSnackbar;
