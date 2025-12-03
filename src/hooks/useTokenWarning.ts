import { useEffect, useState } from 'react';

/**
 * Mockup version - UI only
 * Hook for displaying token expiry warning modal
 */
export function useTokenWarning() {
  const [timeToExpiry, setTimeToExpiry] = useState<number | null>(null);
  const [hasWarned, setHasWarned] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    // Mockup: Simulate token expiry check
    // In real app, this would check actual token
    // For UI demo, we'll set a mock expiry time
    const mockExpiryTime = 3600; // 1 hour in seconds
    setTimeToExpiry(mockExpiryTime);
    
    // Mockup: Show warning modal after 5 seconds for demo
    const warningTimer = setTimeout(() => {
      setShowModal(true);
      setHasWarned(true);
    }, 5000);

    return () => {
      clearTimeout(warningTimer);
    };
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return {
    timeToExpiry,
    hasWarned,
    showModal,
    showLogoutModal,
    handleCloseModal,
    handleLogoutConfirm
  };
}
