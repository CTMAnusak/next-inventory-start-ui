'use client';

import React, { useEffect } from 'react';
import { EnhancedErrorBoundary, setupGlobalErrorHandling } from '@/components/EnhancedErrorBoundary';

interface ErrorMonitoringProviderProps {
  children: React.ReactNode;
  enableDashboard?: boolean;
  enableGlobalHandling?: boolean;
}

/**
 * Error Monitoring Provider - UI Only Version
 * จัดการ error monitoring สำหรับทั้งแอปพลิเคชัน (Mockup version)
 */
export function ErrorMonitoringProvider({ 
  children, 
  enableDashboard: _enableDashboard = false,
  enableGlobalHandling = true 
}: ErrorMonitoringProviderProps) {
  // Suppress unused variable warning for enableDashboard (may be used in future)
  void _enableDashboard;
  useEffect(() => {
    if (enableGlobalHandling) {
      setupGlobalErrorHandling();
    }
  }, [enableGlobalHandling]);

  return (
    <EnhancedErrorBoundary
      onError={(error, errorInfo) => {
        // Mockup: Just log to console, no API calls
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
      }}
      recoveryOptions={{
        retry: () => {
          // Mockup: Reload page
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        },
        reset: () => {
          // Mockup: Reload page
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }
      }}
    >
      {children}
    </EnhancedErrorBoundary>
  );
}

/**
 * Hook for sending performance metrics - Mockup version
 */
export function usePerformanceMonitoring() {
  useEffect(() => {
    // Mockup: No actual monitoring
    console.log('Performance monitoring (mockup mode)');
  }, []);
}

/**
 * Hook for tracking user actions - Mockup version
 */
export function useUserActionTracking() {
  const trackAction = (action: string, component: string, metadata?: Record<string, unknown>) => {
    // Mockup: Just log to console
    console.log('User action tracked:', { action, component, metadata });
  };

  return { trackAction };
}

/**
 * Component for tracking page views - Mockup version
 */
export function PageViewTracker({ pageName }: { pageName: string }) {
  useEffect(() => {
    // Mockup: Just log to console
    console.log('Page view tracked:', pageName);
  }, [pageName]);

  return null;
}
