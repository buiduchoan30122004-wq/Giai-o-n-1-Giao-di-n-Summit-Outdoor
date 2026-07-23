import { Resend } from 'resend';
import { queryAll, queryRun } from './db';

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

// Domain gửi mặc định sau khi đã xác thực domain riêng
const FROM_EMAIL = 'Summit Outdoor <no-reply@summitoutdoor.io.vn>';

// Header HTML dùng chung có chứa Logo và Tên thương hiệu
const EMAIL_HEADER_HTML = `
  <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid #f3f4f6; padding-bottom: 20px;">
    <img src="https://summitoutdoor.io.vn/icon.svg" alt="Summit Outdoor Logo" width="50" height="50" style="display: inline-block; vertical-align: middle; border-radius: 50%;" />
    <span style="font-size: 22px; font-weight: bold; color: #111; vertical-align: middle; margin-left: 10px; letter-spacing: 1px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">SUMMIT OUTDOOR</span>
  </div>
`;

/**
 * Gửi email theo chuỗi chăm sóc khách hàng tự động (Email 1, 2, 3)
 */
export async function sendSequenceEmail(toEmail: string, fullName: string, emailType: number) {
  if (!resend) {
    console.warn(`Skipping sendSequenceEmail type ${emailType}: Resend SDK is not initialized.`);
    return { success: false, error: 'Resend SDK is not initialized' };
  }

  try {
    let subject = '';
    let htmlContent = '';

    if (emailType === 1) {
      subject = 'Chào mừng bạn đến với Summit Outdoor + Voucher 5% của bạn đây! 🏔️';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          ${EMAIL_HEADER_HTML}
          <h2 style="color: #c2410c; text-align: center; margin-bottom: 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">Chào mừng bạn đến với Summit Outdoor!</h2>
          <p>Chào bạn,</p>
          <p>Cảm ơn bạn đã đăng ký tham gia cộng đồng <strong>Summit Outdoor</strong> – nơi tụ hội của những người đam mê chạy bộ địa hình và hoạt động ngoài trời thực thụ.</p>
          <p>Chúng tôi hiểu rằng chạy trail (chạy địa hình) không chỉ là một môn thể thao, mà là một hành trình khám phá giới hạn bản thân giữa thiên nhiên. Tại Summit Outdoor, chúng tôi không đơn thuần là bán giày hay phụ kiện; chúng tôi là những người trực tiếp trải nghiệm, kiểm thử thiết bị trên từng cung đường dốc, bùn lầy hay đá sỏi để mang lại cho bạn những đánh giá chân thực và thiết bị phù hợp nhất.</p>
          
          <p>Để chào mừng bạn, Summit Outdoor xin gửi tặng mã giảm giá <strong>5%</strong> áp dụng cho đơn hàng đầu tiên của bạn:</p>
          
          <div style="background-color: #fff7ed; border: 1px dashed #c2410c; padding: 15px; text-align: center; border-radius: 6px; margin: 20px 0;">
            <span style="font-size: 14px; color: #7c2d12; display: block; margin-bottom: 5px;">Mã Voucher của bạn:</span>
            <strong style="font-size: 24px; color: #c2410c; letter-spacing: 2px;">SUMMIT5OFF</strong>
          </div>
          
          <h3 style="color: #444; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 25px;">Bạn có thể mong đợi điều gì từ chúng tôi trong những ngày tới?</h3>
          <ul style="padding-left: 20px;">
            <li style="margin-bottom: 10px;"><strong>Mẹo kỹ thuật thực tế:</strong> Kỹ thuật đổ dốc (downhill) an toàn, cách phân bổ sức bền khi power hiking.</li>
            <li style="margin-bottom: 10px;"><strong>Kinh nghiệm chọn đồ:</strong> Hướng dẫn chọn giày trail phù hợp với từng loại địa hình, cách sắp xếp mandatory gear tối ưu nhất.</li>
            <li style="margin-bottom: 10px;"><strong>Đánh giá khách quan:</strong> Phân tích ưu và nhược điểm thực tế của từng dòng sản phẩm mà không phóng đại quảng cáo.</li>
          </ul>
          
          <p>Nếu bạn cần tư vấn ngay về size giày hoặc lựa chọn thiết bị cho giải chạy sắp tới, bạn có thể ghé thăm website và trò chuyện trực tiếp với trợ lý ảo 24/7 của chúng tôi. Bạn ấy được huấn luyện dựa trên chính những bộ tài liệu kinh nghiệm thực chiến của đội ngũ Summit Outdoor.</p>
          
          <p style="margin-top: 30px; text-align: center;">
            <a href="https://summitoutdoor.io.vn/" style="background-color: #c2410c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Ghé thăm cửa hàng & Test Chatbot ngay</a>
          </p>
          
          <p style="margin-top: 20px;">Chúc bạn luôn có những bước chạy an toàn và tràn đầy cảm hứng!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;"/>
          <p style="font-size: 12px; color: #888; text-align: center;">Thân mến,<br/><strong>Đội ngũ Summit Outdoor</strong></p>
        </div>
      `;
    } else if (emailType === 2) {
      subject = '3 lỗi nhỏ dễ gây bầm móng chân khi chạy trail (Và cách xử lý thực tế) 👣';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          ${EMAIL_HEADER_HTML}
          <h2 style="color: #c2410c; text-align: center; margin-bottom: 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">3 lỗi nhỏ dễ gây bầm móng chân khi chạy trail</h2>
          <p>Chào bạn,</p>
          <p>Có một thực tế khá "đau đớn" mà rất nhiều runner gặp phải khi chuyển từ chạy đường nhựa (road) sang chạy địa hình (trail): <strong>bầm đen hoặc rụng móng chân sau các buổi chạy dài, đặc biệt là sau khi đổ dốc.</strong></p>
          <p>Nhiều người nghĩ đó là điều bình thường của chạy bộ. Nhưng thực tế, lỗi này hoàn toàn có thể phòng tránh nếu bạn hiểu rõ nguyên nhân.</p>
          <p>Dưới đây là 3 lỗi phổ biến nhất và giải pháp thực tế từ kinh nghiệm của đội ngũ Summit Outdoor:</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #c2410c;">
            <h4 style="margin: 0 0 5px 0; color: #7c2d12;">Lỗi 1: Chọn size giày trail vừa khít như giày đi làm</h4>
            <p style="margin: 0; font-size: 14px;"><strong>Thực tế:</strong> Khi chạy dốc dài, bàn chân của bạn sẽ có xu hướng trượt về phía trước. Cộng thêm việc chân sẽ phồng to ra sau vài tiếng vận động liên tục.</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #16a34a;"><strong>Giải pháp:</strong> Luôn chọn giày trail lớn hơn giày chạy road hoặc giày đi lại hàng ngày từ <strong>0.5 đến 1 size</strong> (tương đương chừa ra khoảng 1cm đến 1.5cm khoảng trống từ mũi ngón chân dài nhất đến mũi giày).</p>
          </div>

          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #c2410c;">
            <h4 style="margin: 0 0 5px 0; color: #7c2d12;">Lỗi 2: Cắt tỉa móng chân quá sát hoặc cắt tròn khóe</h4>
            <p style="margin: 0; font-size: 14px;"><strong>Thực tế:</strong> Cắt móng quá sát sẽ làm lộ phần thịt nhạy cảm dưới móng, dễ bị tổn thương khi va chạm. Cắt tròn khóe sâu vào trong lại dễ dẫn đến tình trạng móng chọc thịt khi chạy.</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #16a34a;"><strong>Giải pháp:</strong> Cắt tỉa móng chân trước ngày chạy ít nhất 2 ngày. Cắt theo đường thẳng ngang và để lại một viền móng mỏng để bảo vệ đầu ngón chân.</p>
          </div>

          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #c2410c;">
            <h4 style="margin: 0 0 5px 0; color: #7c2d12;">Lỗi 3: Buộc dây giày quá lỏng lẻo ở cổ chân</h4>
            <p style="margin: 0; font-size: 14px;"><strong>Thực tế:</strong> Khi dây giày không khóa chặt cổ chân, bàn chân sẽ liên tục bị xê dịch và đâm mạnh mũi ngón chân vào phần mũi giày khi đổ dốc (downhill).</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #16a34a;"><strong>Giải pháp:</strong> Áp dụng kỹ thuật buộc dây <strong>Heel Lock (Runner\'s Loop)</strong>. Hãy tận dụng lỗ xỏ dây cuối cùng sát cổ chân để tạo một vòng khóa cố định gót chân, giúp bàn chân không bị trượt tới trước mà vẫn thoải mái ở phần mũi.</p>
          </div>

          <p>Hy vọng mẹo nhỏ này sẽ giúp bạn bảo vệ đôi chân tốt hơn trong buổi tập cuối tuần này. Ở email tiếp theo, chúng tôi sẽ phân tích chi tiết cách chọn loại gai đế giày phù hợp cho từng loại địa hình đá dốc hay bùn lầy. Cùng chờ đón nhé!</p>
          <p>Chúc bạn chạy vui và an toàn!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;"/>
          <p style="font-size: 12px; color: #888; text-align: center;">Thân mến,<br/><strong>Đội ngũ Summit Outdoor</strong></p>
        </div>
      `;
    } else if (emailType === 3) {
      subject = 'Sẵn sàng cho cung đường trail tiếp theo? Gợi ý 3 mẫu giày tốt nhất cho người mới 👟';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          ${EMAIL_HEADER_HTML}
          <h2 style="color: #c2410c; text-align: center; margin-bottom: 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">Sẵn sàng cho cung đường trail tiếp theo?</h2>
          <p>Chào bạn,</p>
          <p>Nếu bạn đang lên kế hoạch cho một giải chạy trail sắp tới hoặc đơn giản là muốn đổi gió cuối tuần tại các cung đường rừng, một đôi giày trail chuyên dụng là trang bị tối quan trọng để bảo vệ bạn khỏi trơn trượt và chấn thương.</p>
          <p>Không có đôi giày tốt nhất cho tất cả mọi người, chỉ có đôi giày phù hợp nhất với bàn chân và cung đường của bạn. Dưới đây là phân tích ưu và nhược điểm khách quan của 3 dòng giày trail được cộng đồng runner đánh giá cao nhất hiện nay để bạn tham khảo:</p>
          
          <div style="margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
            <h3 style="color: #c2410c; margin-bottom: 5px;">1. Salomon Speedcross 6 – Vua bám đường bùn đất</h3>
            <p style="margin: 5px 0;"><strong>🟢 Ưu điểm:</strong> Hệ thống gai (lug) sâu 5mm bằng cao su Contagrip bám cực đỉnh trên địa hình bùn lầy, đất trơn trượt sau mưa. Form giày ôm khít gót chân, hệ thống dây rút Quicklace tiện lợi không lo tuột dây giữa đường.</p>
            <p style="margin: 5px 0; color: #991b1b;"><strong>🔴 Nhược điểm:</strong> Form giày khá ôm ngang (phù hợp chân thon gọn, chân bè sẽ cảm thấy hơi chật). Đế gai to và cao không thích hợp để chạy trên đường bê tông hoặc đường nhựa cứng vì sẽ gây mòn gai nhanh và đau chân.</p>
          </div>

          <div style="margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
            <h3 style="color: #c2410c; margin-bottom: 5px;">2. Hoka Speedgoat 5 – Đệm êm vượt trội cho cự ly dài</h3>
            <p style="margin: 5px 0;"><strong>🟢 Ưu điểm:</strong> Đế giữa bằng đệm EVA siêu êm ái, giảm chấn cực tốt cho khớp gối khi chạy quãng đường dài. Đế ngoài Vibram Megagrip bám đá và địa hình khô rất tốt. Trọng lượng nhẹ bất ngờ so với kích thước đế đồ sộ.</p>
            <p style="margin: 5px 0; color: #991b1b;"><strong>🔴 Nhược điểm:</strong> Do đế khá dày nên cảm giác tiếp đất địa hình (ground feel) không nhạy bằng Salomon. Người chưa quen chạy giày đế cao cần cẩn thận ở những đoạn đá gồ ghề để tránh lật cổ chân.</p>
          </div>

          <div style="margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
            <h3 style="color: #c2410c; margin-bottom: 5px;">3. Nike Pegasus Trail 4 – Sự linh hoạt giữa Road và Trail</h3>
            <p style="margin: 5px 0;"><strong>🟢 Ưu điểm:</strong> Thiết kế lai (hybrid) linh hoạt. Đệm React êm ái và bám đường nhựa tốt, giúp bạn thoải mái chạy từ nhà ra tới chân đường trail. Thiết kế thời trang, dễ phối đồ hàng ngày.</p>
            <p style="margin: 5px 0; color: #991b1b;"><strong>🔴 Nhược điểm:</strong> Gai đế nông hơn nên khả năng bám đường đất bùn nhão hoặc đá ướt trơn trượt kém hơn hẳn so với Salomon and Hoka. Không khuyến nghị dùng cho các cung đường địa hình quá phức tạp hoặc mùa mưa.</p>
          </div>

          <div style="background-color: #fff7ed; border: 1px dashed #c2410c; padding: 15px; text-align: center; border-radius: 6px; margin: 25px 0;">
            <span style="font-size: 14px; color: #7c2d12; display: block; margin-bottom: 5px;">Đừng quên mã giảm giá 5% của bạn:</span>
            <strong style="font-size: 20px; color: #c2410c; letter-spacing: 1px;">SUMMIT5OFF</strong>
          </div>

          <h4 style="margin-bottom: 5px; color: #444;">🛡️ Chính sách an tâm của Summit Outdoor:</h4>
          <p style="margin-top: 0; font-size: 14px; color: #555;">Chúng tôi hiểu việc mua giày online rất dễ bị nhầm size. Do đó, Summit Outdoor hỗ trợ <strong>đổi size miễn phí tại nhà</strong> trong vòng 7 ngày. Bạn chỉ cần thử giày, nếu rộng hay chật, chúng tôi sẽ gửi đôi mới đến tận cửa và thu hồi đôi cũ về mà bạn không mất thêm chi phí vận chuyển nào.</p>

          <p style="margin-top: 30px; text-align: center;">
            <a href="https://summitoutdoor.io.vn/shop" style="background-color: #c2410c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Xem chi tiết và chọn size giày của bạn</a>
          </p>

          <p>Nếu bạn vẫn còn phân vân giữa các dòng giày, hãy cứ nhắn tin trực tiếp cho chúng tôi hoặc test thử tính năng chatbot trên web để tìm ra người bạn đồng hành phù hợp nhất nhé!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;"/>
          <p style="font-size: 12px; color: #888; text-align: center;">Thân mến,<br/><strong>Đội ngũ Summit Outdoor</strong></p>
        </div>
      `;
    } else {
      return { success: false, error: `Invalid emailType: ${emailType}` };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [toEmail],
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      console.error(`Error sending sequence email type ${emailType}:`, error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error(`Failed to send sequence email type ${emailType}:`, err);
    return { success: false, error: err.message };
  }
}

/**
 * Gửi email chào mừng khi đăng ký nhận tin bản tin / tư vấn (Newsletter) - Fallback về Sequence Email 1
 */
export async function sendWelcomeEmail(toEmail: string, fullName: string) {
  return await sendSequenceEmail(toEmail, fullName, 1);
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
          ${EMAIL_HEADER_HTML}
          <h2 style="color: #16a34a; text-align: center; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">Đặt hàng thành công!</h2>
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

/**
 * Gửi email cảm ơn khách hàng đã mua hàng tại Summit Outdoor
 */
export async function sendThankYouEmail(toEmail: string, fullName: string, orderCode: string) {
  if (!resend) {
    console.warn('Skipping sendThankYouEmail: Resend SDK is not initialized.');
    return { success: false, error: 'Resend SDK is not initialized' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [toEmail],
      subject: `Cảm ơn bạn đã mua hàng tại Summit Outdoor! 🏔️ (Đơn hàng #${orderCode})`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          ${EMAIL_HEADER_HTML}
          <h2 style="color: #c2410c; text-align: center; margin-bottom: 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">Chân thành cảm ơn bạn!</h2>
          <p>Chào <strong>${fullName}</strong>, chúng tôi biết bạn có rất nhiều sự lựa chọn ngoài kia, cảm ơn vì đã tin tưởng đồng hành cùng <strong>Summit Outdoor</strong>.</p>
          
          <p>Đơn hàng của bạn với mã số <strong style="color: #c2410c;">#${orderCode}</strong> đã được bộ phận quản trị duyệt thành công và đang được chuẩn bị đóng gói cẩn thận để gửi đến bạn nhanh nhất có thể.</p>

          <h3 style="color: #444; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 25px;">Một số lưu ý nhỏ dành cho bạn:</h3>
          <ul style="padding-left: 20px;">
            <li style="margin-bottom: 10px;"><strong>Kiểm tra hàng:</strong> Khi nhận hàng, bạn vui lòng kiểm tra kỹ sản phẩm, tem mác và thử size ngay tại chỗ để đảm bảo thiết bị hoàn hảo nhất.</li>
            <li style="margin-bottom: 10px;"><strong>Đổi size miễn phí:</strong> Đừng quên chính sách hỗ trợ đổi size miễn phí tận nhà trong vòng 7 ngày nếu giày hay quần áo của bạn bị rộng hoặc chật.</li>
            <li style="margin-bottom: 10px;"><strong>Vệ sinh giày:</strong> Đối với giày trail, tránh phơi trực tiếp dưới ánh nắng gay gắt hoặc dùng máy sấy nóng để giữ keo đế giày luôn bền bỉ.</li>
          </ul>

          <p>Nếu bạn cần bất kỳ hỗ trợ nào về vận chuyển hoặc tư vấn kỹ thuật sử dụng sản phẩm, đừng ngần ngại chat với chatbot 24/7 của chúng tôi hoặc liên hệ trực tiếp qua số hotline hỗ trợ.</p>
          
          <p style="margin-top: 30px; text-align: center;">
            <a href="https://summitoutdoor.io.vn/" style="background-color: #c2410c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Ghé thăm Summit Outdoor</a>
          </p>

          <p>Chúc bạn có những chuyến đi thật trọn vẹn và an toàn!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;"/>
          <p style="font-size: 12px; color: #888; text-align: center;">Thân mến,<br/><strong>Đội ngũ Summit Outdoor</strong></p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending thank you email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Failed to send thank you email:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Tra cứu thông tin khách hàng từ mã đơn hàng và gửi email cảm ơn mua hàng
 */
export async function sendThankYouEmailByCode(orderCode: string) {
  try {
    const rawOrders = await queryAll(`
      SELECT c.name as customer_name, c.email as customer_email
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE o.order_code = ?
      LIMIT 1
    `, [orderCode]);

    if (!rawOrders || rawOrders.length === 0) {
      console.warn(`No orders found for code: ${orderCode} to send thank you email.`);
      return { success: false, error: 'Order not found' };
    }

    const customer = rawOrders[0] as any;
    const toEmail = customer.customer_email;
    const fullName = customer.customer_name;

    if (!toEmail) {
      console.warn(`Customer email is empty for order: ${orderCode}. Skipping thank you email.`);
      return { success: false, error: 'Customer email not found' };
    }

    return await sendThankYouEmail(toEmail, fullName, orderCode);
  } catch (err: any) {
    console.error(`Failed to send thank you email for code ${orderCode}:`, err);
    return { success: false, error: err.message };
  }
}

// Background Worker: Tự động gửi email trong hàng đợi
if (typeof global !== 'undefined') {
  const globalAny = global as any;
  if (!globalAny.emailQueueWorkerStarted) {
    globalAny.emailQueueWorkerStarted = true;
    
    console.log('Initializing background Email Queue Worker loop (every 30 seconds)...');
    
    setInterval(async () => {
      try {
        const { queryAll: qAll, queryRun: qRun } = await import('./db');
        
        // Truy vấn các email đã lên lịch và đến hạn gửi (so sánh theo giờ UTC trong SQLite)
        const pendingEmails = await qAll<any>(
          "SELECT * FROM email_queue WHERE sent = 0 AND scheduled_time <= datetime('now')"
        );
        
        for (const emailJob of pendingEmails) {
          // Đánh dấu đã gửi trước để tránh race-conditions trùng lặp
          await qRun("UPDATE email_queue SET sent = 1 WHERE id = ?", [emailJob.id]);
          
          try {
            console.log(`Email Queue Worker: Sending sequence email type ${emailJob.email_type} to ${emailJob.email}`);
            await sendSequenceEmail(emailJob.email, emailJob.name, emailJob.email_type);
          } catch (jobErr) {
            console.error(`Email Queue Worker: Failed to send job ${emailJob.id} to ${emailJob.email}:`, jobErr);
          }
        }
      } catch (err) {
        console.error('Email Queue Worker Loop Error:', err);
      }
    }, 30000); // Chạy kiểm tra mỗi 30 giây
  }
}
