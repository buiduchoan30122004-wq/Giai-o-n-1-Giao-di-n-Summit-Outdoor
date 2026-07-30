"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./Chatbot.module.css";
import { useLanguage } from "../context/LanguageContext";

type Message = {
  id: string;
  text: string;
  sender: "bot" | "user";
};

// Dữ liệu từ sales_script.md và objections (tiếng Việt)
const botDataVi = [
  {
    keywords: ["giá", "đắt", "cao"],
    answer: "Chào bạn, mình hiểu băn khoăn của bạn. Tuy nhiên, giày trail chuyên dụng là một khoản đầu tư rất xứng đáng để bảo vệ an toàn cho đôi chân trên địa hình đồi núi, giúp tránh lật sơ mi hay bầm ngón chân. Độ bền của nó cũng cao hơn hẳn so với giày thông thường. Nếu bạn có một mức ngân sách cụ thể, bạn chia sẻ để mình gợi ý mẫu tối ưu nhất nhé!",
  },
  {
    keywords: ["size", "chọn size", "vừa", "rộng"],
    answer: "Kinh nghiệm thực tế là bạn nên chọn giày trail lớn hơn giày đi làm/giày road khoảng 0.5 - 1 size. Khi xuống dốc chân có xu hướng trượt tới trước, nếu giày quá sát sẽ gây bầm ngón chân. Đặc biệt bên mình hỗ trợ đổi size tận nhà nên bạn hoàn toàn không lo mua nhầm đâu ạ.",
  },
  {
    keywords: ["mới chạy", "chưa kinh nghiệm", "chưa biết"],
    answer: "Với người mới, sự an toàn và thoải mái là ưu tiên số 1. Bạn chia sẻ thêm về cự ly giải sắp tới và địa hình chủ yếu (đất bùn hay đá dốc) nhé. Mình sẽ tư vấn mẫu giày có độ êm và độ bám chính xác nhất cho mục tiêu của bạn.",
  },
  {
    keywords: ["chính hãng", "fake", "bảo hành"],
    answer: "Tại Summit Outdoor, bên mình cam kết 100% hàng chính hãng, có nguồn gốc xuất xứ rõ ràng kèm hóa đơn đầy đủ. Mọi sản phẩm đều được áp dụng chính sách bảo hành lỗi kỹ thuật từ hãng, nên bạn hoàn toàn yên tâm sử dụng nhé.",
  },
  {
    keywords: ["khuyến mãi", "sale", "chờ"],
    answer: "Hiện tại mẫu này đang còn đúng size của bạn ở kho, thường các dòng hot sẽ hết size khá nhanh sát các mùa giải. Việc sắm giày sớm giúp bạn có thêm thời gian 'break-in' (làm quen giày) đảm bảo chân bạn hoàn toàn thoải mái vào ngày đua chính thức.",
  },
  {
    keywords: ["ship", "vận chuyển", "giao hàng", "bao lâu"],
    answer: "Bên mình đang nỗ lực tối ưu phí vận chuyển tốt nhất cho khách. Thường chỉ mất 1-2 ngày là bạn nhận được hàng nếu ở trung tâm. Nếu bạn đang cần gấp cho buổi tập cuối tuần, chốt luôn hôm nay để mình gửi đi hỏa tốc nhé!",
  },
  {
    keywords: ["chốt đơn", "mua"],
    answer: "Dựa trên nhu cầu của bạn, mẫu này là lựa chọn tối ưu và đang sẵn đúng size của bạn. Bạn điền thông tin vào form này để hệ thống tự động chốt đơn và gửi đi nhanh nhất nhé:\n🔗 https://forms.gle/xyz",
  }
];

// Dữ liệu chatbot tiếng Anh
const botDataEn = [
  {
    keywords: ["price", "expensive", "cost", "high"],
    answer: "Hi! I understand your concern. Professional trail running shoes are a great investment to protect your feet on rough terrains, preventing injuries like ankle sprains or bruised toes. They are also much more durable than standard running shoes. If you have a specific budget, let me know so I can suggest the best option!",
  },
  {
    keywords: ["size", "choose size", "fit", "tight", "loose"],
    answer: "From our experience, you should choose trail shoes that are 0.5 - 1 size larger than your regular shoes. When running downhill, feet tend to slide forward, so tight shoes will cause black toenails. We support home size-exchange, so don't worry about buying the wrong size!",
  },
  {
    keywords: ["newbie", "beginner", "start", "first time"],
    answer: "For beginners, safety and comfort are top priorities. Could you share more about your upcoming race distance and the main terrain (mud or rocks)? I will recommend the most suitable grip and cushioning for you.",
  },
  {
    keywords: ["authentic", "fake", "legit", "warranty", "original"],
    answer: "At Summit Outdoor, we guarantee 100% authentic products with clear origins and full receipts. Every product is covered by manufacturer warranties, so you can buy with absolute peace of mind.",
  },
  {
    keywords: ["promo", "discount", "sale", "deal"],
    answer: "Currently, this model is in stock for your size, but hot models sell out very quickly close to race days. Buying shoes early gives you enough time to break them in, ensuring full comfort on race day.",
  },
  {
    keywords: ["ship", "delivery", "time", "how long", "express"],
    answer: "We work hard to offer the best shipping fees. Usually, it takes 1-2 days for major cities. If you need them urgently for this weekend's runs, let's confirm your order today so we can ship express!",
  },
  {
    keywords: ["buy", "order", "checkout", "purchase"],
    answer: "Based on your needs, this model is the best match and is in stock in your size. Please fill out this form to complete your order:\n🔗 https://forms.gle/xyz",
  }
];

const LogoSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L22 20H2L12 4Z" fill="#C1121F"/>
  </svg>
);

export default function Chatbot() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isVi = language === 'vi';

  // Initialize welcome message when language changes or component mounts
  useEffect(() => {
    setMessages([
      {
        id: "1",
        text: t('bot.welcome'),
        sender: "bot",
      },
    ]);
  }, [language, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Auto open after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newMsg: Message = { id: Date.now().toString(), text, sender: "user" };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let response = isVi 
        ? "Mình đã nhận được thông tin từ bạn. Tuy nhiên mình chưa tìm được câu trả lời phù hợp trong hệ thống. Bạn có thể hỏi về 'size chân', 'giá đắt', 'giao hàng' hoặc bấm 'chốt đơn' để mình hỗ trợ nhé!"
        : "I have received your message, but I could not find a matching answer. Please feel free to ask about 'shoes size', 'price', 'delivery', or click 'buy now' for assistance!";
      
      const botData = isVi ? botDataVi : botDataEn;
      for (const item of botData) {
        if (item.keywords.some((kw) => lowerText.includes(kw))) {
          response = item.answer;
          break;
        }
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: response, sender: "bot" },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className={styles.chatbotContainer}>
      <div className={`${styles.chatbotWindow} ${isOpen ? "" : styles.hidden}`}>
        <div className={styles.chatbotHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>
              <LogoSVG />
            </div>
            <div className={styles.headerText}>
              <h3>{t('bot.title')}</h3>
              <p>{t('bot.subtitle')}</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
            ✕
          </button>
        </div>

        <div className={styles.chatMessages}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.messageRow} ${
                msg.sender === "user" ? styles.user : ""
              }`}
            >
              {msg.sender === "bot" && <div className={styles.msgAvatar}>
                <LogoSVG />
              </div>}
              <div
                className={`${styles.bubble} ${
                  msg.sender === "user" ? styles.user : styles.bot
                }`}
              >
                {msg.text.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className={`${styles.messageRow}`}>
              <div className={styles.msgAvatar}>
                <LogoSVG />
              </div>
              <div className={`${styles.bubble} ${styles.bot} ${styles.typingIndicator}`}>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.quickReplies}>
          {[
            t('bot.reply.size'),
            t('bot.reply.price'),
            t('bot.reply.shipping'),
            t('bot.reply.done')
          ].map((btn) => (
            <button
              key={btn}
              className={styles.quickReplyBtn}
              onClick={() => handleSend(btn)}
            >
              {btn}
            </button>
          ))}
        </div>

        <div className={styles.chatInputArea}>
          <input
            type="text"
            className={styles.chatInput}
            placeholder={t('bot.placeholder')}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend(inputValue);
            }}
          />
          <button
            className={styles.sendBtn}
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>

      <button onClick={() => setIsOpen(!isOpen)} className={styles.toggleBtn}>
        <LogoSVG />
      </button>
    </div>
  );
}
