import Link from 'next/link';
import styles from '../shop.module.css';
import ProductCard from '../../../components/ProductCard';

export default function ShopSale() {
  // Discounted products list showing discounted price
  const products = [
    { 
      id: 'speedcross', 
      brand: 'Salomon', 
      name: 'Speedcross 6', 
      price: '3.250.000đ', 
      status: 'Sale -10%',
      subtitle: 'Original: 3.600.000đ',
      image: '/products/salomon_xt6_black.jpg'
    },
    { 
      id: 'xtwhisper', 
      brand: 'Salomon', 
      name: 'XT-WHISPER', 
      price: '3.500.000đ', 
      status: 'Sale -10%',
      subtitle: 'Original: 3.900.000đ',
      image: '/products/salomon_xt_whisper.jpg'
    },
    { 
      id: 'pegasus', 
      brand: 'Nike', 
      name: 'Pegasus Trail 4', 
      price: '3.990.000đ', 
      status: 'Sale -11%',
      subtitle: 'Original: 4.500.000đ',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500'
    },
    { 
      id: 'senseride', 
      brand: 'Salomon', 
      name: 'Sense Ride 5', 
      price: '3.490.000đ', 
      status: 'Sale -8%',
      subtitle: 'Original: 3.800.000đ',
      image: '/products/salomon_slab_ultraglide.jpg'
    },
    { 
      id: 'wildhorse', 
      brand: 'Nike', 
      name: 'Wildhorse 8', 
      price: '3.250.000đ', 
      status: 'Sale -10%',
      subtitle: 'Original: 3.600.000đ',
      image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=500'
    }
  ];

  return (
    <main className="container">
      <div className={styles.shopContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Filters (Giảm giá)</h2>
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Brand</h3>
            <ul className={styles.filterList}>
              <li><input type="checkbox" /> Salomon (3)</li>
              <li><input type="checkbox" /> Nike (2)</li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Sale banner showing shoe in artistic dark orange style */}
          <div className={styles.categoryBanner}>
            <img src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1200" alt="Sale Banner" className={styles.bannerImg} />
            <div className={styles.bannerOverlay}>
              <h1 className={styles.bannerTitle}>Special Deals & Promotions</h1>
            </div>
          </div>
          
          <div className={styles.header}>
            <span className={styles.itemCount}>Hiển thị 5 sản phẩm khuyến mãi hot</span>
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
