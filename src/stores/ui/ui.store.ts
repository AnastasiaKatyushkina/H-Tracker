import { makeAutoObservable } from 'mobx';
import type { UIStoreState, SnackbarState, DrawerState } from './ui.types';
import { showSnackbarAction, closeSnackbarAction, toggleDrawerAction } from './ui.actions';
import {
  getSnackbarSelector,
  getDrawerStateSelector,
  isSnackbarOpenSelector,
  isDrawerOpenSelector,
} from './ui.selectors';

export class UIStoreImplementation implements UIStoreState {
  snackbar: SnackbarState = {
    isOpen: false,
    message: '',
    severity: 'info',
  };

  drawerState: DrawerState = 'closed';

  constructor() {
    makeAutoObservable(this);
  }

  get currentSnackbar() {
    return getSnackbarSelector(this);
  }

  get currentDrawerState() {
    return getDrawerStateSelector(this);
  }

  get isSnackbarOpen() {
    return isSnackbarOpenSelector(this);
  }

  get isDrawerOpen() {
    return isDrawerOpenSelector(this);
  }

  showSnackbar(message: string, severity?: 'info' | 'success' | 'warning' | 'error') {
    showSnackbarAction(this, { message, severity });
  }

  closeSnackbar() {
    closeSnackbarAction(this);
  }

  toggleDrawer(state?: DrawerState) {
    toggleDrawerAction(this, state ? { state } : undefined);
  }
}

export type UIStore = UIStoreImplementation;

export const createUIStore = (): UIStoreImplementation => {
  return new UIStoreImplementation();
};
