import Link from 'next/link';
import styles from '../shop.module.css';
import ProductCard from '../../../components/ProductCard';

export default function ShopNutrition() {
  const products = [
    { 
      id: 'gu-tabs', 
      brand: 'GU Energy', 
      name: 'Viên sủi điện giải GU Hydration Tabs', 
      price: '219.000đ', 
      image: 'https://cdn.hstatic.net/products/200001165929/20230830_jsdi42u6db_5cf9e7362ea3440387a5069d7fb44de3_grande.jpeg',
      status: 'Essential',
      subtitle: 'Hydration Drink Tabs - Vị Dâu Hibicus'
    },
    { 
      id: 'hammer-gel-real', 
      brand: 'Hammer Nutrition', 
      name: 'Hammer Gel vị Montana Huckleberry', 
      price: '49.000đ', 
      image: 'https://cdn.hstatic.net/products/200001165929/upload_4532655c9b5c42ed813f44962cfe05f2_grande.jpg',
      status: 'Popular',
      subtitle: 'Hammer Energy Gel - Vị Huckleberry'
    },
    { 
      id: 'lecka-bar', 
      brand: 'Lecka', 
      name: 'Thanh năng lượng Lecka Chuối Quế', 
      price: '40.000đ', 
      image: 'https://cdn.hstatic.net/products/200001165929/upload_4313a74252a94f94b90421b303c3845e_grande.jpg',
      status: 'Eco-Friendly',
      subtitle: 'Natural Energy Bar - Vị Chuối Quế'
    },
    { 
      id: 'lecka-bar-cacao', 
      brand: 'Lecka', 
      name: 'Thanh năng lượng Lecka Cacao Chuối', 
      price: '40.000đ', 
      image: 'https://cdn.hstatic.net/products/200001165929/upload_89eacceb324947b089b62a9b6dafef04_grande.jpg',
      status: 'Popular',
      subtitle: 'Natural Energy Bar - Vị Cacao Chuối'
    },
    { 
      id: 'pillar-recovery-berry', 
      brand: 'Pillar Performance', 
      name: 'Bột Magie Pillar Triple Magnesium', 
      price: '40.000đ', 
      image: 'https://cdn.hstatic.net/products/200001165929/upload_0e36e90b54224a0882255a7198ed9bf9_grande.jpg',
      status: 'High Tech',
      subtitle: 'Triple Magnesium Recovery - 5g'
    }
  ];

  return (
    <main className="container">
      <div className={styles.shopContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Filters (Dinh dưỡng)</h2>
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Brand</h3>
            <ul className={styles.filterList}>
              <li><input type="checkbox" /> GU Energy (4)</li>
              <li><input type="checkbox" /> Maurten (2)</li>
              <li><input type="checkbox" /> Tailwind (3)</li>
              <li><input type="checkbox" /> SaltStick (2)</li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Nutrition healthy lifestyle banner */}
          <div className={styles.categoryBanner}>
            <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200" alt="Nutrition Banner" className={styles.bannerImg} />
            <div className={styles.bannerOverlay}>
              <h1 className={styles.bannerTitle}>Trail Running Nutrition</h1>
            </div>
          </div>
          
          <div className={styles.header}>
            <span className={styles.itemCount}>Hiển thị {products.length} sản phẩm dinh dưỡng & năng lượng</span>
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
