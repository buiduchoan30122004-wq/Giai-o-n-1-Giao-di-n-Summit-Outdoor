"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './Chatbot.module.css';
import Link from 'next/link';
import RecommendationPopup, { RecommendationData } from './RecommendationPopup';
import { productsDatabase } from '@/data/products';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  isFormLink?: boolean;
  showHotline?: boolean;
  recommendedProducts?: any[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Chào bạn, cảm ơn bạn đã quan tâm đến Summit Outdoor! Bạn đang tìm kiếm một đôi giày trail cho giải chạy sắp tới, hay cần tư vấn phụ kiện (vest, gậy) để bắt đầu tập luyện vậy? Bạn cứ thoải mái chia sẻ cự ly và mục tiêu nhé!',
      showHotline: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const renderMessageText = (text: string) => {
    return text.split('\n').map((line, lineIndex) => {
      const parts = [];
      let lastIndex = 0;
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;

      while ((match = linkRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        const label = match[1];
        const url = match[2];
        parts.push(
          <Link 
            key={match.index} 
            href={url} 
            style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 600 }}
          >
            {label}
          </Link>
        );
        lastIndex = linkRegex.lastIndex;
      }

      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return (
        <p key={lineIndex} style={{ margin: lineIndex > 0 ? '8px 0 0 0' : 0 }}>
          {parts.length > 0 ? parts : line}
        </p>
      );
    });
  };

  const getMatchingProducts = (data: RecommendationData) => {
    const type = data.product_type;
    const terrain = data.terrain;
    const priority = data.priority;
    const budget = data.budget;

    const allProducts = Object.values(productsDatabase);
    let filtered = [...allProducts];

    // 1. Filter by category type
    if (type.includes('Giày Trail') || type.includes('Giày Hiking')) {
      filtered = allProducts.filter(p => 
        p.id === 'xt6' || p.id === 'speedgoat' || p.id === 'pegasus' || 
        p.id === 'slab' || p.id === 'xt4' || p.id === 'speedcross' || 
        p.id === 'senseride' || p.id === 'wildhorse' || 
        p.id === 'speedcross-w' || p.id === 'speedgoat-w' || p.id === 'pegasus-w'
      );
      
      // Sort by relevance score
      filtered.sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        // Priority match
        if (priority === 'Êm') {
          if (a.specs.cushioning.includes('Max') || a.specs.cushioning.includes('Êm')) scoreA += 3;
          if (b.specs.cushioning.includes('Max') || b.specs.cushioning.includes('Êm')) scoreB += 3;
        } else if (priority === 'Bám tốt') {
          if (a.specs.terrain.toLowerCase().includes('bùn') || a.features.some(f => f.toLowerCase().includes('bám'))) scoreA += 3;
          if (b.specs.terrain.toLowerCase().includes('bùn') || b.features.some(f => f.toLowerCase().includes('bám'))) scoreB += 3;
        } else if (priority === 'Nhẹ') {
          if (parseInt(a.specs.weight) < 280) scoreA += 3;
          if (parseInt(b.specs.weight) < 280) scoreB += 3;
        }

        // Terrain match
        if (a.specs.terrain.toLowerCase().includes(terrain.toLowerCase())) scoreA += 2;
        if (b.specs.terrain.toLowerCase().includes(terrain.toLowerCase())) scoreB += 2;

        // Budget match
        const parsePrice = (pStr: string) => parseInt(pStr.replace(/\./g, '').replace('đ', ''));
        const priceA = parsePrice(a.price);
        const priceB = parsePrice(b.price);

        if (budget === 'Dưới 2 triệu') {
          if (priceA < 3000000) scoreA += 2;
          if (priceB < 3000000) scoreB += 2;
        } else if (budget === '2–4 triệu') {
          if (priceA >= 2000000 && priceA <= 4000000) scoreA += 2;
          if (priceB >= 2000000 && priceB <= 4000000) scoreB += 2;
        } else if (budget === '4–6 triệu') {
          if (priceA >= 4000000 && priceA <= 6000000) scoreA += 2;
          if (priceB >= 4000000 && priceB <= 6000000) scoreB += 2;
        } else {
          if (priceA > 5000000) scoreA += 2;
          if (priceB > 5000000) scoreB += 2;
        }

        return scoreB - scoreA;
      });

    } else if (type.includes('Vest') || type.includes('nước')) {
      filtered = allProducts.filter(p => p.id === 'hydration-vest' || p.id === 'flask-500' || p.id === 'trail-socks' || p.id === 'garmin-fenix');
    } else if (type.includes('Dinh dưỡng')) {
      filtered = allProducts.filter(p => p.id === 'gu-tabs' || p.id === 'gu-gel-real' || p.id === 'lecka-bar' || p.id === 'pillar-recovery-berry');
    } else {
      filtered = allProducts.filter(p => p.id === 'xt6' || p.id === 'hydration-vest' || p.id === 'trail-socks' || p.id === 'gu-tabs');
    }

    return filtered.slice(0, 4);
  };

  const handleRecommendationSubmit = (data: RecommendationData) => {
    setIsRecommendOpen(false);

    // Show a summary message in chat as User
    const summaryText = `📋 Thông tin khảo sát đã điền:
- Sản phẩm cần tìm: ${data.product_type}
- Kinh nghiệm: ${data.experience}
- Cự ly: ${data.distance}
- Địa hình: ${data.terrain}
- Ưu tiên: ${data.priority}
- Size giày: ${data.shoe_size || 'Chưa cung cấp'}
- Thương hiệu đang dùng: ${data.current_brand}
- Ngân sách: ${data.budget}
- Vấn đề: ${data.foot_issue.length > 0 ? data.foot_issue.join(', ') : 'Không có'}
- Người liên hệ: ${data.name || 'Khách hàng'} ${data.phone ? `(${data.phone})` : ''}`;

    setMessages(prev => [
      ...prev,
      { sender: 'user', text: summaryText }
    ]);

    // Set generating/loading state
    setIsGenerating(true);

    // After 1.2 seconds, reply with exactly the 5 short bullets and the 4 products!
    setTimeout(() => {
      const matched = getMatchingProducts(data);
      const botResponseText = `💡 Kết quả tư vấn chọn sản phẩm dành cho bạn:
- Nhu cầu: Tìm kiếm ${data.product_type} phù hợp.
- Hồ sơ: Chạy cự ly ${data.distance} trên địa hình ${data.terrain} (${data.experience}).
- Ưu tiên: Tiêu chí ${data.priority} với mức ngân sách ${data.budget}.
- Size chân: Cỡ ${data.shoe_size || 'Chưa cung cấp'} (Vấn đề: ${data.foot_issue.length > 0 && !data.foot_issue.includes('Không có') ? data.foot_issue.join(', ') : 'Không đáng ngại'}).
- Đề xuất: 4 sản phẩm tối ưu nhất bên dưới dành riêng cho bạn.`;

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: botResponseText,
          recommendedProducts: matched,
          showHotline: true
        }
      ]);
      setIsGenerating(false);
    }, 1200);
  };

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
    },
    {
      q: 'Để tôi suy nghĩ thêm',
      keywords: ['suy nghĩ', 'suy nghi', 'xem thêm', 'xem them', 'tham khảo', 'tham khao', 'để sau', 'de sau', 'chưa mua', 'chua mua'],
      a: 'Dạ vâng ạ. Bạn cứ thong thả tham khảo thêm nhé. Bất cứ khi nào bạn cần hỗ trợ thêm thông tin hoặc tư vấn mẫu mã, bạn cứ nhắn tin ở đây cho mình nhé!'
    },
    {
      q: 'Cảm ơn bạn',
      keywords: ['cảm ơn', 'cam on', 'thank', 'ok', 'oke', 'dạ vâng', 'da vang', 'ok nhé', 'ok nhe'],
      a: 'Dạ không có gì ạ! Rất vui được hỗ trợ bạn. Chúc bạn tìm được sản phẩm ưng ý và có những buổi chạy trail thật tuyệt vời!'
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

    // Check for explicit "chốt đơn" / "mua hàng" / "tư vấn" / "phù hợp" intent
    if (
      cleanText.includes('chốt') || 
      cleanText.includes('mua') || 
      cleanText.includes('đặt hàng') || 
      cleanText.includes('dat hang') || 
      cleanText.includes('lấy đôi') ||
      cleanText.includes('lay doi') ||
      cleanText.includes('lên đơn') ||
      cleanText.includes('len don') ||
      cleanText.includes('order') ||
      cleanText.includes('phù hợp') ||
      cleanText.includes('phu hop') ||
      cleanText.includes('tư vấn') ||
      cleanText.includes('tu van') ||
      cleanText.includes('chọn giày') ||
      cleanText.includes('chon giay') ||
      cleanText.includes('chọn sản phẩm') ||
      cleanText.includes('giày nào') ||
      cleanText.includes('giay nao')
    ) {
      replyText = 'Tôi cần bạn cung cấp một số thông tin để tôi chọn sản phẩm phù hợp cho bạn. Bạn dành chút thời gian điền thông tin vào biểu mẫu dưới đây nhé!';
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
        replyText = 'Mình chưa rõ câu hỏi của bạn lắm. Bạn có thể nhấn nút "Tôi muốn mua hàng" bên dưới để mở form khảo sát giúp mình tư vấn dòng giày phù hợp nhất, hoặc hỏi về "size chân", "chống nước", "chọn vest" để mình hỗ trợ nhé!';
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
                  {renderMessageText(msg.text)}
                  
                  {msg.isFormLink && (
                    <div className={styles.formLinkBox}>
                      <button 
                        type="button"
                        onClick={() => setIsRecommendOpen(true)}
                        className={styles.formBtn}
                        style={{ border: 'none', width: '100%', cursor: 'pointer', display: 'block' }}
                      >
                        🔗 Điền form tư vấn tại đây
                      </button>
                      <p className={styles.formNote}>Sau khi gửi form, bạn nhắn lại ở đây để mình check và hỗ trợ đề xuất mẫu giày phù hợp ngay nhé!</p>
                    </div>
                  )}

                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className={styles.productRow}>
                      {msg.recommendedProducts.map((p) => (
                        <Link 
                          key={p.id}
                          href={`/product/${p.id}`}
                          className={styles.miniProductCard}
                        >
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            className={styles.miniProductImg}
                          />
                          <p className={styles.miniProductName}>{p.name}</p>
                          <span className={styles.miniProductPrice}>{p.price}</span>
                        </Link>
                      ))}
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
            {isGenerating && (
              <div className={`${styles.messageWrapper} ${styles.botWrapper}`}>
                <div className={`${styles.messageBubble} ${styles.botBubble} ${styles.loadingBubble}`}>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Swipes */}
          <div className={styles.quickReplies}>
            <div className={styles.quickRepliesScroll}>
              <button 
                className={styles.quickReplyBtn} 
                onClick={() => {
                  handleSend('Tôi muốn mua hàng');
                }}
              >
                🛒 Tôi muốn mua hàng
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

      <RecommendationPopup 
        isOpen={isRecommendOpen}
        onClose={() => setIsRecommendOpen(false)}
        onSubmit={handleRecommendationSubmit}
      />
    </div>
  );
}
