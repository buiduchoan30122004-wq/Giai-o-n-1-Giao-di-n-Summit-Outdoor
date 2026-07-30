'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'vi' | 'en';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Header top bar
    'topbar.promo': 'Cam kết chính hãng 100% • Miễn phí vận chuyển từ 2.000.000đ',
    'topbar.stores': 'Hệ Thống Cửa Hàng',
    'topbar.track': 'Tra Cứu Đơn Hàng',
    'topbar.hotline': 'Hotline: 1800 6789',
    
    // Header main
    'nav.men': 'Giày Nam',
    'nav.women': 'Giày Nữ',
    'nav.trail': 'Chạy Địa Hình',
    'nav.hiking': 'Leo Núi',
    'nav.accessories': 'Phụ Kiện',
    'nav.sale': 'Khuyến Mãi',
    'cart.title': 'Giỏ hàng',

    // Hero
    'hero.title': 'Đánh Thức Tiềm Năng',
    'hero.desc': 'Chinh phục mọi địa hình với bộ sưu tập Xuân/Hè mới nhất. Trải nghiệm sự khác biệt trên từng bước chạy.',
    'hero.btn.men': 'Mua Cho Nam',
    'hero.btn.women': 'Mua Cho Nữ',

    // Home sections
    'section.activity': 'Theo Hoạt Động',
    'activity.trail': 'Chạy Địa Hình',
    'activity.road': 'Chạy Đường Nhựa',
    'activity.hiking': 'Leo Núi & Dã Ngoại',
    'section.new': 'Hàng Mới Về',
    'section.best': 'Bán Chạy Nhất',
    'btn.viewall': 'Xem Tất Cả',

    // Cart page
    'cart.header': 'Giỏ Hàng Của Bạn',
    'cart.empty': 'Giỏ hàng trống. Hãy tiếp tục mua sắm!',
    'cart.subtotal': 'Tạm tính',
    'cart.shipping': 'Phí vận chuyển dự kiến',
    'cart.tax': 'Thuế',
    'cart.tax.desc': 'Tính khi thanh toán',
    'cart.total': 'Tổng Cộng',
    'cart.checkout': 'Thanh Toán Ngay',
    'cart.quantity': 'Số lượng',
    'cart.remove': 'Xóa',
    'cart.size': 'Kích cỡ',
    'cart.item.name': 'Giày Chạy Địa Hình Speedcross 6',

    // Shop page
    'shop.title': 'Giày Chạy Địa Hình',
    'shop.filters': 'Bộ Lọc',
    'shop.brand': 'Thương Hiệu',
    'shop.size': 'Kích Cỡ',
    'shop.sort': 'Sắp xếp: Gợi ý',
    'shop.sort.low': 'Giá: Thấp đến Cao',
    'shop.sort.high': 'Giá: Cao đến Thấp',

    // Product page
    'product.brand': 'Thương hiệu',
    'product.add': 'Thêm Vào Giỏ Hàng',
    'product.desc': 'Mô Tả Sản Phẩm',
    'product.select.size': 'Chọn Kích Cỡ (US)',
    'product.speedcross.desc': 'SPEEDCROSS 6 không cần giới thiệu. Giữ vững những giá trị huyền thoại của dòng giày chạy trail, phiên bản này nhẹ hơn với khả năng bám đất vượt trội, thoát bùn nhanh hơn. Thiết kế thân giày ôm chân, năng động cùng sự êm ái đặc trưng của SPEEDCROSS.',

    // Footer
    'footer.desc': 'Hệ thống cửa hàng phân phối đồ chạy bộ địa hình và dã ngoại cao cấp, tập trung vào sản phẩm chính hãng, tư vấn chuyên sâu và xây dựng cộng đồng đam mê thể thao.',
    'footer.shop': 'Mua Sắm',
    'footer.men': 'Đồ Cho Nam',
    'footer.women': 'Đồ Cho Nữ',
    'footer.trail': 'Giày Chạy Địa Hình',
    'footer.hiking': 'Giày Leo Núi',
    'footer.accessories': 'Phụ Kiện Thể Thao',
    'footer.support': 'Hỗ Trợ',
    'footer.track': 'Tra Cứu Đơn Hàng',
    'footer.returns': 'Chính Sách Đổi Trả',
    'footer.warranty': 'Chính Sách Bảo Hành',
    'footer.contact': 'Liên Hệ',
    'footer.faq': 'Câu Hỏi Thường Gặp',
    'footer.discover': 'Khám Phá',
    'footer.about': 'Về Summit Outdoor',
    'footer.events': 'Sự Kiện Cộng Đồng',
    'footer.blog': 'Blog & Câu Chuyện',
    'footer.jobs': 'Tuyển Dụng',
    'footer.copyright': 'Summit Outdoor. Đã đăng ký bản quyền.',

    // Promo Popup
    'promo.title': 'Ưu Đãi Độc Quyền',
    'promo.desc': 'Đăng ký nhận thông tin để nhận ngay mã giảm giá 10% cho đơn hàng đầu tiên!',
    'promo.name': 'Họ và tên',
    'promo.email': 'Địa chỉ Email',
    'promo.phone': 'Số điện thoại',
    'promo.pref': 'Thương hiệu yêu thích',
    'promo.submit': 'Nhận Mã Giảm Giá',
    'promo.success': 'Đăng Ký Thành Công!',
    'promo.code.desc': 'Sử dụng mã dưới đây khi thanh toán:',
    'promo.copy': 'Sao chép',
    'promo.copied': 'Đã sao chép!',
    'promo.close': 'Đóng',

    // Chatbot
    'bot.title': 'Trợ Lý Summit Outdoor',
    'bot.subtitle': 'Chuyên gia chạy trail 24/7',
    'bot.welcome': 'Chào bạn, cảm ơn bạn đã quan tâm đến Summit Outdoor! Bạn đang tìm kiếm một đôi giày trail cho giải chạy sắp tới, hay cần tư vấn phụ kiện vậy?',
    'bot.placeholder': 'Nhập câu hỏi của bạn...',
    'bot.reply.size': 'Cách chọn size?',
    'bot.reply.price': 'Giá hơi đắt',
    'bot.reply.shipping': 'Giao hàng bao lâu?',
    'bot.reply.done': 'Chốt đơn'
  },
  en: {
    // Header top bar
    'topbar.promo': '100% Authentic Guaranteed • Free Shipping on Orders Over 2.000.000đ',
    'topbar.stores': 'Store Locator',
    'topbar.track': 'Track Order',
    'topbar.hotline': 'Hotline: 1800 6789',

    // Header main
    'nav.men': 'Men\'s',
    'nav.women': 'Women\'s',
    'nav.trail': 'Trail Running',
    'nav.hiking': 'Hiking',
    'nav.accessories': 'Accessories',
    'nav.sale': 'Sale',
    'cart.title': 'Cart',

    // Hero
    'hero.title': 'Awaken Your Potential',
    'hero.desc': 'Conquer any terrain with our latest Spring/Summer collection. Experience the difference in every step.',
    'hero.btn.men': 'Shop Men\'s',
    'hero.btn.women': 'Shop Women\'s',

    // Home sections
    'section.activity': 'Shop By Activity',
    'activity.trail': 'Trail Running',
    'activity.road': 'Road Running',
    'activity.hiking': 'Hiking & Outdoor',
    'section.new': 'New Arrivals',
    'section.best': 'Best Sellers',
    'btn.viewall': 'View All',

    // Cart page
    'cart.header': 'Your Shopping Cart',
    'cart.empty': 'Your cart is empty. Keep shopping!',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Estimated Shipping',
    'cart.tax': 'Tax',
    'cart.tax.desc': 'Calculated at checkout',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout',
    'cart.quantity': 'Quantity',
    'cart.remove': 'Remove',
    'cart.size': 'Size',
    'cart.item.name': 'Speedcross 6 Trail Running Shoes',

    // Shop page
    'shop.title': 'Trail Running Shoes',
    'shop.filters': 'Filters',
    'shop.brand': 'Brand',
    'shop.size': 'Size',
    'shop.sort': 'Sort by: Recommended',
    'shop.sort.low': 'Price: Low to High',
    'shop.sort.high': 'Price: High to Low',

    // Product page
    'product.brand': 'Brand',
    'product.add': 'Add to Cart',
    'product.desc': 'Product Description',
    'product.select.size': 'Select Size (US)',
    'product.speedcross.desc': 'The SPEEDCROSS 6 needs no introductions. True to its legendary roots and trail status, this version is lighter with an even more powerful, grippy connection to the ground and faster mud evacuation. Featuring a revamped upper that’s both functional and fiery, and classic SPEEDCROSS comfort.',

    // Footer
    'footer.desc': 'Premium retailer of trail running and outdoor gear, focusing on authentic products, expert advice, and building an active sports community.',
    'footer.shop': 'Shop',
    'footer.men': 'Men\'s Gear',
    'footer.women': 'Women\'s Gear',
    'footer.trail': 'Trail Running Shoes',
    'footer.hiking': 'Hiking Shoes',
    'footer.accessories': 'Sports Accessories',
    'footer.support': 'Support',
    'footer.track': 'Track Order',
    'footer.returns': 'Return Policy',
    'footer.warranty': 'Warranty Policy',
    'footer.contact': 'Contact Us',
    'footer.faq': 'FAQs',
    'footer.discover': 'Discover',
    'footer.about': 'About Summit Outdoor',
    'footer.events': 'Community Events',
    'footer.blog': 'Blog & Stories',
    'footer.jobs': 'Careers',
    'footer.copyright': 'Summit Outdoor. All rights reserved.',

    // Promo Popup
    'promo.title': 'Exclusive Offer',
    'promo.desc': 'Sign up for our newsletter and get a 10% discount code for your first order!',
    'promo.name': 'Full name',
    'promo.email': 'Email Address',
    'promo.phone': 'Phone number',
    'promo.pref': 'Favorite Brand',
    'promo.submit': 'Get Discount Code',
    'promo.success': 'Successfully Registered!',
    'promo.code.desc': 'Use the code below at checkout:',
    'promo.copy': 'Copy',
    'promo.copied': 'Copied!',
    'promo.close': 'Close',

    // Chatbot
    'bot.title': 'Summit Outdoor Assistant',
    'bot.subtitle': 'Trail running expert 24/7',
    'bot.welcome': 'Hello! Thanks for visiting Summit Outdoor. Are you looking for a pair of trail running shoes for your upcoming race, or do you need help with gear and accessories?',
    'bot.placeholder': 'Ask a question...',
    'bot.reply.size': 'How to choose size?',
    'bot.reply.price': 'Is it too expensive?',
    'bot.reply.shipping': 'How long is delivery?',
    'bot.reply.done': 'Buy now'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('vi');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang === 'vi' || savedLang === 'en') {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
