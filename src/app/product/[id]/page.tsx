import styles from './product.module.css';
import Link from 'next/link';

export default function ProductDetail({ params }: { params: { id: string } }) {
  return (
    <main className="container">
      <div className={styles.productPage}>
        {/* Gallery */}
        <div className={styles.gallery}>
          <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000" alt="Product Image" className={styles.galleryImg} />
        </div>

        {/* Details */}
        <div className={styles.details}>
          <div className={styles.brand}>Salomon</div>
          <h1 className={styles.name}>Speedcross 6 Trail Running Shoes</h1>
          <div className={styles.price}>$130.00</div>

          <div>
            <div className={styles.selectorTitle}>Select Size (US)</div>
            <div className={styles.sizeGrid}>
              <div className={styles.sizeOption}>8</div>
              <div className={styles.sizeOption}>8.5</div>
              <div className={styles.sizeOption}>9</div>
              <div className={styles.sizeOption}>9.5</div>
              <div className={styles.sizeOption}>10</div>
              <div className={styles.sizeOption}>10.5</div>
              <div className={styles.sizeOption}>11</div>
              <div className={styles.sizeOption}>12</div>
            </div>
          </div>

          <Link href="/cart" style={{ display: 'block' }}>
            <button className={styles.addToCartBtn}>Add to Cart</button>
          </Link>

          <div className={styles.description}>
            <h3 className={styles.selectorTitle}>Product Description</h3>
            <p className={styles.descText}>The SPEEDCROSS 6 needs no introductions. True to its legendary roots and trail status, this version is lighter with an even more powerful, grippy connection to the ground and faster mud evacuation. Featuring a revamped upper that’s both functional and fiery, and classic SPEEDCROSS comfort.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
