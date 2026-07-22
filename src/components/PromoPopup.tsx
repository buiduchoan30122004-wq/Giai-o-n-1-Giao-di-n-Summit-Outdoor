"use client";

import React, { useState, useEffect } from 'react';
import styles from './PromoPopup.module.css';
import Image from 'next/image';

interface PromoPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PromoPopup = ({ isOpen, onClose }: PromoPopupProps) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    favoriteBrand: '',
    experienceLevel: '',
    interests: [] as string[]
  });

  const [interestError, setInterestError] = useState('');

  const handleClose = () => {
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleInterestChange = (interest: string) => {
    setFormData(prev => {
      const current = prev.interests;
      if (current.includes(interest)) {
        setInterestError('');
        return { ...prev, interests: current.filter(i => i !== interest) };
      } else {
        if (current.length >= 2) {
          setInterestError('Bạn chỉ được chọn tối đa 2 mục');
          return prev;
        }
        setInterestError('');
        return { ...prev, interests: [...current, interest] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send data to our internal Next.js API route
      const payload = {
        ...formData,
        interests: formData.interests.join(', ')
      };

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContainer}>
        <button onClick={handleClose} className={styles.closeButton} aria-label="Đóng popup">
          ✕
        </button>
        
        <div className={styles.imageSection}>
          <Image 
            src="/images/promo_bg.png" 
            alt="Khám phá giới hạn bản thân" 
            fill
            className={styles.promoImage}
            priority
          />
        </div>

        <div className={styles.formSection}>
          {!isSuccess ? (
            <>
              <h2 className={styles.title}>Đăng ký nhận ngay</h2>
              <p className={styles.subtitle}>Voucher giảm giá 5% cho toàn bộ sản phẩm</p>
              
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName" className={styles.label}>Họ và tên *</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    name="fullName" 
                    required 
                    className={styles.input}
                    placeholder="Nhập họ tên của bạn"
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
                    placeholder="Nhập email thường dùng"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>Số điện thoại *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    required 
                    className={styles.input}
                    placeholder="Nhập số điện thoại"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="favoriteBrand" className={styles.label}>Hãng giày yêu thích *</label>
                  <select 
                    id="favoriteBrand" 
                    name="favoriteBrand" 
                    required 
                    className={styles.select}
                    value={formData.favoriteBrand}
                    onChange={handleChange}
                  >
                    <option value="" disabled>-- Chọn hãng --</option>
                    <option value="Hoka">Hoka</option>
                    <option value="Kailas">Kailas</option>
                    <option value="Nike">Nike</option>
                    <option value="Salomon">Salomon</option>
                    <option value="Altra">Altra</option>
                  </select>
                </div>

                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.label}>Trình độ hiện tại *</label>
                  <select 
                    name="experienceLevel" 
                    required 
                    className={styles.select}
                    value={formData.experienceLevel}
                    onChange={handleChange}
                  >
                    <option value="" disabled>-- Chọn trình độ --</option>
                    <option value="Mới bắt đầu">Mới bắt đầu</option>
                    <option value="Đã chạy road, muốn chuyển sang trail">Đã chạy road, muốn chuyển sang trail</option>
                    <option value="Chạy trail dưới 2 năm">Chạy trail dưới 2 năm</option>
                    <option value="Chạy trail trên 2 năm">Chạy trail trên 2 năm</option>
                  </select>
                </div>

                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.label}>
                    Bạn quan tâm điều gì nhất? (Chọn tối đa 2)
                    {interestError && <span className={styles.errorText}> - {interestError}</span>}
                  </label>
                  <div className={styles.checkboxGroup}>
                    {[
                      'Chọn giày phù hợp', 'Đồng hồ GPS', 'Balo/Nước chạy trail', 
                      'Quần áo chạy trail', 'Kỹ thuật chạy trail', 'Review sản phẩm', 'Khuyến mãi'
                    ].map(interest => (
                      <label key={interest} className={styles.checkboxLabel}>
                        <input 
                          type="checkbox" 
                          checked={formData.interests.includes(interest)}
                          onChange={() => handleInterestChange(interest)}
                        />
                        {interest}
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                  {isLoading ? 'Đang xử lý...' : 'Nhận Voucher Ngay!'}
                </button>
              </form>
            </>
          ) : (
            <div className={styles.successContainer}>
              <h2 className={styles.successTitle}>Chúc mừng!</h2>
              <p className={styles.successSubtitle}>Mã giảm giá 5% của bạn đã sẵn sàng</p>
              
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
                    Đã copy mã
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    Copy mã ngay
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
