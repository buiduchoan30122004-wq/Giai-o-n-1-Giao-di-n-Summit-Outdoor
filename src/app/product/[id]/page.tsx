"use client";

import React, { useState, useEffect } from 'react';
import styles from './product.module.css';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { productsDatabase } from '@/data/products';
const defaultProduct = productsDatabase['xt6'];

const preDefinedColors = [
  { name: 'Đen', hex: '#000000' },
  { name: 'Trắng', hex: '#ffffff', border: '#e2e8f0' },
  { name: 'Xám', hex: '#808080' },
  { name: 'Đỏ', hex: '#c1121f' },
  { name: 'Xanh dương', hex: '#0055b8' },
  { name: 'Vàng', hex: '#fcd34d' },
  { name: 'Cam', hex: '#f97316' },
  { name: 'Xanh lá', hex: '#10b981' },
  { name: 'Hồng', hex: '#ec4899' },
  { name: 'Đa sắc', hex: 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)' }
];

export default function ProductDetail({ params: paramsProp }: { params: { id: string } }) {
  const params = useParams();
  const router = useRouter();
  const idStr = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const productId = idStr ? idStr.toLowerCase() : (paramsProp?.id ? paramsProp.id.toLowerCase() : 'xt6');
  const product = productsDatabase[productId] || defaultProduct;

  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'features'>('overview');

  // Sync state when product loads or changes
  useEffect(() => {
    setActiveImage(product.image);
    setSelectedSize(null);
    setSelectedColor(null);
    setIsVoucherOpen(false);
    setVoucherInput('');
    setDiscountPercent(0);
    setVoucherMessage(null);
  }, [productId, product.image]);

  // Voucher states
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  const [voucherInput, setVoucherInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const sizes = ['US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 12'];

  // Parse price string to number for calculations (e.g. "4.800.000đ" -> 4800000)
  const numericPrice = parseInt(product.price.replace(/\./g, '').replace('đ', '')) || 0;
  const discountedPrice = discountPercent > 0 ? numericPrice * (1 - discountPercent / 100) : numericPrice;

  const formatPriceVND = (value: number) => {
    return value.toLocaleString('vi-VN') + 'đ';
  };

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (voucherInput.trim().toUpperCase() === 'SUMMIT10OFF') {
      setDiscountPercent(10);
      setVoucherMessage({ text: 'Áp dụng mã thành công! Giảm ngay 10%.', type: 'success' });
    } else {
      setDiscountPercent(0);
      setVoucherMessage({ text: 'Mã giảm giá không hợp lệ. Vui lòng thử lại!', type: 'error' });
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Vui lòng chọn kích thước (size) trước khi mua hàng!');
      return;
    }
    if (!selectedColor) {
      alert('Vui lòng chọn màu sắc trước khi mua hàng!');
      return;
    }
    setIsVoucherOpen(true);
  };

  return (
    <main className="container" style={{ maxWidth: '1140px', margin: '0 auto' }}>
      {/* Breadcrumb - Sportsshoes Style */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className={styles.divider}>/</span>
        <Link href="/shop">Cửa hàng</Link>
        <span className={styles.divider}>/</span>
        <span className={styles.current} translate="no">{product.brand}</span>
      </nav>

      {/* Main product section: Compact 2-column layout */}
      <div className={styles.productPage}>
        {/* Column 1: Left Gallery Side */}
        <div className={styles.gallerySection}>
          <div className={styles.galleryWrapper}>
            {/* Vertical Thumbnails List */}
            <div className={styles.thumbnailsList}>
              {product.thumbnails.map((thumb, index) => (
                <button
                  key={index}
                  className={`${styles.thumbBtn} ${activeImage === thumb ? styles.thumbActive : ''}`}
                  onClick={() => setActiveImage(thumb)}
                >
                  <img src={thumb} alt={`Thumbnail ${index + 1}`} className={styles.thumbImg} />
                </button>
              ))}
            </div>

            {/* Large Active Main Image - Tăng kích thước chiều cao */}
            <div className={styles.mainImageArea}>
              {product.status && <span className={styles.badge}>{product.status}</span>}
              <img src={activeImage} alt={product.name} className={styles.mainImg} />
            </div>
          </div>
        </div>

        {/* Column 2: Right Product Meta Details & Checkout Action */}
        <div className={styles.metaSection}>
          <div className={styles.headerArea}>
            <div className={styles.brandTag} translate="no">{product.brand}</div>
            <h1 className={styles.nameTitle} translate="no">{product.name}</h1>
            <p className={styles.subtitleText}>{product.subtitle}</p>
          </div>

          {/* Hiển thị giá có giảm nếu áp voucher */}
          <div className={styles.priceArea}>
            <div className={styles.priceDisplay}>
              {discountPercent > 0 ? (
                <>
                  <span className={styles.originalPriceCrossed}>{product.price}</span>
                  <span className={styles.currentPrice}>{formatPriceVND(discountedPrice)}</span>
                </>
              ) : (
                <span className={styles.currentPrice}>{product.price}</span>
              )}
            </div>
            <span className={styles.shippingTag}>🚚 Miễn phí vận chuyển</span>
          </div>

          {/* Quick Specifications Grid - sportsshoes.com Iconic Feature */}
          <div className={styles.specsGrid}>
            <div className={styles.specCard}>
              <span className={styles.specLabel}>Đệm gót</span>
              <span className={styles.specVal}>{product.specs.cushioning}</span>
            </div>
            <div className={styles.specCard}>
              <span className={styles.specLabel}>Hỗ trợ lực</span>
              <span className={styles.specVal}>{product.specs.support}</span>
            </div>
            <div className={styles.specCard}>
              <span className={styles.specLabel}>Drop</span>
              <span className={styles.specVal}>{product.specs.drop}</span>
            </div>
            <div className={styles.specCard}>
              <span className={styles.specLabel}>Trọng lượng</span>
              <span className={styles.specVal}>{product.specs.weight}</span>
            </div>
            <div className={styles.specCard} style={{ gridColumn: 'span 2' }}>
              <span className={styles.specLabel}>Địa hình khuyên dùng</span>
              <span className={styles.specVal}>{product.specs.terrain}</span>
            </div>
          </div>

          {/* Color Selector Section - 10 Predefined Colors */}
          <div className={styles.colorSelectorSection}>
            <div className={styles.colorHeader}>
              <span className={styles.colorTitle}>Chọn Màu Sắc</span>
              {selectedColor && <span className={styles.selectedColorText}>: {selectedColor}</span>}
            </div>
            <div className={styles.colorsGrid}>
              {preDefinedColors.map((color) => {
                const isAvailable = product.availableColors.includes(color.name);
                return (
                  <button
                    key={color.name}
                    className={`${styles.colorSwatchBtn} ${selectedColor === color.name ? styles.colorSwatchActive : ''} ${!isAvailable ? styles.colorSwatchDisabled : ''}`}
                    style={{ background: color.hex, borderColor: color.border || 'transparent' }}
                    onClick={() => isAvailable && setSelectedColor(color.name)}
                    disabled={!isAvailable}
                    title={isAvailable ? color.name : `${color.name} (Tạm hết hàng)`}
                  >
                    {!isAvailable && <div className={styles.disabledSlash} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector Box */}
          <div className={styles.sizeSection}>
            <div className={styles.sizeHeader}>
              <span className={styles.sizeTitle}>Chọn Kích Thước (US)</span>
              <span className={styles.sizeGuideLink}>📐 Bảng quy đổi size</span>
            </div>
            <div className={styles.sizeOptionsGrid}>
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`${styles.sizeOptionBtn} ${selectedSize === size ? styles.sizeSelected : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size.replace('US ', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart & Buy Now CTA Actions - 2 buttons */}
          <div className={styles.actionButtons}>
            <div className={styles.ctaButtonsRow}>
              {/* Button 1: Add to Cart */}
              <button 
                className={styles.cartBtn}
                onClick={() => {
                  if (!selectedSize) {
                    alert('Vui lòng chọn kích thước (size) trước!');
                    return;
                  }
                  if (!selectedColor) {
                    alert('Vui lòng chọn màu sắc trước!');
                    return;
                  }

                  try {
                    const cartDataStr = localStorage.getItem('summit_cart');
                    let cart = [];
                    if (cartDataStr) {
                      cart = JSON.parse(cartDataStr);
                    }

                    const existingItemIndex = cart.findIndex(
                      (item: any) => item.id === product.id && item.size === selectedSize && item.color === selectedColor
                    );

                    if (existingItemIndex > -1) {
                      cart[existingItemIndex].quantity += 1;
                    } else {
                      cart.push({
                        id: product.id,
                        brand: product.brand,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        size: selectedSize,
                        color: selectedColor,
                        quantity: 1
                      });
                    }

                    localStorage.setItem('summit_cart', JSON.stringify(cart));
                    window.dispatchEvent(new Event('cartUpdated'));

                    alert(`Đã thêm vào giỏ hàng: ${product.name} (Màu: ${selectedColor}, Size: ${selectedSize})`);
                  } catch (e) {
                    console.error(e);
                    alert('Lỗi khi thêm vào giỏ hàng!');
                  }
                }}
              >
                Thêm vào giỏ hàng
              </button>

              {/* Button 2: Buy Now */}
              <button 
                className={styles.buyNowBtn}
                onClick={() => {
                  if (!selectedSize) {
                    alert('Vui lòng chọn kích thước (size) trước!');
                    return;
                  }
                  if (!selectedColor) {
                    alert('Vui lòng chọn màu sắc trước!');
                    return;
                  }

                  try {
                    const cartDataStr = localStorage.getItem('summit_cart');
                    let cart = [];
                    if (cartDataStr) {
                      cart = JSON.parse(cartDataStr);
                    }

                    const existingItemIndex = cart.findIndex(
                      (item: any) => item.id === product.id && item.size === selectedSize && item.color === selectedColor
                    );

                    if (existingItemIndex > -1) {
                      cart[existingItemIndex].quantity += 1;
                    } else {
                      cart.push({
                        id: product.id,
                        brand: product.brand,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        size: selectedSize,
                        color: selectedColor,
                        quantity: 1
                      });
                    }

                    localStorage.setItem('summit_cart', JSON.stringify(cart));
                    window.dispatchEvent(new Event('cartUpdated'));

                    router.push('/cart');
                  } catch (e) {
                    console.error(e);
                    router.push('/cart');
                  }
                }}
              >
                Mua ngay
              </button>
            </div>

            {/* Voucher input form, displays when clicking "Mua ngay" */}
            {isVoucherOpen && (
              <div className={styles.voucherBox}>
                <p className={styles.voucherPrompt}>Bạn có mã giảm giá? Hãy nhập vào đây:</p>
                <form onSubmit={handleApplyVoucher} className={styles.voucherForm}>
                  <input
                    type="text"
                    placeholder="Ví dụ: SUMMIT10OFF"
                    className={styles.voucherInput}
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                  />
                  <button type="submit" className={styles.voucherApplyBtn}>Áp dụng</button>
                </form>
                {voucherMessage && (
                  <p className={voucherMessage.type === 'success' ? styles.voucherSuccessText : styles.voucherErrorText}>
                    {voucherMessage.text}
                  </p>
                )}
              </div>
            )}

            <div className={styles.guarantees}>
              <span>✓ Cam kết 100% chính hãng</span>
              <span>✓ Đổi size linh hoạt trong 7 ngày</span>
            </div>
          </div>

          {/* Collapsible Tabs: Overview & Features */}
          <div className={styles.tabSection}>
            <div className={styles.tabHeaders}>
              <button
                className={`${styles.tabHeaderBtn} ${activeTab === 'overview' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Tổng quan
              </button>
              <button
                className={`${styles.tabHeaderBtn} ${activeTab === 'features' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('features')}
              >
                Tính năng nổi bật
              </button>
            </div>
            <div className={styles.tabContent}>
              {activeTab === 'overview' ? (
                <p className={styles.tabDescText}>{product.description}</p>
              ) : (
                <ul className={styles.featuresList}>
                  {product.features.map((feat, index) => (
                    <li key={index} className={styles.featItem}>{feat}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
