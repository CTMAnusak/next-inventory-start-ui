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
    // จำลองว่าตอนนี้เข้าใช้งานมาแล้ว 5 วัน (ระบบจำกัดไว้ 7 วัน)
    // ดังนั้นเหลืออีก 2 วัน = 2 * 24 * 60 * 60 = 172800 วินาที
    // ไม่แสดงแจ้งเตือนเพราะยังไม่ใกล้หมดอายุ (แสดงเมื่อเหลือน้อยกว่า 60 นาที)
    
    const daysRemaining = 2; // เหลืออีก 2 วัน
    const secondsRemaining = daysRemaining * 24 * 60 * 60; // แปลงเป็นวินาที
    setTimeToExpiry(secondsRemaining);
    
    // ไม่แสดงแจ้งเตือนเพราะยังเหลือเวลาอีกมาก (มากกว่า 60 นาที)
    // แจ้งเตือนจะแสดงเมื่อเหลือเวลาน้อยกว่า 60 นาที
    setShowModal(false);
    setHasWarned(false);
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
