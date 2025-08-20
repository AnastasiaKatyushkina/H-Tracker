import type { SnackbarSeverity, SnackbarState, DrawerState } from '../../types/types';

export type { SnackbarSeverity, SnackbarState, DrawerState };

export interface UIStoreState {
  snackbar: SnackbarState;
  drawerState: DrawerState;
}

export interface ShowSnackbarParams {
  message: string;
  severity?: SnackbarSeverity;
}

export interface ToggleDrawerParams {
  state?: DrawerState;
}
