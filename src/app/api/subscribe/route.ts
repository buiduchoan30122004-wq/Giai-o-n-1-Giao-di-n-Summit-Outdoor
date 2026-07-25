import { NextRequest, NextResponse } from 'next/server';
import { queryGet, queryRun } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = body.name || body.fullName || '';
    const email = body.email || '';
    const phone = body.phone || '';
    const preferred_brand = body.preferred_brand || body.favoriteBrand || '';
    const experience_level = body.experience_level || body.experienceLevel || '';
    const interests = body.interests || '';
    const source = body.source || '';
    const chatbot_data = body.chatbot_data || null;
    
    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Thiếu tên hoặc email khách hàng' }, { status: 400 });
    }

    // Check if customer email already exists
    const existing: any = await queryGet('SELECT id, interests FROM customers WHERE email = ?', [email]);
    
    if (existing) {
      // Append new interests if not already present
      let updatedInterests = existing.interests || '';
      if (interests) {
        if (updatedInterests && !updatedInterests.includes(interests)) {
          updatedInterests = `${updatedInterests} | ${interests}`;
        } else if (!updatedInterests) {
          updatedInterests = interests;
        }
      }

      // Update existing customer info
      await queryRun(
        `UPDATE customers SET name = ?, phone = ?, preferred_brand = ?, experience_level = ?, interests = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [
          name,
          phone || '',
          preferred_brand || '',
          experience_level || '',
          updatedInterests,
          existing.id
        ]
      );
    } else {
      // Insert new subscriber
      await queryRun(
        `INSERT INTO customers (name, email, phone, preferred_brand, experience_level, interests) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          name,
          email,
          phone || '',
          preferred_brand || '',
          experience_level || '',
          interests || ''
        ]
      );
    }

    // Dọn dẹp các email cũ chưa gửi trong hàng đợi cho email này (nếu có)
    await queryRun('DELETE FROM email_queue WHERE email = ? AND sent = 0', [email]);

    // Kiểm tra xem email có chứa chữ "test" hay không
    const isTest = email.toLowerCase().includes('test');

    if (isTest) {
      // Gửi MỘT LÚC cả 3 email ngay lập tức để test hệ thống
      const { sendSequenceEmail } = await import('@/lib/email');
      await sendSequenceEmail(email, name, 1);
      await sendSequenceEmail(email, name, 2);
      await sendSequenceEmail(email, name, 3);
    } else {
      // Gửi Email 1 ngay lập tức
      await sendWelcomeEmail(email, name);

      // Lên lịch gửi Email 2 sau đúng 2 ngày
      await queryRun(
        "INSERT INTO email_queue (email, name, email_type, scheduled_time) VALUES (?, ?, ?, datetime('now', '+2 days'))",
        [email, name, 2]
      );

      // Lên lịch gửi Email 3 sau đúng 3 ngày (đúng 1 ngày sau Email 2)
      await queryRun(
        "INSERT INTO email_queue (email, name, email_type, scheduled_time) VALUES (?, ?, ?, datetime('now', '+3 days'))",
        [email, name, 3]
      );
    }

    // Gửi thông báo đăng ký mới qua Telegram
    try {
      const { sendTelegramNotification } = await import('@/lib/telegram');
      
      let telegramMessage = '';
      if (source === 'chatbot_recommendation' && chatbot_data) {
        telegramMessage = `<b>🤖 KHÁCH ĐIỀN FORM TƯ VẤN CHATBOT 🤖</b>\n\n` +
          `<b>• Họ tên:</b> ${name}\n` +
          `<b>• Email:</b> ${email}\n` +
          `<b>• Số điện thoại:</b> ${phone || 'Chưa cung cấp'}\n` +
          `<b>• Sản phẩm tìm kiếm:</b> ${chatbot_data.product_type || 'Chưa chọn'}\n` +
          `<b>• Cự ly chạy:</b> ${chatbot_data.distance || 'Chưa chọn'}\n` +
          `<b>• Địa hình:</b> ${chatbot_data.terrain || 'Chưa chọn'}\n` +
          `<b>• Ưu tiên:</b> ${chatbot_data.priority || 'Chưa chọn'}\n` +
          `<b>• Size giày:</b> ${chatbot_data.shoe_size || 'Chưa chọn'}\n` +
          `<b>• Thương hiệu hiện tại:</b> ${chatbot_data.current_brand || 'Chưa chọn'}\n` +
          `<b>• Ngân sách:</b> ${chatbot_data.budget || 'Chưa chọn'}\n` +
          `<b>• Vấn đề chân:</b> ${chatbot_data.foot_issue && chatbot_data.foot_issue.length > 0 ? chatbot_data.foot_issue.join(', ') : 'Không có'}`;
      } else {
        telegramMessage = `<b>🔔 KHÁCH ĐĂNG KÝ TƯ VẤN MỚI 🔔</b>\n\n` +
          `<b>• Họ tên:</b> ${name}\n` +
          `<b>• Email:</b> ${email}\n` +
          `<b>• Số điện thoại:</b> ${phone || 'Chưa cung cấp'}\n` +
          `<b>• Thương hiệu yêu thích:</b> ${preferred_brand || 'Chưa cung cấp'}\n` +
          `<b>• Kinh nghiệm:</b> ${experience_level || 'Chưa cung cấp'}\n` +
          `<b>• Quan tâm:</b> ${interests || 'Chưa cung cấp'}`;
      }
      
      await sendTelegramNotification(telegramMessage);
    } catch (telegramError) {
      console.error('Failed to send Telegram subscription notification:', telegramError);
    }

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Subscribe API Route Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
