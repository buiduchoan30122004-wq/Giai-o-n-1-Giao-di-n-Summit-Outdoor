import styles from './page.module.css';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';
import PromoPopup from '../components/PromoPopup';

export default function Home() {
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
            <h1 className={styles.heroTitle}>Đánh Thức Tiềm Năng</h1>
            <p className={styles.heroDesc}>Chinh phục mọi địa hình với bộ sưu tập Xuân/Hè mới nhất. Trải nghiệm sự khác biệt trên từng bước chạy.</p>
            <div className={styles.heroBtns}>
              <Link href="/shop" className="btn btn-primary">Mua Cho Nam</Link>
              <Link href="/shop" className="btn btn-secondary">Mua Cho Nữ</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Activity */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Theo Hoạt Động</h2>
          </div>
          <div className={styles.activityGrid}>
            <Link href="/shop" className={styles.activityCard}>
              <img src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800" alt="Trail Running" />
              <span className={styles.activityLabel}>Chạy Địa Hình</span>
            </Link>
            <Link href="/shop" className={styles.activityCard}>
              <img src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800" alt="Road Running" />
              <span className={styles.activityLabel}>Chạy Đường Nhựa</span>
            </Link>
            <Link href="/shop" className={styles.activityCard}>
              <img src="https://images.unsplash.com/photo-1621609764180-2ca554a9d6f2?q=80&w=800" alt="Hiking" />
              <span className={styles.activityLabel}>Leo Núi & Dã Ngoại</span>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Hàng Mới Về</h2>
            <Link href="/shop" className={styles.viewAll}>Xem Tất Cả</Link>
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

      {/* Promotion Banner */}
      <div className={styles.promoBanner}>
        <div className="container">
          <div className={styles.promoContent}>
            <h2>Tuần Lễ Thành Viên</h2>
            <p>Đăng ký ngay để nhận ưu đãi giảm 20% cho đơn hàng thiết bị dã ngoại đầu tiên.</p>
            <Link href="/shop" className="btn btn-primary">Tham Gia Ngay</Link>
          </div>
        </div>
      </div>

      {/* Best Sellers */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Bán Chạy Nhất</h2>
            <Link href="/shop" className={styles.viewAll}>Xem Tất Cả</Link>
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
