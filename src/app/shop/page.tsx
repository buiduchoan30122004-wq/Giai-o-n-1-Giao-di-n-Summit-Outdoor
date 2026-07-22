import Link from 'next/link';
import styles from './shop.module.css';
import ProductCard from '../../components/ProductCard';

export default function Shop() {
  const products = [
    { 
      id: '1', 
      brand: 'Salomon', 
      name: 'Speedcross 6', 
      price: '3.250.000đ', 
      image: '/products/salomon_xt6_black.jpg',
      status: 'New',
      subtitle: 'Trail running shoes - Unisex'
    },
    { 
      id: '2', 
      brand: 'Hoka', 
      name: 'Speedgoat 5', 
      price: '3.850.000đ', 
      image: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?q=80&w=500',
      status: 'New',
      subtitle: 'Trail running shoes - Unisex'
    },
    { 
      id: '3', 
      brand: 'Nike', 
      name: 'Pegasus Trail 4', 
      price: '3.990.000đ', 
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500',
      status: '',
      subtitle: 'Trail running shoes - Unisex'
    },
    { 
      id: '4', 
      brand: 'Asics', 
      name: 'Trabuco Max 2', 
      price: '3.490.000đ', 
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500',
      status: 'New',
      subtitle: 'Trail running shoes - Unisex'
    },
    { 
      id: '5', 
      brand: 'Salomon', 
      name: 'Sense Ride 5', 
      price: '3.490.000đ', 
      image: '/products/salomon_slab_ultraglide.jpg',
      status: '',
      subtitle: 'Trail running shoes - Unisex'
    },
    { 
      id: '6', 
      brand: 'Nike', 
      name: 'Wildhorse 8', 
      price: '3.250.000đ', 
      image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=500',
      status: 'New',
      subtitle: 'Trail running shoes - Unisex'
    }
  ];

  return (
    <main className="container">
      <div className={styles.shopContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Filters</h2>
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Brand</h3>
            <ul className={styles.filterList}>
              <li><input type="checkbox" /> Salomon (12)</li>
              <li><input type="checkbox" /> Hoka (8)</li>
              <li><input type="checkbox" /> Nike (15)</li>
            </ul>
          </div>
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Size</h3>
            <ul className={styles.filterList}>
              <li><input type="checkbox" /> US 8</li>
              <li><input type="checkbox" /> US 9</li>
              <li><input type="checkbox" /> US 10</li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <div className={styles.categoryBanner}>
            <img src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1200" alt="Trail Running Banner" className={styles.bannerImg} />
            <div className={styles.bannerOverlay}>
              <h1 className={styles.bannerTitle}>Trail Running Shoes</h1>
            </div>
          </div>
          
          <div className={styles.header}>
            <span className={styles.itemCount}>Hiển thị 6 sản phẩm</span>
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
