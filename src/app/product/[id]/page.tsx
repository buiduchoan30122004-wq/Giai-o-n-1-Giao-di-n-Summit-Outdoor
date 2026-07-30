'use client';

import styles from './product.module.css';
import Link from 'next/link';
import { useLanguage } from '../../../context/LanguageContext';

export default function ProductDetail({ params }: { params: { id: string } }) {
  const { t } = useLanguage();

  return (
    <main className="container">
      <div className={styles.productPage}>
        {/* Gallery */}
        <div className={styles.gallery}>
          <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000" alt="Product Image" className={styles.galleryImg} />
        </div>

        {/* Details */}
        <div className={styles.details}>
          <div className={styles.brand}>Salomon</div>
          <h1 className={styles.name}>{t('cart.item.name')}</h1>
          <div className={styles.price}>$130.00</div>

          <div>
            <div className={styles.selectorTitle}>{t('product.select.size')}</div>
            <div className={styles.sizeGrid}>
              <div className={styles.sizeOption}>8</div>
              <div className={styles.sizeOption}>8.5</div>
              <div className={styles.sizeOption}>9</div>
              <div className={styles.sizeOption}>9.5</div>
              <div className={styles.sizeOption}>10</div>
              <div className={styles.sizeOption}>10.5</div>
              <div className={styles.sizeOption}>11</div>
              <div className={styles.sizeOption}>12</div>
            </div>
          </div>

          <Link href="/cart" style={{ display: 'block' }}>
            <button className={styles.addToCartBtn}>{t('product.add')}</button>
          </Link>

          <div className={styles.description}>
            <h3 className={styles.selectorTitle}>{t('product.desc')}</h3>
            <p className={styles.descText}>{t('product.speedcross.desc')}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
