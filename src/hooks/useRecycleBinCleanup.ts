import { useEffect } from 'react';

/**
 * Mockup version - UI only
 * Hook to trigger daily cleanup of recycle bin (disabled in UI-only mode)
 */
export function useRecycleBinCleanup() {
    useEffect(() => {
        // Mockup: No actual cleanup needed for UI-only mode
        // This hook is kept for compatibility but does nothing
        console.log('Recycle bin cleanup check (mockup mode)');
    }, []);
}
