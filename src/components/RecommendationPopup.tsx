"use client";

import React, { useState } from 'react';
import styles from './RecommendationPopup.module.css';

interface RecommendationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RecommendationData) => void;
}

export interface RecommendationData {
  product_type: string;
  experience: string;
  distance: string;
  terrain: string;
  priority: string;
  shoe_size: string;
  current_brand: string;
  budget: string;
  foot_issue: string[];
  name: string;
  phone: string;
  email: string;
}

const RecommendationPopup = ({ isOpen, onClose, onSubmit }: RecommendationPopupProps) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<RecommendationData>({
    product_type: '',
    experience: '',
    distance: '',
    terrain: '',
    priority: '',
    shoe_size: '',
    current_brand: '',
    budget: '',
    foot_issue: [],
    name: '',
    phone: '',
    email: '',
  });

  if (!isOpen) return null;

  const productTypes = [
    { id: 'Giày Trail Running', label: 'Giày Trail Running', icon: '👟' },
    { id: 'Giày Hiking', label: 'Giày Hiking', icon: '🥾' },
    { id: 'Vest nước', label: 'Vest nước', icon: '🎒' },
    { id: 'Gậy Trail', label: 'Gậy Trail', icon: '🦯' },
    { id: 'Quần áo', label: 'Quần áo', icon: '👕' },
    { id: 'Tất chạy', label: 'Tất chạy', icon: '🧦' },
    { id: 'Phụ kiện', label: 'Phụ kiện', icon: '🧢' },
  ];

  const handleProductSelect = (id: string) => {
    setFormData(prev => ({ ...prev, product_type: id }));
    setErrors(prev => ({ ...prev, product_type: '' }));
  };

  const handleRadioChange = (field: keyof RecommendationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleTextChange = (field: keyof RecommendationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => {
      const current = prev.foot_issue;
      if (current.includes(value)) {
        return { ...prev, foot_issue: current.filter(item => item !== value) };
      } else {
        // If "Không có" is selected, clear other issues.
        if (value === 'Không có') {
          return { ...prev, foot_issue: ['Không có'] };
        }
        // If other issue is selected, remove "Không có" if it exists.
        const filtered = current.filter(item => item !== 'Không có');
        return { ...prev, foot_issue: [...filtered, value] };
      }
    });
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.product_type) {
        newErrors.product_type = 'Vui lòng chọn loại sản phẩm bạn đang tìm kiếm!';
      }
    } else if (currentStep === 2) {
      if (!formData.experience) newErrors.experience = 'Vui lòng chọn kinh nghiệm chạy!';
      if (!formData.distance) newErrors.distance = 'Vui lòng chọn cự ly thường chạy!';
      if (!formData.terrain) newErrors.terrain = 'Vui lòng chọn địa hình chạy!';
      if (!formData.priority) newErrors.priority = 'Vui lòng chọn tiêu chí quan tâm nhất!';
      if (!formData.current_brand) newErrors.current_brand = 'Vui lòng chọn thương hiệu đang dùng!';
      if (!formData.budget) newErrors.budget = 'Vui lòng chọn mức ngân sách!';
    } else if (currentStep === 3) {
      if (!formData.name || !formData.name.trim()) {
        newErrors.name = 'Vui lòng nhập họ và tên!';
      }
      if (!formData.phone || !formData.phone.trim()) {
        newErrors.phone = 'Vui lòng nhập số điện thoại!';
      } else if (!/^[0-9]{9,11}$/.test(formData.phone.trim().replace(/[\s.-]/g, ''))) {
        newErrors.phone = 'Số điện thoại không hợp lệ (yêu cầu từ 9 đến 11 chữ số)!';
      }
      if (!formData.email || !formData.email.trim()) {
        newErrors.email = 'Vui lòng nhập email!';
      } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
        newErrors.email = 'Địa chỉ email không hợp lệ!';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(step)) {
      onSubmit(formData);
      // Reset form and step upon successful submission
      setStep(1);
      setFormData({
        product_type: '',
        experience: '',
        distance: '',
        terrain: '',
        priority: '',
        shoe_size: '',
        current_brand: '',
        budget: '',
        foot_issue: [],
        name: '',
        phone: '',
        email: '',
      });
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContainer}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <span className={styles.iconArea}>💡</span>
            <div>
              <h3 className={styles.title}>Tư vấn chọn sản phẩm</h3>
              <p className={styles.subtitle}>Điền nhanh thông tin khảo sát để chuyên gia hỗ trợ bạn tốt nhất</p>
            </div>
          </div>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Đóng popup">
            &times;
          </button>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressWrapper}>
          <div className={styles.progressHeader}>
            <span className={styles.progressText}>Bước {step}/3</span>
            <span className={styles.progressPercent}>{Math.round((step / 3) * 100)}% Hoàn thành</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className={styles.formBody}>
          
          {/* STEP 1: Product Selection */}
          {step === 1 && (
            <div className={styles.stepContent}>
              <h4 className={styles.questionTitle}>Bạn đang tìm sản phẩm gì? <span className={styles.required}>*</span></h4>
              <div className={styles.cardGrid}>
                {productTypes.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleProductSelect(item.id)}
                    className={`${styles.productCard} ${formData.product_type === item.id ? styles.cardActive : ''}`}
                  >
                    <span className={styles.cardIcon}>{item.icon}</span>
                    <span className={styles.cardLabel}>{item.label}</span>
                  </button>
                ))}
              </div>
              {errors.product_type && <p className={styles.errorText}>{errors.product_type}</p>}
            </div>
          )}

          {/* STEP 2: Running Profile */}
          {step === 2 && (
            <div className={`${styles.stepContent} ${styles.scrollableContent}`}>
              <h4 className={styles.stepTitle}>Thông tin sử dụng</h4>

              {/* 1. Experience */}
              <div className={styles.questionBlock}>
                <label className={styles.fieldLabel}>1. Bạn đã từng chạy trail chưa? <span className={styles.required}>*</span></label>
                <div className={styles.optionsGrid}>
                  {['Chưa từng', 'Mới bắt đầu', 'Dưới 1 năm', 'Trên 1 năm'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleRadioChange('experience', opt)}
                      className={`${styles.optionBtn} ${formData.experience === opt ? styles.optionActive : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {errors.experience && <p className={styles.errorText}>{errors.experience}</p>}
              </div>

              {/* 2. Distance */}
              <div className={styles.questionBlock}>
                <label className={styles.fieldLabel}>2. Bạn thường chạy cự ly nào? <span className={styles.required}>*</span></label>
                <div className={styles.optionsGrid}>
                  {['Dưới 10 km', '10–21 km', '21–42 km', '42–70 km', 'Trên 70 km', 'Chưa xác định'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleRadioChange('distance', opt)}
                      className={`${styles.optionBtn} ${formData.distance === opt ? styles.optionActive : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {errors.distance && <p className={styles.errorText}>{errors.distance}</p>}
              </div>

              {/* 3. Terrain */}
              <div className={styles.questionBlock}>
                <label className={styles.fieldLabel}>3. Địa hình thường chạy? <span className={styles.required}>*</span></label>
                <div className={styles.optionsGrid}>
                  {['Đường đất', 'Rừng', 'Núi đá', 'Bùn', 'Hỗn hợp'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleRadioChange('terrain', opt)}
                      className={`${styles.optionBtn} ${formData.terrain === opt ? styles.optionActive : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {errors.terrain && <p className={styles.errorText}>{errors.terrain}</p>}
              </div>

              {/* 4. Priority */}
              <div className={styles.questionBlock}>
                <label className={styles.fieldLabel}>4. Điều bạn quan tâm nhất? <span className={styles.required}>*</span></label>
                <div className={styles.optionsGrid}>
                  {['Êm', 'Nhẹ', 'Bám tốt', 'Ổn định', 'Tốc độ', 'Độ bền'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleRadioChange('priority', opt)}
                      className={`${styles.optionBtn} ${formData.priority === opt ? styles.optionActive : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {errors.priority && <p className={styles.errorText}>{errors.priority}</p>}
              </div>

              {/* 5. Shoe Size */}
              <div className={styles.questionBlock}>
                <label className={styles.fieldLabel} htmlFor="shoe_size_input">5. Size giày hiện tại</label>
                <input
                  id="shoe_size_input"
                  type="text"
                  placeholder="Ví dụ: EU42, US9, Nike Pegasus EU42..."
                  value={formData.shoe_size}
                  onChange={e => handleTextChange('shoe_size', e.target.value)}
                  className={styles.textInput}
                />
              </div>

              {/* 6. Current Brand */}
              <div className={styles.questionBlock}>
                <label className={styles.fieldLabel}>6. Thương hiệu đang sử dụng <span className={styles.required}>*</span></label>
                <div className={styles.optionsGrid}>
                  {['Salomon', 'HOKA', 'Altra', 'Brooks', 'Saucony', 'ASICS', 'adidas Terrex', 'Merrell', 'Khác', 'Chưa từng sử dụng'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleRadioChange('current_brand', opt)}
                      className={`${styles.optionBtn} ${formData.current_brand === opt ? styles.optionActive : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {errors.current_brand && <p className={styles.errorText}>{errors.current_brand}</p>}
              </div>

              {/* 7. Budget */}
              <div className={styles.questionBlock}>
                <label className={styles.fieldLabel}>7. Ngân sách <span className={styles.required}>*</span></label>
                <div className={styles.optionsGrid}>
                  {['Dưới 2 triệu', '2–4 triệu', '4–6 triệu', 'Trên 6 triệu'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleRadioChange('budget', opt)}
                      className={`${styles.optionBtn} ${formData.budget === opt ? styles.optionActive : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {errors.budget && <p className={styles.errorText}>{errors.budget}</p>}
              </div>

              {/* 8. Foot issues */}
              <div className={styles.questionBlock}>
                <label className={styles.fieldLabel}>8. Bạn có gặp vấn đề nào không? (Chọn nhiều)</label>
                <div className={styles.optionsGrid}>
                  {['Bàn chân bè', 'Bàn chân hẹp', 'Đau gót chân', 'Đau đầu gối', 'Không có'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleCheckboxChange(opt)}
                      className={`${styles.optionBtn} ${formData.foot_issue.includes(opt) ? styles.optionActive : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: Contact Info */}
          {step === 3 && (
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>Thông tin liên hệ</h4>
              <p className={styles.stepDescription}>Vui lòng điền thông tin để chuyên gia của chúng tôi gửi tài liệu hoặc liên hệ khi cần thiết</p>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="fullName_input">Họ và tên <span className={styles.required}>*</span></label>
                <input
                  id="fullName_input"
                  type="text"
                  placeholder="Nhập họ và tên của bạn"
                  value={formData.name}
                  onChange={e => handleTextChange('name', e.target.value)}
                  className={styles.textInput}
                />
                {errors.name && <p className={styles.errorText}>{errors.name}</p>}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="phone_input">Số điện thoại <span className={styles.required}>*</span></label>
                <input
                  id="phone_input"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={e => handleTextChange('phone', e.target.value)}
                  className={styles.textInput}
                />
                {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="email_input">Email <span className={styles.required}>*</span></label>
                <input
                  id="email_input"
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  value={formData.email}
                  onChange={e => handleTextChange('email', e.target.value)}
                  className={styles.textInput}
                />
                {errors.email && <p className={styles.errorText}>{errors.email}</p>}
              </div>
            </div>
          )}

          {/* Footer Navigation Buttons */}
          <div className={styles.footer}>
            {step > 1 ? (
              <button 
                type="button" 
                onClick={handlePrev} 
                className={styles.prevBtn}
              >
                Quay lại
              </button>
            ) : (
              <div /> // placeholder for spacing
            )}

            {step < 3 ? (
              <button 
                type="button" 
                onClick={handleNext} 
                className={styles.nextBtn}
              >
                Tiếp tục
              </button>
            ) : (
              <button 
                type="submit" 
                className={styles.submitBtn}
              >
                Nhận tư vấn
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default RecommendationPopup;
