"use client";

import React, { useState } from 'react';
import styles from './components.module.css';

interface ProductCardProps {
  id: string;
  brand: string;
  name: string;
  price: string;
  image: string;
  status?: string;
  subtitle?: string;
}

export default function ProductCard({ brand, name, price, image, status, subtitle }: ProductCardProps) {
  const [activeFilter, setActiveFilter] = useState('none');
  const [activeSwatch, setActiveSwatch] = useState(0);

  // Giả lập 6 phối màu khác nhau bằng cách xoay tông màu (hue-rotate)
  const swatches = [
    { id: 0, filter: 'none' },
    { id: 1, filter: 'hue-rotate(45deg)' },
    { id: 2, filter: 'hue-rotate(90deg) saturate(1.2)' },
    { id: 3, filter: 'hue-rotate(150deg)' },
    { id: 4, filter: 'hue-rotate(200deg) brightness(0.9)' },
    { id: 5, filter: 'hue-rotate(280deg)' },
  ];

  return (
    <div className={styles.productCard}>
      {/* Khung ảnh có wishlist và nền xám */}
      <div className={styles.productImgContainer}>
        <button className={styles.wishlist} aria-label="Thêm vào danh sách yêu thích">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <img 
          src={image} 
          alt={name} 
          className={styles.productImg} 
          style={{ filter: activeFilter }}
        />
      </div>

      {/* Hàng ảnh thu nhỏ chọn màu */}
      <div className={styles.swatchRow}>
        <div className={styles.swatchList}>
          {swatches.map((swatch) => (
            <div 
              key={swatch.id}
              className={`${styles.swatchItem} ${activeSwatch === swatch.id ? styles.activeSwatch : ''}`}
              onMouseEnter={() => {
                setActiveFilter(swatch.filter);
                setActiveSwatch(swatch.id);
              }}
              onClick={() => {
                setActiveFilter(swatch.filter);
                setActiveSwatch(swatch.id);
              }}
            >
              <img 
                src={image} 
                alt={`${name} color option`} 
                className={styles.swatchImg} 
                style={{ filter: swatch.filter }}
              />
            </div>
          ))}
        </div>
        <div className={styles.swatchArrow}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className={styles.productInfo}>
        {status && <span className={styles.productStatus}>{status}</span>}
        <h4 className={styles.productName}>{name}</h4>
        <span className={styles.productSubtitle}>{subtitle || `${brand} - Unisex`}</span>
        <div className={styles.productPrice}>{price}</div>
      </div>
    </div>
  );
}
