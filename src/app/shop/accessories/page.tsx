import Link from 'next/link';
import styles from '../shop.module.css';
import ProductCard from '../../../components/ProductCard';

export default function ShopAccessories() {
  const products = [
    { 
      id: 'hydration-vest', 
      brand: 'Salomon', 
      name: 'Balo Nước Active Skin 8', 
      price: '2.850.000đ', 
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500',
      status: 'Best Seller',
      subtitle: 'Hydration Vest - Unisex'
    },
    { 
      id: 'garmin-fenix', 
      brand: 'Garmin', 
      name: 'Đồng Hồ Fenix 7 Pro Sapphire Solar', 
      price: '18.990.000đ', 
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500',
      status: 'Premium',
      subtitle: 'GPS Sport Watch'
    },
    { 
      id: 'trail-socks', 
      brand: 'Compressport', 
      name: 'Tất Chạy Trail PRS V4.0', 
      price: '450.000đ', 
      image: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?q=80&w=500',
      status: 'New',
      subtitle: 'High Performance Socks'
    },
    { 
      id: 'flask-500', 
      brand: 'Salomon', 
      name: 'Bình Nước Mềm Soft Flask 500ml', 
      price: '550.000đ', 
      image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=500',
      status: '',
      subtitle: 'Soft Water Flask'
    }
  ];

  return (
    <main className="container">
      <div className={styles.shopContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Filters (Phụ Kiện)</h2>
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Brand</h3>
            <ul className={styles.filterList}>
              <li><input type="checkbox" /> Salomon (6)</li>
              <li><input type="checkbox" /> Garmin (2)</li>
              <li><input type="checkbox" /> Compressport (4)</li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Accessories equipment banner */}
          <div className={styles.categoryBanner}>
            <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200" alt="Accessories Banner" className={styles.bannerImg} />
            <div className={styles.bannerOverlay}>
              <h1 className={styles.bannerTitle}>Trail & Outdoor Accessories</h1>
            </div>
          </div>
          
          <div className={styles.header}>
            <span className={styles.itemCount}>Hiển thị 4 phụ kiện thể thao cao cấp</span>
            <select className={styles.sort}>
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
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
