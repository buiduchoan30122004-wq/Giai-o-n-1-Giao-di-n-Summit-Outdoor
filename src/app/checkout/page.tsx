"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './checkout.module.css';

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

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(50000);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(3300000);
  const [mounted, setMounted] = useState(false);

  // Generate random order code and load checkout data on mount
  useEffect(() => {
    setMounted(true);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setOrderCode(`SUMMIT${randomNum}`);

    try {
      const cartDataStr = localStorage.getItem('summit_cart');
      if (cartDataStr) {
        const items = JSON.parse(cartDataStr);
        setCartItems(items);
        
        const checkoutDataStr = localStorage.getItem('summit_checkout');
        if (checkoutDataStr) {
          const checkData = JSON.parse(checkoutDataStr);
          setSubtotal(checkData.subtotal || 0);
          setShipping(checkData.shipping || 0);
          setDiscount(checkData.discount || 0);
          setTotal(checkData.total || 0);
        } else {
          // Dynamic calculation fallback
          const parsePrice = (priceStr: string) => {
            return parseInt(priceStr.replace(/\./g, '').replace('đ', '')) || 0;
          };
          const calculatedSubtotal = items.reduce((acc: number, item: any) => acc + parsePrice(item.price) * item.quantity, 0);
          setSubtotal(calculatedSubtotal);
          setShipping(50000);
          setDiscount(0);
          setTotal(calculatedSubtotal + 50000);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Poll payment status if payment method is QR and order code exists
  useEffect(() => {
    if (!mounted || paymentMethod !== 'qr' || !orderCode || isPaid) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/check-payment?orderCode=${orderCode}`);
        const data = await response.json();
        if (data.paid) {
          setIsPaid(true);
          localStorage.removeItem('summit_cart');
          window.dispatchEvent(new Event('cartUpdated'));
        }
      } catch (e) {
        console.error('Error polling payment status:', e);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [paymentMethod, orderCode, isPaid, mounted]);

  if (!mounted) {
    return (
      <main className="container">
        <div style={{ padding: '80px 0', textAlign: 'center', fontSize: '18px', color: '#666', fontWeight: 'bold' }}>
          Đang tải thông tin thanh toán...
        </div>
      </main>
    );
  }

  const formatPriceVND = (value: number) => {
    return value.toLocaleString('vi-VN') + 'đ';
  };

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
      setIsPaid(true);
      localStorage.removeItem('summit_cart');
      window.dispatchEvent(new Event('cartUpdated'));
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

    // Call the server API directly to trigger a simulated webhook payload
    fetch('/api/sepay-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Apikey summit_sepay_secret'
      },
      body: JSON.stringify({
        id: Math.floor(Math.random() * 1000000),
        gateway: 'MBBank',
        transactionDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        accountNumber: '0904759624',
        subAccount: '',
        code: `SIM_${Math.floor(Math.random() * 1000000)}`,
        content: `Thanh toan don hang ${orderCode}`,
        transferType: 'in',
        description: `${name} chuyen khoan qua MB`,
        transferAmount: total,
        accumulated: 10000000,
        referenceCode: `SIMREF_${Math.floor(Math.random() * 1000000)}`
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log('Webhook simulation sent successfully, waiting for polling to detect payment.');
      } else {
        alert('Có lỗi xảy ra khi gửi webhook giả lập: ' + data.message);
      }
    })
    .catch(err => {
      console.error(err);
      // Fallback
      setIsPaid(true);
      localStorage.removeItem('summit_cart');
      window.dispatchEvent(new Event('cartUpdated'));
    });
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
              <span className={styles.infoValue}>{formatPriceVND(total)}</span>
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
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className={styles.orderItem}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className={styles.itemImg}
                  />
                  <div className={styles.itemMeta}>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemSize}>Cỡ: {item.size} | Màu: {item.color} | SL: {item.quantity}</div>
                  </div>
                  <div className={styles.itemPrice}>{item.price}</div>
                </div>
              ))}
            </div>

            <div className={styles.divider}></div>

            <div className={styles.summaryRow}>
              <span>Tạm tính</span>
              <span>{formatPriceVND(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className={styles.summaryRow} style={{ color: '#16a34a', fontWeight: 'bold' }}>
                <span>Mã giảm giá</span>
                <span>-{formatPriceVND(discount)}</span>
              </div>
            )}

            <div className={styles.summaryRow}>
              <span>Phí vận chuyển</span>
              <span>{shipping === 0 ? 'Miễn phí' : formatPriceVND(shipping)}</span>
            </div>
            
            <div className={styles.divider}></div>

            <div className={styles.totalRow}>
              <span>Tổng thanh toán</span>
              <span>{formatPriceVND(total)}</span>
            </div>

            {/* If payment method is QR, display the VietQR Code and Sepay mockup */}
            {paymentMethod === 'qr' ? (
              <div className={styles.qrBox}>
                <div className={styles.qrImageContainer}>
                  {/* Real-time VietQR Generation API */}
                  <img 
                    src={`https://img.vietqr.io/image/mbbank-0904759624-compact.png?amount=${total}&addInfo=${orderCode}&accountName=BUI%20DUC%20HOAN`} 
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
                      <span className={styles.detailValue}>{formatPriceVND(total)}</span>
                      <button 
                        type="button" 
                        onClick={() => copyToClipboard(total.toString(), 'amount')} 
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
