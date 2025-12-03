'use client';

import { useRouter, usePathname } from 'next/navigation';
import Layout from '@/components/Layout';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { Package, PackageOpen, AlertTriangle, BarChart3, Users, X, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { enableDragScroll } from '@/lib/drag-scroll';
import SimpleErrorModal from '@/components/SimpleErrorModal';
import CancelReturnModal from '@/components/CancelReturnModal';
import AuthGuard from '@/components/AuthGuard';
import { usePerformanceMonitoring, useUserActionTracking, PageViewTracker } from '@/providers/ErrorMonitoringProvider';
import DashboardSkeleton from '@/components/DashboardSkeleton';
import { mockCategoryConfigs, mockStatusConfigs, mockConditionConfigs, mockOwnedItems } from '@/lib/mockup-data';

interface ICategoryConfig {
  id: string;
  name: string;
  isSpecial: boolean;
  isSystemCategory: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, checkAuth } = useAuth();
  
  // Error monitoring hooks
  usePerformanceMonitoring();
  const { trackAction } = useUserActionTracking();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [ownedItems, setOwnedItems] = useState<Array<{ _id?: string; itemName: string; category: string; categoryId?: string; serialNumber?: string; numberPhone?: string; quantity: number; firstName?: string; lastName?: string; nickname?: string; department?: string; phone?: string; statusId?: string; conditionId?: string; statusName?: string; conditionName?: string; notes?: string; currentOwnership?: { ownedSince?: string | Date }; sourceInfo?: { dateAdded?: string | Date }; createdAt?: string | Date; source?: string; editable?: boolean; hasPendingReturn?: boolean; deliveryLocation?: string }>>([]);
  const [categoryConfigs, setCategoryConfigs] = useState<ICategoryConfig[]>([]);
  const [statusConfigs, setStatusConfigs] = useState<any[]>([]);
  const [conditionConfigs, setConditionConfigs] = useState<any[]>([]);
  const [ownedLoading, setOwnedLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isManualRefresh, setIsManualRefresh] = useState(false);
  
  // Simple Error Modal State
  const [showSimpleError, setShowSimpleError] = useState(false);
  const [simpleErrorMessage, setSimpleErrorMessage] = useState('');
  
  // Cancel Return Modal State
  const [showCancelReturnModal, setShowCancelReturnModal] = useState(false);
  const [cancelReturnData, setCancelReturnData] = useState<{
    returnLogId: string;
    itemId: string;
    equipmentName: string;
  } | null>(null);
  const [cancelReturnLoading, setCancelReturnLoading] = useState(false);
  
  // Return loading state - track loading for return button for each item
  const [returnLoadingItems, setReturnLoadingItems] = useState<Set<string>>(new Set());
  
  // Cancel loading state - track loading for cancel button for each item
  const [cancelLoadingItems, setCancelLoadingItems] = useState<Set<string>>(new Set());
  
  // Drag scroll ref
  const tableContainerRef = useRef<HTMLDivElement>(null);
  

  // Initialize static data on component mount
  useEffect(() => {
    setCategoryConfigs(mockCategoryConfigs);
    setStatusConfigs(mockStatusConfigs);
    setConditionConfigs(mockConditionConfigs);
  }, []);

  // Initialize drag scrolling - reinitialize when table is rendered
  useEffect(() => {
    // Wait for table to be rendered
    if (ownedLoading || ownedItems.length === 0) return;

    const element = tableContainerRef.current;
    if (!element) return;

    const cleanup = enableDragScroll(element);
    return cleanup;
  }, [ownedLoading, ownedItems.length]);



  // Static data initialization
  const initializeStaticData = useCallback(() => {
    // Transform mockOwnedItems to include category field
    const transformedItems = mockOwnedItems.map(item => {
      const category = mockCategoryConfigs.find(c => c.id === item.categoryId)?.name || item.categoryId || '';
      return {
        ...item,
        category
      };
    });
    setOwnedItems(transformedItems);
    setDataLoaded(true);
  }, []);


  // Initialize static data when component loads
  useEffect(() => {
    if (!dataLoaded) {
      initializeStaticData();
    }
  }, [dataLoaded, initializeStaticData]);

  // Simple refresh function for static data
  const refreshData = useCallback(() => {
    setOwnedLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      initializeStaticData();
      setOwnedLoading(false);
      toast.success('รีเฟรชข้อมูลเรียบร้อย');
    }, 500);
  }, [initializeStaticData]);

  // Cancel return function - แสดง modal ยืนยัน
  const handleCancelReturn = (returnLogId: string, itemId: string, equipmentName?: string) => {
    // หาชื่ออุปกรณ์จาก ownedItems ถ้าไม่ได้ส่งมา
    const equipment = equipmentName || ownedItems.find(item => item._id === itemId)?.itemName || 'อุปกรณ์';
    
    setCancelReturnData({
      returnLogId,
      itemId,
      equipmentName: equipment
    });
    setShowCancelReturnModal(true);
  };

  // ฟังก์ชันยืนยันการยกเลิกการคืน
  const confirmCancelReturn = () => {
    if (cancelReturnLoading || !cancelReturnData) {
      return;
    }

    const itemIdToCancel = cancelReturnData.itemId;
    setCancelReturnLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      toast.success('ยกเลิกการคืนเรียบร้อยแล้ว');
      
      // ปิด modal และรีเซ็ตข้อมูล
      setShowCancelReturnModal(false);
      setCancelReturnData(null);
      
      // เคลียร์ loading state
      setCancelLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemIdToCancel);
        return newSet;
      });
      
      // อัพเดต state โดยลบ hasPendingReturn flag
      setOwnedItems(prevItems => {
        return prevItems.map(item => {
          const itemId = item._id || (item as any).itemId;
          if (String(itemId) === String(itemIdToCancel)) {
            return { ...item, hasPendingReturn: false };
          }
          return item;
        });
      });
      
      setCancelReturnLoading(false);
    }, 500);
  };

  // ฟังก์ชันปิด modal ยกเลิกการคืน
  const closeCancelReturnModal = () => {
    if (cancelReturnLoading) {
      return; // ป้องกันการปิดขณะกำลังโหลด
    }
    setShowCancelReturnModal(false);
    // เคลียร์ loading state ของ item ที่เกี่ยวข้อง
    if (cancelReturnData) {
      setCancelLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cancelReturnData.itemId);
        return newSet;
      });
    }
    setCancelReturnData(null);
  };



  // Helper functions to convert IDs to names
  const getCategoryName = (categoryId: string) => {
    const category = categoryConfigs.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  const getStatusName = (statusId: string) => {
    const status = statusConfigs.find(s => s.id === statusId);
    return status?.name || statusId;
  };

  const getConditionName = (conditionId: string) => {
    const condition = conditionConfigs.find(c => c.id === conditionId);
    return condition?.name || conditionId;
  };







  const quickActions = useMemo(() => [
    {
      title: 'เบิกอุปกรณ์',
      description: 'ยื่นคำขอเบิกอุปกรณ์จากคลัง',
      icon: Package,
      href: '/equipment-request',
      color: 'bg-blue-500',
    },
    {
      title: 'คืนอุปกรณ์',
      description: 'ยื่นคำขอเบิกอุปกรณ์จากคลัง',
      icon: PackageOpen,
      href: '/equipment-return',
      color: 'bg-orange-500',
    },
    {
      title: 'แจ้งปัญหา IT',
      description: 'แจ้งปัญหาเทคนิคหรือขอความช่วยเหลือ',
      icon: AlertTriangle,
      href: '/it-report',
      color: 'bg-red-500',
    },
    {
      title: 'ติดตามสถานะ',
      description: 'ตรวจสอบสถานะการแจ้งงาน IT',
      icon: BarChart3,
      href: '/it-tracking',
      color: 'bg-green-500',
    },
    {
      title: 'ติดต่อทีม IT Support',
      description: 'ข้อมูลการติดต่อทีม IT Support',
      icon: Users,
      href: '/contact',
      color: 'bg-purple-500',
    },
  ], []);

  // Prevent hydration mismatch - wait for auth to load
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  // แสดง Skeleton Screen ระหว่างโหลดข้อมูลอุปกรณ์ครั้งแรก
  // ไม่แสดงเมื่อ manual refresh เพื่อให้ user เห็นข้อมูลเดิมขณะรีเฟรช
  if (!dataLoaded || (ownedLoading && !isManualRefresh)) {
    return (
      <AuthGuard>
        <Layout>
          <PageViewTracker pageName="Dashboard" />
          <DashboardSkeleton />
        </Layout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Layout>
        <PageViewTracker pageName="Dashboard" />
        <div className="max-w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            ยินดีต้อนรับสู่ระบบจัดการคลังสินค้า
          </h1>
          <p className="text-gray-600">
            เลือกเมนูที่ต้องการใช้งาน
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 min-[550px]:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => {
            // Determine data-tutorial attribute based on action title
            let dataTutorial = '';
            if (action.title === 'เบิกอุปกรณ์') dataTutorial = 'equipment-request-card';
            else if (action.title === 'คืนอุปกรณ์') dataTutorial = 'equipment-return-card';
            else if (action.title === 'แจ้งปัญหา IT') dataTutorial = 'it-report-card';
            else if (action.title === 'ติดตามสถานะ') dataTutorial = 'it-tracking-card';
            else if (action.title === 'ติดต่อทีม IT Support') dataTutorial = 'contact-it-card';
            
            return (
              <div
                key={index}
                onClick={() => router.push(action.href)}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-white/50 hover:scale-105 hover:bg-white/90"
                data-tutorial={dataTutorial || undefined}
              >
                <div className="flex items-start">
                  <div className={`${action.color} p-3 rounded-lg`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 leading-none">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Important Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg py-8 px-6 border border-white/50">
          {/* Desktop Layout (768px and above) */}
          <div className="flex flex-col md:flex-row text-center md:text-left justify-between mb-7 gap-4">
            <div className="text-2xl font-medium text-blue-600">{
              (user?.userType === 'branch'
                ? `ทรัพย์สินที่มี ของ สาขา ${user?.office || ''}`
                : `ทรัพย์สินที่มี ของ ${[user?.firstName, user?.lastName].filter(Boolean).join(' ')}`
              ).trim()
            }</div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={refreshData}
                disabled={ownedLoading}
                className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 transition-colors"
                title="เคลียร์แคชและรีเฟรชข้อมูลทั้งหมด"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${ownedLoading ? 'animate-spin' : ''}`} /> 
                {ownedLoading ? 'กำลังรีเฟรช...' : 'รีเฟรช'}
              </button>
            </div>
          </div>

          <div ref={tableContainerRef} className="table-container">
            <table className="max-[425px]:min-w-[500vw] max-[510px]:min-w-[400vw] max-[610px]:min-w-[350vw] max-[768px]:min-w-[300vw] max-[1024px]:min-w-[250vw] max-[1440px]:min-w-[200vw] min-w-[150vw] divide-y divide-gray-200">
              <thead>
                <tr className="bg-blue-600">
                  <th className="px-3 py-2 text-center border-b text-white">วันที่เพิ่ม</th>
                  <th className="px-3 py-2 text-center border-b text-white">ชื่อ</th>
                  <th className="px-3 py-2 text-center border-b text-white">นามสกุล</th>
                  <th className="px-3 py-2 text-center border-b text-white">ชื่อเล่น</th>
                  <th className="px-3 py-2 text-center border-b text-white">แผนก</th>
                  <th className="px-3 py-2 text-center border-b text-white">ออฟฟิศ/สาขา</th>
                  <th className="px-3 py-2 text-center border-b text-white">เบอร์โทร</th>
                  <th className="px-3 py-2 text-center border-b text-white">สถานที่จัดส่ง</th>
                  <th className="px-3 py-2 text-center border-b text-white">ชื่ออุปกรณ์</th>
                  <th className="px-3 py-2 text-center border-b text-white">หมวดหมู่</th>
                  <th className="px-3 py-2 text-center border-b text-white">สถานะ</th>
                  <th className="px-3 py-2 text-center border-b text-white">สภาพ</th>
                  <th className="px-3 py-2 text-center border-b text-white">รายละเอียด</th>
                  <th className="px-3 py-2 text-center border-b text-white">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {ownedLoading ? (
                  <tr>
                    <td colSpan={14} className="px-3 py-6 text-left text-gray-500">
                      <RefreshCw className="inline-block w-4 h-4 mr-2 animate-spin text-gray-400" /> กำลังโหลดข้อมูล
                    </td>
                  </tr>
                ) : ownedItems.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="px-3 py-6 text-left text-gray-500">
                      ยังไม่มีอุปกรณ์ในความครอบครอง
                    </td>
                  </tr>
                ) : ownedItems.map((row, idx) => (
                  <tr key={idx} className={`hover:bg-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}>
                    <td className="px-3 py-2 text-center border-b">
                      <div className="text-gray-900">
                        {(() => {
                          const dateValue = (row as any)?.currentOwnership?.ownedSince || (row as any)?.sourceInfo?.dateAdded || (row as any)?.createdAt;
                          if (!dateValue) return '-';
                          const d = new Date(dateValue);
                          if (isNaN(d.getTime())) return '-';
                          return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Bangkok' });
                        })()}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center border-b">
                      <div className="text-gray-900">
                        {user?.userType === 'branch' 
                          ? (row.firstName || '-')
                          : (user?.firstName || '-')
                        }
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center border-b">
                      <div className="text-gray-900">
                        {user?.userType === 'branch' 
                          ? (row.lastName || '-')
                          : (user?.lastName || '-')
                        }
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center border-b">
                      <div className="text-gray-900">
                        {user?.userType === 'branch' 
                          ? (row.nickname || '-')
                          : (user?.nickname || '-')
                        }
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center border-b">
                      <div className="text-gray-900">
                        {user?.userType === 'branch' 
                          ? (row.department || '-')
                          : (user?.department || '-')
                        }
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center border-b">
                      <div className="text-gray-900">{user?.office || '-'}</div>
                    </td>
                    <td className="px-3 py-2 text-center border-b">
                      <div className="text-gray-900">
                        {user?.userType === 'branch' 
                          ? (row.phone || '-')
                          : (user?.phone || '-')
                        }
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center border-b">
                      <div className="text-gray-900">
                        {(row as any).deliveryLocation || '-'}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center border-b">
                      <div className="text-gray-900">{row.itemName}</div>
                    </td>
                    <td className="px-3 py-2 text-center border-b"><div className="text-gray-900">{getCategoryName(row.categoryId || (row as any).categoryId)}</div></td>
                    <td className="px-3 py-2 text-center border-b">
                      <div className="text-gray-900">
                        {row.statusId ? getStatusName(row.statusId) : ((row as any).statusName || '-')}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center border-b">
                      <div className="text-gray-900">
                        {row.conditionId ? getConditionName(row.conditionId) : ((row as any).conditionName || '-')}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center border-b">
                      <div className="text-gray-900">
                        {(() => {
                          const totalQuantity = 1;
                          const serialNumbers = row.serialNumber ? [row.serialNumber] : [];
                          const phoneNumbers = row.numberPhone ? [row.numberPhone] : [];
                          const isSimCard = row.categoryId === 'cat_sim_card';
                          
                          // ถ้ามีชิ้นเดียว
                          if (totalQuantity === 1) {
                            if (isSimCard && phoneNumbers.length > 0) {
                              // แสดงเบอร์โทรศัพท์สำหรับซิมการ์ด
                              return (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  {phoneNumbers[0]}
                                </span>
                              );
                            } else if (serialNumbers.length > 0) {
                              // แสดง Serial Number สำหรับอุปกรณ์ทั่วไป
                              return (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {serialNumbers[0]}
                                </span>
                              );
                            } else {
                              // ไม่มี SN หรือ Phone Number
                              return <span className="text-gray-500">1 ชิ้น (ทั่วไป)</span>;
                            }
                          }
                          
                          // ถ้ามีหลายชิ้น
                          const hasSerialItems = serialNumbers.length;
                          const hasPhoneItems = phoneNumbers.length;
                          const hasSpecialItems = hasSerialItems + hasPhoneItems; // รวม SN และ Phone Number
                          const hasNonSpecialItems = totalQuantity - hasSpecialItems;
                          
                          if (hasSpecialItems > 0 && hasNonSpecialItems > 0) {
                            // มีทั้งที่มี SN/Phone และไม่มี SN/Phone
                            return (
                              <button 
                                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                                onClick={() => {
                                  const detailDataObj = {
                                    itemName: row.itemName,
                                    categoryId: row.categoryId,
                                    categoryName: getCategoryName(row.categoryId || ''),
                                    hasSerialItems,
                                    hasPhoneItems,
                                    hasNonSpecialItems: hasNonSpecialItems,
                                    serialNumbers,
                                    phoneNumbers,
                                    totalQuantity
                                  };
                                  setDetailData(detailDataObj);
                                  setShowDetailModal(true);
                                }}
                              >
                                ดูรายละเอียด
                              </button>
                            );
                          } else if (hasSpecialItems > 0) {
                            // มีแต่ที่มี SN หรือ Phone Number
                            if (hasSpecialItems === 1) {
                              if (isSimCard && phoneNumbers.length > 0) {
                                return (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {phoneNumbers[0]}
                                  </span>
                                );
                              } else if (serialNumbers.length > 0) {
                                return (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {serialNumbers[0]}
                                  </span>
                                );
                              }
                            } else {
                              return (
                                <button 
                                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors cursor-pointer"
                                  onClick={() => {
                                    setDetailData({
                                      itemName: row.itemName,
                                      categoryId: row.categoryId,
                                      categoryName: getCategoryName(row.categoryId || ''),
                                      hasSerialItems,
                                      hasPhoneItems,
                                      hasNonSpecialItems: 0,
                                      serialNumbers,
                                      phoneNumbers,
                                      totalQuantity
                                    });
                                    setShowDetailModal(true);
                                  }}
                                >
                                  ดูรายละเอียด
                                </button>
                              );
                            }
                          } else {
                            // มีแต่ที่ไม่มี SN หรือ Phone Number
                            return <span className="text-gray-500">{totalQuantity} ชิ้น (ทั่วไป)</span>;
                          }
                        })()}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center border-b">
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        {/* ถ้ามี pending return ให้แสดง badge พร้อมปุ่มยกเลิก */}
                        {row.hasPendingReturn ? (
                          <>
                            <div className="px-3 py-1.5 text-xs font-medium text-white bg-orange-500 rounded-lg">
                              รออนุมัติคืน
                            </div>
                            <button
                              onClick={() => {
                                const itemId = row._id || (row as any).itemId;
                                
                                // ป้องกันการกดซ้ำ
                                if (cancelLoadingItems.has(itemId) || showCancelReturnModal) {
                                  return;
                                }
                                
                                // ตั้งค่า loading state ทันทีเมื่อกดปุ่ม
                                setCancelLoadingItems(prev => new Set(prev).add(itemId));
                                
                                // Simulate delay then open modal
                                setTimeout(() => {
                                  const mockReturnLogId = `return-log-${itemId}`;
                                  handleCancelReturn(mockReturnLogId, itemId, row.itemName);
                                }, 300);
                              }}
                              disabled={cancelLoadingItems.has(row._id || (row as any).itemId) || showCancelReturnModal}
                              className={`px-3 py-1 text-xs border rounded transition-all duration-200 flex items-center justify-center ${
                                cancelLoadingItems.has(row._id || (row as any).itemId) || showCancelReturnModal
                                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                  : 'text-red-600 hover:text-red-800 hover:bg-red-50 border-red-200'
                              }`}
                            >
                              {cancelLoadingItems.has(row._id || (row as any).itemId) ? (
                                <div className="flex items-center">
                                  <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  กำลังโหลด...
                                </div>
                              ) : (
                                'ยกเลิก'
                              )}
                            </button>
                          </>
                        ) : (
                          <>
                            
                            {/* Return Equipment button */}
                            <button
                              onClick={() => {
                                const itemId = (row._id || (row as any).itemId) as string;
                                
                                // Set loading state for this specific item
                                setReturnLoadingItems(prev => new Set(prev).add(itemId));
                                
                                // Build URL with personal info for branch users
                                const params = new URLSearchParams({
                                  id: itemId
                                });
                                
                                // เพิ่ม serialNumber หรือ numberPhone เพื่อล็อคค่าในหน้าคืน
                                if (row.serialNumber) {
                                  params.set('serialNumber', row.serialNumber);
                                }
                                if (row.numberPhone) {
                                  params.set('numberPhone', row.numberPhone);
                                }
                                
                                // For branch users, include personal info from the row
                                if (user?.userType === 'branch' && row.firstName) {
                                  params.set('firstName', row.firstName);
                                  params.set('lastName', row.lastName || '');
                                  params.set('nickname', row.nickname || '');
                                  params.set('department', row.department || '');
                                  params.set('phone', row.phone || '');
                                }
                                
                                // Navigate to equipment return page with all params
                                router.push(`/equipment-return?${params.toString()}`);
                                
                                // Reset loading state after a delay (in case navigation is slow)
                                // This will be cleared by useEffect cleanup when navigation completes
                                setTimeout(() => {
                                  setReturnLoadingItems(prev => {
                                    const newSet = new Set(prev);
                                    newSet.delete(itemId);
                                    return newSet;
                                  });
                                }, 3000); // Reset after 3 seconds as fallback
                              }}
                              disabled={returnLoadingItems.has(row._id || (row as any).itemId)}
                              className={`px-3 py-1 text-xs border rounded transition-all duration-200 ${
                                returnLoadingItems.has(row._id || (row as any).itemId)
                                  ? 'bg-orange-100 text-orange-400 border-orange-200 cursor-not-allowed'
                                  : 'text-orange-600 hover:text-orange-800 hover:bg-orange-50 border-orange-200'
                              }`}
                            >
                              {returnLoadingItems.has(row._id || (row as any).itemId) ? (
                                <svg className="animate-spin h-3 w-3 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                'คืน'
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Information Note */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-blue-900 mb-3">หมายเหตุ:</h4>
            
            {/* สถานที่จัดส่ง */}
            <div>
              <h5 className="text-sm font-semibold text-blue-900 mb-2">📍 สถานที่จัดส่ง</h5>
              <ul className="text-sm text-blue-800 space-y-1 ml-4">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>อุปกรณ์ที่ได้จาก<strong>การเบิกอุปกรณ์</strong> จะแสดงสถานที่จัดส่งที่กรอกไว้ตอนเบิก</span>
                </li>
              </ul>
            </div>
          </div>
        </div>


        {/* Detail Modal */}
        {showDetailModal && detailData && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border-0 flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">
                    รายละเอียด {detailData.itemName}
                  </h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
              
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  จำนวนทั้งหมด: <span className="font-medium text-gray-900">{detailData.totalQuantity} ชิ้น</span>
                </div>
                
                {/* แสดงหมวดหมู่ */}
                {detailData.categoryName && (
                  <div className="text-sm text-gray-600">
                    หมวดหมู่: <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {detailData.categoryName}
                    </span>
                  </div>
                )}
                
                {/* แสดงอุปกรณ์ที่ไม่มี SN/เบอร์ - ลำดับแรก */}
                {detailData.hasNonSpecialItems > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-900">
                      อุปกรณ์ที่ไม่มี SN/เบอร์: {detailData.hasNonSpecialItems} ชิ้น
                    </div>
                  </div>
                )}

                {/* แสดง Serial Numbers */}
                {detailData.hasSerialItems > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-blue-900 mb-2">
                      อุปกรณ์ที่มี SN: {detailData.hasSerialItems} ชิ้น
                    </div>
                    <div className="space-y-1">
                      {detailData.serialNumbers.map((sn: string, idx: number) => (
                        <div key={idx} className="text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded">
                          • {sn}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* แสดง Phone Numbers สำหรับซิมการ์ด */}
                {detailData.hasPhoneItems > 0 && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-green-900 mb-2">
                      เบอร์โทรศัพท์ (ซิมการ์ด): {detailData.hasPhoneItems} ชิ้น
                    </div>
                    <div className="space-y-1">
                      {detailData.phoneNumbers?.map((phone: string, idx: number) => (
                        <div key={idx} className="text-sm text-green-800 bg-green-100 px-2 py-1 rounded">
                          • {phone}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              
              {/* Footer */}
              <div className="flex justify-end p-6 border-t border-gray-200 bg-white">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  ปิด
                </button>
              </div>
              </div>
            </div>
          </div>
        )}

        {/* Simple Error Modal */}
        {/* Cancel Return Modal */}
        <CancelReturnModal
          isOpen={showCancelReturnModal}
          onClose={closeCancelReturnModal}
          onConfirm={confirmCancelReturn}
          equipmentName={cancelReturnData?.equipmentName}
          isLoading={cancelReturnLoading}
        />

        <SimpleErrorModal
          isOpen={showSimpleError}
          onClose={() => setShowSimpleError(false)}
          message={simpleErrorMessage}
        />
      </div>
    </Layout>
    </AuthGuard>
  );
}
