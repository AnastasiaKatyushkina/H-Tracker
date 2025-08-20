import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import type { LoginFormProps } from '../../types/types';

export function LoginForm({
  mode,
  email,
  password,
  error,
  isLoading,
  isFormSubmitted,
  isEmailTouched,
  isPasswordTouched,
  isEmailValid,
  isPasswordValid,
  onEmailChange,
  onPasswordChange,
  onEmailBlur,
  onPasswordBlur,
  onSubmit,
  onModeChange,
  onGoogleLogin,
}: LoginFormProps) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 400,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
        p: 4,
      }}>
      <form onSubmit={onSubmit}>
        <Typography
          variant='h4'
          component='h1'
          gutterBottom
          align='center'
          sx={{ fontWeight: 700 }}>
          {mode === 'login' ? 'Вход' : 'Регистрация'}
        </Typography>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          label='Email'
          type='email'
          fullWidth
          margin='normal'
          variant='outlined'
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          onBlur={onEmailBlur}
          error={(isEmailTouched || isFormSubmitted) && !isEmailValid}
          helperText={
            (isEmailTouched || isFormSubmitted) && !isEmailValid ? 'Введите корректный email' : ''
          }
          required
          autoComplete='email'
        />
        <TextField
          label='Пароль'
          type='password'
          fullWidth
          margin='normal'
          variant='outlined'
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          onBlur={onPasswordBlur}
          error={(isPasswordTouched || isFormSubmitted) && !isPasswordValid}
          helperText={
            (isPasswordTouched || isFormSubmitted) && !isPasswordValid
              ? 'Пароль должен содержать не менее 8 символов'
              : ''
          }
          required
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />
        <Button
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          size='large'
          disabled={isLoading}
          sx={{ mt: 2, py: 1 }}>
          {isLoading ? (
            <CircularProgress size={24} color='inherit' />
          ) : mode === 'login' ? (
            'Войти'
          ) : (
            'Зарегистрироваться'
          )}
        </Button>
        <Divider sx={{ my: 3 }}>ИЛИ</Divider>
        <Button
          variant='outlined'
          color='inherit'
          fullWidth
          size='large'
          onClick={onGoogleLogin}
          disabled={isLoading}
          startIcon={
            <img
              src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
              alt='Google'
              width={24}
              height={24}
            />
          }
          sx={{ py: 1 }}>
          Войти с Google
        </Button>
        <Box mt={3} textAlign='center'>
          <Button
            variant='text'
            color='primary'
            onClick={onModeChange}
            sx={{ textTransform: 'none' }}>
            {mode === 'login' ? 'Создать новый аккаунт' : 'Уже есть аккаунт?'}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
