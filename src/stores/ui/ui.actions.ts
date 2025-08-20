import { runInAction } from 'mobx';
import type { ShowSnackbarParams, ToggleDrawerParams } from './ui.types';
import type { UIStoreImplementation } from './ui.store';

export const showSnackbarAction = (store: UIStoreImplementation, params: ShowSnackbarParams) => {
  runInAction(() => {
    store.snackbar = {
      isOpen: true,
      message: params.message,
      severity: params.severity || 'info',
    };
  });
};

export const closeSnackbarAction = (store: UIStoreImplementation) => {
  runInAction(() => {
    store.snackbar.isOpen = false;
  });
};

export const toggleDrawerAction = (store: UIStoreImplementation, params?: ToggleDrawerParams) => {
  runInAction(() => {
    if (params?.state !== undefined) {
      store.drawerState = params.state;
    } else {
      store.drawerState = store.drawerState === 'open' ? 'closed' : 'open';
    }
  });
};
