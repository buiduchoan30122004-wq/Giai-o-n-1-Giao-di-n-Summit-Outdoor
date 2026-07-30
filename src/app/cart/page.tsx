"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './cart.module.css';

interface CartItem {
  id: string;
  brand: string;
  name: string;
  price: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [giftWrap, setGiftWrap] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [shippingFee, setShippingFee] = useState(50000); // 50.000đ
  const [country, setCountry] = useState('Vietnam');
  const [shippingMethod, setShippingMethod] = useState('Standard');

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const cartDataStr = localStorage.getItem('summit_cart');
        if (cartDataStr) {
          setCartItems(JSON.parse(cartDataStr));
        }
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    };
    loadCart();
  }, []);

  // Update localStorage when cart items change
  const saveCartToStorage = (updatedItems: CartItem[]) => {
    setCartItems(updatedItems);
    try {
      localStorage.setItem('summit_cart', JSON.stringify(updatedItems));
      // Dispatch custom event to update Header count
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  };

  // Change quantity
  const handleQuantityChange = (itemId: string, size: string, color: string, newQty: number) => {
    const updated = cartItems.map(item => {
      if (item.id === itemId && item.size === size && item.color === color) {
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCartToStorage(updated);
  };

  // Delete item
  const handleDeleteItem = (itemId: string, size: string, color: string) => {
    const updated = cartItems.filter(
      item => !(item.id === itemId && item.size === size && item.color === color)
    );
    saveCartToStorage(updated);
  };

  // Apply promo code
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (code === 'SUMMIT10OFF') {
      setDiscountPercent(10);
      setPromoMessage({ text: 'Áp dụng mã giảm giá 10% thành công!', type: 'success' });
    } else if (code === 'FREESHIP' || code === 'FREE SHIP' || code === 'FREEE SHIP' || code === 'FREESHIP' || code === 'FREEESHIP') {
      setDiscountPercent(0);
      setShippingFee(0);
      setPromoMessage({ text: 'Áp dụng mã miễn phí vận chuyển thành công!', type: 'success' });
    } else {
      setPromoMessage({ text: 'Mã giảm giá không hợp lệ!', type: 'error' });
    }
  };

  // Calculate prices
  const parsePrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/\./g, '').replace('đ', '')) || 0;
  };

  const formatPrice = (amount: number) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  const subtotal = cartItems.reduce((acc, item) => acc + parsePrice(item.price) * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const giftWrapFee = giftWrap ? 50000 : 0; // 50.000đ if wrapped
  const total = subtotal - discountAmount + shippingFee + giftWrapFee;

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <main className="container">
        <div className={styles.emptyCart}>
          <h1 className={styles.emptyTitle}>Giỏ hàng của bạn đang trống</h1>
          <p className={styles.emptyText}>Hiện chưa có sản phẩm nào được thêm vào giỏ hàng.</p>
          <Link href="/shop" className={styles.shopBtn}>
            Bắt đầu mua sắm
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div className={styles.cartPage}>
        
        {/* Left Column: Cart items table & options */}
        <div className={styles.leftColumn}>
          <h1 className={styles.cartTitle}>
            Giỏ hàng của bạn <span>({totalItemsCount} sản phẩm)</span>
          </h1>

          {/* Table Headers */}
          <div className={styles.tableHeader}>
            <span className={styles.tableHeaderItem}>Sản phẩm</span>
            <span className={styles.tableHeaderCenter}>Đơn giá</span>
            <span className={styles.tableHeaderCenter}>Số lượng</span>
            <span className={styles.tableHeaderCenter}>Thành tiền</span>
            <span className={styles.tableHeaderRight}>Xóa</span>
          </div>

          {/* Cart Item Rows */}
          <div className={styles.cartList}>
            {cartItems.map((item, index) => {
              const itemPriceNum = parsePrice(item.price);
              const itemTotalNum = itemPriceNum * item.quantity;
              
              return (
                <div key={`${item.id}-${item.size}-${item.color}-${index}`} className={styles.cartItem}>
                  {/* Info */}
                  <div className={styles.itemMainInfo}>
                    <img src={item.image} alt={item.name} className={styles.itemImg} />
                    <div className={styles.itemDetails}>
                      <span className={styles.itemBrand}>{item.brand}</span>
                      <Link href={`/product/${item.id}`} className={styles.itemName}>
                        {item.name}
                      </Link>
                      <span className={styles.itemMeta}>
                        Size: {item.size} | Màu: {item.color}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className={styles.itemPriceCol}>
                    {item.price}
                  </div>

                  {/* Quantity Dropdown */}
                  <div className={styles.itemQtyCol}>
                    <select 
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, item.size, item.color, parseInt(e.target.value))}
                      className={styles.qtyDropdown}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  {/* Total */}
                  <div className={styles.itemTotalCol}>
                    {formatPrice(itemTotalNum)}
                  </div>

                  {/* Delete button */}
                  <div className={styles.deleteCol}>
                    <button 
                      onClick={() => handleDeleteItem(item.id, item.size, item.color)}
                      className={styles.deleteBtn}
                      aria-label="Xóa sản phẩm"
                    >
                      <svg className={styles.deleteIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Options: Gift Wrap */}
          <label className={styles.giftWrap}>
            <input 
              type="checkbox" 
              checked={giftWrap}
              onChange={(e) => setGiftWrap(e.target.checked)}
            />
            🎁 Gói quà cho đơn hàng này? (+50.000đ)
          </label>

          <p className={styles.promoDisclaimer}>
            * Sản phẩm trong giỏ hàng được áp dụng giao hàng tiêu chuẩn miễn phí nếu đạt tổng giá trị quy định hoặc áp dụng mã coupon hợp lệ.
          </p>

          {/* Delivery Calculator */}
          <div className={styles.deliveryCalcBox}>
            <div className={styles.deliveryHeader}>
              <span className={styles.deliveryTitle}>Dự toán phí giao hàng</span>
              <span className={styles.carbonNeutral}>
                🌱 Tất cả đơn hàng đều trung hòa Carbon
              </span>
            </div>
            
            <div className={styles.calcGrid}>
              <div className={styles.calcSelectGroup}>
                <label className={styles.calcLabel}>Quốc gia</label>
                <select 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)} 
                  className={styles.calcSelect}
                  disabled
                >
                  <option value="Vietnam">Việt Nam (Chỉ hỗ trợ giao hàng nội địa)</option>
                </select>
              </div>

              <div className={styles.calcSelectGroup}>
                <label className={styles.calcLabel}>Phương thức giao hàng</label>
                <select 
                  value={shippingMethod} 
                  onChange={(e) => {
                    setShippingMethod(e.target.value);
                    if (e.target.value === 'Express') {
                      setShippingFee(100000); // Express is 100k
                    } else {
                      setShippingFee(50000); // Standard is 50k
                    }
                  }} 
                  className={styles.calcSelect}
                >
                  <option value="Standard">Giao hàng tiêu chuẩn (50.000đ - 2-3 ngày)</option>
                  <option value="Express">Giao hàng hỏa tốc (100.000đ - 1 ngày)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Banner cyan */}
          <div className={styles.ultraBanner}>
            ULTRA. Thành viên Summit được ưu tiên xử lý đơn hàng trước. Hãy đăng ký tài khoản Ultra khi thanh toán.
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>TÓM TẮT ĐƠN HÀNG</h2>
          
          <div className={styles.summaryRow}>
            <span>Tạm tính</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {discountAmount > 0 && (
            <div className={styles.summaryRow} style={{ color: '#16a34a', fontWeight: 'bold' }}>
              <span>Mã giảm giá</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}

          {giftWrap && (
            <div className={styles.summaryRow}>
              <span>Gói quà tặng</span>
              <span>+50.000đ</span>
            </div>
          )}

          <div className={styles.summaryRow}>
            <span>Phí vận chuyển</span>
            <span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
          </div>

          <div className={styles.totalRow}>
            <span>Tổng cộng</span>
            <span>{formatPrice(total)}</span>
          </div>

          {/* Promo code accordion */}
          <div className={styles.promoDropdown}>
            <div className={styles.promoHeader} onClick={() => setPromoOpen(!promoOpen)}>
              <span>Bạn có mã giảm giá?</span>
              <svg className={`${styles.chevronIcon} ${promoOpen ? styles.chevronOpen : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {promoOpen && (
              <div>
                <form onSubmit={handleApplyPromo} className={styles.promoContent}>
                  <input 
                    type="text" 
                    placeholder="Ví dụ: SUMMIT10OFF"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className={styles.promoInput}
                  />
                  <button type="submit" className={styles.promoApplyBtn}>
                    Áp dụng
                  </button>
                </form>
                {promoMessage && (
                  <p className={`${styles.promoMessage} ${promoMessage.type === 'success' ? styles.promoSuccess : styles.promoError}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>
            )}
          </div>

          <p className={styles.giftCardNotice}>
            Nếu bạn muốn thanh toán bằng thẻ quà tặng (Gift card), vui lòng chọn phương thức thanh toán đó ở bước tiếp theo của quá trình đặt hàng.
          </p>

          <button 
            onClick={() => {
              try {
                localStorage.setItem('summit_checkout', JSON.stringify({
                  subtotal,
                  shipping: shippingFee,
                  discount: discountAmount,
                  giftWrap: giftWrapFee,
                  total
                }));
                router.push('/checkout');
              } catch (e) {
                console.error(e);
                router.push('/checkout');
              }
            }} 
            className={styles.checkoutBtn}
          >
            {/* Padlock Icon */}
            <svg className={styles.padlockIcon} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Thanh toán an toàn
          </button>

          <Link href="/shop" className={styles.continueShopping}>
            Tiếp tục mua sắm
          </Link>

          <p className={styles.taxNotice}>
            Tất cả các khoản thuế và thuế nhập khẩu đã được bao gồm đầy đủ trong giá bán của mỗi sản phẩm.
          </p>

          {/* Payment Icons - Standard Sportsshoes Grid */}
          <div className={styles.paymentPartners}>
            <div className={styles.payBadge}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className={styles.payIcon} />
            </div>
            <div className={styles.payBadge}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3b/Sofort_Direct_eBanking_logo.svg" alt="Sofort" className={styles.payIcon} />
            </div>
            <div className={styles.payBadge}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className={styles.payIcon} />
            </div>
            <div className={styles.payBadge}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo.svg" alt="Google Pay" className={styles.payIcon} />
            </div>
            <div className={styles.payBadge}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" className={styles.payIcon} />
            </div>
            <div className={styles.payBadge}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/14/Giropay_logo.svg" alt="Giropay" className={styles.payIcon} />
            </div>
            <div className={styles.payBadge}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className={styles.payIcon} />
            </div>
            <div className={styles.payBadge}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_Pay_logo.svg" alt="Apple Pay" className={styles.payIcon} />
            </div>
            <div className={styles.payBadge}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/07/Klarna_Logo.svg" alt="Klarna" className={styles.payIcon} />
            </div>
            <div className={styles.payBadge}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/df/Clearpay_logo.svg" alt="Clearpay" className={styles.payIcon} />
            </div>
          </div>

          {/* Trust list checklist */}
          <div className={styles.trustList}>
            <div className={styles.trustRating}>
              <span>Đánh giá 4.5/5</span>
              <span className={styles.trustStars}>★★★★★</span>
              <span>Trustpilot</span>
            </div>
            
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🏆</span>
              <span>Nhà bán lẻ chạy bộ địa hình và dã ngoại số 1 Việt Nam.</span>
            </div>
            
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>⚡</span>
              <span>Giao hàng nhanh hỏa tốc và hỗ trợ đóng gói quà tặng.</span>
            </div>

            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🔄</span>
              <span>Hỗ trợ đổi trả size linh hoạt trong 7 ngày miễn phí.</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
