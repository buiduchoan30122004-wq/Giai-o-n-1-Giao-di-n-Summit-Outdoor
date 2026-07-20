import Link from 'next/link';
import styles from './components.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className="container">
          <div className={styles.topBarInner}>
            <span>Stores</span>
            <span>Help</span>
            <span>EN</span>
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
            <li className={styles.navItem}><Link href="/shop">Men</Link></li>
            <li className={styles.navItem}><Link href="/shop">Women</Link></li>
            <li className={styles.navItem}><Link href="/shop">Trail Running</Link></li>
            <li className={styles.navItem}><Link href="/shop">Hiking</Link></li>
            <li className={styles.navItem}><Link href="/shop">Accessories</Link></li>
            <li className={styles.navItem} style={{ color: 'var(--color-primary)' }}><Link href="/shop">Sale</Link></li>
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
    </header>
  );
}
