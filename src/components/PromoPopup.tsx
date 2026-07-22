"use client";

import React, { useState } from 'react';
import styles from './PromoPopup.module.css';

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
          setInterestError('Chọn tối đa 2 mục');
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
    navigator.clipboard.writeText('SUMMIT10OFF').then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContainer}>
        {/* Close button on top-right over the image */}
        <button onClick={handleClose} className={styles.closeButton} aria-label="Đóng popup">
          ✕
        </button>

        {/* Left Column: Form Section */}
        <div className={styles.formSection}>
          {!isSuccess ? (
            <>
              <div className={styles.badgeWrapper}>
                <span className={styles.badge}>Ưu đãi độc quyền</span>
              </div>
              <h2 className={styles.title}>Unlock 10% Off</h2>
              <p className={styles.subtitle}>Nhập thông tin nhận ngay mã giảm giá đặc quyền và các cập nhật mới nhất từ Summit Outdoor</p>
              
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName" className={styles.label}>Họ và tên *</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    name="fullName" 
                    required 
                    className={styles.input}
                    placeholder="Nhập họ tên"
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
                    placeholder="Nhập email"
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
                  <label htmlFor="favoriteBrand" className={styles.label}>Hãng yêu thích *</label>
                  <select 
                    id="favoriteBrand" 
                    name="favoriteBrand" 
                    required 
                    className={styles.select}
                    value={formData.favoriteBrand}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Chọn hãng</option>
                    <option value="Hoka">Hoka</option>
                    <option value="Nike">Nike</option>
                    <option value="Salomon">Salomon</option>
                    <option value="Asics">Asics</option>
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
                    <option value="" disabled>Chọn trình độ chạy</option>
                    <option value="Mới bắt đầu">Mới bắt đầu</option>
                    <option value="Đã chạy road, muốn sang trail">Muốn chuyển sang chạy trail</option>
                    <option value="Chạy trail dưới 2 năm">Chạy trail dưới 2 năm</option>
                    <option value="Chạy trail trên 2 năm">Chạy trail trên 2 năm</option>
                  </select>
                </div>

                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.label}>
                    Mục quan tâm (Tối đa 2)
                    {interestError && <span className={styles.errorText}> - {interestError}</span>}
                  </label>
                  <div className={styles.checkboxGroup}>
                    {[
                      'Giày chạy trail', 'Balo/Vest nước', 'Kỹ thuật chạy'
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
              <div className={styles.termsText}>* Điều khoản áp dụng cho hàng mới về</div>
            </>
          ) : (
            <div className={styles.successContainer}>
              <h2 className={styles.successTitle}>Chúc mừng!</h2>
              <p className={styles.successSubtitle}>Mã giảm giá 10% của bạn đã sẵn sàng</p>
              
              <div className={styles.codeBox}>
                <span className={styles.code}>SUMMIT10OFF</span>
              </div>
              
              <button 
                onClick={copyToClipboard} 
                className={`${styles.copyBtn} ${isCopied ? styles.copied : ''}`}
              >
                {isCopied ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Đã copy mã
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    Copy mã ngay
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Image Section */}
        <div className={styles.imageSection}>
          <img 
            src="/images/promo_bg.png" 
            alt="Trail runner climbing mountain" 
            className={styles.promoImage}
          />
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;
