'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setIsRedirecting(true);
      router.push('/login');
    } else if (!loading && user) {
      setIsRedirecting(true);
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // แสดง loading เมื่อกำลัง loading หรือ redirect
  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ไม่ควรถึงจุดนี้ เพราะจะ redirect ไปแล้ว
  return null;
}