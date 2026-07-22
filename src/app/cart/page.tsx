import Link from 'next/link';
import styles from './cart.module.css';

export default function Cart() {
  return (
    <main className="container">
      <div className={styles.cartPage}>
        {/* Cart Items */}
        <div className={styles.cartList}>
          <h1 className={styles.cartTitle}>Your Cart (1)</h1>
          
          <div className={styles.cartItem}>
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500" alt="Shoes" className={styles.itemImg} />
            <div className={styles.itemInfo}>
              <div className={styles.itemBrand}>Salomon</div>
              <div className={styles.itemName}>Speedcross 6 Trail Running Shoes</div>
              <div className={styles.itemSize}>Size: US 9</div>
              <div className={styles.itemActions}>
                <div className={styles.quantity}>
                  <button className={styles.qtyBtn}>-</button>
                  <span className={styles.qtyValue}>1</span>
                  <button className={styles.qtyBtn}>+</button>
                </div>
                <button className={styles.removeBtn}>Remove</button>
              </div>
            </div>
            <div className={styles.itemPrice}>3.250.000đ</div>
          </div>
        </div>

        {/* Order Summary */}
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>3.250.000đ</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Estimated Shipping</span>
            <span>50.000đ</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Tax</span>
            <span>Calculated at checkout</span>
          </div>
          
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>3.300.000đ</span>
          </div>

          <Link 
            href="/checkout" 
            className={styles.checkoutBtn}
            style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}
