import type { UIStoreState, SnackbarState, DrawerState } from './ui.types';

export const getSnackbarSelector = (state: UIStoreState): SnackbarState => {
  return state.snackbar;
};

export const getDrawerStateSelector = (state: UIStoreState): DrawerState => {
  return state.drawerState;
};

export const isSnackbarOpenSelector = (state: UIStoreState): boolean => {
  return state.snackbar.isOpen;
};

export const isDrawerOpenSelector = (state: UIStoreState): boolean => {
  return state.drawerState === 'open';
};
