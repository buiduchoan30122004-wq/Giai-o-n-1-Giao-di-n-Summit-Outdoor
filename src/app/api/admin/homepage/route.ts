import { NextRequest, NextResponse } from 'next/server';
import { queryAll, queryRun } from '@/lib/db';

export async function GET() {
  try {
    const configs = await queryAll('SELECT * FROM homepage_configs ORDER BY display_order ASC, id ASC');
    return NextResponse.json({ success: true, configs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { layout_key, layout_name, is_active, display_order, content_value } = await req.json();
    
    if (!layout_key || !layout_name) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }
    
    const result = await queryRun(
      `INSERT INTO homepage_configs (
        layout_key, layout_name, is_active, display_order, content_value, created_at
      ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        layout_key, 
        layout_name, 
        is_active === undefined ? 1 : is_active, 
        display_order || 0, 
        content_value || ''
      ]
    );
    return NextResponse.json({ success: true, id: result.lastID });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, layout_key, layout_name, is_active, display_order, content_value } = await req.json();
    
    if (!id || !layout_key || !layout_name) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }
    
    await queryRun(
      `UPDATE homepage_configs SET 
        layout_key = ?, layout_name = ?, is_active = ?, display_order = ?, content_value = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        layout_key, 
        layout_name, 
        is_active === undefined ? 1 : is_active, 
        display_order || 0, 
        content_value || '',
        id
      ]
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
      return NextResponse.json({ success: false, error: 'Thiếu ID cấu hình' }, { status: 400 });
    }
    await queryRun('DELETE FROM homepage_configs WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
