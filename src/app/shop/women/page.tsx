import Link from 'next/link';
import styles from '../shop.module.css';
import ProductCard from '../../../components/ProductCard';

export default function ShopWomen() {
  const products = [
    { 
      id: 'xtwhisper', 
      brand: 'Salomon', 
      name: 'XT-WHISPER', 
      price: '3.500.000đ', 
      image: '/products/salomon_xt_whisper.jpg',
      status: 'New',
      subtitle: 'Sneakers - Unisex'
    },
    { 
      id: 'speedcross-w', 
      brand: 'Salomon', 
      name: 'Speedcross 6 Women', 
      price: '3.250.000đ', 
      image: '/products/salomon_slab_ultraglide.jpg',
      status: 'New',
      subtitle: 'Trail running shoes - Women'
    },
    { 
      id: 'speedgoat-w', 
      brand: 'Hoka', 
      name: 'Speedgoat 5 Women', 
      price: '3.850.000đ', 
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500',
      status: 'New',
      subtitle: 'Trail running shoes - Women'
    },
    { 
      id: 'pegasus-w', 
      brand: 'Nike', 
      name: 'Pegasus Trail 4 Women', 
      price: '3.990.000đ', 
      image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=500',
      status: '',
      subtitle: 'Trail running shoes - Women'
    },
    { 
      id: 'slab', 
      brand: 'Salomon', 
      name: 'S/LAB ULTRA GLIDE 2 LIMITED', 
      price: '6.500.000đ', 
      image: '/products/salomon_slab_ultraglide.jpg',
      status: 'Limited',
      subtitle: 'Trail running shoes - Unisex'
    },
    { 
      id: 'senseride', 
      brand: 'Salomon', 
      name: 'Sense Ride 5', 
      price: '3.490.000đ', 
      image: '/products/salomon_slab_ultraglide.jpg',
      status: '',
      subtitle: 'Trail running shoes - Unisex'
    }
  ];

  return (
    <main className="container">
      <div className={styles.shopContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Filters (Nữ)</h2>
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Brand</h3>
            <ul className={styles.filterList}>
              <li><input type="checkbox" /> Salomon (8)</li>
              <li><input type="checkbox" /> Hoka (4)</li>
              <li><input type="checkbox" /> Nike (6)</li>
            </ul>
          </div>
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Size (Women)</h3>
            <ul className={styles.filterList}>
              <li><input type="checkbox" /> US 6 (W)</li>
              <li><input type="checkbox" /> US 7 (W)</li>
              <li><input type="checkbox" /> US 8 (W)</li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Custom Women Banner: Mountain running athlete */}
          <div className={styles.categoryBanner}>
            <img 
              src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200" 
              alt="Women's Trail Running Collection" 
              className={styles.bannerImg} 
            />
            <div className={styles.bannerOverlay}>
              <h1 className={styles.bannerTitle}>Women's Trail Collection</h1>
            </div>
          </div>
          
          <div className={styles.header}>
            <span className={styles.itemCount}>Hiển thị 6 sản phẩm dành cho nữ</span>
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
