"use client";

import React, { useState, useEffect } from 'react';
import styles from './PromoPopup.module.css';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

const PromoPopup = () => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    favoriteBrand: ''
  });

  // 2s Delay trigger
  useEffect(() => {
    // Check if user has already seen/closed it in this session to prevent annoyance
    const hasSeenPopup = sessionStorage.getItem('hasSeenPromoPopup');
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenPromoPopup', 'true');
      }, 2000); // 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send data to our internal Next.js API route
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        console.error('Failed to submit form');
        // Still show success to the user so they get the code even if our backend hiccups
        setIsSuccess(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSuccess(true); 
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText('SUMMIT5OFF').then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  if (!isOpen) return null;

  const isVi = language === 'vi';

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContainer}>
        <button onClick={handleClose} className={styles.closeButton} aria-label={isVi ? "Đóng" : "Close"}>
          ✕
        </button>
        
        <div className={styles.imageSection}>
          <Image 
            src="/images/promo_bg.png" 
            alt={isVi ? "Khám phá giới hạn bản thân" : "Explore your limits"} 
            fill
            className={styles.promoImage}
            priority
          />
        </div>

        <div className={styles.formSection}>
          {!isSuccess ? (
            <>
              <h2 className={styles.title}>{isVi ? 'Đăng ký nhận ngay' : 'Subscribe to receive'}</h2>
              <p className={styles.subtitle}>{isVi ? 'VOUCHER GIẢM GIÁ 5% TOÀN BỘ SẢN PHẨM' : '5% DISCOUNT VOUCHER ON ALL PRODUCTS'}</p>
              
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName" className={styles.label}>{isVi ? 'Họ và tên *' : 'Full Name *'}</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    name="fullName" 
                    required 
                    className={styles.input}
                    placeholder={isVi ? 'Nhập họ tên của bạn' : 'Enter your full name'}
                    value={formData.fullName}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>Email *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    className={styles.input}
                    placeholder={isVi ? 'Nhập email thường dùng' : 'Enter email address'}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>{isVi ? 'Số điện thoại *' : 'Phone Number *'}</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    required 
                    className={styles.input}
                    placeholder={isVi ? 'Nhập số điện thoại' : 'Enter phone number'}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="favoriteBrand" className={styles.label}>{isVi ? 'Thương hiệu yêu thích *' : 'Favorite Brand *'}</label>
                  <select 
                    id="favoriteBrand" 
                    name="favoriteBrand" 
                    required 
                    className={styles.select}
                    value={formData.favoriteBrand}
                    onChange={handleChange}
                  >
                    <option value="" disabled>{isVi ? '-- Chọn hãng --' : '-- Choose brand --'}</option>
                    <option value="Hoka">Hoka</option>
                    <option value="Kailas">Kailas</option>
                    <option value="Nike">Nike</option>
                    <option value="Salomon">Salomon</option>
                    <option value="Altra">Altra</option>
                  </select>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                  {isLoading ? (isVi ? 'Đang xử lý...' : 'Processing...') : (isVi ? 'Nhận Voucher Ngay!' : 'Get Voucher Now!')}
                </button>
              </form>
            </>
          ) : (
            <div className={styles.successContainer}>
              <h2 className={styles.successTitle}>{isVi ? 'Chúc mừng!' : 'Congratulations!'}</h2>
              <p className={styles.successSubtitle}>{isVi ? 'Mã giảm giá 5% của bạn đã sẵn sàng' : 'Your 5% discount code is ready'}</p>
              
              <div className={styles.codeBox}>
                <span className={styles.code}>SUMMIT5OFF</span>
              </div>
              
              <button 
                onClick={copyToClipboard} 
                className={`${styles.copyBtn} ${isCopied ? styles.copied : ''}`}
              >
                {isCopied ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    {isVi ? 'Đã copy mã' : 'Copied code'}
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    {isVi ? 'Copy mã ngay' : 'Copy code now'}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;
