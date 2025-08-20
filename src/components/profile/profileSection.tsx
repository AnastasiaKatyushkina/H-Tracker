import { Box, Typography, Avatar, Button, TextField, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import type { ProfileSectionProps } from '../../types/types';

export function ProfileSection({
  displayName,
  photoURL,
  email,
  editMode,
  onDisplayNameChange,
  onPhotoURLChange,
  onEditModeToggle,
  onSaveProfile,
}: ProfileSectionProps) {
  return (
    <Box
      sx={{
        mb: 4,
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
      }}>
      <Typography variant='h4' gutterBottom>
        Мой профиль
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar src={photoURL || undefined} sx={{ width: 80, height: 80, mr: 3 }} />
        {editMode ? (
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              label='Имя'
              fullWidth
              value={displayName}
              onChange={(e) => onDisplayNameChange(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label='URL фото'
              fullWidth
              value={photoURL}
              onChange={(e) => onPhotoURLChange(e.target.value)}
              placeholder='https://example.com/photo.jpg'
            />
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant='h5'>{displayName}</Typography>
            <Typography variant='body1' color='text.secondary'>
              {email}
            </Typography>
          </Box>
        )}
        <Box sx={{ alignSelf: 'flex-start', pl: 2 }}>
          {editMode ? (
            <>
              <Button variant='outlined' sx={{ mr: 2 }} onClick={onEditModeToggle}>
                Отмена
              </Button>
              <Button variant='contained' onClick={onSaveProfile}>
                Сохранить
              </Button>
            </>
          ) : (
            <IconButton onClick={onEditModeToggle}>
              <EditIcon />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
}
