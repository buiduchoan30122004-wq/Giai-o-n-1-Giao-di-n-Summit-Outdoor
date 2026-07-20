import styles from './components.module.css';

interface ProductCardProps {
  id: string;
  brand: string;
  name: string;
  price: string;
  image: string;
}

export default function ProductCard({ brand, name, price, image }: ProductCardProps) {
  return (
    <div className={styles.productCard}>
      <button className={styles.wishlist}>♡</button>
      <div className={styles.productImgContainer}>
        <img src={image} alt={name} className={styles.productImg} />
      </div>
      <div className={styles.productInfo}>
        <div className={styles.productBrand}>{brand}</div>
        <div className={styles.productName}>{name}</div>
        <div className={styles.productPrice}>{price}</div>
      </div>
    </div>
  );
}
