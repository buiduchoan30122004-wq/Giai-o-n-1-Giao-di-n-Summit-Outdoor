import { Resend } from 'resend';
import { queryAll } from './db';

// Khởi tạo Resend instance an toàn
let resend: Resend | null = null;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  } else {
    console.warn('RESEND_API_KEY is not defined in environment variables. Email functions will be skipped.');
  }
} catch (e) {
  console.error('Failed to initialize Resend SDK:', e);
}

// Domain gửi mặc định cho môi trường test của Resend.
// Khi đã xác thực domain riêng (ví dụ: summitoutdoor.io.vn), bạn hãy đổi sang email của domain đó.
const FROM_EMAIL = 'Summit Outdoor <onboarding@resend.dev>';

/**
 * Gửi email chào mừng khi đăng ký nhận tin bản tin / tư vấn (Newsletter)
 */
export async function sendWelcomeEmail(toEmail: string, fullName: string) {
  if (!resend) {
    console.warn('Skipping sendWelcomeEmail: Resend SDK is not initialized.');
    return { success: false, error: 'Resend SDK is not initialized' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [toEmail],
      subject: 'Chào mừng bạn đến với Summit Outdoor! 🏔️',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #c2410c; text-align: center;">Chào mừng bạn đến với Summit Outdoor!</h2>
          <p>Xin chào <strong>${fullName}</strong>,</p>
          <p>Cảm ơn bạn đã đăng ký nhận bản tin tư vấn từ Summit Outdoor - cửa hàng chuyên đồ chạy trail và leo núi chuyên nghiệp.</p>
          <p>Từ nay, bạn sẽ là người đầu tiên nhận được:</p>
          <ul>
            <li>Các cẩm nang chạy trail và kỹ thuật leo núi hữu ích.</li>
            <li>Thông tin về các sản phẩm mới nhất từ Salomon, Hoka, Altra, Nike Trail...</li>
            <li>Các chương trình khuyến mãi độc quyền dành riêng cho thành viên.</li>
          </ul>
          <p style="margin-top: 30px; text-align: center;">
            <a href="https://summitoutdoor.io.vn" style="background-color: #c2410c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Khám phá cửa hàng</a>
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;"/>
          <p style="font-size: 12px; color: #888; text-align: center;">Đây là email tự động từ hệ thống Summit Outdoor. Vui lòng không phản hồi email này.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Failed to send welcome email:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Gửi email xác nhận đặt hàng thành công
 */
export async function sendOrderConfirmationEmail(
  toEmail: string,
  fullName: string,
  orderCode: string,
  items: Array<{ name: string; brand?: string; quantity: number; price: number }>,
  totalPrice: number
) {
  if (!resend) {
    console.warn('Skipping sendOrderConfirmationEmail: Resend SDK is not initialized.');
    return { success: false, error: 'Resend SDK is not initialized' };
  }

  try {
    const itemsHtml = items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong><br/>
          <small style="color: #666;">Thương hiệu: ${item.brand || 'Khác'}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString('vi-VN')} đ</td>
      </tr>
    `
      )
      .join('');

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [toEmail],
      subject: `Xác nhận đơn hàng thành công #${orderCode} - Summit Outdoor`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #16a34a; text-align: center;">Đặt hàng thành công!</h2>
          <p>Xin chào <strong>${fullName}</strong>,</p>
          <p>Cảm ơn bạn đã tin tưởng mua sắm tại Summit Outdoor. Đơn hàng của bạn đã được ghi nhận thành công và đang được chuẩn bị đóng gói.</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Mã đơn hàng:</strong> <span style="color: #c2410c; font-weight: bold;">${orderCode}</span></p>
            <p style="margin: 5px 0;"><strong>Trạng thái thanh toán:</strong> Đã xác nhận thanh toán</p>
          </div>

          <h3 style="border-bottom: 2px solid #eee; padding-bottom: 8px;">Chi tiết sản phẩm</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 10px; text-align: left;">Sản phẩm</th>
                <th style="padding: 10px; text-align: center; width: 80px;">SL</th>
                <th style="padding: 10px; text-align: right; width: 120px;">Đơn giá</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr>
                <td colspan="2" style="padding: 15px 10px; font-weight: bold; text-align: right;">Tổng thanh toán:</td>
                <td style="padding: 15px 10px; font-weight: bold; text-align: right; color: #c2410c; font-size: 16px;">${totalPrice.toLocaleString('vi-VN')} đ</td>
              </tr>
            </tbody>
          </table>

          <p style="margin-top: 30px;">Nếu bạn có bất kỳ câu hỏi nào liên quan đến đơn hàng, vui lòng liên hệ bộ phận hỗ trợ khách hàng của chúng tôi.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;"/>
          <p style="font-size: 12px; color: #888; text-align: center;">Đây là email tự động từ hệ thống Summit Outdoor. Vui lòng không phản hồi email này.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending order confirmation email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Failed to send order confirmation email:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Tự động tìm kiếm thông tin đơn hàng và gửi email xác nhận đặt hàng theo mã đơn hàng (orderCode)
 */
export async function sendOrderConfirmationByCode(orderCode: string) {
  try {
    const rawOrders = await queryAll(`
      SELECT o.quantity, o.total_price, c.name as customer_name, c.email as customer_email, 
             p.name as product_name, p.brand as product_brand, p.price as product_price
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN products p ON o.product_id = p.id
      WHERE o.order_code = ?
    `, [orderCode]);

    if (!rawOrders || rawOrders.length === 0) {
      console.warn(`No orders found for code: ${orderCode} to send confirmation email.`);
      return { success: false, error: 'Order not found' };
    }

    const firstRow = rawOrders[0] as any;
    const toEmail = firstRow.customer_email;
    const fullName = firstRow.customer_name;

    if (!toEmail) {
      console.warn(`Customer email is empty for order: ${orderCode}. Skipping email.`);
      return { success: false, error: 'Customer email not found' };
    }

    const items = rawOrders.map((row: any) => ({
      name: row.product_name,
      brand: row.product_brand,
      quantity: row.quantity,
      price: row.product_price
    }));

    const totalPrice = rawOrders.reduce((acc: number, row: any) => acc + (row.total_price || 0), 0);

    return await sendOrderConfirmationEmail(toEmail, fullName, orderCode, items, totalPrice);
  } catch (err: any) {
    console.error(`Failed to send order confirmation for code ${orderCode}:`, err);
    return { success: false, error: err.message };
  }
}
