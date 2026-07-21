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

      {/* Brands Section (Logo Strip) */}
      <section className={styles.partnerSection}>
        <div className="container">
          <div className={styles.partnerGrid}>
            <div className={styles.partnerLogo}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Asics_Logo.svg/2560px-Asics_Logo.svg.png" alt="Asics" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/2560px-Adidas_Logo.svg.png" alt="Adidas" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Salomon_logo.svg/2560px-Salomon_logo.svg.png" alt="Salomon" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Hoka_One_One_logo.svg/2560px-Hoka_One_One_logo.svg.png" alt="Hoka" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Puma_Logo.svg/2560px-Puma_Logo.svg.png" alt="Puma" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/New_Balance_logo.svg/2560px-New_Balance_logo.svg.png" alt="New Balance" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/2560px-Logo_NIKE.svg.png" alt="Nike" />
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
              <div className={styles.overlay}></div>
              <span className={styles.activityLabel}>Chạy Địa Hình</span>
            </Link>
            <Link href="/shop" className={styles.activityCard}>
              <img src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800" alt="Road Running" />
              <div className={styles.overlay}></div>
              <span className={styles.activityLabel}>Chạy Đường Nhựa</span>
            </Link>
            <Link href="/shop" className={styles.activityCard}>
              <img src="https://images.unsplash.com/photo-1621609764180-2ca554a9d6f2?q=80&w=800" alt="Hiking" />
              <div className={styles.overlay}></div>
              <span className={styles.activityLabel}>Leo Núi & Dã Ngoại</span>
            </Link>
            <Link href="/shop" className={styles.activityCard}>
              <img src="https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?q=80&w=800" alt="Accessories" />
              <div className={styles.overlay}></div>
              <span className={styles.activityLabel}>Phụ Kiện Thể Thao</span>
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

      {/* Partner Brands */}
      <section className={styles.partnerSection}>
        <div className="container">
          <div className={styles.partnerGrid}>
            <div className={styles.partnerLogo}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Asics_Logo.svg/2560px-Asics_Logo.svg.png" alt="Asics" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/2560px-Adidas_Logo.svg.png" alt="Adidas" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Salomon_logo.svg/2560px-Salomon_logo.svg.png" alt="Salomon" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Hoka_One_One_logo.svg/2560px-Hoka_One_One_logo.svg.png" alt="Hoka" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Puma_Logo.svg/2560px-Puma_Logo.svg.png" alt="Puma" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/New_Balance_logo.svg/2560px-New_Balance_logo.svg.png" alt="New Balance" />
            </div>
            <div className={styles.partnerLogo}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/2560px-Logo_NIKE.svg.png" alt="Nike" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
