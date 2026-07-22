"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'cod'>('qr');
  const [orderCode, setOrderCode] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Generate random order code on mount
  useEffect(() => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setOrderCode(`SUMMIT${randomNum}`);
  }, []);

  const totalAmount = 3300000; // 3.300.000đ

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(type);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng!');
      return;
    }
    
    if (paymentMethod === 'cod') {
      // COD orders complete instantly
      setIsPaid(true);
    } else {
      alert('Vui lòng quét mã QR chuyển khoản và nhấn "Xác nhận đã chuyển khoản" để hoàn tất!');
    }
  };

  // Simulates Sepay Webhook confirming transaction success
  const simulateSepayPayment = () => {
    if (!name || !phone || !address) {
      alert('Vui lòng điền đầy đủ Thông tin nhận hàng (Họ tên, SĐT, Địa chỉ) trước khi thanh toán!');
      return;
    }
    setIsPaid(true);
  };

  if (isPaid) {
    return (
      <main className="container">
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Đặt hàng thành công!</h1>
          <p className={styles.successText}>
            {paymentMethod === 'qr' 
              ? 'Hệ thống Sepay đã tự động nhận được chuyển khoản của bạn. Đơn hàng đang được chuẩn bị đóng gói.' 
              : 'Đơn hàng của bạn đã được ghi nhận thành công dưới hình thức thanh toán COD.'}
          </p>

          <div className={styles.successInfoBox}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Mã đơn hàng:</span>
              <span className={styles.infoValue}>{orderCode}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Khách hàng:</span>
              <span className={styles.infoValue}>{name}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Số điện thoại:</span>
              <span className={styles.infoValue}>{phone}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Tổng thanh toán:</span>
              <span className={styles.infoValue}>3.300.000đ</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Phương thức:</span>
              <span className={styles.infoValue}>
                {paymentMethod === 'qr' ? 'Chuyển khoản VietQR (Sepay)' : 'Thanh toán COD'}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Trạng thái:</span>
              <span className={styles.infoValue} style={{ color: '#10b981' }}>ĐÃ XÁC NHẬN</span>
            </div>
          </div>

          <Link href="/" className={styles.homeBtn}>
            Tiếp tục mua sắm
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div className={styles.checkoutPage}>
        
        {/* Left Column: Form & Info */}
        <div className={styles.leftColumn}>
          <h1 className={styles.checkoutTitle}>Thanh toán đơn hàng</h1>
          
          <form onSubmit={handleCheckoutSubmit}>
            {/* Step 1: Shipping Address info */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>1. Thông tin giao hàng</h2>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Họ tên người nhận *</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="Ví dụ: Bùi Đức Hoàn"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Số điện thoại *</label>
                  <input 
                    type="tel" 
                    className={styles.input} 
                    placeholder="Ví dụ: 0904759624"
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.inputGroupFull}>
                  <label className={styles.label}>Địa chỉ Email</label>
                  <input 
                    type="email" 
                    className={styles.input} 
                    placeholder="tenban@gmail.com"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className={styles.inputGroupFull}>
                  <label className={styles.label}>Địa chỉ nhận hàng chi tiết *</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/TP"
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.inputGroupFull}>
                  <label className={styles.label}>Ghi chú đơn hàng (nếu có)</label>
                  <textarea 
                    className={styles.textarea} 
                    placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method choices */}
            <div className={styles.card} style={{ marginTop: '20px' }}>
              <h2 className={styles.cardTitle}>2. Phương thức thanh toán</h2>
              <div className={styles.methodList}>
                <div 
                  className={`${styles.methodItem} ${paymentMethod === 'qr' ? styles.methodItemActive : ''}`}
                  onClick={() => setPaymentMethod('qr')}
                >
                  <input 
                    type="radio" 
                    checked={paymentMethod === 'qr'} 
                    onChange={() => setPaymentMethod('qr')}
                  />
                  <div className={styles.methodInfo}>
                    <span className={styles.methodName}>Quét mã QR Ngân hàng (Khuyên dùng)</span>
                    <span className={styles.methodDesc}>Chuyển khoản tự động xác nhận ngay lập tức qua Sepay</span>
                  </div>
                </div>

                <div 
                  className={`${styles.methodItem} ${paymentMethod === 'cod' ? styles.methodItemActive : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <input 
                    type="radio" 
                    checked={paymentMethod === 'cod'} 
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div className={styles.methodInfo}>
                    <span className={styles.methodName}>Thanh toán khi nhận hàng (COD)</span>
                    <span className={styles.methodDesc}>Giao hàng thu tiền mặt tận nơi</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary & Pay box */}
        <div className={styles.rightColumn}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Đơn hàng của bạn</h2>
            
            <div className={styles.orderItems}>
              <div className={styles.orderItem}>
                <img 
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500" 
                  alt="Giày" 
                  className={styles.itemImg}
                />
                <div className={styles.itemMeta}>
                  <div className={styles.itemName}>Salomon Speedcross 6 Trail Shoes</div>
                  <div className={styles.itemSize}>Cỡ: US 9 | Đen</div>
                </div>
                <div className={styles.itemPrice}>3.250.000đ</div>
              </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.summaryRow}>
              <span>Tạm tính</span>
              <span>3.250.000đ</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Phí vận chuyển</span>
              <span>50.000đ</span>
            </div>
            
            <div className={styles.divider}></div>

            <div className={styles.totalRow}>
              <span>Tổng thanh toán</span>
              <span>3.300.000đ</span>
            </div>

            {/* If payment method is QR, display the VietQR Code and Sepay mockup */}
            {paymentMethod === 'qr' ? (
              <div className={styles.qrBox}>
                <div className={styles.qrImageContainer}>
                  {/* Real-time VietQR Generation API */}
                  <img 
                    src={`https://img.vietqr.io/image/mbbank-0904759624-compact.png?amount=${totalAmount}&addInfo=${orderCode}&accountName=BUI%20DUC%20HOAN`} 
                    alt="VietQR Chuyển khoản" 
                    className={styles.qrImage}
                  />
                </div>
                
                <div className={styles.transferDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Ngân hàng:</span>
                    <span className={styles.detailValue}>MB Bank (Ngân hàng Quân Đội)</span>
                  </div>

                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Số tài khoản:</span>
                    <div className={styles.detailValBox}>
                      <span className={styles.detailValue}>0904759624</span>
                      <button 
                        type="button" 
                        onClick={() => copyToClipboard('0904759624', 'acc')} 
                        className={styles.copyBtn}
                      >
                        {copySuccess === 'acc' ? 'Đã sao chép' : 'Sao chép'}
                      </button>
                    </div>
                  </div>

                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Số tiền:</span>
                    <div className={styles.detailValBox}>
                      <span className={styles.detailValue}>3.300.000đ</span>
                      <button 
                        type="button" 
                        onClick={() => copyToClipboard('3300000', 'amount')} 
                        className={styles.copyBtn}
                      >
                        {copySuccess === 'amount' ? 'Đã sao chép' : 'Sao chép'}
                      </button>
                    </div>
                  </div>

                  <div className={styles.detailRow} style={{ border: '2px dashed var(--color-primary)' }}>
                    <span className={styles.detailLabel}>Nội dung CK *:</span>
                    <div className={styles.detailValBox}>
                      <span className={styles.detailValue} style={{ color: 'var(--color-primary)' }}>
                        {orderCode}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => copyToClipboard(orderCode, 'memo')} 
                        className={styles.copyBtn}
                        style={{ background: 'var(--color-primary)', color: '#ffffff' }}
                      >
                        {copySuccess === 'memo' ? 'Đã sao chép' : 'Sao chép'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.statusIndicator}>
                  <span className={styles.pulseDot}></span>
                  <span>Đang chờ chuyển khoản qua Sepay...</span>
                </div>

                {/* Sepay Simulation Button */}
                <button 
                  type="button" 
                  onClick={simulateSepayPayment} 
                  className={styles.simPayBtn}
                >
                  Xác nhận đã chuyển khoản (Giả lập Sepay)
                </button>
              </div>
            ) : (
              <div style={{ marginTop: '20px' }}>
                <button 
                  type="button" 
                  onClick={handleCheckoutSubmit} 
                  className={styles.submitBtn}
                >
                  Xác nhận đặt hàng COD
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
