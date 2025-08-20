import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from './app/RootStore';
import MainLayout from './appLayout/MainLayout';
import AuthLayout from './appLayout/AuthLayout';
import LoadingScreen from './appLayout/LoadingScreen';
import AppRoutes from './AppRoutes';
import { logAnalyticsEvent } from './analytics/analytics';
import { AnalyticsEvents } from './analytics/analytics';

const App = observer(() => {
  const { userStore, habitsStore } = useStore();
  const location = useLocation();

  useEffect(() => {
    logAnalyticsEvent(AnalyticsEvents.PAGE_VIEW, {
      page_path: location.pathname,
      user_id: userStore.currentUser?.uid,
    });
  }, [location, userStore.currentUser]);

  useEffect(() => {
    if (userStore.currentUser) {
      habitsStore.loadUserHabits(userStore.currentUser.uid);
    }
  }, [userStore.currentUser, habitsStore]);

  useEffect(() => {
    habitsStore.loadAllHabits();
  }, [habitsStore]);

  if (userStore.isLoading) {
    return <LoadingScreen />;
  }

  const isAuthPage = location.pathname === '/login';

  return isAuthPage ? (
    <AuthLayout>
      <AppRoutes />
    </AuthLayout>
  ) : (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
});

export default App;
