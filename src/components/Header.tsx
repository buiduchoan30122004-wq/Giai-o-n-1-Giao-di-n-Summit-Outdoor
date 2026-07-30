"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './components.module.css';
import React, { useState, useEffect } from 'react';

const brandsList = [
  { name: 'Salomon', logo: '/brands/salomon.png' },
  { name: 'HOKA', logo: '/brands/hoka.png' },
  { name: 'Altra', logo: '/brands/altra.png' },
  { name: 'La Sportiva', logo: '/brands/lasportiva.png' },
  { name: 'Brooks', logo: '/brands/brooks.png' },
  { name: 'Saucony', logo: '/brands/saucony.png' },
  { name: 'ASICS', logo: '/brands/asics.png' },
  { name: 'adidas TERREX', logo: '/brands/adidas-terrex.png' },
  { name: 'NNormal', logo: '/brands/nnormal.png' },
  { name: 'Merrell', logo: '/brands/merrell.png' }
];

export default function Header() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cartDataStr = localStorage.getItem('summit_cart');
        if (cartDataStr) {
          const cart = JSON.parse(cartDataStr);
          const count = cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0);
          setCartCount(count);
        } else {
          setCartCount(0);
        }
      } catch (e) {
        console.error(e);
      }
    };

    updateCartCount();

    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  return (
    <header className={styles.header}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className="container">
          <div className={styles.topBarInner}>
            <div className={styles.topBarLeft}>
              <span>⚡ MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC CHO ĐƠN HÀNG TỪ 2.000.000đ</span>
            </div>
            <div className={styles.topBarRight}>
              <Link href="/shop" className={styles.topLink}>
                <span className={styles.topLinkIcon}>📍</span> Tìm Cửa Hàng
              </Link>
              <Link href="/shop" className={styles.topLink}>
                <span className={styles.topLinkIcon}>💬</span> Trợ Giúp
              </Link>
              <div className={styles.langSelector}>
                <span>🇻🇳 VN</span>
                <span className={styles.dropdownArrow}>▾</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={styles.mainHeader}>
        <div className={styles.mainHeaderInner}>
          <Link href="/" className={styles.logo}>
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.logoIcon}>
              <polygon points="13,6 3,24 23,24" fill="var(--color-primary)" />
              <polygon points="21,11 13,24 29,24" fill="var(--color-black)" />
              <polygon points="13,24 16,19 18,24" fill="var(--color-white)" />
            </svg>
            SUMMIT<span>OUTDOOR</span>
          </Link>
 
          <ul className={styles.navList}>
            <li className={styles.navItem}><Link href="/shop">Giày Nam</Link></li>
            <li className={styles.navItem}><Link href="/shop/women">Giày Nữ</Link></li>
            <li className={styles.navItem}><Link href="/shop/trail">Chạy Địa Hình</Link></li>
            <li className={styles.navItem}><Link href="/shop/hiking">Leo Núi</Link></li>
            <li className={styles.navItem}><Link href="/shop/accessories">Phụ Kiện</Link></li>
            <li className={styles.navItem}><Link href="/shop/nutrition">Dinh Dưỡng</Link></li>
            <li className={styles.navItem} style={{ color: 'var(--color-primary)' }}><Link href="/shop/sale">Khuyến Mãi</Link></li>
          </ul>
 
          <div className={styles.headerActions}>
            {/* Search Icon */}
            <span className={styles.actionIcon} title="Tìm kiếm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.actionSvg}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>

            {/* Profile Icon */}
            <span className={styles.actionIcon} title="Tài khoản">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.actionSvg}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>

            {/* Cart Link with bag icon and count */}
            <Link href="/cart" className={styles.cartAction}>
              <span className={styles.cartText}>Giỏ hàng</span>
              <div className={styles.cartIconWrapper}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.cartIcon}>
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span className={styles.cartBadge}>{cartCount}</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
 
      {/* Brand Bar (Sticky along with Header) */}
      <div className={styles.brandBar}>
        <div className={styles.brandBarInner}>
          {/* Vòng lặp thứ nhất */}
          {brandsList.map((brand, idx) => (
            <span key={`marq1-${idx}`} className={styles.brandItem}>
              <img src={brand.logo} alt={brand.name} className={styles.brandLogo} />
            </span>
          ))}
          {/* Vòng lặp thứ hai tạo hiệu ứng nối đuôi vô tận */}
          {brandsList.map((brand, idx) => (
            <span key={`marq2-${idx}`} className={styles.brandItem}>
              <img src={brand.logo} alt={brand.name} className={styles.brandLogo} />
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
