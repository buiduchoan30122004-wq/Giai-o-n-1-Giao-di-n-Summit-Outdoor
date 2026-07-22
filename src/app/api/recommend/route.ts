import { NextResponse } from 'next/server';
import { productsDatabase } from '@/data/products';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is not set. Using fallback recommendation engine.');
      const fallbackResponse = generateFallbackRecommendation(data);
      return NextResponse.json({ recommendation: fallbackResponse });
    }

    // Format the product database catalog for the AI context
    const catalogSummary = Object.values(productsDatabase)
      .map(p => `ID: ${p.id}
Tên: ${p.name}
Thương hiệu: ${p.brand}
Giá: ${p.price}
Địa hình phù hợp: ${p.specs.terrain}
Đặc tính: Cushioning=${p.specs.cushioning}, Weight=${p.specs.weight}, Support=${p.specs.support}, Drop=${p.specs.drop}
Mô tả: ${p.description}
Tính năng nổi bật: ${p.features.join(', ')}
---`)
      .join('\n');

    // Build system instructions and user questionnaire context
    const prompt = {
      contents: [
        {
          parts: [
            {
              text: `Bạn là Trợ lý chuyên gia chạy bộ địa hình và dã ngoại tại Summit Outdoor. 
Nhiệm vụ của bạn là tư vấn và giới thiệu sản phẩm phù hợp nhất cho khách hàng dựa trên kết quả khảo sát dưới đây.

Dưới đây là DANH SÁCH SẢN PHẨM HIỆN CÓ TRONG CỬA HÀNG của chúng tôi:
${catalogSummary}

Dưới đây là HỒ SƠ KHẢO SÁT CỦA KHÁCH HÀNG:
- Loại sản phẩm quan tâm: ${data.product_type || 'Chưa chọn'}
- Kinh nghiệm chạy trail: ${data.experience || 'Chưa chọn'}
- Cự ly chạy thường xuyên: ${data.distance || 'Chưa chọn'}
- Địa hình ưu thích: ${data.terrain || 'Chưa chọn'}
- Tiêu chí ưu tiên hàng đầu: ${data.priority || 'Chưa chọn'}
- Size giày hiện tại: ${data.shoe_size || 'Chưa khai báo'}
- Thương hiệu đang chạy: ${data.current_brand || 'Chưa khai báo'}
- Ngân sách: ${data.budget || 'Chưa chọn'}
- Vấn đề chân gặp phải: ${data.foot_issue ? data.foot_issue.join(', ') : 'Không có'}
- Tên khách hàng: ${data.name || 'Khách hàng'}
- Số điện thoại: ${data.phone || 'Chưa cung cấp'}
- Email: ${data.email || 'Chưa cung cấp'}

Yêu cầu phản hồi:
1. Giao tiếp thân thiện, xưng hô lịch sự (Ví dụ: "chào anh/chị [Tên]", xưng "mình/Summit Outdoor").
2. Phân tích ngắn gọn nhu cầu & hồ sơ của khách hàng dựa trên thông tin đã cung cấp.
3. Đề xuất từ 3–5 sản phẩm PHÙ HỢP NHẤT trong danh sách sản phẩm ở trên. KHÔNG tự ý bịa ra sản phẩm không có trong danh sách.
4. Với mỗi sản phẩm được đề xuất, hãy:
   - Giải thích lý do vì sao sản phẩm này lại phù hợp với họ (ví dụ: bám tốt trên địa hình núi đá, đệm êm giảm đau gối...).
   - Đưa ra so sánh nhanh ưu/nhược điểm.
   - Gợi ý kích cỡ (size) giày hoặc thông tin bổ trợ tương ứng nếu khách có điền thông tin size hiện tại.
   - Đính kèm LINK SẢN PHẨM bằng cú pháp markdown: [Tên Sản Phẩm](/product/[id]) (Ví dụ: [Salomon XT-6 GORE-TEX](/product/xt6)). Lưu ý dùng link tương đối '/product/[id]' chính xác theo ID trong danh sách.
5. Cuối cùng, lịch sự hỏi khách xem họ có muốn nhân viên tư vấn của Summit Outdoor trực tiếp gọi điện/nhắn tin hỗ trợ sâu thêm qua SĐT/Email họ đã cung cấp hay không.

Hãy trình bày rõ ràng, phân cấp bullet points rõ ràng để khách hàng dễ đọc trên ô chat.`
            }
          ]
        }
      ]
    };

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prompt),
      });

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('Empty response text from Gemini');
      }

      return NextResponse.json({ recommendation: text });
    } catch (apiError) {
      console.error('Failed to query Gemini API, falling back to local recommendation engine:', apiError);
      const fallbackResponse = generateFallbackRecommendation(data);
      return NextResponse.json({ recommendation: fallbackResponse });
    }
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Fallback recommendation engine in case AI fails or is unconfigured
function generateFallbackRecommendation(data: any): string {
  const name = data.name || 'bạn';
  const type = data.product_type || 'Giày Trail Running';
  
  let result = `Chào anh/chị ${name}, Summit Outdoor đã nhận được thông tin khảo sát tư vấn của bạn. Dưới đây là phân tích và đề xuất các sản phẩm phù hợp nhất dành cho bạn:\n\n`;

  if (type.includes('Giày Trail') || type.includes('Giày Hiking')) {
    result += `### Phân tích nhu cầu chạy địa hình của bạn:
- Bạn quan tâm đến dòng giày chạy trail phù hợp cho địa hình ${data.terrain || 'hỗn hợp'}, ưu tiên tiêu chí **${data.priority || 'Êm ái / Bám đường'}**.
- Ngân sách dự kiến: **${data.budget || 'Từ 2–4 triệu'}**.

### Top sản phẩm đề xuất tốt nhất tại Summit Outdoor:

1. **[Salomon XT-6 GORE-TEX](/product/xt6)** (Giá: 4.800.000đ)
   - *Tại sao phù hợp:* Dòng giày huyền thoại siêu bền, trang bị màng GORE-TEX chống thấm nước tuyệt đối, bám đường cực chắc trên địa hình ${data.terrain || 'phức tạp'}. Rất hợp với size chân ${data.shoe_size || 'của bạn'}.
   - *Ưu điểm:* Chống nước, bền bỉ, thời trang.
   - *Nhược điểm:* Giá phân khúc cao cấp, đệm hơi cứng lúc mới đi.

2. **[Hoka Speedgoat 5](/product/speedgoat)** (Giá: 3.850.000đ)
   - *Tại sao phù hợp:* Đệm cực dày (Max Cushion) hấp thụ chấn động rất tốt, cực kỳ thích hợp nếu bạn có lo ngại về vấn đề ${data.foot_issue && data.foot_issue.length > 0 ? data.foot_issue.join(', ') : 'mỏi cơ/đau khớp'}. Đế Vibram bám đất đá tốt.
   - *Ưu điểm:* Siêu êm, nhẹ, bám đường bùn đất tuyệt hảo.
   - *Nhược điểm:* Đế dày đi không có cảm giác địa hình thật chân.

3. **[Nike Pegasus Trail 4](/product/pegasus)** (Giá: 3.990.000đ)
   - *Tại sao phù hợp:* Phù hợp nhất cho cự ly ${data.distance || 'ngắn đến trung bình'}. Đệm React êm ái, chuyển tiếp mượt mà nếu bạn chạy cả đường hỗn hợp nhựa đô thị và đường đất đỏ.
   - *Ưu điểm:* Đa năng, êm nảy tốt, thiết kế hiện đại thời thượng.
   - *Nhược điểm:* Không phù hợp lắm cho địa hình sình lầy hoặc leo núi quá kỹ thuật.`;
  } else if (type.includes('Vest') || type.includes('nước')) {
    result += `### Đề xuất phụ kiện giữ nước phù hợp:

1. **[Balo Nước Active Skin 8](/product/hydration-vest)** (Giá: 2.850.000đ)
   - *Tại sao phù hợp:* Ôm sát cơ thể chống rung lắc khi chạy. Đi kèm sẵn 2 bình nước mềm 500ml, thể tích chứa đồ 8L đủ cho các buổi chạy dài từ 21km đến 70km.
   - *Ưu điểm:* Ôm khít, thoáng khí tốt.
   - *Nhược điểm:* Cần vệ sinh kỹ sau mỗi lần sử dụng.

2. **[Bình Nước Mềm Soft Flask 500ml](/product/flask-500)** (Giá: 550.000đ)
   - *Tại sao phù hợp:* Nhỏ gọn, tự xẹp lại khi uống tránh xóc nước. Hoàn toàn không chứa BPA độc hại.`;
  } else if (type.includes('Dinh dưỡng')) {
    result += `### Đề xuất dinh dưỡng & năng lượng bổ trợ:

1. **[Gel Năng Lượng GU Energy Gel Vị Dâu Chuối](/product/gu-gel-real)** (Giá: 45.000đ/gói)
   - *Tại sao phù hợp:* Cung cấp 100 calo tức thì, dễ tiêu hóa, có bổ sung điện giải chống chuột rút khi chạy cự ly dài.

2. **[Thanh Năng Lượng Tự Nhiên Lecka](/product/lecka-bar)** (Giá: 40.000đ/thanh)
   - *Tại sao phù hợp:* 100% nguyên liệu tự nhiên thuần chay, thích hợp ăn nhẹ khi trekking dã ngoại, bao bì tự phân hủy bảo vệ môi trường.

3. **[Vi Chất Magie Phục Hồi Pillar Triple Magnesium](/product/pillar-recovery-berry)** (Giá: 40.000đ/gói)
   - *Tại sao phù hợp:* Giúp giãn cơ sâu, chống chuột rút đêm và tăng cường chất lượng giấc ngủ sau buổi vận động nặng.`;
  } else {
    result += `### Đề xuất phụ kiện chạy bộ tiêu biểu:

1. **[Tất Chạy Trail PRS V4.0](/product/trail-socks)** (Giá: 450.000đ)
   - *Tại sao phù hợp:* Gia cố đệm 3D.Dots ngăn phồng rộp chân khi di chuyển địa hình đồi núi dốc đá.
   
2. **[Đồng Hồ Fenix 7 Pro Sapphire Solar](/product/garmin-fenix)** (Giá: 18.990.000đ)
   - *Tại sao phù hợp:* Dẫn đường topo offline chuyên nghiệp, pin năng lượng mặt trời kéo dài nhiều tuần cho các cung đường hoang dã.`;
  }

  result += `\n\nHiện tại các sản phẩm trên đang có sẵn size tại kho của Summit Outdoor. Bạn có muốn nhân viên hỗ trợ trực tiếp tư vấn sâu hơn qua thông tin liên hệ của bạn không ạ?`;
  return result;
}
