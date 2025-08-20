import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export type BackButtonProps = {
  onClick?: () => void;
};

export function BackButton({ onClick }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <IconButton onClick={handleClick} sx={{ mb: 2, alignSelf: 'flex-start' }}>
      <ArrowBackIcon />
    </IconButton>
  );
}
