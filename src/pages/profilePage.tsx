import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Typography, CircularProgress, Button, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../app/RootStore';
import { DeleteHabitDialog } from '../components/profile/deleteHabitDialog';
import { ProfileSection } from '../components/profile/profileSection';
import { HabitCard } from '../components/profile/habitCard';
import type { Habit } from '../types/types';

const ProfilePage = observer(() => {
  const { userStore, habitsStore, uiStore } = useStore();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState(userStore.currentUser?.displayName || '');
  const [photoURL, setPhotoURL] = useState(userStore.currentUser?.photoURL || '');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

  const currentUserId = userStore.currentUser?.uid || '';
  const currentUserEmail = userStore.currentUser?.email || '';

  useEffect(() => {
    if (currentUserId) {
      habitsStore.loadUserHabits(currentUserId);
    } else {
      navigate('/login');
    }
  }, [currentUserId, habitsStore, navigate]);

  const handleSaveProfile = async (): Promise<boolean> => {
    try {
      await userStore.updateUserProfile({ displayName, photoURL });
      uiStore.showSnackbar('Профиль успешно обновлен', 'success');
      setEditMode(false);
      return true;
    } catch {
      uiStore.showSnackbar('Ошибка при обновлении профиля', 'error');
      return false;
    }
  };

  const handleEditHabit = (habitId: string): void => {
    navigate(`/habits/edit/${habitId}`);
  };

  const handleDeleteHabit = async (): Promise<void> => {
    if (habitToDelete) {
      const result = await habitsStore.deleteHabit(habitToDelete.id);

      if (result.status === 'success') {
        uiStore.showSnackbar('Привычка успешно удалена', 'success');
      } else if (result.status === 'error') {
        uiStore.showSnackbar(`Ошибка: ${result.error}`, 'error');
      }

      setOpenDeleteDialog(false);
      setHabitToDelete(null);
    }
  };

  const handleOpenDeleteDialog = (habit: Habit): void => {
    setHabitToDelete(habit);
    setOpenDeleteDialog(true);
  };

  if (!userStore.currentUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <DeleteHabitDialog
        open={openDeleteDialog}
        habitToDelete={habitToDelete}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteHabit}
      />
      <ProfileSection
        displayName={displayName}
        photoURL={photoURL}
        email={currentUserEmail}
        editMode={editMode}
        onDisplayNameChange={setDisplayName}
        onPhotoURLChange={setPhotoURL}
        onEditModeToggle={() => setEditMode(!editMode)}
        onSaveProfile={handleSaveProfile}
      />
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Typography variant='h4'>Мои привычки</Typography>
        <Button component={Link} to='/habits/new' variant='contained'>
          Добавить новую привычку
        </Button>
      </Box>

      {habitsStore.isUserHabitsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : habitsStore.userHabitsError ? (
        <Alert severity='error' sx={{ mb: 3 }}>
          {habitsStore.userHabitsError}
        </Alert>
      ) : habitsStore.userHabits.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}>
          <Typography variant='h6' color='textSecondary'>
            У вас пока нет привычек
          </Typography>
          <Typography variant='body1' sx={{ mt: 1, mb: 2 }}>
            Начните добавлять привычки или выберите из библиотеки
          </Typography>
          <Button component={Link} to='/habits' variant='outlined'>
            Перейти в библиотеку
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 3,
            mt: 3,
          }}>
          {habitsStore.userHabits.map((habit: Habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={handleEditHabit}
              onDelete={handleOpenDeleteDialog}
            />
          ))}
        </Box>
      )}
    </Box>
  );
});

export default ProfilePage;
