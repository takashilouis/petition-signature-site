'use client';

import { useEffect } from 'react';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
}

export function useAnalytics() {
  useEffect(() => {
    // Log page view
    logEvent('page_view', {
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const logEvent = (event: string, properties?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', { event, properties });
    }
    // In production, this would send to your analytics service
  };

  return { logEvent };
}