import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../app/RootStore';
import { auth, googleProvider } from '../app/firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { Box } from '@mui/material';
import { handleAuthOperation } from '../utils/authUtils';
import { LoginForm } from '../components/login/loginForm';
import { BackButton } from '../components/backButton/backButton';
import type { AuthResponse } from '../types/types';

export function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);

  const navigate = useNavigate();
  const { uiStore } = useStore();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 8;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleAuthResponse = (response: AuthResponse) => {
    if (response.success && response.user) {
      uiStore.showSnackbar(
        mode === 'login' ? 'Вы успешно вошли в систему' : 'Вы успешно зарегистрировались',
        'success'
      );
      navigate('/');
    } else if (response.error) {
      setError(response.error);
    }
  };

  const handleEmailAuth = async () => {
    setIsLoading(true);
    setError('');

    try {
      const operation =
        mode === 'login'
          ? () => signInWithEmailAndPassword(auth, email, password)
          : () => createUserWithEmailAndPassword(auth, email, password);

      const response = await handleAuthOperation(operation);
      handleAuthResponse(response);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await handleAuthOperation(() => signInWithPopup(auth, googleProvider));
      handleAuthResponse(response);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    setIsEmailTouched(true);
    setIsPasswordTouched(true);

    if (!isFormValid) return;
    handleEmailAuth();
  };

  const handleModeChange = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setIsFormSubmitted(false);
    setError('');
    setIsEmailTouched(false);
    setIsPasswordTouched(false);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: 'background.default',
      }}>
      <BackButton />
      <LoginForm
        mode={mode}
        email={email}
        password={password}
        error={error}
        isLoading={isLoading}
        isFormSubmitted={isFormSubmitted}
        isEmailTouched={isEmailTouched}
        isPasswordTouched={isPasswordTouched}
        isEmailValid={isEmailValid}
        isPasswordValid={isPasswordValid}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onEmailBlur={() => setIsEmailTouched(true)}
        onPasswordBlur={() => setIsPasswordTouched(true)}
        onSubmit={handleSubmit}
        onModeChange={handleModeChange}
        onGoogleLogin={handleGoogleLogin}
      />
    </Box>
  );
}
