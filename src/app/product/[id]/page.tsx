"use client";

import React, { useState, useEffect } from 'react';
import styles from './product.module.css';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Unified products database matching homepage and shop page
const productsDatabase: Record<string, {
  id: string;
  brand: string;
  name: string;
  price: string;
  image: string;
  thumbnails: string[];
  status?: string;
  subtitle?: string;
  description: string;
  features: string[];
  availableColors: string[];
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
    description: 'Salomon XT-6 GORE-TEX là dòng giày chạy trail huyền thoại được các vận động viên cự ly siêu dài tin dùng hàng đầu. Giày được trang bị màng chống nước GORE-TEX hiện đại, thân trên bằng nhựa TPU siêu bền bỉ chống rách, bộ khung Agile Chassis System (ACS) tối ưu hóa độ thăng bằng, cùng bộ gai đế Contagrip bám cực chắc trên địa hình sình lầy và đá dốc.',
    features: [
      'Màng chống thấm nước GORE-TEX cao cấp',
      'Hệ thống dây giày rút Quicklace đóng mở siêu nhanh',
      'Khung đế Agile Chassis System (ACS) tăng cường độ vững chãi',
      'Đế ngoài bùn Contagrip với gai bám sâu bám chắc địa hình trơn trượt'
    ],
    availableColors: ['Đen', 'Xám', 'Xanh dương'],
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
    description: 'Đôi giày giao thoa hoàn hảo giữa thời trang đường phố và chạy trail nhẹ nhàng. Salomon XT-WHISPER mang lại cảm giác êm ái tối đa cùng thân lưới siêu thoáng khí, rất thích hợp cho những buổi chạy trail cự ly ngắn, khám phá đô thị hay sử dụng hàng ngày với phong cách outdoor thời thượng.',
    features: [
      'Thân giày lưới dệt Engineered Mesh thông thoáng tối đa',
      'Đệm gót EVA êm ái giảm phản lực bảo vệ khớp chân',
      'Phần mũi bọc nhựa bảo vệ ngón chân chống va đập đá sỏi',
      'Gai đế đa hướng tối ưu cho cả chạy trail nhẹ lẫn đi dạo phố'
    ],
    availableColors: ['Xám', 'Trắng'],
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
    description: 'Nhà vô địch cự ly siêu dài (Ultra Trail) được phát triển cùng huyền thoại chạy trail Courtney Dauwalter. Giày sở hữu lớp đệm Energy Foam đàn hồi vượt trội giúp bảo vệ khớp, độ dày đế tối đa mang lại sự êm ái tuyệt hảo cho cự ly dài, kết hợp cùng thân giày dệt lưới thoáng mát và bọc mũi bảo vệ an toàn.',
    features: [
      'Đế giữa Energy Foam siêu nhẹ và hoàn trả lực cực đỉnh',
      'Phối màu Courtney Dauwalter phiên bản giới hạn toàn cầu',
      'Đế cong Rocker thúc đẩy guồng chân cuộn đều tự nhiên',
      'Đế ngoài Contagrip MA chống mài mòn vượt trội trên cự ly Ultra'
    ],
    availableColors: ['Xanh dương', 'Hồng'],
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
    description: 'Phiên bản tái bản trung thực của dòng giày chạy trail biểu tượng đời đầu. Salomon XT-4 OG nổi bật với thiết kế phối màu khối tương phản đậm chất thể thao mạnh mẽ, hệ thống dây rút nhanh Quicklace tiện lợi, khung xương Agile Chassis System toàn bàn chân tăng khả năng vững chãi kiểm soát thăng bằng và bộ gai Contagrip chuyên trị bùn sỏi đá.',
    features: [
      'Thiết kế phối màu khối OG nguyên bản tương phản ấn tượng',
      'Lưới upper chống cát sỏi lọt vào bên trong giày',
      'Bộ khung Agile Chassis System toàn bàn chân kiểm soát thăng bằng',
      'Gai đế cao su Contagrip sắc sảo chuyên trị đường sình lầy'
    ],
    availableColors: ['Vàng', 'Đen'],
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
    description: 'Salomon Speedcross 6 là dòng giày chạy địa hình chuyên nghiệp không cần giới thiệu nhiều. Giữ nguyên những giá trị huyền thoại và địa vị chạy trail của mình, phiên bản này có trọng lượng nhẹ hơn, lực bám tiếp đất mạnh mẽ hơn cùng khả năng thoát bùn sình cực nhanh.',
    features: [
      'Gai đế hình mũi tên xương cá bám bùn đất tuyệt đối',
      'Công nghệ ôm chân Sensifit bao bọc bàn chân như một cái ôm',
      'Đế giữa đàn hồi cao EnergyCell+ giúp đẩy chân linh hoạt',
      'Vải ripstop kháng rách và ngăn mảnh vụn cọ xát'
    ],
    availableColors: ['Đen', 'Xám'],
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
    description: 'Được mệnh danh là gã lực sĩ chuyên trị các cung đường trail kỹ thuật khó khăn. Hoka Speedgoat 5 trở lại với trọng lượng nhẹ hơn và độ bám vượt trội nhờ đế ngoài cao su Vibram® Megagrip tích hợp công nghệ gai kéo Traction Lug tăng ma sát tối ưu trên bùn đất đá gồ ghề.',
    features: [
      'Đế ngoài Vibram Megagrip cải tiến thêm gai Traction Lug siêu bám',
      'Vành Meta-Rocker đẩy chân lăn tròn giảm mỏi cổ chân',
      'Đế xốp nén CMEVA siêu nhẹ siêu êm hấp thụ chấn động',
      'Thân giày lưới dệt kép co giãn ôm chân thoải mái'
    ],
    availableColors: ['Xanh lá', 'Xanh dương'],
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
    description: 'Nike Pegasus Trail 4 là người bạn đồng hành chạy bộ hàng ngày giúp chuyển tiếp mượt mà từ đường nhựa đô thị sang đường đất đỏ. Giày mang lại độ êm ái đàn hồi nhạy bén của đệm foam React cùng sự vững chãi của công nghệ cáp treo Flywire khóa chặt bàn chân.',
    features: [
      'Đế giữa đệm Nike React bền bỉ và đàn hồi nhạy bén',
      'Dây đai giữa chân Flywire khóa giữ bàn chân ổn định chống trượt',
      'Lưới dệt mỏng bền gia cố tại các vùng chịu lực',
      'Mặt gai cao su chuyển tiếp linh hoạt từ đường nhựa sang đường đất'
    ],
    availableColors: ['Đỏ', 'Xanh dương'],
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
    description: 'Asics Trabuco Max 2 mang cảm hứng giao hòa giữa công nghệ hiện đại và thiên nhiên hoang dã. Giày được trang bị lớp đệm dày FF BLAST PLUS siêu êm ái cùng công nghệ đế cong Guidesole giúp tiết kiệm tối đa sức lực cho chân khi vượt dốc cao cự ly dài.',
    features: [
      'Đệm FF BLAST PLUS nén nhẹ cho bước chạy nảy và êm ái sâu',
      'Cấu trúc đế cong GUIDESOLE tiết kiệm sức bền cho bàn chân',
      'Đế ngoài cao su ASICSGRIP bền bỉ độ bám cao trên bùn ẩm',
      'Thân dệt sợi jacquard lưới cao cấp thoáng khí thân thiện môi trường'
    ],
    availableColors: ['Xám', 'Đỏ'],
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
    description: 'Dòng giày chạy trail đa năng quốc dân cân mọi cự ly. Salomon Sense Ride 5 thể hiện sự cơ động tuyệt vời ở cả những buổi chạy trail ngắn tốc độ cao lẫn các giải chạy siêu cự ly đầy thử thách với sự êm ái, bảo vệ và đàn hồi tối đa.',
    features: [
      'Đệm đế giữa Energy Foam cân bằng hoàn hảo giữa êm và nảy',
      'Đế ngoài Contagrip đa địa hình bám dính chắc chắn trên cát, cỏ, bùn',
      'Chất liệu lưới mỏng co giãn đa chiều siêu nhẹ',
      'Cấu trúc gót ôm khít chống sụt gót chân khi đổ dốc nhanh'
    ],
    availableColors: ['Xanh dương', 'Hồng'],
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
    description: 'Chinh phục những cung đường mòn hoang dã đầy thách thức cùng Nike Wildhorse 8. Giày có đế ngoài cao su chống mài mòn cực tốt mang lại lực kéo đa hướng bền bỉ, kết hợp đệm React đàn hồi cao và bộ khung gót ôm khít vững chãi.',
    features: [
      'Đệm phản hồi Nike React đàn hồi tối ưu bảo vệ gót chân',
      'Đế gai cao su chống mài mòn đúc khối đa hướng bám vách đá',
      'Thân giày lưới dệt gia cố viền nhựa chống rách',
      'Cổ giày thun đệm êm hạn chế bụi cát chui vào giày'
    ],
    availableColors: ['Đen', 'Cam'],
    specs: { cushioning: 'Trung bình', support: 'Vững chãi gót', drop: '8mm', weight: '300g', terrain: 'Địa hình hoang dã dốc đá' }
  }
};

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
                  if (!selectedSize) alert('Vui lòng chọn kích thước (size) trước!');
                  else if (!selectedColor) alert('Vui lòng chọn màu sắc trước!');
                  else alert(`Đã thêm vào giỏ hàng: ${product.name} (Màu: ${selectedColor}, Size: ${selectedSize})`);
                }}
              >
                Thêm vào giỏ hàng
              </button>

              {/* Button 2: Buy Now (Triggers Voucher input block) */}
              <button 
                className={styles.buyNowBtn}
                onClick={handleBuyNow}
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
