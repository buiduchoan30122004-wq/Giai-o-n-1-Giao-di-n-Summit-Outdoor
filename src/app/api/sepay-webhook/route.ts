import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to store payments data
const paymentsFilePath = path.join(process.cwd(), 'src/data/payments.json');

// Ensure payments.json exists
function initPaymentsFile() {
  const dirPath = path.dirname(paymentsFilePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  if (!fs.existsSync(paymentsFilePath)) {
    fs.writeFileSync(paymentsFilePath, JSON.stringify({}), 'utf-8');
  }
}

export async function POST(request: NextRequest) {
  try {
    initPaymentsFile();

    // 1. Authenticate the request (Optional but recommended by Sepay)
    const authHeader = request.headers.get('authorization');
    const secretApiKey = process.env.SEPAY_WEBHOOK_API_KEY || 'summit_sepay_secret';
    
    if (authHeader && authHeader !== `Apikey ${secretApiKey}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized webhook request' },
        { status: 401 }
      );
    }

    // 2. Parse the Sepay JSON payload
    const payload = await request.json();
    
    // Validate required fields
    if (!payload || !payload.id || !payload.content || payload.transferType !== 'in') {
      return NextResponse.json(
        { success: false, message: 'Invalid payload or transfer type' },
        { status: 400 }
      );
    }

    const { id, content, transferAmount, transactionDate } = payload;

    // 3. Extract order code (e.g. SUMMITxxxx) using Regex
    const orderCodeMatch = content.match(/SUMMIT\d{4}/i);
    if (!orderCodeMatch) {
      return NextResponse.json(
        { success: false, message: 'Order code (SUMMITxxxx) not found in transaction content' },
        { status: 200 } // Return 200 so Sepay doesn't keep retrying for non-store transactions
      );
    }

    const orderCode = orderCodeMatch[0].toUpperCase();

    // 4. Read existing payments to check duplicates
    const fileContent = fs.readFileSync(paymentsFilePath, 'utf-8');
    const payments = JSON.parse(fileContent);

    // Check if this transaction ID was already processed
    const isDuplicate = Object.values(payments).some((p: any) => p.transactionId === id);
    if (isDuplicate) {
      return NextResponse.json(
        { success: true, message: 'Transaction already processed' },
        { status: 200 }
      );
    }

    // 5. Store the payment confirmation
    payments[orderCode] = {
      paid: true,
      transactionId: id,
      amount: transferAmount,
      date: transactionDate,
      processedAt: new Date().toISOString()
    };

    fs.writeFileSync(paymentsFilePath, JSON.stringify(payments, null, 2), 'utf-8');

    // 6. Update order status and record payment details in SQLite CRM database if queryRun is available
    try {
      const { queryRun } = await import('@/lib/db');
      await queryRun(
        "UPDATE orders SET status = 'confirmed', transaction_id = ?, payment_amount = ?, payment_date = ? WHERE order_code = ?",
        [id, transferAmount, transactionDate, orderCode]
      );
      
      // Gửi email xác nhận đặt hàng & email cảm ơn mua hàng qua Resend
      try {
        const { sendOrderConfirmationByCode, sendThankYouEmailByCode } = await import('@/lib/email');
        await sendOrderConfirmationByCode(orderCode);
        await sendThankYouEmailByCode(orderCode);
      } catch (mailError) {
        console.error('Failed to send order confirmation/thank you email via sepay webhook:', mailError);
      }

      // Thông báo nhận tiền qua Telegram
      try {
        const { sendTelegramNotification } = await import('@/lib/telegram');
        const message = `<b>💰 ĐÃ NHẬN THANH TOÁN TỰ ĐỘNG</b>\n\n` +
          `• <b>Mã đơn:</b> #${orderCode}\n` +
          `• <b>Số tiền nhận:</b> <b>${transferAmount.toLocaleString('vi-VN')} đ</b>\n` +
          `• <b>Mã GD Ngân hàng:</b> ${id}\n` +
          `• <b>Ngày nhận:</b> ${transactionDate}\n\n` +
          `✅ Hệ thống đã tự động kích hoạt gửi Email xác nhận & Email cảm ơn qua Resend cho khách hàng!`;
        
        await sendTelegramNotification(message);
      } catch (telegramError) {
        console.error('Failed to send Telegram payment confirmation notification:', telegramError);
      }
    } catch (dbError) {
      console.error('Failed to update order status in local SQLite database:', dbError);
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error('Error handling Sepay Webhook:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
