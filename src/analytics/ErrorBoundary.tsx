import React from 'react';
import * as Sentry from '@sentry/react';
import { logError } from './analytics';

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const handleError = (error: unknown, componentStack: string | null) => {
    if (error instanceof Error) {
      logError(error, { componentStack });
    } else {
      logError(new Error(String(error)), { componentStack });
    }
  };

  return (
    <Sentry.ErrorBoundary
      fallback={({ error, componentStack }) => {
        handleError(error, componentStack || null);
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Что-то пошло не так</h2>
            <p>Мы уже знаем о проблеме и работаем над её решением</p>
            <button onClick={() => window.location.reload()}>Перезагрузить страницу</button>
          </div>
        );
      }}>
      {children}
    </Sentry.ErrorBoundary>
  );
};

export default ErrorBoundary;
