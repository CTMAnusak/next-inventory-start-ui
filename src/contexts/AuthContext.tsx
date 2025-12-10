'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockUsers } from '@/lib/mockup-data';

interface User {
  id: string;
  user_id?: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  department?: string;
  phone?: string;
  userType: 'individual' | 'branch';
  office?: string;
  officeId?: string;
  officeName: string;
  isMainAdmin?: boolean;
  userRole?: 'user' | 'admin' | 'it_admin' | 'super_admin';
  pendingDeletion?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  getMockUsers: () => User[]; // เพิ่มฟังก์ชันสำหรับดึงรายการ mock users
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ใช้ mockUsers จาก mockup-data.ts
const allMockUsers: User[] = mockUsers as User[];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const checkAuth = async () => {
    // Mockup: simulate loading
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mockup: set user based on URL or default to regular user
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      
      // ถ้าอยู่ที่หน้า login หรือ auth pages ให้ clear user
      if (pathname === '/login' || pathname.startsWith('/auth/')) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      // Check localStorage for saved user session
      const savedUserId = localStorage.getItem('mock_user_id');
      if (savedUserId) {
        const savedUser = allMockUsers.find(u => u.id === savedUserId);
        if (savedUser) {
          setUser(savedUser);
          setLoading(false);
          return;
        } else {
          // ถ้าไม่พบ user ใน mockUsers ให้ clear localStorage
          localStorage.removeItem('mock_user_id');
        }
      }
      
      // ถ้าไม่มี saved user session และไม่อยู่ที่หน้า login ให้ redirect ไป login
      if (!savedUserId) {
        setUser(null);
        setLoading(false);
        router.push('/login');
        return;
      }
    } else {
      setUser(null);
    }
    
    setLoading(false);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Mockup: simulate login delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // ค้นหาผู้ใช้จากอีเมล
    const foundUser = allMockUsers.find(user => user.email === email);
    
    if (!foundUser) {
      return { success: false, error: 'ไม่พบผู้ใช้งานนี้ในระบบ' };
    }
    
    // ตรวจสอบรหัสผ่าน
    if (foundUser.password !== password) {
      return { success: false, error: 'รหัสผ่านไม่ถูกต้อง' };
    }
    
    // Login สำเร็จ - บันทึก user ID ใน localStorage
    setUser(foundUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_user_id', foundUser.id);
    }
    router.push('/dashboard');
    return { success: true };
  };

  const logout = async () => {
    // Mockup: simulate logout
    setUser(null);
    if (typeof window !== 'undefined') {
      // Clear localStorage first
      localStorage.removeItem('mock_user_id');
      // Use window.location.href to force full page reload and clear all state
      window.location.href = '/login';
    } else {
      router.push('/login');
    }
  };

  const getMockUsers = () => {
    return allMockUsers;
  };

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <AuthContext.Provider value={{ user: null, loading: true, login: async () => ({ success: false }), logout: async () => {}, checkAuth: async () => {}, getMockUsers: () => [] }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth, getMockUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
