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

    const responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch (e) {
      console.error('Failed to parse Apps Script response as JSON. Response:', responseText);
      return NextResponse.json({ 
        success: false, 
        error: 'Google Apps Script trả về trang đăng nhập HTML thay vì định dạng dữ liệu JSON. Vui lòng kiểm tra lại cấu hình Deploy Web App trong Google Sheets (phải chọn "Who has access: Anyone" chứ không phải "Anyone with a Google account" hay "Only myself").' 
      });
    }
  } catch (error: any) {
    console.error('Error forwarding to Apps Script:', error);
    return NextResponse.json({ success: false, error: error.message || 'Lỗi server khi kết nối với Google Sheets' }, { status: 500 });
  }
}
