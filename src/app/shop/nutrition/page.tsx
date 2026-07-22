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
      image: 'https://m.media-amazon.com/images/I/61m1N1hXedL._AC_SL1000_.jpg',
      status: 'Essential',
      subtitle: 'Hydration Drink Tabs - Vị Dâu Hibicus'
    },
    { 
      id: 'gu-gel-real', 
      brand: 'GU Energy', 
      name: 'Gel Năng Lượng GU Energy Gel Vị Dâu Chuối', 
      price: '45.000đ', 
      image: 'https://m.media-amazon.com/images/I/71wE19yP69L._AC_SL1500_.jpg',
      status: 'Hot',
      subtitle: 'Energy Gel - Vị Dâu Chuối'
    },
    { 
      id: 'tailwind-pack', 
      brand: 'Tailwind', 
      name: 'Bột Năng Lượng Tailwind Endurance Fuel vị Mâm Xôi', 
      price: '98.000đ', 
      image: 'https://m.media-amazon.com/images/I/71Lh5M-nZ+L._AC_SL1500_.jpg',
      status: 'Best Seller',
      subtitle: 'Endurance Fuel - Raspberry Caffeinated'
    },
    { 
      id: 'hammer-recover-real', 
      brand: 'Hammer Nutrition', 
      name: 'Thức Uống Phục Hồi Hammer Recoverite Socola', 
      price: '105.000đ', 
      image: 'https://m.media-amazon.com/images/I/71R2QZ2eGHL._AC_SL1500_.jpg',
      status: 'New',
      subtitle: 'Post-Workout Recovery - Chocolate'
    },
    { 
      id: 'hammer-gel-real', 
      brand: 'Hammer Nutrition', 
      name: 'Gel Năng Lượng Hammer Gel Vị Montana Huckleberry', 
      price: '49.000đ', 
      image: 'https://m.media-amazon.com/images/I/61m1T7vG6jL._AC_SL1000_.jpg',
      status: 'Popular',
      subtitle: 'Hammer Energy Gel - Vị Huckleberry'
    },
    { 
      id: 'lecka-bar', 
      brand: 'Lecka', 
      name: 'Thanh Năng Lượng Tự Nhiên Lecka Vị Chuối Quế', 
      price: '40.000đ', 
      image: 'https://lecka.eco/cdn/shop/products/banana_cinnamon_1_grande.jpg',
      status: 'Eco-Friendly',
      subtitle: 'Natural Energy Bar - Vị Chuối Quế'
    },
    { 
      id: 'lecka-bar-cacao', 
      brand: 'Lecka', 
      name: 'Thanh Năng Lượng Tự Nhiên Lecka Vị Cacao Chuối', 
      price: '40.000đ', 
      image: 'https://lecka.eco/cdn/shop/products/banana_cacao_1_grande.jpg',
      status: 'Popular',
      subtitle: 'Natural Energy Bar - Vị Cacao Chuối'
    },
    { 
      id: 'tailwind-rebuild-coffee', 
      brand: 'Tailwind', 
      name: 'Bột Phục Hồi Tailwind Rebuild Recovery Vị Cà Phê', 
      price: '105.000đ', 
      image: 'https://m.media-amazon.com/images/I/71m4lOswjGL._AC_SL1500_.jpg',
      status: 'New Flavor',
      subtitle: 'Rebuild Recovery - Coffee Flavor'
    },
    { 
      id: 'tailwind-rebuild-caramel', 
      brand: 'Tailwind', 
      name: 'Bột Phục Hồi Tailwind Rebuild Recovery Vị Caramel Muối', 
      price: '105.000đ', 
      image: 'https://m.media-amazon.com/images/I/71K649SDRpL._AC_SL1500_.jpg',
      status: 'Hot',
      subtitle: 'Rebuild Recovery - Salted Caramel'
    },
    { 
      id: 'pillar-recovery-berry', 
      brand: 'Pillar Performance', 
      name: 'Vi Chất Magie Phục Hồi Pillar Triple Magnesium Berry', 
      price: '40.000đ', 
      image: 'https://pillarperformance.shop/cdn/shop/files/magnesium-berry-tub_600x600.jpg',
      status: 'High Tech',
      subtitle: 'Triple Magnesium Recovery - 5g'
    },
    { 
      id: 'gu-roctane-chocolate', 
      brand: 'GU Energy', 
      name: 'Gel Năng Lượng GU Roctane Vị Socola Muối Biển', 
      price: '79.000đ', 
      image: 'https://m.media-amazon.com/images/I/71a6+L3WnRL._AC_SL1500_.jpg',
      status: 'Ultra Spec',
      subtitle: 'Roctane Ultra Energy - Chocolate'
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
