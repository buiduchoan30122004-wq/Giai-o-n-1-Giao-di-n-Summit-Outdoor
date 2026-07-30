import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { queryAll, queryRun } from '../../../../lib/db';

export async function GET(req: Request) {
  return handleSendEmails();
}

export async function POST(req: Request) {
  return handleSendEmails();
}

async function handleSendEmails() {
  try {
    // 1. Đọc Resend API Key
    const configPath = path.join(process.cwd(), 'resend_config.txt');
    if (!fs.existsSync(configPath)) {
      return NextResponse.json({ success: false, error: 'Chưa có file resend_config.txt cấu hình API Key.' }, { status: 400 });
    }
    const resendApiKey = fs.readFileSync(configPath, 'utf8').trim();
    if (!resendApiKey) {
      return NextResponse.json({ success: false, error: 'API Key trống.' }, { status: 400 });
    }

    // 2. Lấy danh sách email đến hạn gửi (sent_status = 0 và scheduled_send_time <= thời gian hiện tại)
    const nowIso = new Date().toISOString();
    const pendingEmails = await queryAll<any>(
      `SELECT * FROM email_queue WHERE sent_status = 0 AND scheduled_send_time <= ?`,
      [nowIso]
    );

    if (pendingEmails.length === 0) {
      return NextResponse.json({ success: true, message: 'Không có email nào đang chờ gửi.' });
    }

    console.log(`[Email Cron] Tìm thấy ${pendingEmails.length} email đang chờ gửi.`);
    const results = [];

    // 3. Gửi từng email và cập nhật trạng thái
    for (const item of pendingEmails) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Summit Outdoor <no-reply@summitoutdoor.io.vn>',
            to: [item.email],
            subject: item.subject,
            html: item.html,
          }),
        });

        if (resendResponse.ok) {
          // Gửi thành công -> UPDATE status = 1
          await queryRun(
            `UPDATE email_queue SET sent_status = 1 WHERE id = ?`,
            [item.id]
          );
          results.push({ id: item.id, email: item.email, status: 'sent' });
          console.log(`[Email Cron] Đã gửi thành công email ID: ${item.id} tới ${item.email}`);
        } else {
          const errorText = await resendResponse.text();
          console.error(`[Email Cron Error] Gửi email ID: ${item.id} thất bại: ${errorText}`);
          
          // Gửi thất bại -> UPDATE status = -1
          await queryRun(
            `UPDATE email_queue SET sent_status = -1 WHERE id = ?`,
            [item.id]
          );
          results.push({ id: item.id, email: item.email, status: 'failed', error: errorText });
        }
      } catch (err: any) {
        console.error(`[Email Cron Error] Lỗi hệ thống khi gửi email ID: ${item.id}:`, err.message);
        results.push({ id: item.id, email: item.email, status: 'error', error: err.message });
      }
    }

    return NextResponse.json({ success: true, sentCount: results.filter(r => r.status === 'sent').length, details: results });

  } catch (error: any) {
    console.error('[Email Cron Fatal Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
