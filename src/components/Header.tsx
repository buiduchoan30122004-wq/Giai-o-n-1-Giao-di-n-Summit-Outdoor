"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './components.module.css';
import React, { useState, useEffect } from 'react';

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
            <span>Hệ Thống Cửa Hàng</span>
            <span>Trợ Giúp</span>
            <span>VN</span>
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
        <div className="container">
          <div className={styles.brandBarInner}>
            <span className={styles.brandItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={styles.brandLogo} style={{ color: '#0f2c59' }}>
                <path d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8Z" />
                <path d="M14.5 9h-3.5c-.3 0-.5.2-.5.5v1.5c0 .3.2.5.5.5h2.5c.6 0 1 .4 1 1v2c0 .6-.4 1-1 1h-3.5c-.6 0-1-.4-1-1v-1h1.5v1h3v-2H11c-.6 0-1-.4-1-1V9.5c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1v1h-1.5V9Z" />
              </svg>
              SALOMON
            </span>
            <span className={styles.brandItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={styles.brandLogo} style={{ color: '#009fdf' }}>
                <path d="M1 14.5c4.5-1.2 6.5-5 10.5-5c3 0 4.5 2.2 8.5 1.2c-3.2 2.8-5.2 2.2-8.5 2.2c-4.2 0-6.2-1.8-10.5 1.6Z" />
                <path d="M6.5 11c3.8-1 5.5-4 9-4c2.5 0 3.8 1.8 7.2 1c-2.7 2.2-4.4 1.8-7.2 1.8c-3.5 0-5.2-1.5-9 1.2Z" opacity="0.8" />
              </svg>
              HOKA
            </span>
            <span className={styles.brandItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={styles.brandLogo} style={{ color: '#ff5400' }}>
                <path d="M3 19h18l-9-13.5L3 19Zm9-10.8l6.2 9.3H5.8L12 8.2Z" />
                <path d="M16.5 11c-2.2.8-4.8 2.5-6.6 4.6c-1 1.2-1.7 2.5-2.4 3.7c-.3.7-1 1.2-1.5 1.2c-.3 0-.7-.3-.7-.7c0-.3.3-1.2.9-2.6c1-2 2.7-4.4 4.9-6.3c1.4-1.1 3-1.7 4-2c.4 0 .7.3.4 1Z" />
              </svg>
              NIKE TRAIL
            </span>
            <span className={styles.brandItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={styles.brandLogo} style={{ color: '#00205b' }}>
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8Z" />
                <path d="M15.5 15c-1.2 1.2-2.8 1.8-4.5 1.8s-3.2-.8-4-2.2l1.2-1c.6.9 1.6 1.4 2.8 1.4s2.4-.3 3.3-1.2l1.2 1.2ZM12 5.5c2 0 3.6 1.2 4 3.2h-1.8c-.3-1-1.2-1.6-2.2-1.6s-2 .6-2.2 1.6H8c.4-2 2-3.2 12-3.2Z" />
              </svg>
              ASICS
            </span>
            <span className={styles.brandItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={styles.brandLogo} style={{ color: '#a6192e' }}>
                <path d="M3 21h4V3H3v18Zm6-3h4V6H9v12Zm6-4h4V9h-4v5Z" />
              </svg>
              ALTRA
            </span>
            <span className={styles.brandItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.brandLogo} style={{ color: '#f3b200' }}>
                <circle cx="12" cy="12" r="9" />
                <path d="M6 16l4-5.5l2.5 3.5l3.5-4.5l3 6.5H6Z" fill="currentColor" />
              </svg>
              LA SPORTIVA
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
