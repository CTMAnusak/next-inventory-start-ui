/**
 * Mockup Data for UI-only mode
 * ข้อมูลตัวอย่างสำหรับแสดงผล UI โดยไม่ต้องเชื่อมต่อฐานข้อมูล
 * 
 * @security-ignore: This file contains mock/test data only, not real secrets
 * กรุณาเพิกเฉยต่อการแจ้งเตือน secret scanning - ไฟล์นี้เป็นข้อมูลจำลองเท่านั้น
 */

// Mockup User Data
export const mockUser = {
  id: 'mock-user-1',
  email: 'user@example.com',
  password: 'MOCK_PASSWORD_123456', // รหัสผ่านสำหรับ user ธรรมดา (MOCK DATA)
  firstName: 'สมชาย',
  lastName: 'ใจดี',
  nickname: 'ชาย',
  department: 'IT',
  phone: '0812345678',
  userType: 'individual' as const,
  office: 'สำนักงานใหญ่',
  officeId: 'office-1',
  officeName: 'สำนักงานใหญ่',
  isMainAdmin: false,
  userRole: 'user' as const,
  pendingDeletion: false,
};

export const mockAdminUser = {
  ...mockUser,
  id: 'mock-admin-1',
  email: 'admin@example.com',
  password: 'admin123', // รหัสผ่านสำหรับ admin
  firstName: 'ผู้ดูแล',
  lastName: 'ระบบ',
  isMainAdmin: true,
  userRole: 'admin' as const,
};

// Mockup Category Configs
export const mockCategoryConfigs = [
  { id: 'cat_computer', name: 'คอมพิวเตอร์', isSpecial: false, isSystemCategory: false, order: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'cat_mouse', name: 'เมาส์', isSpecial: false, isSystemCategory: false, order: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: 'cat_keyboard', name: 'คีย์บอร์ด', isSpecial: false, isSystemCategory: false, order: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: 'cat_sim_card', name: 'ซิมการ์ด', isSpecial: true, isSystemCategory: false, order: 4, createdAt: new Date(), updatedAt: new Date() },
];

// Mockup Status Configs
export const mockStatusConfigs = [
  { id: 'status_available', name: 'มี', order: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'status_used', name: 'ใช้งาน', order: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: 'status_maintenance', name: 'ซ่อมบำรุง', order: 3, createdAt: new Date(), updatedAt: new Date() },
];

// Mockup Condition Configs
export const mockConditionConfigs = [
  { id: 'cond_working', name: 'ใช้งานได้', isSystemConfig: false, order: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'cond_damaged', name: 'ชำรุด', isSystemConfig: false, order: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: 'cond_repairing', name: 'กำลังซ่อม', isSystemConfig: false, order: 3, createdAt: new Date(), updatedAt: new Date() },
];

// Mockup Owned Equipment
export const mockOwnedItems = [
  {
    _id: 'item-1',
    itemName: 'โน๊ตบุ๊ค Dell',
    categoryId: 'cat_computer',
    serialNumber: 'SN123456',
    quantity: 1,
    statusId: 'status_used',
    conditionId: 'cond_working',
    firstName: 'สมชาย',
    lastName: 'ใจดี',
    nickname: 'ชาย',
    department: 'IT',
    phone: '0812345678',
    notes: 'อุปกรณ์ส่วนตัว',
    source: 'user-owned',
    createdAt: new Date('2024-01-15'),
    currentOwnership: { ownedSince: new Date('2024-01-15') },
  },
  {
    _id: 'item-2',
    itemName: 'เมาส์ Logitech',
    categoryId: 'cat_mouse',
    serialNumber: 'SN789012',
    quantity: 1,
    statusId: 'status_used',
    conditionId: 'cond_working',
    firstName: 'สมชาย',
    lastName: 'ใจดี',
    nickname: 'ชาย',
    department: 'IT',
    phone: '0812345678',
    notes: '',
    source: 'user-owned',
    createdAt: new Date('2024-02-01'),
    currentOwnership: { ownedSince: new Date('2024-02-01') },
  },
];

// Mockup Inventory Items
export const mockInventoryItems = [
  {
    _id: 'inv-1',
    itemName: 'โน๊ตบุ๊ค Dell',
    categoryId: 'cat_computer',
    quantity: 10,
    totalQuantity: 10,
    availableQuantity: 5,
    userOwnedQuantity: 5,
    status: 'มี',
    statusId: 'status_available',
    conditionId: 'cond_working',
    serialNumbers: [],
    dateAdded: '2024-01-15',
  },
  {
    _id: 'inv-2',
    itemName: 'เมาส์ Logitech',
    categoryId: 'cat_mouse',
    quantity: 20,
    totalQuantity: 20,
    availableQuantity: 15,
    userOwnedQuantity: 5,
    status: 'มี',
    statusId: 'status_available',
    conditionId: 'cond_working',
    serialNumbers: [],
    dateAdded: '2024-02-01',
  },
];

// Mockup Equipment Requests
export const mockEquipmentRequests = [
  {
    _id: 'req-1',
    itemName: 'โน๊ตบุ๊ค Dell',
    categoryId: 'cat_computer',
    quantity: 1,
    status: 'pending',
    requestedBy: 'สมชาย ใจดี',
    requestedAt: new Date('2024-03-01'),
  },
];

// Mockup Available Items for Equipment Request
export const mockAvailableItems = [
  {
    itemMasterId: 'inv-1',
    itemName: 'โน๊ตบุ๊ค Dell',
    categoryId: 'cat_computer',
    availableQuantity: 5,
    isAvailable: true,
    hasPendingRequest: false,
    pendingQuantity: 0,
    totalPendingQuantity: 0,
    availableAfterPending: 5,
    pendingRequestId: null,
    sampleItems: [{ serialNumber: 'SN123456' }],
  },
  {
    itemMasterId: 'inv-2',
    itemName: 'เมาส์ Logitech',
    categoryId: 'cat_mouse',
    availableQuantity: 15,
    isAvailable: true,
    hasPendingRequest: false,
    pendingQuantity: 0,
    totalPendingQuantity: 0,
    availableAfterPending: 15,
    pendingRequestId: null,
    sampleItems: [{ serialNumber: 'SN789012' }],
  },
];

// Mockup Serial Numbers
export const mockSerialNumbers = {
  'โน๊ตบุ๊ค Dell': ['SN123456', 'SN123457', 'SN123458'],
  'เมาส์ Logitech': ['SN789012', 'SN789013'],
  'คีย์บอร์ด Logitech': ['SN345678'],
};

// Mockup IT Reports
export const mockITReports = [
  {
    _id: 'it-1',
    title: 'อินเทอร์เน็ตช้า',
    description: 'อินเทอร์เน็ตช้ามาก',
    status: 'pending',
    priority: 'medium',
    reportedBy: 'สมชาย ใจดี',
    department: 'IT',
    reportedAt: new Date('2024-03-01'),
    issueType: 'network',
    assignedTo: null,
  },
  {
    _id: 'it-2',
    title: 'คอมพิวเตอร์เปิดไม่ติด',
    description: 'จอดำ ไฟไม่ติด',
    status: 'in-progress',
    priority: 'high',
    reportedBy: 'สมหญิง ใจงาม',
    department: 'Sales',
    reportedAt: new Date('2024-03-02'),
    issueType: 'hardware',
    assignedTo: 'ช่างไอที',
  },
  {
    _id: 'it-3',
    title: 'ปริ้นเตอร์ไม่พิมพ์',
    description: 'กดปริ้นแล้วไม่ออก',
    status: 'resolved',
    priority: 'low',
    reportedBy: 'สมพงษ์ ดีเด่น',
    department: 'HR',
    reportedAt: new Date('2024-02-28'),
    issueType: 'printer',
    assignedTo: 'ช่างไอที',
    resolvedAt: new Date('2024-03-01'),
  },
];

// Mockup Equipment Tracking
export const mockEquipmentTracking = [
  {
    _id: 'track-1',
    itemName: 'โน๊ตบุ๊ค Dell Latitude',
    serialNumber: 'SN123456',
    categoryId: 'cat_computer',
    status: 'in-use',
    currentUser: 'สมชาย ใจดี',
    department: 'IT',
    borrowedAt: new Date('2024-01-15'),
    dueDate: new Date('2024-12-31'),
  },
  {
    _id: 'track-2',
    itemName: 'เมาส์ Logitech',
    serialNumber: 'SN789012',
    categoryId: 'cat_mouse',
    status: 'in-use',
    currentUser: 'สมหญิง ใจงาม',
    department: 'Sales',
    borrowedAt: new Date('2024-02-01'),
    dueDate: null,
  },
];

// Mockup Users List (for admin)
export const mockUsers = [
  mockUser,
  mockAdminUser,
  {
    id: 'user-3',
    email: 'somying@example.com',
    password: '123456',
    firstName: 'สมหญิง',
    lastName: 'ใจงาม',
    nickname: 'หญิง',
    department: 'Sales',
    phone: '0823456789',
    userType: 'individual' as const,
    office: 'สำนักงานใหญ่',
    officeId: 'office-1',
    officeName: 'สำนักงานใหญ่',
    isMainAdmin: false,
    userRole: 'user' as const,
    pendingDeletion: false,
  },
  {
    id: 'user-4',
    email: 'sompong@example.com',
    password: '123456',
    firstName: 'สมพงษ์',
    lastName: 'ดีเด่น',
    nickname: 'พงษ์',
    department: 'HR',
    phone: '0834567890',
    userType: 'individual' as const,
    office: 'สำนักงานสาขา 1',
    officeId: 'office-2',
    officeName: 'สำนักงานสาขา 1',
    isMainAdmin: false,
    userRole: 'user' as const,
    pendingDeletion: false,
  },
];

// Mockup Offices
export const mockOffices = [
  { _id: 'office-1', name: 'สำนักงานใหญ่', isDeleted: false },
  { _id: 'office-2', name: 'สำนักงานสาขา 1', isDeleted: false },
  { _id: 'office-3', name: 'สำนักงานสาขา 2', isDeleted: false },
];

// Mockup Dashboard Stats
export const mockDashboardStats = {
  totalItems: 150,
  availableItems: 85,
  inUseItems: 50,
  maintenanceItems: 15,
  pendingRequests: 8,
  activeIssues: 12,
  resolvedToday: 5,
};

// Mockup Equipment Reports
export const mockEquipmentReports = [
  {
    _id: 'report-1',
    itemName: 'โน๊ตบุ๊ค Dell',
    categoryId: 'cat_computer',
    totalQuantity: 50,
    inUse: 35,
    available: 10,
    maintenance: 5,
  },
  {
    _id: 'report-2',
    itemName: 'เมาส์ Logitech',
    categoryId: 'cat_mouse',
    totalQuantity: 100,
    inUse: 75,
    available: 20,
    maintenance: 5,
  },
];

// Mockup Transfer Logs
export const mockTransferLogs = [
  {
    _id: 'transfer-1',
    itemName: 'โน๊ตบุ๊ค Dell',
    fromUser: 'สมชาย ใจดี',
    toUser: 'สมหญิง ใจงาม',
    transferDate: new Date('2024-02-15'),
    reason: 'โอนให้แผนก Sales',
    status: 'completed',
  },
];

// Mockup Return Logs
export const mockReturnLogs = [
  {
    _id: 'return-1',
    itemName: 'โน๊ตบุ๊ค Dell',
    serialNumber: 'SN123456',
    returnedBy: 'สมชาย ใจดี',
    returnDate: new Date('2024-03-01'),
    condition: 'ใช้งานได้',
    notes: 'คืนตามกำหนด',
  },
];

// Mockup Pending Summary
export const mockPendingSummary = [
  {
    _id: 'pending-1',
    requestId: 'req-1',
    itemName: 'โน๊ตบุ๊ค Dell',
    requestedBy: 'สมชาย ใจดี',
    department: 'IT',
    quantity: 1,
    requestDate: new Date('2024-03-01'),
    status: 'pending',
  },
  {
    _id: 'pending-2',
    requestId: 'req-2',
    itemName: 'เมาส์ Logitech',
    requestedBy: 'สมหญิง ใจงาม',
    department: 'Sales',
    quantity: 2,
    requestDate: new Date('2024-03-02'),
    status: 'pending',
  },
];

// Helper function to simulate API delay
export const simulateApiDelay = (ms: number = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Helper function to simulate API response
export const mockApiResponse = <T>(data: T, delay: number = 500): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay);
  });
};

