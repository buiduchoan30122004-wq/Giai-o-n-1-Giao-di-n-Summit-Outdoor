"use client";

import { usePathname } from 'next/navigation';
import styles from './components.module.css';

export default function Footer() {
  const pathname = usePathname();

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div>
          <div className={styles.footerBrand}>
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.footerLogoIcon}>
              <polygon points="13,6 3,24 23,24" fill="var(--color-primary)" />
              <polygon points="21,11 13,24 29,24" fill="var(--color-white)" />
              <polygon points="13,24 16,19 18,24" fill="var(--color-black)" />
            </svg>
            SUMMIT<span>OUTDOOR</span>
          </div>
          <p className={styles.footerDesc}>
            Hệ thống cửa hàng phân phối đồ chạy bộ địa hình và dã ngoại cao cấp, tập trung vào sản phẩm chính hãng, tư vấn chuyên sâu và xây dựng cộng đồng đam mê thể thao.
          </p>
        </div>
        <div>
          <h3 className={styles.footerColTitle}>Mua Sắm</h3>
          <ul className={styles.footerList}>
            <li>Đồ Cho Nam</li>
            <li>Đồ Cho Nữ</li>
            <li>Giày Chạy Địa Hình</li>
            <li>Giày Leo Núi</li>
            <li>Phụ Kiện Thể Thao</li>
          </ul>
        </div>
        <div>
          <h3 className={styles.footerColTitle}>Hỗ Trợ</h3>
          <ul className={styles.footerList}>
            <li>Tra Cứu Đơn Hàng</li>
            <li>Chính Sách Đổi Trả</li>
            <li>Chính Sách Bảo Hành</li>
            <li>Liên Hệ</li>
            <li>Câu Hỏi Thường Gặp</li>
          </ul>
        </div>
        <div>
          <h3 className={styles.footerColTitle}>Khám Phá</h3>
          <ul className={styles.footerList}>
            <li>Về Summit Outdoor</li>
            <li>Sự Kiện Cộng Đồng</li>
            <li>Blog & Câu Chuyện</li>
            <li>Tuyển Dụng</li>
          </ul>
        </div>
      </div>
      <div className={styles.copyright}>
        <div className="container">
          &copy; {new Date().getFullYear()} Summit Outdoor. Đã đăng ký bản quyền.
        </div>
      </div>
    </footer>
  );
}
