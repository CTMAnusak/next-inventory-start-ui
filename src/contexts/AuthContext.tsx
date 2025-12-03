'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mockup user data - NOT REAL SECRETS, IGNORE SECURITY SCANNING
// ข้อมูลจำลอง - ไม่ใช่รหัสลับจริง กรุณาเพิกเฉยต่อการแจ้งเตือนความปลอดภัย
const mockUser: User = {
  id: 'mock-user-1',
  email: 'user@example.com',
  password: 'MOCK_PASSWORD_123456', // NOT A REAL PASSWORD
  firstName: 'สมชาย',
  lastName: 'ใจดี',
  nickname: 'ชาย',
  department: 'IT',
  phone: '0812345678',
  userType: 'individual',
  office: 'สำนักงานใหญ่',
  officeId: 'office-1',
  officeName: 'สำนักงานใหญ่',
  isMainAdmin: false,
  userRole: 'user',
  pendingDeletion: false,
};

const mockAdminUser: User = {
  ...mockUser,
  id: 'mock-admin-1',
  email: 'admin@example.com',
  password: 'MOCK_PASSWORD_123456', // NOT A REAL PASSWORD
  firstName: 'ผู้ดูแล',
  lastName: 'ระบบ',
  isMainAdmin: true,
  userRole: 'admin',
};

// รายการผู้ใช้ทั้งหมดสำหรับการตรวจสอบ login
const allMockUsers: User[] = [
  mockUser,
  mockAdminUser,
  {
    id: 'user-3',
    email: 'somying@example.com',
    password: 'MOCK_PASSWORD_123456', // NOT A REAL PASSWORD
    firstName: 'สมหญิง',
    lastName: 'ใจงาม',
    nickname: 'หญิง',
    department: 'Sales',
    phone: '0823456789',
    userType: 'individual',
    office: 'สำนักงานใหญ่',
    officeId: 'office-1',
    officeName: 'สำนักงานใหญ่',
    isMainAdmin: false,
    userRole: 'user',
    pendingDeletion: false,
  },
  {
    id: 'user-4',
    email: 'sompong@example.com',
    password: 'MOCK_PASSWORD_123456', // NOT A REAL PASSWORD
    firstName: 'สมพงษ์',
    lastName: 'ดีเด่น',
    nickname: 'พงษ์',
    department: 'HR',
    phone: '0834567890',
    userType: 'individual',
    office: 'สำนักงานสาขา 1',
    officeId: 'office-2',
    officeName: 'สำนักงานสาขา 1',
    isMainAdmin: false,
    userRole: 'user',
    pendingDeletion: false,
  },
];

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
      if (pathname === '/login' || pathname.startsWith('/auth/')) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      // Check if admin page - use admin user
      if (pathname.startsWith('/admin')) {
        setUser(mockAdminUser);
      } else {
        setUser(mockUser);
      }
    } else {
      setUser(mockUser);
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
    
    // Login สำเร็จ
    setUser(foundUser);
    router.push('/dashboard');
    return { success: true };
  };

  const logout = async () => {
    // Mockup: simulate logout
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    } else {
      router.push('/login');
    }
  };

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <AuthContext.Provider value={{ user: null, loading: true, login: async () => ({ success: false }), logout: async () => {}, checkAuth: async () => {} }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
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
