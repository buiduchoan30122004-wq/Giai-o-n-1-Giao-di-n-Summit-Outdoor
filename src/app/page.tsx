'use client';

import styles from './page.module.css';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';
import PromoPopup from '../components/PromoPopup';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  const products = [
    { id: '1', brand: 'Salomon', name: 'Speedcross 6', price: '$130.00', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500' },
    { id: '2', brand: 'Hoka', name: 'Speedgoat 5', price: '$155.00', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=500' },
    { id: '3', brand: 'Nike', name: 'Pegasus Trail 4', price: '$160.00', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500' },
    { id: '4', brand: 'Asics', name: 'Trabuco Max 2', price: '$140.00', image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=500' }
  ];

  return (
    <main className={styles.main}>
      <PromoPopup />
      
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container" style={{ width: '100%' }}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{t('hero.title')}</h1>
            <p className={styles.heroDesc}>{t('hero.desc')}</p>
            <div className={styles.heroBtns}>
              <Link href="/shop" className="btn btn-primary">{t('hero.btn.men')}</Link>
              <Link href="/shop" className="btn btn-secondary">{t('hero.btn.women')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Activity */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t('section.activity')}</h2>
          </div>
          <div className={styles.activityGrid}>
            <Link href="/shop" className={styles.activityCard}>
              <img src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800" alt="Trail Running" />
              <span className={styles.activityLabel}>{t('activity.trail')}</span>
            </Link>
            <Link href="/shop" className={styles.activityCard}>
              <img src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800" alt="Road Running" />
              <span className={styles.activityLabel}>{t('activity.road')}</span>
            </Link>
            <Link href="/shop" className={styles.activityCard}>
              <img src="https://images.unsplash.com/photo-1621609764180-2ca554a9d6f2?q=80&w=800" alt="Hiking" />
              <span className={styles.activityLabel}>{t('activity.hiking')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t('section.new')}</h2>
            <Link href="/shop" className={styles.viewAll}>{t('btn.viewall')}</Link>
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
            <h2 className={styles.sectionTitle}>{t('section.best')}</h2>
            <Link href="/shop" className={styles.viewAll}>{t('btn.viewall')}</Link>
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
    </main>
  );
}
