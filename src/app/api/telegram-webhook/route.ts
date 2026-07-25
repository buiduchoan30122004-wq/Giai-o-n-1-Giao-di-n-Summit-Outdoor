import { NextRequest, NextResponse } from 'next/server';
import { queryRun, queryGet, queryAll } from '@/lib/db';
import { publishToFacebook } from '@/lib/facebook';
import { scrapeUrlText } from '@/lib/scraper';

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

async function sendTelegramMessage(chatId: number, text: string) {
  try {
    await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });
  } catch (err) {
    console.error('Failed to send message back to Telegram:', err);
  }
}

// Hàm gọi Gemini AI sinh nội dung bài viết
async function generateMarketingPost(promptText: string, competitorReference?: string): Promise<{ topic: string; key: string; content: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined.');
  }

  const systemInstruction = `Bạn là Chuyên gia Marketing Nội dung của Summit Outdoor (cửa hàng chuyên đồ chạy trail và dã ngoại).
Nhiệm vụ của bạn là soạn thảo một bài viết Facebook quảng cáo/chia sẻ kiến thức cực kỳ cuốn hút, chuyên nghiệp, sử dụng biểu tượng cảm xúc (emojis) phù hợp, có tiêu đề hấp dẫn, phân cấp rõ ràng và kết thúc bằng lời kêu gọi hành động (CTA) hướng khách hàng truy cập website https://summitoutdoor.io.vn.

Bạn PHẢI trả về câu trả lời phân tách chính xác bởi các thẻ XML sau để hệ thống tự động bóc tách dữ liệu:
<topic>Tên chủ đề ngắn gọn của bài viết (tối đa 50 ký tự)</topic>
<key>#HashtagChínhCủaBàiViết (Ví dụ: #Salomon, #ChayTrail)</key>
<content>
Nội dung chi tiết bài viết đăng Facebook ở đây...
</content>`;

  const prompt = {
    contents: [
      {
        parts: [
          {
            text: `${systemInstruction}\n\n` +
              (competitorReference ? `Dưới đây là nội dung bài viết của ĐỐI THỦ dùng để THAM KHẢO cấu trúc/chủ đề (hãy viết lại độc quyền theo Brand Voice của Summit Outdoor, không đạo văn):\n---\n${competitorReference}\n---\n` : '') +
              `Yêu cầu viết bài về chủ đề/sản phẩm: ${promptText}`
          }
        ]
      }
    ]
  };

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prompt),
  });

  if (!response.ok) {
    throw new Error(`Gemini API returned status ${response.status}`);
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  const topicMatch = text.match(/<topic>([\s\S]*?)<\/topic>/i);
  const keyMatch = text.match(/<key>([\s\S]*?)<\/key>/i);
  const contentMatch = text.match(/<content>([\s\S]*?)<\/content>/i);

  return {
    topic: topicMatch ? topicMatch[1].trim() : 'Chủ đề ngẫu nhiên',
    key: keyMatch ? keyMatch[1].trim() : '#SummitOutdoor',
    content: contentMatch ? contentMatch[1].trim() : text.trim()
  };
}

// Hàm duyệt đơn hàng qua mã đơn hàng (gửi hóa đơn & cảm ơn qua Resend)
async function confirmOrder(orderCode: string): Promise<string> {
  let code = orderCode.trim().toUpperCase().replace('#', '');
  if (!code.startsWith('SUMMIT') && /^\d+$/.test(code)) {
    code = `SUMMIT${code}`;
  }

  try {
    const order: any = await queryGet('SELECT * FROM orders WHERE order_code = ?', [code]);
    if (!order) {
      return `❌ Không tìm thấy đơn hàng mã <code>${code}</code> trong database.`;
    }

    if (order.status === 'confirmed') {
      return `ℹ️ Đơn hàng <code>${code}</code> đã được xác nhận thanh toán/duyệt từ trước đó rồi.`;
    }

    await queryRun(
      "UPDATE orders SET status = 'confirmed', updated_at = datetime('now') WHERE order_code = ?",
      [code]
    );

    // Gửi email xác nhận đặt hàng & email cảm ơn mua hàng qua Resend
    try {
      const { sendOrderConfirmationByCode, sendThankYouEmailByCode } = await import('@/lib/email');
      await sendOrderConfirmationByCode(code);
      await sendThankYouEmailByCode(code);
    } catch (mailError) {
      console.error('Failed to send emails during Telegram order confirmation:', mailError);
    }

    return `✅ <b>DUYỆT ĐƠN THÀNH CÔNG!</b>\n\n• Mã đơn: <code>${code}</code>\n• Trạng thái: Confirmed (Đã xác nhận)\n\n📧 Hệ thống đã tự động kích hoạt gửi Email hóa đơn & Cảm ơn qua Resend cho khách hàng!`;
  } catch (err: any) {
    console.error('Error confirming order via Telegram:', err);
    return `❌ Lỗi hệ thống khi duyệt đơn: ${err.message}`;
  }
}

// Hàm xuất báo cáo doanh số/đơn hàng ngày hôm nay
async function getTodayReport(): Promise<string> {
  try {
    const now = new Date();
    const vnOffset = 7 * 60 * 60 * 1000;
    const vnTime = new Date(now.getTime() + vnOffset);
    const todayStr = vnTime.toISOString().substring(0, 10); // YYYY-MM-DD

    const orders = await queryAll<any>(
      `SELECT o.*, c.name as customer_name FROM orders o 
       JOIN customers c ON o.customer_id = c.id 
       WHERE o.created_at LIKE ?`,
      [`%${todayStr}%`]
    );

    if (!orders || orders.length === 0) {
      return `📊 <b>BÁO CÁO DOANH THU HÔM NAY (${todayStr}):</b>\n\nHôm nay chưa phát sinh đơn hàng mới nào.`;
    }

    const count = orders.length;
    const confirmedCount = orders.filter(o => o.status === 'confirmed').length;
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    
    const totalRevenue = orders
      .filter(o => o.status === 'confirmed')
      .reduce((sum, o) => sum + (o.total_price || 0), 0);

    let reportText = `📊 <b>BÁO CÁO DOANH THU HÔM NAY (${todayStr}):</b>\n\n` +
      `• <b>Tổng số đơn:</b> ${count} đơn\n` +
      `  - Đã duyệt: ${confirmedCount} đơn\n` +
      `  - Chờ thanh toán: ${pendingCount} đơn\n` +
      `• <b>Doanh thu đã thu:</b> <b>${totalRevenue.toLocaleString('vi-VN')} đ</b>\n\n` +
      `<b>Chi tiết các đơn hàng:</b>\n`;

    for (const order of orders) {
      const statusIcon = order.status === 'confirmed' ? '✅' : '⏳';
      reportText += `${statusIcon} <code>#${order.order_code}</code> - ${order.customer_name} - <b>${order.total_price.toLocaleString('vi-VN')} đ</b> (${order.status})\n`;
    }

    return reportText;
  } catch (err: any) {
    console.error('Error generating report:', err);
    return `❌ Lỗi khi xuất báo cáo: ${err.message}`;
  }
}

// Hàm nhận diện ý định hội thoại tự nhiên từ tin nhắn người dùng
async function classifyIntent(messageText: string): Promise<{
  intent: 'write' | 'post' | 'schedule' | 'suggest' | 'list' | 'cancel' | 'help' | 'report' | 'confirm' | 'unknown';
  argument?: string;
  scheduled_time?: string;
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { intent: 'unknown' };

  const localTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  const systemInstruction = `Bạn là bộ não phân tích ý định tin nhắn của chủ cửa hàng gửi cho Bot Facebook Marketing của Summit Outdoor.
Hãy phân tích tin nhắn và phân loại vào một trong các ý định sau:
1. 'help': Muêu xem hướng dẫn sử dụng, trợ giúp. (Ví dụ: "hướng dẫn anh dùng", "trợ giúp", "cứu", "help")
2. 'report': Xem báo cáo doanh thu/đơn hàng ngày hôm nay. (Ví dụ: "báo cáo đơn hôm nay", "báo cáo doanh thu", "doanh số hôm nay", "hôm nay bán được bao nhiêu")
3. 'confirm': Muốn duyệt hoặc xác nhận thanh toán đơn hàng. (Ví dụ: "duyệt đơn SUMMIT1004", "xác nhận đơn 8508", "duyệt đơn hàng SUMMIT2622")
4. 'write': Muốn soạn/viết bài viết mới. (Ví dụ: "viết bài về Salomon", "soạn bài marketing về tất trail", "viết bài dựa trên link này http://...")
5. 'post': Muốn đăng bài viết lên Facebook ngay lập tức. (Ví dụ: "đăng bài này đi", "đăng bài số 5 lên page", "đăng bài nháp số 2")
6. 'schedule': Muốn lên lịch/hẹn giờ đăng bài. (Ví dụ: "hẹn giờ bài này lúc 9h sáng mai", "lên lịch đăng bài số 3 vào 2026-07-26 15:00", "đặt lịch bài nháp 1 vào tối nay lúc 20:00")
7. 'suggest': Muốn nhận gợi ý chủ đề marketing hoặc lập lịch 7 ngày tự động. (Ví dụ: "gợi ý chủ đề", "lập lịch 7 ngày", "lên lịch tự động", "tuần này nên viết gì")
8. 'list': Muốn xem danh sách bài viết. (Ví dụ: "xem danh sách bài viết", "danh sách bài đăng", "lịch đăng bài gần đây")
9. 'cancel': Muốn hủy/xóa lịch đăng của bài viết. (Ví dụ: "hủy bài số 4", "xóa lịch đăng bài 5")

Trả về cấu trúc JSON duy nhất dưới đây (không kèm bất cứ văn bản nào khác):
{
  "intent": "write" | "post" | "schedule" | "suggest" | "list" | "cancel" | "help" | "report" | "confirm" | "unknown",
  "argument": "tham số chi tiết trích xuất được (như chủ đề cần viết, link đối thủ, ID bài viết cần đăng/hủy, mã đơn hàng cần duyệt, hoặc nội dung bài đăng)",
  "scheduled_time": "Thời gian hẹn giờ định dạng YYYY-MM-DD HH:MM nếu có. Hãy tự tính toán dựa trên thời gian máy chủ hiện tại ở Việt Nam là: ${localTime}"
}`;

  const prompt = {
    contents: [{
      parts: [{
        text: `${systemInstruction}\n\nTin nhắn người dùng: "${messageText}"`
      }]
    }]
  };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prompt),
    });

    if (!response.ok) return { intent: 'unknown' };

    const result = await response.json();
    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    const jsonMatch = rawText.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to classify intent:', e);
  }
  return { intent: 'unknown' };
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    
    // Chỉ xử lý tin nhắn dạng text
    if (!update.message || !update.message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = update.message.chat.id;
    const rawText: string = update.message.text.trim();
    let text = rawText;

    // Nếu không phải là lệnh có gạch chéo /, dùng Gemini để phân tích ý định tự nhiên
    if (!text.startsWith('/')) {
      const lowerText = text.toLowerCase();
      
      // Nhận diện nhanh báo cáo đơn hôm nay
      if (lowerText.includes('báo cáo') || lowerText.includes('doanh thu') || lowerText.includes('doanh số') || lowerText.includes('đơn hôm nay')) {
        text = '/baocao';
      } 
      // Nhận diện nhanh duyệt đơn hàng
      else if (lowerText.includes('duyệt') || lowerText.includes('xác nhận')) {
        const match = text.match(/(SUMMIT\d+|\d+)/i);
        if (match) {
          text = `/duyet ${match[1]}`;
        } else {
          await sendTelegramMessage(chatId, '❓ Bạn muốn duyệt đơn hàng nào? Vui lòng ghi rõ mã đơn hàng (ví dụ: "Duyệt đơn SUMMIT1004" hoặc "duyệt đơn 1004").');
          return NextResponse.json({ ok: true });
        }
      } 
      // Mọi ý định khác sẽ được phân tích qua Gemini AI
      else {
        // Gửi thông báo đang xử lý, nếu Gemini API key bị lỗi sẽ bắt exception và thông báo cụ thể
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          await sendTelegramMessage(chatId, '❌ Lỗi: Server chưa cấu hình GEMINI_API_KEY để phân tích tin nhắn tự nhiên. Vui lòng gõ các lệnh bằng dấu gạch chéo (ví dụ: /help, /danhsach, /viet Salomon...).');
          return NextResponse.json({ ok: true });
        }

        await sendTelegramMessage(chatId, '🧠 Đang suy nghĩ...');
        const classified = await classifyIntent(text);
        console.log('Classified Telegram input:', classified);

        switch (classified.intent) {
          case 'help':
            text = '/help';
            break;
          case 'report':
            text = '/baocao';
            break;
          case 'confirm':
            text = `/duyet ${classified.argument || ''}`;
            break;
          case 'suggest':
            if (rawText.includes('7 ngày') || rawText.includes('tự động') || (classified.argument && classified.argument.includes('7 ngày'))) {
              text = '/lich_7_ngay';
            } else {
              text = '/goiy';
            }
            break;
          case 'write':
            text = `/viet ${classified.argument || ''}`;
            break;
          case 'post':
            text = `/dang ${classified.argument || ''}`;
            break;
          case 'schedule':
            text = `/hengio ${classified.scheduled_time || ''} ${classified.argument || ''}`;
            break;
          case 'list':
            text = '/danhsach';
            break;
          case 'cancel':
            text = `/huy ${classified.argument || ''}`;
            break;
          default:
            // Mặc định xem như yêu cầu viết bài
            text = `/viet ${rawText}`;
            break;
        }
      }
    }

    // 1. Lệnh trợ giúp / Trợ giúp chung
    if (text.startsWith('/start') || text.startsWith('/help') || text.startsWith('/trogiup')) {
      const helpMessage = `<b>🏔️ HỆ THỐNG MARKETING FB AUTOMATION 🏔️</b>\n\n` +
        `Chào bạn! Dưới đây là danh sách các lệnh bạn có thể ra lệnh cho mình:\n\n` +
        `✍️ <b>Soạn thảo bài viết:</b>\n` +
        `• <code>/viet [Chủ đề/Sản phẩm]</code>: AI tự động viết bài mới.\n` +
        `• <code>/viet [URL đối thủ]</code>: Cào bài đối thủ và viết lại tối ưu.\n` +
        `• <code>/goiy</code>: Nhận gợi ý chiến lược chủ đề từ AI.\n\n` +
        `📢 <b>Đăng bài Fanpage:</b>\n` +
        `• <code>/dang [Nội dung]</code>: Đăng trực tiếp bài viết lên Fanpage.\n` +
        `• <code>/dang [URL ảnh] [Nội dung]</code>: Đăng bài kèm ảnh lên Fanpage.\n` +
        `• <code>/dang [ID bài nháp]</code>: Đăng bài viết nháp trong DB.\n\n` +
        `⏰ <b>Lên lịch bài viết:</b>\n` +
        `• <code>/hengio [YYYY-MM-DD HH:MM] [Nội dung/ID]</code>: Đăng vào giờ chỉ định.\n` +
        `• <code>/lich_7_ngay</code>: Tự động lên lịch 7 ngày tiếp theo.\n\n` +
        `📊 <b>Quản lý bài viết:</b>\n` +
        `• <code>/danhsach</code>: Xem danh sách bài viết trong database.\n` +
        `• <code>/huy [ID]</code>: Hủy lịch đăng bài viết.`;
      
      await sendTelegramMessage(chatId, helpMessage);
      return NextResponse.json({ ok: true });
    }

    // 2. Lệnh Gợi ý Chủ đề
    if (text === '/goiy') {
      await sendTelegramMessage(chatId, '🤖 Đang phân tích chiến lược marketing và suy nghĩ chủ đề...');
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        await sendTelegramMessage(chatId, '❌ Lỗi: Chưa cấu hình GEMINI_API_KEY.');
        return NextResponse.json({ ok: true });
      }

      const prompt = {
        contents: [{
          parts: [{
            text: `Bạn là Giám đốc Marketing của Summit Outdoor. Hãy đưa ra 3 gợi ý chủ đề cụ thể (kèm tóm tắt nội dung chính cần truyền tải) cho tuần này để đăng Facebook. Tập trung vào chia sẻ mẹo chạy bộ địa hình, cách chọn giày Salomon/Hoka, hoặc dinh dưỡng phục hồi. Viết ngắn gọn súc tích bằng tiếng Việt.`
          }]
        }]
      };

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt),
      });

      const result = await response.json();
      const suggestions = result?.candidates?.[0]?.content?.parts?.[0]?.text || 'Không có gợi ý nào.';
      
      await sendTelegramMessage(chatId, `💡 <b>Gợi ý chủ đề Marketing:</b>\n\n${suggestions}\n\n<i>Bạn có thể copy chủ đề ưa thích và dùng lệnh <code>/viet [chủ đề]</code> để mình viết bài nhé!</i>`);
      return NextResponse.json({ ok: true });
    }

    // 3. Lệnh viết bài (Có hỗ trợ cào link đối thủ)
    if (text.startsWith('/viet ')) {
      const argument = text.substring(6).trim();
      if (!argument) {
        await sendTelegramMessage(chatId, '❌ Vui lòng nhập chủ đề hoặc link bài viết đối thủ sau lệnh `/viet`.');
        return NextResponse.json({ ok: true });
      }

      await sendTelegramMessage(chatId, '✍️ AI đang nghiên cứu và soạn thảo bài viết, vui lòng chờ chút...');

      try {
        let competitorText = '';
        let isUrl = false;

        if (argument.startsWith('http://') || argument.startsWith('https://')) {
          isUrl = true;
          try {
            competitorText = await scrapeUrlText(argument);
            await sendTelegramMessage(chatId, '🔍 Đã cào dữ liệu tham khảo từ URL đối thủ thành công. Bắt đầu viết bài...');
          } catch (scrapeErr) {
            await sendTelegramMessage(chatId, '⚠️ Không thể cào URL đối thủ, AI sẽ tự động viết bài dựa trên tiêu đề URL.');
          }
        }

        const generated = await generateMarketingPost(isUrl ? `Viết lại bài viết tham khảo từ URL: ${argument}` : argument, competitorText || undefined);

        // Lưu bài viết nháp vào database
        const result = await queryRun(
          `INSERT INTO marketing_posts (topic, platform, content, status, main_key) VALUES (?, 'Facebook', ?, 'draft', ?)`,
          [generated.topic, generated.content, generated.key]
        );

        const draftId = result.lastID;

        const draftMsg = `📝 <b>BÀI VIẾT NHÁP ĐÃ TẠO (ID: #${draftId})</b>\n` +
          `<b>• Chủ đề:</b> ${generated.topic}\n` +
          `<b>• Hashtag chính:</b> ${generated.key}\n` +
          `<b>• Trạng thái:</b> Draft (Nháp)\n\n` +
          `-----------------------\n` +
          `${generated.content}\n` +
          `-----------------------\n\n` +
          `👉 Gõ <code>/dang ${draftId}</code> để đăng ngay bài viết này lên Fanpage.\n` +
          `👉 Gõ <code>/hengio YYYY-MM-DD HH:MM ${draftId}</code> để lên lịch đăng bài.`;

        await sendTelegramMessage(chatId, draftMsg);

      } catch (err: any) {
        console.error('Failed to generate post:', err);
        await sendTelegramMessage(chatId, `❌ Lỗi khi sinh bài viết: ${err.message}`);
      }
      return NextResponse.json({ ok: true });
    }

    // 4. Lệnh đăng ngay bài viết
    if (text.startsWith('/dang')) {
      const argument = text.substring(5).trim();
      if (!argument) {
        await sendTelegramMessage(chatId, '❌ Vui lòng nhập ID bài viết nháp hoặc nội dung cần đăng sau lệnh `/dang`.');
        return NextResponse.json({ ok: true });
      }

      await sendTelegramMessage(chatId, '🚀 Đang tiến hành đăng bài lên Fanpage...');

      try {
        let contentToPost = argument;
        let imageUrl: string | undefined = undefined;
        let dbId: number | null = null;
        let topic = 'Đăng trực tiếp từ Telegram';
        let key = '#SummitOutdoor';

        // Kiểm tra xem argument có phải là ID của bài nháp không
        const draftId = parseInt(argument, 10);
        if (!isNaN(draftId)) {
          const draft: any = await queryGet('SELECT * FROM marketing_posts WHERE id = ?', [draftId]);
          if (draft) {
            contentToPost = draft.content;
            imageUrl = draft.image_url || undefined;
            topic = draft.topic;
            key = draft.main_key;
            dbId = draft.id;
          } else {
            await sendTelegramMessage(chatId, `❌ Không tìm thấy bài viết nháp ID #${draftId} trong database.`);
            return NextResponse.json({ ok: true });
          }
        } else {
          // Kiểm tra xem dòng đầu tiên có chứa link ảnh hay không
          const lines = argument.split('\n');
          const firstLine = lines[0].trim();
          if (firstLine.startsWith('http://') || firstLine.startsWith('https://')) {
            imageUrl = firstLine;
            contentToPost = lines.slice(1).join('\n').trim();
          }
        }

        const publishResult = await publishToFacebook(contentToPost, imageUrl);

        if (publishResult.success && publishResult.id) {
          if (dbId) {
            // Cập nhật bài nháp hiện có thành đã đăng
            await queryRun(
              `UPDATE marketing_posts SET status = 'published', posted_at = datetime('now'), fb_post_id = ? WHERE id = ?`,
              [publishResult.id, dbId]
            );
          } else {
            // Thêm mới bài đăng trực tiếp vào lịch sử
            await queryRun(
              `INSERT INTO marketing_posts (topic, platform, content, image_url, status, posted_at, main_key, fb_post_id) VALUES (?, 'Facebook', ?, ?, 'published', datetime('now'), ?, ?)`,
              [topic, contentToPost, imageUrl || '', key, publishResult.id]
            );
          }
          await sendTelegramMessage(chatId, `✅ <b>ĐĂNG BÀI THÀNH CÔNG!</b>\n• FB Post ID: <code>${publishResult.id}</code>\n• Xem bài viết tại: https://facebook.com/${publishResult.id}`);
        } else {
          await sendTelegramMessage(chatId, `❌ Đăng bài thất bại: ${publishResult.error}`);
        }
      } catch (err: any) {
        await sendTelegramMessage(chatId, `❌ Lỗi hệ thống khi đăng bài: ${err.message}`);
      }
      return NextResponse.json({ ok: true });
    }

    // 5. Lệnh lên lịch đăng bài
    if (text.startsWith('/hengio ')) {
      const argument = text.substring(8).trim();
      // Định dạng: YYYY-MM-DD HH:MM [Nội dung hoặc ID bài nháp]
      const match = argument.match(/^(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2})\s+([\s\S]+)$/);
      if (!match) {
        await sendTelegramMessage(chatId, '❌ Định dạng lệnh hengio sai. Vui lòng nhập đúng:\n<code>/hengio YYYY-MM-DD HH:MM [ID bài nháp hoặc Nội dung]</code>\nVí dụ: <code>/hengio 2026-07-26 08:00 5</code>');
        return NextResponse.json({ ok: true });
      }

      const scheduledTimeStr = match[1];
      const postArg = match[2].trim();

      try {
        let content = postArg;
        let imageUrl: string | undefined = undefined;
        let topic = 'Bài đăng lên lịch';
        let key = '#SummitOutdoor';
        let dbId: number | null = null;

        const draftId = parseInt(postArg, 10);
        if (!isNaN(draftId)) {
          const draft: any = await queryGet('SELECT * FROM marketing_posts WHERE id = ?', [draftId]);
          if (draft) {
            content = draft.content;
            imageUrl = draft.image_url || undefined;
            topic = draft.topic;
            key = draft.main_key;
            dbId = draft.id;
          } else {
            await sendTelegramMessage(chatId, `❌ Không tìm thấy bài viết nháp ID #${draftId}.`);
            return NextResponse.json({ ok: true });
          }
        } else {
          const lines = postArg.split('\n');
          const firstLine = lines[0].trim();
          if (firstLine.startsWith('http://') || firstLine.startsWith('https://')) {
            imageUrl = firstLine;
            content = lines.slice(1).join('\n').trim();
          }
        }

        // Chuyển scheduledTime sang định dạng SQLite datetime hiểu được (UTC)
        // Lưu ý: Người dùng nhập giờ local (Việt Nam UTC+7). Ta cần convert sang UTC trước khi lưu để worker quét chính xác
        const localDate = new Date(scheduledTimeStr.replace(' ', 'T') + ':00+07:00');
        if (isNaN(localDate.getTime())) {
          await sendTelegramMessage(chatId, '❌ Thời gian lên lịch không hợp lệ.');
          return NextResponse.json({ ok: true });
        }
        const utcIsoStr = localDate.toISOString().replace('T', ' ').substring(0, 19);

        if (dbId) {
          await queryRun(
            `UPDATE marketing_posts SET status = 'scheduled', scheduled_time = ? WHERE id = ?`,
            [utcIsoStr, dbId]
          );
        } else {
          await queryRun(
            `INSERT INTO marketing_posts (topic, platform, content, image_url, status, scheduled_time, main_key) VALUES (?, 'Facebook', ?, ?, 'scheduled', ?, ?)`,
            [topic, content, imageUrl || '', utcIsoStr, key]
          );
        }

        await sendTelegramMessage(chatId, `⏰ <b>LÊN LỊCH THÀNH CÔNG!</b>\n• Đăng lúc: <b>${scheduledTimeStr} (Giờ VN)</b>\n• Trạng thái: Scheduled (Đang chờ đăng)`);
      } catch (err: any) {
        await sendTelegramMessage(chatId, `❌ Lỗi lên lịch: ${err.message}`);
      }
      return NextResponse.json({ ok: true });
    }

    // 6. Lệnh lên lịch tự động 7 ngày tiếp theo
    if (text === '/lich_7_ngay') {
      await sendTelegramMessage(chatId, '🤖 Bắt đầu lập kế hoạch 7 bài đăng cho 7 ngày tới...');

      try {
        const topics = [
          'Kỹ thuật chạy bộ địa hình đổ dốc downhill an toàn',
          'Cách chọn tất chuyên dụng tránh phồng rộp bàn chân',
          'Đánh giá chi tiết độ bám của Salomon Speedcross 6',
          'Bảo quản giày trail đúng cách để không bị mòn đế',
          'Cấp nước và điện giải thông minh cho cự ly Ultra trail',
          'Có nên mua giày trail chống nước Gore-Tex tại VN?',
          'Lựa chọn dung tích Vest nước phù hợp cự ly chạy trail'
        ];

        const baseDate = new Date(); // Thời gian hiện tại

        for (let i = 0; i < 7; i++) {
          const runDate = new Date(baseDate);
          runDate.setDate(baseDate.getDate() + i + 1); // Bắt đầu từ ngày mai
          runDate.setHours(9, 0, 0, 0); // Lên lịch vào lúc 9h sáng hàng ngày

          const scheduledUtcStr = runDate.toISOString().replace('T', ' ').substring(0, 19);
          const generated = await generateMarketingPost(topics[i]);

          await queryRun(
            `INSERT INTO marketing_posts (topic, platform, content, status, scheduled_time, main_key) VALUES (?, 'Facebook', ?, 'scheduled', ?, ?)`,
            [generated.topic, generated.content, scheduledUtcStr, generated.key]
          );
        }

        await sendTelegramMessage(chatId, `📅 <b>LẬP KẾ HOẠCH THÀNH CÔNG!</b>\n• Đã lên lịch thành công <b>7 bài viết</b> cho 7 ngày tới vào lúc <b>09:00 sáng hàng ngày</b>.\n• Gõ <code>/danhsach</code> để xem chi tiết lịch đăng.`);
      } catch (err: any) {
        await sendTelegramMessage(chatId, `❌ Lỗi lập lịch 7 ngày: ${err.message}`);
      }
      return NextResponse.json({ ok: true });
    }

    // 7. Lệnh xem danh sách bài viết
    if (text === '/danhsach') {
      try {
        const posts = await queryAll<any>(
          `SELECT id, topic, status, scheduled_time, posted_at FROM marketing_posts ORDER BY id DESC LIMIT 15`
        );

        if (!posts || posts.length === 0) {
          await sendTelegramMessage(chatId, '📭 Chưa có bài viết nào trong lịch sử và hàng đợi.');
          return NextResponse.json({ ok: true });
        }

        let listText = `📋 <b>DANH SÁCH BÀI VIẾT GẦN ĐÂY:</b>\n\n`;
        for (const post of posts) {
          let timeInfo = '';
          if (post.status === 'scheduled' && post.scheduled_time) {
            // Convert UTC back to Local VN (UTC+7) for user display
            const localDate = new Date(post.scheduled_time + 'Z');
            const vnTime = localDate.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            timeInfo = ` - Lên lịch: ${vnTime}`;
          } else if (post.status === 'published' && post.posted_at) {
            const localDate = new Date(post.posted_at + 'Z');
            const vnTime = localDate.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            timeInfo = ` - Đã đăng: ${vnTime}`;
          }

          const statusIcon = post.status === 'published' ? '✅' : post.status === 'scheduled' ? '⏰' : '📝';
          listText += `${statusIcon} <b>#${post.id}</b>: [${post.status.toUpperCase()}] ${post.topic}${timeInfo}\n\n`;
        }

        await sendTelegramMessage(chatId, listText);
      } catch (err: any) {
        await sendTelegramMessage(chatId, `❌ Lỗi truy vấn database: ${err.message}`);
      }
      return NextResponse.json({ ok: true });
    }

    // 8. Lệnh hủy bài lên lịch
    if (text.startsWith('/huy ')) {
      const idStr = text.substring(5).trim();
      const id = parseInt(idStr, 10);
      if (isNaN(id)) {
        await sendTelegramMessage(chatId, '❌ Vui lòng nhập đúng ID bài viết cần hủy sau lệnh `/huy`. Ví dụ: `/huy 5`');
        return NextResponse.json({ ok: true });
      }

      try {
        const post: any = await queryGet('SELECT * FROM marketing_posts WHERE id = ?', [id]);
        if (!post) {
          await sendTelegramMessage(chatId, `❌ Không tìm thấy bài viết ID #${id}.`);
          return NextResponse.json({ ok: true });
        }

        await queryRun('DELETE FROM marketing_posts WHERE id = ?', [id]);
        await sendTelegramMessage(chatId, `🗑️ Đã xóa/hủy bài viết ID #${id} thành công.`);
      } catch (err: any) {
        await sendTelegramMessage(chatId, `❌ Lỗi khi hủy bài viết: ${err.message}`);
      }
      return NextResponse.json({ ok: true });
    }

    // 9. Lệnh báo cáo doanh thu hôm nay
    if (text === '/baocao') {
      try {
        const report = await getTodayReport();
        await sendTelegramMessage(chatId, report);
      } catch (err: any) {
        await sendTelegramMessage(chatId, `❌ Lỗi khi xuất báo cáo: ${err.message}`);
      }
      return NextResponse.json({ ok: true });
    }

    // 10. Lệnh duyệt đơn hàng
    if (text.startsWith('/duyet ')) {
      const orderCodeArg = text.substring(7).trim();
      try {
        const resultMessage = await confirmOrder(orderCodeArg);
        await sendTelegramMessage(chatId, resultMessage);
      } catch (err: any) {
        await sendTelegramMessage(chatId, `❌ Lỗi khi duyệt đơn: ${err.message}`);
      }
      return NextResponse.json({ ok: true });
    }

    // Lệnh không khớp
    await sendTelegramMessage(chatId, '❓ Lệnh không hợp lệ. Gõ <code>/help</code> hoặc <code>/trogiup</code> để xem hướng dẫn.');
    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error('Telegram Webhook error:', err);
    return NextResponse.json({ ok: true }); // Telegram yêu cầu trả về HTTP 200 để tránh spam gửi lại webhook
  }
}
