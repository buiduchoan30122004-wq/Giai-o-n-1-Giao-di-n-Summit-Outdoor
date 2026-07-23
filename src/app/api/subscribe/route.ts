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

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Subscribe API Route Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
