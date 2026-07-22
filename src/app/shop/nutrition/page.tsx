import Link from 'next/link';
import styles from '../shop.module.css';
import ProductCard from '../../../components/ProductCard';

export default function ShopNutrition() {
  const products = [
    { 
      id: 'gu-tabs', 
      brand: 'GU Energy', 
      name: 'Viên Sủi Điện Giải GU Hydration Drink Tabs', 
      price: '219.000đ', 
      image: 'https://cdn.hstatic.net/products/200001165929/20230830_jsdi42u6db_5cf9e7362ea3440387a5069d7fb44de3_grande.jpeg',
      status: 'Essential',
      subtitle: 'Hydration Drink Tabs - Vị Dâu Hibicus'
    },
    { 
      id: 'gu-gel-real', 
      brand: 'GU Energy', 
      name: 'Gel Năng Lượng GU Energy Gel Vị Dâu Chuối', 
      price: '45.000đ', 
      image: 'https://cdn.hstatic.net/products/200001165929/upload_ca2ae7d0cbf744d399dff0fe62d1d134_grande.jpg',
      status: 'Hot',
      subtitle: 'Energy Gel - Vị Dâu Chuối'
    },
    { 
      id: 'tailwind-pack', 
      brand: 'Tailwind', 
      name: 'Bột Năng Lượng Tailwind Endurance Fuel vị Mâm Xôi', 
      price: '98.000đ', 
      image: 'https://cdn.hstatic.net/products/200001165929/upload_ad4b3c14e9114eddbec5d1e77b0bf9cc_grande.jpg',
      status: 'Best Seller',
      subtitle: 'Endurance Fuel - Raspberry Caffeinated'
    },
    { 
      id: 'hammer-recover-real', 
      brand: 'Hammer Nutrition', 
      name: 'Thức Uống Phục Hồi Hammer Recoverite Socola', 
      price: '105.000đ', 
      image: 'https://cdn.hstatic.net/products/200001165929/upload_a5f8396e74d444f8b8eaf1d8955b389d_grande.jpg',
      status: 'New',
      subtitle: 'Post-Workout Recovery - Chocolate'
    },
    { 
      id: 'hammer-gel-real', 
      brand: 'Hammer Nutrition', 
      name: 'Gel Năng Lượng Hammer Gel Vị Montana Huckleberry', 
      price: '49.000đ', 
      image: 'https://cdn.hstatic.net/products/200001165929/upload_4532655c9b5c42ed813f44962cfe05f2_grande.jpg',
      status: 'Popular',
      subtitle: 'Hammer Energy Gel - Vị Huckleberry'
    },
    { 
      id: 'lecka-bar', 
      brand: 'Lecka', 
      name: 'Thanh Năng Lượng Tự Nhiên Lecka Vị Chuối Quế', 
      price: '40.000đ', 
      image: 'https://cdn.hstatic.net/products/200001165929/upload_4313a74252a94f94b90421b303c3845e_grande.jpg',
      status: 'Eco-Friendly',
      subtitle: 'Natural Energy Bar - Vị Chuối Quế'
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
            <span className={styles.itemCount}>Hiển thị 6 sản phẩm dinh dưỡng & năng lượng</span>
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
