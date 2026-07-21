import Link from 'next/link';
import styles from './components.module.css';

export default function Header() {
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
            SUMMIT<span>OUTDOOR</span>
          </Link>

          <ul className={styles.navList}>
            <li className={styles.navItem}><Link href="/shop">Giày Nam</Link></li>
            <li className={styles.navItem}><Link href="/shop">Giày Nữ</Link></li>
            <li className={styles.navItem}><Link href="/shop">Chạy Địa Hình</Link></li>
            <li className={styles.navItem}><Link href="/shop">Leo Núi</Link></li>
            <li className={styles.navItem}><Link href="/shop">Phụ Kiện</Link></li>
            <li className={styles.navItem} style={{ color: 'var(--color-primary)' }}><Link href="/shop">Khuyến Mãi</Link></li>
          </ul>

          <div className={styles.headerActions}>
            <span className={styles.actionIcon}>🔍</span>
            <span className={styles.actionIcon}>👤</span>
            <Link href="/cart">
              <span className={styles.actionIcon}>🛒</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Brand Bar (Sticky along with Header) */}
      <div className={styles.brandBar}>
        <div className="container">
          <div className={styles.brandBarInner}>
            <span>SALOMON</span>
            <span>HOKA</span>
            <span>NIKE TRAIL</span>
            <span>ASICS</span>
            <span>ALTRA</span>
            <span>LA SPORTIVA</span>
          </div>
        </div>
      </div>
    </header>
  );
}
