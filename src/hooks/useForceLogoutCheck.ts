import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Mockup version - UI only
 * Hook for checking force logout status (disabled in UI-only mode)
 */
export function useForceLogoutCheck() {
  const { user } = useAuth();

  useEffect(() => {
    // Mockup: No actual check needed for UI-only mode
    // This hook is kept for compatibility but does nothing
    if (!user) return;
    
    // Mockup: Just log for debugging
    console.log('Force logout check (mockup mode)');
  }, [user]);
}
