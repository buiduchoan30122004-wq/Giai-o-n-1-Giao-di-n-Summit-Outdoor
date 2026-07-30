'use client';

import Link from 'next/link';
import styles from './shop.module.css';
import ProductCard from '../../components/ProductCard';
import { useLanguage } from '../../context/LanguageContext';

export default function Shop() {
  const { t } = useLanguage();

  const products = [
    { id: '1', brand: 'Salomon', name: 'Speedcross 6', price: '$130.00', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500' },
    { id: '2', brand: 'Hoka', name: 'Speedgoat 5', price: '$155.00', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=500' },
    { id: '3', brand: 'Nike', name: 'Pegasus Trail 4', price: '$160.00', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500' },
    { id: '4', brand: 'Asics', name: 'Trabuco Max 2', price: '$140.00', image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=500' },
    { id: '5', brand: 'Salomon', name: 'SENSE RIDE 5', price: '$140.00', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500' },
    { id: '6', brand: 'Nike', name: 'Wildhorse 8', price: '$130.00', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500' }
  ];

  return (
    <main className="container">
      <div className={styles.shopContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>{t('shop.filters')}</h2>
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>{t('shop.brand')}</h3>
            <ul className={styles.filterList}>
              <li><input type="checkbox" /> Salomon (12)</li>
              <li><input type="checkbox" /> Hoka (8)</li>
              <li><input type="checkbox" /> Nike (15)</li>
            </ul>
          </div>
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>{t('shop.size')}</h3>
            <ul className={styles.filterList}>
              <li><input type="checkbox" /> US 8</li>
              <li><input type="checkbox" /> US 9</li>
              <li><input type="checkbox" /> US 10</li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h1 className={styles.title}>{t('shop.title')}</h1>
            <select className={styles.sort}>
              <option>{t('shop.sort')}</option>
              <option>{t('shop.sort.low')}</option>
              <option>{t('shop.sort.high')}</option>
            </select>
          </div>
          
          <div className={styles.productGrid}>
            {products.map(p => (
              <Link href={`/product/${p.id}`} key={p.id} style={{ display: 'block' }}>
                <ProductCard {...p} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
