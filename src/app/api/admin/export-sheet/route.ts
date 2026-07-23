import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { scriptUrl, title, headers, rows } = await req.json();

    if (!scriptUrl) {
      return NextResponse.json({ success: false, error: 'Thiếu Google Apps Script Web App URL' }, { status: 400 });
    }

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, headers, rows }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error forwarding to Apps Script:', error);
    return NextResponse.json({ success: false, error: error.message || 'Lỗi server khi chuyển tiếp đến Google Sheets' }, { status: 500 });
  }
}
