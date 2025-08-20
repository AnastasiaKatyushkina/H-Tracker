import { getAnalytics, logEvent, setUserProperties, setUserId } from 'firebase/analytics';
import { app } from '../app/firebaseConfig';
import Sentry from './sentry';

export const analytics = getAnalytics(app);

export const AnalyticsEvents = {
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  HABIT_CREATED: 'habit_created',
  HABIT_UPDATED: 'habit_update',
  HABIT_DELETED: 'habit_deleted',
  ERROR_OCCURRED: 'error_occurred',
  PAGE_VIEW: 'page_view',
};

type AnalyticsEvent = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

interface AnalyticsParams {
  [key: string]: string | number | boolean | null | undefined;
}

interface ErrorContext {
  [key: string]: string | number | boolean | null | undefined;
}

export const logAnalyticsEvent = (eventName: AnalyticsEvent, params?: AnalyticsParams) => {
  try {
    logEvent(analytics, eventName, params);

    Sentry.addBreadcrumb({
      category: 'analytics',
      message: eventName,
      level: 'info',
      data: params,
    });
  } catch (error) {
    console.warn('Analytics error:', error);
  }
};

export const logError = (error: Error, context?: ErrorContext) => {
  console.error('Application error:', error, context);

  Sentry.withScope((scope) => {
    if (context) {
      scope.setExtras(context);
    }
    Sentry.captureException(error);
  });

  try {
    logEvent(analytics, AnalyticsEvents.ERROR_OCCURRED, {
      error_message: error.message,
      error_name: error.name,
      ...context,
    });
  } catch (analyticsError) {
    console.warn('Failed to log error to analytics:', analyticsError);
  }
};

export const setUserAnalyticsProperties = (userId: string, properties: AnalyticsParams) => {
  try {
    setUserId(analytics, userId);
    setUserProperties(analytics, properties);

    Sentry.setUser({ id: userId, ...properties });
  } catch (error) {
    console.warn('Failed to set user properties:', error);
  }
};

export default {
  logEvent: logAnalyticsEvent,
  logError,
  setUserProperties: setUserAnalyticsProperties,
  Events: AnalyticsEvents,
};
