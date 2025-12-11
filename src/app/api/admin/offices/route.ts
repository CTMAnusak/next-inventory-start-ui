import { NextResponse } from 'next/server';
import { mockOffices } from '@/lib/mockup-data';

// GET /api/admin/offices - ดึงข้อมูล offices ทั้งหมด
export async function GET() {
  try {
    // ❌ ลบ delay ออก เพราะทำให้โหลดช้า
    // await new Promise(resolve => setTimeout(resolve, 200));

    // แปลงข้อมูล mockOffices ให้อยู่ในรูปแบบที่ตรงกับที่ frontend ต้องการ
    const offices = mockOffices
      .filter(office => !office.isDeleted)
      .map(office => ({
        office_id: office._id,
        name: office.name,
        _id: office._id,
        isDeleted: office.isDeleted,
      }));

    return NextResponse.json(offices);
  } catch (error) {
    console.error('Error fetching offices:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล offices' },
      { status: 500 }
    );
  }
}

// POST /api/admin/offices - เพิ่ม office ใหม่ (mock)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // จำลองการสร้าง office
    const newOffice = {
      _id: `office-${Date.now()}`,
      office_id: `office-${Date.now()}`,
      name: body.name,
      isDeleted: false,
    };

    return NextResponse.json(newOffice, { status: 201 });
  } catch (error) {
    console.error('Error creating office:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้าง office' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/offices - อัพเดท office (mock)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // จำลองการอัพเดท office
    return NextResponse.json({ 
      success: true, 
      message: 'อัพเดทข้อมูล office สำเร็จ',
      office: body 
    });
  } catch (error) {
    console.error('Error updating office:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพเดท office' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/offices - ลบ office (mock)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const officeId = searchParams.get('id');
    
    if (!officeId) {
      return NextResponse.json(
        { error: 'ไม่พบ office id' },
        { status: 400 }
      );
    }

    // จำลองการลบ office
    return NextResponse.json({ 
      success: true, 
      message: 'ลบ office สำเร็จ' 
    });
  } catch (error) {
    console.error('Error deleting office:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบ office' },
      { status: 500 }
    );
  }
}

