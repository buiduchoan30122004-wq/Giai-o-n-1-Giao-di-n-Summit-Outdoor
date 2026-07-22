import { NextRequest, NextResponse } from 'next/server';
import { queryAll, queryRun } from '@/lib/db';

export async function GET() {
  try {
    const customers = await queryAll('SELECT * FROM customers ORDER BY id DESC');
    return NextResponse.json({ success: true, customers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, preferred_brand, experience_level, interests } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Thiếu tên hoặc email khách hàng' }, { status: 400 });
    }
    const result = await queryRun(
      `INSERT INTO customers (name, email, phone, preferred_brand, experience_level, interests) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, phone || '', preferred_brand || '', experience_level || '', interests || '']
    );
    return NextResponse.json({ success: true, id: result.lastID });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name, email, phone, preferred_brand, experience_level, interests } = await req.json();
    if (!id || !name || !email) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }
    await queryRun(
      `UPDATE customers SET name = ?, email = ?, phone = ?, preferred_brand = ?, experience_level = ?, interests = ? WHERE id = ?`,
      [name, email, phone || '', preferred_brand || '', experience_level || '', interests || '', id]
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu ID khách hàng' }, { status: 400 });
    }
    await queryRun('DELETE FROM customers WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
