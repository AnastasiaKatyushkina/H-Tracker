import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import type { DeleteDialogProps } from '../../types/types';

export function DeleteHabitDialog({ open, habitToDelete, onClose, onConfirm }: DeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Удалить привычку?</DialogTitle>
      <DialogContent>
        <Typography>
          Вы уверены, что хотите удалить привычку "{habitToDelete?.title}"? Это действие нельзя
          отменить
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={onConfirm} color='error' variant='contained'>
          Удалить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
