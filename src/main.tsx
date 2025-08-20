import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './analytics/ErrorBoundary';
import YandexMetrika from './analytics/YandexMetrika';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename='/H-Tracker'>
        <App />
        <YandexMetrika />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
