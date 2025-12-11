import { NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mockup-data';

// GET /api/admin/users - ดึงข้อมูล users ทั้งหมด
export async function GET() {
  try {
    // จำลองการ delay ของ API
    await new Promise(resolve => setTimeout(resolve, 300));

    // แปลงข้อมูล mockUsers ให้อยู่ในรูปแบบที่ตรงกับ User interface
    const users = mockUsers.map(user => ({
      _id: user.id,
      user_id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      nickname: user.nickname,
      department: user.department,
      office: user.office,
      officeId: user.officeId,
      officeName: user.officeName,
      phone: user.phone,
      email: user.email,
      userType: user.userType,
      isMainAdmin: user.isMainAdmin,
      userRole: user.userRole,
      registrationMethod: 'manual' as const,
      isApproved: true, // ข้อมูล mock ทั้งหมดถือว่า approved แล้ว
      profileCompleted: true,
      pendingDeletion: user.pendingDeletion || false,
      createdAt: new Date().toISOString(),
    }));

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - เพิ่ม user ใหม่ (mock)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // จำลองการสร้าง user
    const newUser = {
      _id: `user-${Date.now()}`,
      user_id: `user-${Date.now()}`,
      ...body,
      isApproved: true,
      profileCompleted: true,
      registrationMethod: 'manual' as const,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users - อัพเดท user (mock)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // จำลองการอัพเดท user
    return NextResponse.json({ 
      success: true, 
      message: 'อัพเดทข้อมูลผู้ใช้สำเร็จ',
      user: body 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพเดทผู้ใช้' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users - ลบ user (mock)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'ไม่พบ user id' },
        { status: 400 }
      );
    }

    // จำลองการลบ user
    return NextResponse.json({ 
      success: true, 
      message: 'ลบผู้ใช้สำเร็จ' 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบผู้ใช้' },
      { status: 500 }
    );
  }
}

