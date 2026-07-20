import styles from './components.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div>
          <div className={styles.footerBrand}>SUMMIT<span>OUTDOOR</span></div>
          <p className={styles.footerDesc}>
            A premium outdoor and trail running gear retailer focused on authentic products, expert knowledge, and an active outdoor community.
          </p>
        </div>
        <div>
          <h3 className={styles.footerColTitle}>Shop</h3>
          <ul className={styles.footerList}>
            <li>Men's Gear</li>
            <li>Women's Gear</li>
            <li>Trail Running Shoes</li>
            <li>Hiking Boots</li>
            <li>Accessories</li>
          </ul>
        </div>
        <div>
          <h3 className={styles.footerColTitle}>Support</h3>
          <ul className={styles.footerList}>
            <li>Track Order</li>
            <li>Returns & Refunds</li>
            <li>Warranty</li>
            <li>Contact Us</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div>
          <h3 className={styles.footerColTitle}>Explore</h3>
          <ul className={styles.footerList}>
            <li>About Summit</li>
            <li>Community Events</li>
            <li>Blog & Stories</li>
            <li>Careers</li>
          </ul>
        </div>
      </div>
      <div className={styles.copyright}>
        <div className="container">
          &copy; {new Date().getFullYear()} Summit Outdoor. All rights reserved. Salomon-inspired minimal architecture.
        </div>
      </div>
    </footer>
  );
}
