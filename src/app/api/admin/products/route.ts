import { NextRequest, NextResponse } from 'next/server';
import { queryAll, queryRun } from '@/lib/db';

export async function GET() {
  try {
    const products = await queryAll('SELECT * FROM products ORDER BY id DESC');
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { brand, name, price, image_url, description, stock } = await req.json();
    if (!brand || !name || price === undefined || stock === undefined) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }
    const result = await queryRun(
      `INSERT INTO products (brand, name, price, image_url, description, stock) VALUES (?, ?, ?, ?, ?, ?)`,
      [brand, name, price, image_url || '', description || '', stock]
    );
    return NextResponse.json({ success: true, id: result.lastID });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, brand, name, price, image_url, description, stock } = await req.json();
    if (!id || !brand || !name || price === undefined || stock === undefined) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }
    await queryRun(
      `UPDATE products SET brand = ?, name = ?, price = ?, image_url = ?, description = ?, stock = ? WHERE id = ?`,
      [brand, name, price, image_url || '', description || '', stock, id]
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
      return NextResponse.json({ success: false, error: 'Thiếu ID sản phẩm' }, { status: 400 });
    }
    await queryRun('DELETE FROM products WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
