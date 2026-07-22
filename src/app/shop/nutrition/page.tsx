import Link from 'next/link';
import styles from '../shop.module.css';
import ProductCard from '../../../components/ProductCard';

export default function ShopNutrition() {
  const products = [
    { 
      id: 'gu-gel', 
      brand: 'GU Energy', 
      name: 'Gel Năng Lượng Liquid Energy Cam Dâu', 
      price: '45.000đ', 
      image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=500',
      status: 'Hot',
      subtitle: 'Liquid Energy Gel'
    },
    { 
      id: 'maurten-gel', 
      brand: 'Maurten', 
      name: 'Gel Năng Lượng Hydrogel Gel 100', 
      price: '95.000đ', 
      image: 'https://images.unsplash.com/photo-1546483875-5f01450a83d4?q=80&w=500',
      status: 'Premium',
      subtitle: 'Hydrogel Technology'
    },
    { 
      id: 'tailwind-drink', 
      brand: 'Tailwind', 
      name: 'Bột Điện Giải Endurance Fuel', 
      price: '85.000đ', 
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=500',
      status: 'Best Seller',
      subtitle: 'Electrolyte Drink Mix'
    },
    { 
      id: 'saltstick-caps', 
      brand: 'SaltStick', 
      name: 'Viên Muối Điện Giải SaltStick (100 viên)', 
      price: '450.000đ', 
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
      status: 'Essential',
      subtitle: 'Anti-Cramp Capsules'
    },
    { 
      id: 'hammer-recover', 
      brand: 'Hammer Nutrition', 
      name: 'Bột Phục Hồi Recoverite Socola', 
      price: '90.000đ', 
      image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=500',
      status: 'New',
      subtitle: 'Recovery Drink Mix'
    },
    { 
      id: 'gu-roctane', 
      brand: 'GU Energy', 
      name: 'Gel Năng Lượng Siêu Bền Roctane Vị Dứa', 
      price: '65.000đ', 
      image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=500',
      status: 'Ultra Spec',
      subtitle: 'Roctane Ultra Energy'
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
