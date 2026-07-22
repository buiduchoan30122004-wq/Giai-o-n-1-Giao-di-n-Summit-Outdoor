"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';
import PromoPopup from '../components/PromoPopup';

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hasSeenPromoPopup');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsPopupOpen(true);
        sessionStorage.setItem('hasSeenPromoPopup', 'true');
      }, 2000); // 2 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const products = [
    { 
      id: '1', 
      brand: 'Salomon', 
      name: 'XT-6 GORE-TEX', 
      price: '4.800.000đ', 
      image: '/products/salomon_xt6_black.jpg',
      status: 'New',
      subtitle: 'Sneakers - Unisex'
    },
    { 
      id: '2', 
      brand: 'Salomon', 
      name: 'XT-WHISPER', 
      price: '3.500.000đ', 
      image: '/products/salomon_xt_whisper.jpg',
      status: 'New',
      subtitle: 'Sneakers - Unisex'
    },
    { 
      id: '3', 
      brand: 'Salomon', 
      name: 'S/LAB ULTRA GLIDE 2 LIMITED COURTNEY EDITION', 
      price: '6.500.000đ', 
      image: '/products/salomon_slab_ultraglide.jpg',
      status: '',
      subtitle: 'Trail running shoes - Unisex'
    },
    { 
      id: '4', 
      brand: 'Salomon', 
      name: 'XT-4 OG', 
      price: '4.800.000đ', 
      image: '/products/salomon_xt4_yellow.jpg',
      status: 'New',
      subtitle: 'Sneakers - Unisex'
    }
  ];

  return (
    <main className={styles.main}>
      <PromoPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container" style={{ width: '100%' }}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Đánh Thức Tiềm Năng</h1>
            <p className={styles.heroDesc}>Chinh phục mọi địa hình với bộ sưu tập Xuân/Hè mới nhất. Trải nghiệm sự khác biệt trên từng bước chạy.</p>
            <div className={styles.heroBtns}>
              <Link href="/shop" className="btn btn-primary">Mua Cho Nam</Link>
              <Link href="/shop" className="btn btn-secondary">Mua Cho Nữ</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section (Logo Strip) */}
      <section className={styles.partnerSection}>
        <div className="container">
          <div className={styles.partnerGrid}>
            <div className={styles.partnerLogo}>
              <img src="/brands/asics.svg" alt="Asics" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="/brands/adidas.svg" alt="Adidas" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="/brands/salomon.svg" alt="Salomon" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="/brands/hoka.svg" alt="Hoka" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="/brands/puma.svg" alt="Puma" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="/brands/new-balance.svg" alt="New Balance" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="/brands/nike.svg" alt="Nike" />
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Brand */}
      <section className={styles.brandSection}>
        <div className="container">
          <div className={styles.brandGrid}>
            <Link href="/shop" className={styles.brandCard}>
              <div className={styles.brandImgWrapper}>
                <img src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=500" alt="Adidas" className={styles.brandCardImg} />
                <div className={styles.brandImgOverlay}>
                  <img src="/brands/adidas.svg" alt="Adidas Logo" className={styles.brandCardLogo} />
                </div>
              </div>
              <div className={styles.brandCardLabel}>adidas</div>
            </Link>

            <Link href="/shop" className={styles.brandCard}>
              <div className={styles.brandImgWrapper}>
                <img src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=500" alt="Asics" className={styles.brandCardImg} />
                <div className={styles.brandImgOverlay}>
                  <img src="/brands/asics.svg" alt="Asics Logo" className={styles.brandCardLogo} />
                </div>
              </div>
              <div className={styles.brandCardLabel}>ASICS</div>
            </Link>

            <Link href="/shop" className={styles.brandCard}>
              <div className={styles.brandImgWrapper}>
                <img src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=500" alt="Brooks" className={styles.brandCardImg} />
                <div className={styles.brandImgOverlay}>
                  <img src="/brands/brooks.svg" alt="Brooks Logo" className={styles.brandCardLogo} />
                </div>
              </div>
              <div className={styles.brandCardLabel}>Brooks</div>
            </Link>

            <Link href="/shop" className={styles.brandCard}>
              <div className={styles.brandImgWrapper}>
                <img src="https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?q=80&w=500" alt="Hoka" className={styles.brandCardImg} />
                <div className={styles.brandImgOverlay}>
                  <img src="/brands/hoka.svg" alt="Hoka Logo" className={styles.brandCardLogo} />
                </div>
              </div>
              <div className={styles.brandCardLabel}>HOKA</div>
            </Link>

            <Link href="/shop" className={styles.brandCard}>
              <div className={styles.brandImgWrapper}>
                <img src="https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=500" alt="New Balance" className={styles.brandCardImg} />
                <div className={styles.brandImgOverlay}>
                  <img src="/brands/new-balance.svg" alt="New Balance Logo" className={styles.brandCardLogo} />
                </div>
              </div>
              <div className={styles.brandCardLabel}>Cân bằng mới</div>
            </Link>

            <Link href="/shop" className={styles.brandCard}>
              <div className={styles.brandImgWrapper}>
                <img src="https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=500" alt="Nike" className={styles.brandCardImg} />
                <div className={styles.brandImgOverlay}>
                  <img src="/brands/nike.svg" alt="Nike Logo" className={styles.brandCardLogo} />
                </div>
              </div>
              <div className={styles.brandCardLabel}>Nike</div>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Hàng Mới Về</h2>
            <Link href="/shop" className={styles.viewAll}>Xem Tất Cả</Link>
          </div>
          <div className={styles.productGrid}>
            {products.map(p => (
              <Link href={`/product/${p.id}`} key={p.id}>
                <ProductCard {...p} />
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* Best Sellers */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Bán Chạy Nhất</h2>
            <Link href="/shop" className={styles.viewAll}>Xem Tất Cả</Link>
          </div>
          <div className={styles.productGrid}>
            {[...products].reverse().map(p => (
              <Link href={`/product/${p.id}`} key={p.id}>
                <ProductCard {...p} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Brands */}
      <section className={styles.partnerSection}>
        <div className="container">
          <div className={styles.partnerGrid}>
            <div className={styles.partnerLogo}>
              <img src="/brands/asics.svg" alt="Asics" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="/brands/adidas.svg" alt="Adidas" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="/brands/salomon.svg" alt="Salomon" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="/brands/hoka.svg" alt="Hoka" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="/brands/puma.svg" alt="Puma" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="/brands/new-balance.svg" alt="New Balance" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="/brands/nike.svg" alt="Nike" />
            </div>
          </div>
        </div>
      </section>
      {/* Disclaimer */}
      <section className={styles.disclaimerSection}>
        <div className="container">
          <p className={styles.disclaimerText}>
            *Việc so sánh giá dựa trên Giá bán lẻ đề xuất của nhà sản xuất ("MSRP") hoặc Giá bán ban đầu. Giá bán thực tế có thể không phải là giá này.
            <br />
            **Các điều khoản về so sánh giá có thể khác nhau tùy theo thương hiệu. Vui lòng liên hệ với chúng tôi để biết thêm chi tiết.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className={styles.featuresSection}>
        <div className="container">
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Giao hàng miễn phí trong 2 ngày</h3>
              <p className={styles.featureDesc}>Đơn hàng trên 1.000.000đ sẽ được giao hàng miễn phí! Một số điều kiện áp dụng.</p>
              <span className={styles.featureLink}>Tìm hiểu thêm</span>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  <path d="M3 9h8M3 13h6M3 17h4" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Phí vận chuyển qua đêm: 150.000đ</h3>
              <p className={styles.featureDesc}>Áp dụng cho tất cả đơn hàng trên 1.500.000đ! Một số điều kiện có thể áp dụng.</p>
              <span className={styles.featureLink}>Tìm hiểu thêm</span>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Trả hàng miễn phí</h3>
              <p className={styles.featureDesc}>Hãy tự tin đặt hàng. Nếu không hài lòng, bạn có thể trả lại hàng miễn phí!</p>
              <span className={styles.featureLink}>Tìm hiểu thêm</span>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M12 8v8M9.5 10h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Giá thấp nhất</h3>
              <p className={styles.featureDesc}>Chúng tôi cam kết sẽ giữ nguyên giá hoặc đưa ra mức giá thấp hơn bất kỳ giá nào được niêm yết tại cửa hàng.</p>
              <span className={styles.featureLink}>Tìm hiểu thêm</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className={styles.newsletterSection}>
        <div className="container">
          <div className={styles.newsletterContainer}>
            <div className={styles.newsletterInfo}>
              <h3 className={styles.newsletterTitle}>Tham gia danh sách gửi thư của chúng tôi</h3>
              <p className={styles.newsletterDesc}>Ưu đãi độc quyền được gửi trực tiếp vào hộp thư đến của bạn</p>
            </div>
            <button className={styles.newsletterBtn} onClick={() => setIsPopupOpen(true)}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Đăng ký
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
