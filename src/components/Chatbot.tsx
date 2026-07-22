"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './Chatbot.module.css';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  isFormLink?: boolean;
  showHotline?: boolean;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Chào bạn, cảm ơn bạn đã quan tâm đến Summit Outdoor! Bạn đang tìm kiếm một đôi giày trail cho giải chạy sắp tới, hay cần tư vấn phụ kiện (vest, gậy) để bắt đầu tập luyện vậy? Bạn cứ thoải mái chia sẻ cự ly và mục tiêu nhé!',
      showHotline: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const faqs = [
    {
      q: 'Trail khác road running thế nào?',
      keywords: ['trail', 'road', 'khác biệt', 'khac nhau', 'phân biệt', 'chay trail là gì'],
      a: 'Chạy trail là chạy trên địa hình tự nhiên (núi, đồi, đường đất). Bạn chắc chắn nên có giày trail vì đế giày có các gai (grip) giúp bám đất, chống trượt trên bùn đá và bảo vệ ngón chân tốt hơn hẳn giày chạy đường nhựa.'
    },
    {
      q: 'Người mới chạy trail sắm gì trước?',
      keywords: ['mới', 'bắt đầu', 'sam gi', 'mua gì', 'sắm gì', 'phụ kiện', 'cần những gì', 'đồ dùng'],
      a: 'Với người mới, 3 món quan trọng nhất bạn cần ưu tiên đầu tư là: 1. Giày trail (an toàn và bám đường); 2. Vest nước hoặc Bình mềm (cấp nước liên tục); 3. Tất chạy chuyên dụng (tránh phồng rộp). Quần áo thì ưu tiên đồ thoáng khí. Các đồ chuyên dụng khác như gậy hay áo chống mưa bạn có thể sắm sau tùy thuộc vào độ khó của giải.'
    },
    {
      q: 'Làm sao chọn đúng size online?',
      keywords: ['size', 'đo chân', 'chọn size', 'online', 'kích thước', 'vừa chân', 'bảng size'],
      a: 'Kinh nghiệm thực tế là bạn nên chọn giày trail lớn hơn giày đi làm/giày road khoảng 0.5 size. Khi chạy, đặc biệt lúc đổ dốc, chân có xu hướng trượt tới trước; nếu giày quá sát sẽ gây bầm đen ngón chân. Bạn đo chiều dài bàn chân (cm) rồi gửi cho mình để đối chiếu bảng size chuẩn của hãng nhé.'
    },
    {
      q: 'Form giày các hãng thế nào?',
      keywords: ['form', 'hãng', 'rộng', 'hẹp', 'bè', 'chân bè', 'ôm chân', 'nhãn hiệu', 'thương hiệu'],
      a: 'Mỗi thương hiệu có triết lý riêng: Altra nổi bật với mũi giày (toe-box) cực kỳ rộng cho ngón chân thoái mái; HOKA tập trung vào đệm siêu êm; trong khi Salomon hay La Sportiva thường ôm sát chân hơn để tăng độ ổn định trên địa hình đá kỹ thuật. Bạn cho mình biết form chân của bạn (bè hay thon) để mình gợi ý hãng phù hợp.'
    },
    {
      q: 'Bao lâu thì nên thay giày?',
      keywords: ['bao lâu', 'thay giày', 'tuổi thọ', 'bền', 'hỏng', 'mòn đế', 'thay giay'],
      a: 'Thông thường một đôi giày trail duy trì độ êm và độ bám tốt trong khoảng 600–800 km. Tuy nhiên, nếu bạn thường xuyên chạy trên mặt đá gồ ghề, gai đế (grip) có thể sẽ mòn nhanh hơn. Khi thấy gai đế mòn phẳng hoặc cảm giác đệm hết êm, đó là lúc nên cân nhắc thay.'
    },
    {
      q: 'Giày trail chạy road được không?',
      keywords: ['chạy road', 'đường nhựa', 'chay road', 'nhựa', 'phố', 'đường bê tông'],
      a: 'Bạn hoàn toàn có thể mang chạy road, nhưng mình không khuyến khích. Mặt đường nhựa cứng và ma sát cao sẽ làm các gai cao su dưới đế giày trail mòn rất nhanh, gây lãng phí và giảm tuổi thọ của giày khi đem trở lại địa hình rừng núi.'
    },
    {
      q: 'Tư vấn chọn Vest nước?',
      keywords: ['vest', 'balo', 'đựng nước', 'bình mềm', 'lít', 'lit', 'hydration'],
      a: 'Vest chạy ôm sát người để chống rung. Nếu bạn chạy dưới 20km, vest 3-5 lít là đủ mang nước và chút điện giải. Từ 21km đến 50km, bạn nên chọn loại 5-8 lít. Với cự ly Ultra (70km+), bạn sẽ cần vest lớn từ 10-12 lít để mang đủ dụng cụ bắt buộc (áo khoác, chăn giữ nhiệt, đèn pin, đồ ăn).'
    },
    {
      q: 'Có nên mua giày chống nước?',
      keywords: ['chống nước', 'chong nuoc', 'gtx', 'gore-tex', 'lội suối', 'loi suoi', 'mưa', 'thấm nước'],
      a: 'Chỉ nên mua giày GTX nếu bạn chạy ở nơi khí hậu lạnh hoặc mưa tuyết. Ở môi trường nóng ẩm, nếu lội suối nước tràn qua cổ giày vào trong thì bản GTX sẽ không thoát nước ra được. Thay vào đó, bạn nên ưu tiên giày bản lưới thoáng khí thông thường, kết hợp với tất tốt, nước vào sẽ tự động thoát ra rất nhanh.'
    },
    {
      q: 'Chính sách bảo hành và nguồn gốc?',
      keywords: ['bảo hành', 'chính hãng', 'uy tín', 'đổi trả', 'fake', 'nhái', 'nguồn gốc', 'doi size'],
      a: 'Tại Summit Outdoor, tất cả sản phẩm đều cam kết chính hãng 100% với hóa đơn đầy đủ. Nếu bạn nhận hàng thử không vừa, bên mình hỗ trợ đổi size nhanh chóng. Sản phẩm cũng được áp dụng bảo hành lỗi kỹ thuật từ nhà sản xuất.'
    },
    {
      q: 'Thời gian ship và phí giao hàng?',
      keywords: ['ship', 'vận chuyển', 'giao hàng', 'thời gian', 'cần gấp', 'phi ship', 'bao lâu nhận'],
      a: 'Bên mình giao hàng toàn quốc. Thường sẽ mất khoảng 1-2 ngày nếu bạn ở trung tâm, và 3-4 ngày với các tỉnh xa. Hiện tại một số mẫu đang có sẵn tại kho, nếu bạn chốt sớm mình sẽ ưu tiên đóng gói gửi đi ngay trong ngày hôm nay.'
    }
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const newMessages: Message[] = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setInputValue('');

    // Generate bot reply
    setTimeout(() => {
      const reply = getBotReply(text);
      setMessages(prev => [...prev, reply]);
    }, 600);
  };

  const getBotReply = (text: string): Message => {
    const cleanText = text.toLowerCase().trim();
    let replyText = '';
    let isFormLink = false;

    // Check for explicit "chốt đơn" / "mua hàng" intent
    if (
      cleanText.includes('chốt') || 
      cleanText.includes('mua') || 
      cleanText.includes('đặt hàng') || 
      cleanText.includes('dat hang') || 
      cleanText.includes('lấy đôi') ||
      cleanText.includes('lay doi') ||
      cleanText.includes('lên đơn') ||
      cleanText.includes('len don') ||
      cleanText.includes('order')
    ) {
      replyText = 'Dựa trên cự ly và form chân của bạn, Salomon XT-6 GORE-TEX là lựa chọn tối ưu nhất. Mẫu này đang sẵn hàng đúng size của bạn tại kho.\n\nBạn dành chút thời gian điền thông tin nhận hàng (Tên, SĐT, Địa chỉ) vào biểu mẫu dưới đây để mình lên đơn gửi đi ngay nhé!';
      isFormLink = true;
    } else {
      // Search in FAQs
      let found = false;
      for (const faq of faqs) {
        if (faq.keywords.some(keyword => cleanText.includes(keyword))) {
          replyText = faq.a;
          found = true;
          break;
        }
      }

      if (!found) {
        // Default fallback (friendly, helpful, prompting FAQs)
        replyText = 'Mình đã nhận được thông tin từ bạn. Với tư cách là một chuyên gia tư vấn chạy bộ tại Summit Outdoor, mình khuyên bạn nên lựa chọn các nút hỏi nhanh bên dưới, hoặc gõ rõ các từ khóa liên quan đến "size chân", "chống nước", "chọn vest", "giao hàng" hoặc "chốt đơn" để mình trả lời ngay lập tức nhé!';
      }
    }

    return {
      sender: 'bot',
      text: replyText,
      isFormLink,
      showHotline: true
    };
  };

  return (
    <div className={styles.chatbotContainer}>
      {/* Cửa sổ Chat */}
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.botInfo}>
              <div className={styles.avatar}>
                <img src="/icon.svg" className={styles.avatarImg} alt="Summit Outdoor Logo" />
              </div>
              <div>
                <h4 className={styles.chatTitle} translate="no">Trợ lý Summit Outdoor</h4>
                <span className={styles.chatSubtitle}>Chuyên gia chạy trail 24/7</span>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Đóng Chat">
              &times;
            </button>
          </div>

          {/* Messages Area */}
          <div className={styles.chatBody}>
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.messageWrapper} ${msg.sender === 'user' ? styles.userWrapper : styles.botWrapper}`}>
                <div className={`${styles.messageBubble} ${msg.sender === 'user' ? styles.userBubble : styles.botBubble}`}>
                  {msg.text.split('\n').map((para, i) => (
                    <p key={i} style={{ margin: i > 0 ? '8px 0 0 0' : 0 }}>{para}</p>
                  ))}
                  
                  {msg.isFormLink && (
                    <div className={styles.formLinkBox}>
                      <a 
                        href="https://script.google.com/macros/s/AKfycbzPKq7oWAuMOA2DujKp3_crxnaaJrw7Ul3XMqQwmtHsU8LVeakvcSj7FDGsPHXF5iPDaw/exec"
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.formBtn}
                      >
                        🔗 Điền form nhận hàng tại đây
                      </a>
                      <p className={styles.formNote}>Sau khi gửi form, bạn phản hồi lại một tiếng để mình kiểm tra trên hệ thống gửi mã vận đơn nhé!</p>
                    </div>
                  )}

                  {msg.showHotline && (
                    <div className={styles.hotlineBox}>
                      <a href="tel:0904759624" className={styles.hotlineBtn}>
                        📞 Hotline: 0904759624
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Swipes */}
          <div className={styles.quickReplies}>
            <div className={styles.quickRepliesScroll}>
              <button className={styles.quickReplyBtn} onClick={() => handleSend('Chốt đơn hàng')}>
                🛒 Tôi muốn chốt đơn!
              </button>
              {faqs.map((faq, index) => (
                <button 
                  key={index} 
                  className={styles.quickReplyBtn}
                  onClick={() => handleSend(faq.q)}
                >
                  ❓ {faq.q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form 
            className={styles.chatInputForm}
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
          >
            <input
              type="text"
              placeholder="Nhập câu hỏi của bạn..."
              className={styles.chatInput}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className={styles.sendBtn} aria-label="Gửi">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Nút tròn Trigger nổi góc dưới bên phải */}
      <button 
        className={`${styles.chatbotTrigger} ${isOpen ? styles.triggerOpen : styles.triggerClosed}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Hỏi đáp hỗ trợ"
      >
        <div className={styles.triggerIcon}>
          {isOpen ? (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          )}
        </div>
        {!isOpen && <span className={styles.tooltip}>Hỏi chuyên gia</span>}
      </button>
    </div>
  );
}
