'use client';

import Link from 'next/link';
import styles from './components.module.css';
import { useLanguage } from '../context/LanguageContext';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className={styles.header}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className="container">
          <div className={styles.topBarInner}>
            {/* Left Side promo message */}
            <div className={styles.topBarLeft}>
              <span className={styles.promoText}>
                <span className={styles.promoIcon}>⛰️</span>
                {t('topbar.promo')}
              </span>
            </div>

            {/* Right Side utilities */}
            <div className={styles.topBarRight}>
              <Link href="/shop" className={styles.topBarLink}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.linkIcon}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{t('topbar.stores')}</span>
              </Link>
              
              <Link href="/cart" className={styles.topBarLink}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.linkIcon}>
                  <polyline points="21 8 21 21 3 21 3 8" />
                  <rect x="1" y="3" width="22" height="5" />
                  <line x1="10" y1="12" x2="14" y2="12" />
                </svg>
                <span>{t('topbar.track')}</span>
              </Link>

              <div className={styles.topBarLink} style={{ cursor: 'default' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.linkIcon}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{t('topbar.hotline')}</span>
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
            <li className={styles.navItem}><Link href="/shop">{t('nav.men')}</Link></li>
            <li className={styles.navItem}><Link href="/shop">{t('nav.women')}</Link></li>
            <li className={styles.navItem}><Link href="/shop">{t('nav.trail')}</Link></li>
            <li className={styles.navItem}><Link href="/shop">{t('nav.hiking')}</Link></li>
            <li className={styles.navItem}><Link href="/shop">{t('nav.accessories')}</Link></li>
            <li className={styles.navItem} style={{ color: 'var(--color-primary)' }}><Link href="/shop">{t('nav.sale')}</Link></li>
          </ul>
  
          <div className={styles.headerActions}>
            {/* Search Icon */}
            <span className={styles.actionIcon} title="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.actionSvg}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>

            {/* Profile Icon */}
            <span className={styles.actionIcon} title="Profile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.actionSvg}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>

            {/* Language Selector Flags */}
            <div className={styles.flagContainer}>
              <button 
                onClick={() => setLanguage('vi')} 
                className={`${styles.flagBtn} ${language === 'vi' ? styles.flagActive : ''}`}
                title="Tiếng Việt"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" className={styles.flagSvg}>
                  <circle cx="12" cy="12" r="12" fill="#DA251D"/>
                  <polygon points="12,4 14.5,11.5 22,11.5 16,16 18.5,23.5 12,19 5.5,23.5 8,16 2,11.5 9.5,11.5" fill="#FFFF00"/>
                </svg>
              </button>
              <button 
                onClick={() => setLanguage('en')} 
                className={`${styles.flagBtn} ${language === 'en' ? styles.flagActive : ''}`}
                title="English"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" className={styles.flagSvg}>
                  <mask id="usCircleMask">
                    <circle cx="12" cy="12" r="12" fill="white" />
                  </mask>
                  <g mask="url(#usCircleMask)">
                    <rect width="24" height="24" fill="#B22234" />
                    <rect y="1.85" width="24" height="1.85" fill="white" />
                    <rect y="3.7" width="24" height="1.85" fill="white" />
                    <rect y="5.55" width="24" height="1.85" fill="white" />
                    <rect y="7.4" width="24" height="1.85" fill="white" />
                    <rect y="9.25" width="24" height="1.85" fill="white" />
                    <rect y="11.1" width="24" height="1.85" fill="white" />
                    <rect y="12.95" width="24" height="1.85" fill="white" />
                    <rect y="14.8" width="24" height="1.85" fill="white" />
                    <rect y="16.65" width="24" height="1.85" fill="white" />
                    <rect y="18.5" width="24" height="1.85" fill="white" />
                    <rect y="20.35" width="24" height="1.85" fill="white" />
                    <rect y="22.2" width="24" height="1.85" fill="white" />
                    <rect width="12" height="13" fill="#3C3B6E" />
                    <circle cx="2" cy="2" r="0.4" fill="white" />
                    <circle cx="4" cy="2" r="0.4" fill="white" />
                    <circle cx="6" cy="2" r="0.4" fill="white" />
                    <circle cx="8" cy="2" r="0.4" fill="white" />
                    <circle cx="10" cy="2" r="0.4" fill="white" />
                    <circle cx="3" cy="4" r="0.4" fill="white" />
                    <circle cx="5" cy="4" r="0.4" fill="white" />
                    <circle cx="7" cy="4" r="0.4" fill="white" />
                    <circle cx="9" cy="4" r="0.4" fill="white" />
                    <circle cx="2" cy="6" r="0.4" fill="white" />
                    <circle cx="4" cy="6" r="0.4" fill="white" />
                    <circle cx="6" cy="6" r="0.4" fill="white" />
                    <circle cx="8" cy="6" r="0.4" fill="white" />
                    <circle cx="10" cy="6" r="0.4" fill="white" />
                    <circle cx="3" cy="8" r="0.4" fill="white" />
                    <circle cx="5" cy="8" r="0.4" fill="white" />
                    <circle cx="7" cy="8" r="0.4" fill="white" />
                    <circle cx="9" cy="8" r="0.4" fill="white" />
                    <circle cx="2" cy="10" r="0.4" fill="white" />
                    <circle cx="4" cy="10" r="0.4" fill="white" />
                    <circle cx="6" cy="10" r="0.4" fill="white" />
                    <circle cx="8" cy="10" r="0.4" fill="white" />
                    <circle cx="10" cy="10" r="0.4" fill="white" />
                  </g>
                </svg>
              </button>
            </div>

            {/* Cart Link with bag icon and count */}
            <Link href="/cart" className={styles.cartAction}>
              <span className={styles.cartText}>{t('cart.title')}</span>
              <div className={styles.cartIconWrapper}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.cartIcon}>
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span className={styles.cartBadge}>1</span>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={styles.brandLogo}>
                <path d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8Z" />
                <path d="M14.5 9h-3.5c-.3 0-.5.2-.5.5v1.5c0 .3.2.5.5.5h2.5c.6 0 1 .4 1 1v2c0 .6-.4 1-1 1h-3.5c-.6 0-1-.4-1-1v-1h1.5v1h3v-2H11c-.6 0-1-.4-1-1V9.5c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1v1h-1.5V9Z" />
              </svg>
              SALOMON
            </span>
            <span className={styles.brandItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={styles.brandLogo}>
                <path d="M1 14.5c4.5-1.2 6.5-5 10.5-5c3 0 4.5 2.2 8.5 1.2c-3.2 2.8-5.2 2.2-8.5 2.2c-4.2 0-6.2-1.8-10.5 1.6Z" />
                <path d="M6.5 11c3.8-1 5.5-4 9-4c2.5 0 3.8 1.8 7.2 1c-2.7 2.2-4.4 1.8-7.2 1.8c-3.5 0-5.2-1.5-9 1.2Z" opacity="0.8" />
              </svg>
              HOKA
            </span>
            <span className={styles.brandItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={styles.brandLogo}>
                <path d="M3 19h18l-9-13.5L3 19Zm9-10.8l6.2 9.3H5.8L12 8.2Z" />
                <path d="M16.5 11c-2.2.8-4.8 2.5-6.6 4.6c-1 1.2-1.7 2.5-2.4 3.7c-.3.7-1 1.2-1.5 1.2c-.3 0-.7-.3-.7-.7c0-.3.3-1.2.9-2.6c1-2 2.7-4.4 4.9-6.3c1.4-1.1 3-1.7 4-2c.4 0 .7.3.4 1Z" />
              </svg>
              NIKE TRAIL
            </span>
            <span className={styles.brandItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={styles.brandLogo}>
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8Z" />
                <path d="M15.5 15c-1.2 1.2-2.8 1.8-4.5 1.8s-3.2-.8-4-2.2l1.2-1c.6.9 1.6 1.4 2.8 1.4s2.4-.3 3.3-1.2l1.2 1.2ZM12 5.5c2 0 3.6 1.2 4 3.2h-1.8c-.3-1-1.2-1.6-2.2-1.6s-2 .6-2.2 1.6H8c.4-2 2-3.2 12-3.2Z" />
              </svg>
              ASICS
            </span>
            <span className={styles.brandItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={styles.brandLogo}>
                <path d="M3 21h4V3H3v18Zm6-3h4V6H9v12Zm6-4h4V9h-4v5Z" />
              </svg>
              ALTRA
            </span>
            <span className={styles.brandItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.brandLogo}>
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
