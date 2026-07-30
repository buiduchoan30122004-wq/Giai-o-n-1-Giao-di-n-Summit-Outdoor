'use client';

import styles from './cart.module.css';
import { useLanguage } from '../../context/LanguageContext';

export default function Cart() {
  const { language, t } = useLanguage();

  const isVi = language === 'vi';
  const cartSummaryText = isVi ? 'Tóm tắt đơn hàng' : 'Order Summary';

  return (
    <main className="container">
      <div className={styles.cartPage}>
        {/* Cart Items */}
        <div className={styles.cartList}>
          <h1 className={styles.cartTitle}>{t('cart.header')} (1)</h1>
          
          <div className={styles.cartItem}>
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500" alt="Shoes" className={styles.itemImg} />
            <div className={styles.itemInfo}>
              <div className={styles.itemBrand}>Salomon</div>
              <div className={styles.itemName}>{t('cart.item.name')}</div>
              <div className={styles.itemSize}>{t('cart.size')}: US 9</div>
              <div className={styles.itemActions}>
                <div className={styles.quantity}>
                  <button className={styles.qtyBtn}>-</button>
                  <span className={styles.qtyValue}>1</span>
                  <button className={styles.qtyBtn}>+</button>
                </div>
                <button className={styles.removeBtn}>{t('cart.remove')}</button>
              </div>
            </div>
            <div className={styles.itemPrice}>$130.00</div>
          </div>
        </div>

        {/* Order Summary */}
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>{cartSummaryText}</h2>
          
          <div className={styles.summaryRow}>
            <span>{t('cart.subtotal')}</span>
            <span>$130.00</span>
          </div>
          <div className={styles.summaryRow}>
            <span>{t('cart.shipping')}</span>
            <span>$15.00</span>
          </div>
          <div className={styles.summaryRow}>
            <span>{t('cart.tax')}</span>
            <span>{t('cart.tax.desc')}</span>
          </div>
          
          <div className={styles.summaryTotal}>
            <span>{t('cart.total')}</span>
            <span>$145.00</span>
          </div>

          <button className={styles.checkoutBtn}>{t('cart.checkout')}</button>
        </div>
      </div>
    </main>
  );
}
