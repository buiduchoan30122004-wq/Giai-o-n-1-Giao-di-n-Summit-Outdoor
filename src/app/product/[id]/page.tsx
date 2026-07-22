"use client";

import React, { useState } from 'react';
import styles from './product.module.css';
import Link from 'next/link';

// Unified products database matching homepage and shop page
const productsDatabase: Record<string, {
  id: string;
  brand: string;
  name: string;
  price: string;
  image: string;
  thumbnails: string[];
  status: string;
  subtitle: string;
  description: string;
  features: string[];
  specs: {
    cushioning: string;
    support: string;
    drop: string;
    weight: string;
    terrain: string;
  }
}> = {
  'xt6': {
    id: 'xt6',
    brand: 'Salomon',
    name: 'XT-6 GORE-TEX',
    price: '4.800.000đ',
    image: '/products/salomon_xt6_black.jpg',
    thumbnails: [
      '/products/salomon_xt6_black.jpg',
      '/products/salomon_xt_whisper.jpg',
      '/products/salomon_slab_ultraglide.jpg',
      '/products/salomon_xt4_yellow.jpg'
    ],
    status: 'New',
    subtitle: 'Sneakers - Unisex',
    description: 'The Salomon XT-6 GORE-TEX is the legendary silhouette preferred by world-class athletes. It features a modernized Gore-Tex membrane for water protection, an ultra-durable TPU upper, Agile Chassis system for stability, and mud Contagrip lugs for deep traction on rugged terrain.',
    features: [
      'Màng chống thấm nước GORE-TEX cao cấp',
      'Hệ thống dây giày rút Quicklace đóng mở siêu nhanh',
      'Khung đế Agile Chassis System (ACS) tăng cường độ vững chãi',
      'Đế ngoài bùn Contagrip với gai bám sâu bám chắc địa hình trơn trượt'
    ],
    specs: { cushioning: 'Độ nảy cao', support: 'Cân bằng', drop: '10mm', weight: '365g', terrain: 'Địa hình hỗn hợp' }
  },
  'xtwhisper': {
    id: 'xtwhisper',
    brand: 'Salomon',
    name: 'XT-WHISPER',
    price: '3.500.000đ',
    image: '/products/salomon_xt_whisper.jpg',
    thumbnails: [
      '/products/salomon_xt_whisper.jpg',
      '/products/salomon_xt6_black.jpg',
      '/products/salomon_xt4_yellow.jpg',
      '/products/salomon_slab_ultraglide.jpg'
    ],
    status: 'New',
    subtitle: 'Sneakers - Unisex',
    description: 'A sleek, versatile lifestyle-meets-trail shoe. The XT-WHISPER offers cushioned comfort and breathable mesh construction, perfect for light trails, city exploration, and everyday wear with unmatched outdoor style.',
    features: [
      'Thân giày lưới dệt Engineered Mesh thông thoáng tối đa',
      'Đệm gót EVA êm ái giảm phản lực bảo vệ khớp chân',
      'Phần mũi bọc nhựa bảo vệ ngón chân chống va đập đá sỏi',
      'Gai đế đa hướng tối ưu cho cả chạy trail nhẹ lẫn đi dạo phố'
    ],
    specs: { cushioning: 'Êm ái cân bằng', support: 'Hỗ trợ vòm', drop: '8mm', weight: '290g', terrain: 'Địa hình bằng phẳng & Nhẹ' }
  },
  'slab': {
    id: 'slab',
    brand: 'Salomon',
    name: 'S/LAB ULTRA GLIDE 2 LIMITED',
    price: '6.500.000đ',
    image: '/products/salomon_slab_ultraglide.jpg',
    thumbnails: [
      '/products/salomon_slab_ultraglide.jpg',
      '/products/salomon_xt6_black.jpg',
      '/products/salomon_xt4_yellow.jpg',
      '/products/salomon_xt_whisper.jpg'
    ],
    status: 'Limited',
    subtitle: 'Trail running shoes - Unisex',
    description: 'A ultra-distance champion shoe developed in collaboration with Courtney Dauwalter. Features dynamic Energy Foam midsole cushioning, maximum stack height for long run comfort, and breathable engineered mesh upper with protective toe cap.',
    features: [
      'Đế giữa Energy Foam siêu nhẹ và hoàn trả lực cực đỉnh',
      'Phối màu Courtney Dauwalter phiên bản giới hạn toàn cầu',
      'Đế cong Rocker thúc đẩy guồng chân cuộn đều tự nhiên',
      'Đế ngoài Contagrip MA chống mài mòn vượt trội trên cự ly Ultra'
    ],
    specs: { cushioning: 'Đệm cực dày (Max)', support: 'Trung tính', drop: '6mm', weight: '260g', terrain: 'Chạy siêu cự ly (Ultra)' }
  },
  'xt4': {
    id: 'xt4',
    brand: 'Salomon',
    name: 'XT-4 OG',
    price: '4.800.000đ',
    image: '/products/salomon_xt4_yellow.jpg',
    thumbnails: [
      '/products/salomon_xt4_yellow.jpg',
      '/products/salomon_xt6_black.jpg',
      '/products/salomon_xt_whisper.jpg',
      '/products/salomon_slab_ultraglide.jpg'
    ],
    status: 'New',
    subtitle: 'Sneakers - Unisex',
    description: 'The faithful reissue of the original trail runner icon. The XT-4 OG boasts the signature bold contrast color blocking, quicklace system, full-length Agile Chassis for maximum control, and aggressive lug traction for mud and gravel.',
    features: [
      'Thiết kế phối màu khối OG nguyên bản tương phản ấn tượng',
      'Lưới upper chống cát sỏi lọt vào bên trong giày',
      'Bộ khung Agile Chassis System toàn bàn chân kiểm soát thăng bằng',
      'Gai đế cao su Contagrip sắc sảo chuyên trị đường sình lầy'
    ],
    specs: { cushioning: 'Cứng ổn định', support: 'Chống lệch trong', drop: '9.5mm', weight: '370g', terrain: 'Địa hình kỹ thuật bùn đá' }
  },
  'speedcross': {
    id: 'speedcross',
    brand: 'Salomon',
    name: 'Speedcross 6',
    price: '3.250.000đ',
    image: '/products/salomon_xt6_black.jpg',
    thumbnails: [
      '/products/salomon_xt6_black.jpg',
      '/products/salomon_xt_whisper.jpg',
      '/products/salomon_slab_ultraglide.jpg',
      '/products/salomon_xt4_yellow.jpg'
    ],
    status: 'New',
    subtitle: 'Trail running shoes - Unisex',
    description: 'The Salomon Speedcross 6 needs no introduction. True to its legendary roots and trail status, this version is lighter with an even more powerful, grippy connection to the ground and faster mud evacuation.',
    features: [
      'Gai đế hình mũi tên xương cá bám bùn đất tuyệt đối',
      'Công nghệ ôm chân Sensifit bao bọc bàn chân như một cái ôm',
      'Đế giữa đàn hồi cao EnergyCell+ giúp đẩy chân linh hoạt',
      'Vải ripstop kháng rách và ngăn mảnh vụn cọ xát'
    ],
    specs: { cushioning: 'Trung bình', support: 'Trung tính', drop: '10mm', weight: '298g', terrain: 'Đường bùn & Trơn trượt' }
  },
  'speedgoat': {
    id: 'speedgoat',
    brand: 'Hoka',
    name: 'Speedgoat 5',
    price: '3.850.000đ',
    image: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?q=80&w=500',
    thumbnails: [
      'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?q=80&w=500',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500'
    ],
    status: 'New',
    subtitle: 'Trail running shoes - Unisex',
    description: 'A workhorse designed for technical trails, the Hoka Speedgoat 5 returns with less weight and more traction than ever before. This trail beast features Vibram® Megagrip with Traction Lug for upgraded grip.',
    features: [
      'Đế ngoài Vibram Megagrip cải tiến thêm gai Traction Lug siêu bám',
      'Vành Meta-Rocker đẩy chân lăn tròn giảm mỏi cổ chân',
      'Đế xốp nén CMEVA siêu nhẹ siêu êm hấp thụ chấn động',
      'Thân giày lưới dệt kép co giãn ôm chân thoải mái'
    ],
    specs: { cushioning: 'Đệm cực dày (Max)', support: 'Trung tính', drop: '4mm', weight: '291g', terrain: 'Địa hình đá gồ ghề kỹ thuật' }
  },
  'pegasus': {
    id: 'pegasus',
    brand: 'Nike',
    name: 'Pegasus Trail 4',
    price: '3.990.000đ',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500',
    thumbnails: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=500',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500'
    ],
    status: '',
    subtitle: 'Trail running shoes - Unisex',
    description: 'The Nike Pegasus Trail 4 is your daily running companion for the transition from road to trail. Providing responsive React foam cushioning and flywire lock stability, it keeps you moving through dirt paths.',
    features: [
      'Đế giữa đệm Nike React bền bỉ và đàn hồi nhạy bén',
      'Dây đai giữa chân Flywire khóa giữ bàn chân ổn định chống trượt',
      'Lưới dệt mỏng bền gia cố tại các vùng chịu lực',
      'Mặt gai cao su chuyển tiếp linh hoạt từ đường nhựa sang đường đất'
    ],
    specs: { cushioning: 'Độ phản hồi cao', support: 'Trung tính', drop: '9.5mm', weight: '289g', terrain: 'Đường phố lai địa hình nhẹ' }
  },
  'trabuco': {
    id: 'trabuco',
    brand: 'Asics',
    name: 'Trabuco Max 2',
    price: '3.490.000đ',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500',
    thumbnails: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500',
      'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?q=80&w=500'
    ],
    status: 'New',
    subtitle: 'Trail running shoes - Unisex',
    description: 'The Asics Trabuco Max 2 shoe draws inspiration from the concept of technology and how it can be synced with nature. It provides advanced energy-saving properties and plush cushioning to help you navigate trails.',
    features: [
      'Đệm FF BLAST PLUS nén nhẹ cho bước chạy nảy và êm ái sâu',
      'Cấu trúc đế cong GUIDESOLE tiết kiệm sức bền cho bàn chân',
      'Đế ngoài cao su ASICSGRIP bền bỉ độ bám cao trên bùn ẩm',
      'Thân dệt sợi jacquard lưới cao cấp thoáng khí thân thiện môi trường'
    ],
    specs: { cushioning: 'Đệm cực dày (Max)', support: 'Trung tính', drop: '5mm', weight: '305g', terrain: 'Mọi địa hình núi đồi' }
  },
  'senseride': {
    id: 'senseride',
    brand: 'Salomon',
    name: 'Sense Ride 5',
    price: '3.490.000đ',
    image: '/products/salomon_slab_ultraglide.jpg',
    thumbnails: [
      '/products/salomon_slab_ultraglide.jpg',
      '/products/salomon_xt6_black.jpg',
      '/products/salomon_xt_whisper.jpg',
      '/products/salomon_xt4_yellow.jpg'
    ],
    status: '',
    subtitle: 'Trail running shoes - Unisex',
    description: 'A versatile trail shoe that does it all, the Sense Ride 5 is equally in its element on short, fast trail runs as it is on ultra distances. A super comfortable overachiever.',
    features: [
      'Đệm đế giữa Energy Foam cân bằng hoàn hảo giữa êm và nảy',
      'Đế ngoài Contagrip đa địa hình bám dính chắc chắn trên cát, cỏ, bùn',
      'Chất liệu lưới mỏng co giãn đa chiều siêu nhẹ',
      'Cấu trúc gót ôm khít chống sụt gót chân khi đổ dốc nhanh'
    ],
    specs: { cushioning: 'Cân bằng', support: 'Trung tính', drop: '8mm', weight: '286g', terrain: 'Hỗn hợp cát sỏi, cỏ bám' }
  },
  'wildhorse': {
    id: 'wildhorse',
    brand: 'Nike',
    name: 'Wildhorse 8',
    price: '3.250.000đ',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=500',
    thumbnails: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=500',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500',
      'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?q=80&w=500'
    ],
    status: 'New',
    subtitle: 'Trail running shoes - Unisex',
    description: 'Tame the wild trail runs with the Nike Wildhorse 8. Constructed with a high-abrasion rubber outsole that delivers durable multi-directional traction, React foam midsole cushioning, and a structured midfoot saddle.',
    features: [
      'Đệm phản hồi Nike React đàn hồi tối ưu bảo vệ gót chân',
      'Đế gai cao su chống mài mòn đúc khối đa hướng bám vách đá',
      'Thân giày lưới dệt gia cố viền nhựa chống rách',
      'Cổ giày thun đệm êm hạn chế bụi cát chui vào giày'
    ],
    specs: { cushioning: 'Trung bình', support: 'Vững chãi gót', drop: '8mm', weight: '300g', terrain: 'Địa hình hoang dã dốc đá' }
  }
};

const defaultProduct = {
  id: 'xt6',
  brand: 'Salomon',
  name: 'XT-6 GORE-TEX',
  price: '4.800.000đ',
  image: '/products/salomon_xt6_black.jpg',
  thumbnails: [
    '/products/salomon_xt6_black.jpg',
    '/products/salomon_xt_whisper.jpg',
    '/products/salomon_slab_ultraglide.jpg',
    '/products/salomon_xt4_yellow.jpg'
  ],
  status: 'New',
  subtitle: 'Sneakers - Unisex',
  description: 'The Salomon XT-6 GORE-TEX is the legendary silhouette preferred by world-class athletes. It features a modernized Gore-Tex membrane for water protection, an ultra-durable TPU upper, Agile Chassis system for stability, and mud Contagrip lugs for deep traction on rugged terrain.',
  features: [
    'Màng chống thấm nước GORE-TEX cao cấp',
    'Hệ thống dây giày rút Quicklace đóng mở siêu nhanh',
    'Khung đế Agile Chassis System (ACS) tăng cường độ vững chãi',
    'Đế ngoài bùn Contagrip với gai bám sâu bám chắc địa hình trơn trượt'
  ],
  specs: { cushioning: 'Độ nảy cao', support: 'Cân bằng', drop: '10mm', weight: '365g', terrain: 'Địa hình hỗn hợp' }
};

export default function ProductDetail({ params }: { params: { id: string } }) {
  const productId = params.id ? params.id.toLowerCase() : 'xt6';
  const product = productsDatabase[productId] || defaultProduct;

  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'features'>('overview');

  const sizes = ['US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 12'];

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

            {/* Large Active Main Image */}
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

          <div className={styles.priceArea}>
            <span className={styles.currentPrice}>{product.price}</span>
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

          {/* Add to Cart CTA Actions */}
          <div className={styles.actionButtons}>
            <Link href="/cart" style={{ display: 'block', width: '100%' }}>
              <button 
                className={styles.cartBtn}
                disabled={!selectedSize}
                title={selectedSize ? "Thêm sản phẩm vào giỏ hàng" : "Vui lòng chọn size trước"}
              >
                {selectedSize ? `Thêm vào giỏ hàng (Size ${selectedSize})` : 'Chọn kích cỡ để đặt hàng'}
              </button>
            </Link>
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
