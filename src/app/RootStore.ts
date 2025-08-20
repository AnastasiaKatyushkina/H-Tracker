import { createContext, useContext } from 'react';
import type { UserStore } from '../stores/user';
import type { HabitsStore } from '../stores/habits';
import type { UIStore } from '../stores/ui';
import { createUserStore } from '../stores/user';
import { createHabitsStore } from '../stores/habits';
import { createUIStore } from '../stores/ui';

export type RootStore = {
  userStore: UserStore;
  habitsStore: HabitsStore;
  uiStore: UIStore;
};

export const createRootStore = (): RootStore => ({
  userStore: createUserStore(),
  habitsStore: createHabitsStore(),
  uiStore: createUIStore(),
});

export const rootStore = createRootStore();

export const StoreContext = createContext(rootStore);
export const useStore = () => useContext(StoreContext);
export const useUIStore = () => useStore().uiStore;
