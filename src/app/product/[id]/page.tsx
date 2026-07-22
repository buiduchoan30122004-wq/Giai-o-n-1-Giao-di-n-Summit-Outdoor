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
  },
  'speedcross-w': {
    id: 'speedcross-w',
    brand: 'Salomon',
    name: 'Speedcross 6 Women',
    price: '3.250.000đ',
    image: '/products/salomon_slab_ultraglide.jpg',
    thumbnails: [
      '/products/salomon_slab_ultraglide.jpg',
      '/products/salomon_xt_whisper.jpg',
      '/products/salomon_xt6_black.jpg'
    ],
    status: 'New',
    subtitle: 'Trail running shoes - Women',
    description: 'Phiên bản đặc biệt dành riêng cho phái nữ của Salomon Speedcross 6. Trọng lượng siêu nhẹ cùng thiết kế phom chân ôm gọn gàng, tăng cường đệm nâng đỡ vòm bàn chân giúp phái đẹp tự tin bứt phá các cung đường sình lầy dốc đứng.',
    features: [
      'Phom dáng thiết kế dành riêng cho cấu trúc xương chân nữ',
      'Gai đế sâu hình xương cá bám bùn sình tuyệt hảo',
      'Bộ đệm EnergyCell+ hoàn trả lực đàn hồi cao',
      'Thân giày Ripstop bền bỉ kháng nước nhẹ'
    ],
    availableColors: ['Trắng', 'Hồng', 'Xám'],
    specs: { cushioning: 'Êm ái cao', support: 'Nâng đỡ vòm', drop: '10mm', weight: '262g', terrain: 'Đường bùn & Trơn trượt' }
  },
  'speedgoat-w': {
    id: 'speedgoat-w',
    brand: 'Hoka',
    name: 'Speedgoat 5 Women',
    price: '3.850.000đ',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500',
    thumbnails: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500',
      'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?q=80&w=500',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500'
    ],
    status: 'New',
    subtitle: 'Trail running shoes - Women',
    description: 'Mẫu giày chạy địa hình được nữ giới ưa chuộng nhất của Hoka. Speedgoat 5 Women mang đến sự êm ái vô song nhờ đệm CMEVA siêu dày, tăng độ bám an toàn tuyệt đối bằng đế ngoài Vibram® Megagrip có gai kéo ma sát.',
    features: [
      'Đế ngoài Vibram Megagrip Traction Lug bám đá ẩm',
      'Lớp đệm gót dày bảo vệ tối đa khớp gối khi đổ dốc',
      'Trọng lượng tối ưu giảm mỏi cơ cự ly dài',
      'Cổ giày kéo dài nâng đỡ gân Achilles'
    ],
    availableColors: ['Hồng', 'Cam', 'Xanh dương'],
    specs: { cushioning: 'Đệm cực dày (Max)', support: 'Trung tính', drop: '4mm', weight: '242g', terrain: 'Địa hình kỹ thuật gồ ghề' }
  },
  'pegasus-w': {
    id: 'pegasus-w',
    brand: 'Nike',
    name: 'Pegasus Trail 4 Women',
    price: '3.990.000đ',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=500',
    thumbnails: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=500',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500'
    ],
    status: '',
    subtitle: 'Trail running shoes - Women',
    description: 'Phiên bản chạy trail mượt mà dành riêng cho các nữ runner. Nike Pegasus Trail 4 Women mang thiết kế thanh lịch thời trang kết hợp đệm foam React nhẹ nảy và hệ thống cáp treo Flywire khóa chân thăng bằng vượt trội.',
    features: [
      'Đệm React siêu nhẹ êm ái đàn hồi vĩnh cửu',
      'Dây đai Flywire ôm sát chống trượt bàn chân',
      'Màu sắc phối hợp thời trang bắt mắt',
      'Lưới dệt Engineered Mesh thông gió mát chân'
    ],
    availableColors: ['Cam', 'Hồng', 'Trắng'],
    specs: { cushioning: 'Độ nảy cao', support: 'Cân bằng ôm chân', drop: '9.5mm', weight: '240g', terrain: 'Đường hỗn hợp đô thị - mòn' }
  },
  'hydration-vest': {
    id: 'hydration-vest',
    brand: 'Salomon',
    name: 'Balo Nước Active Skin 8',
    price: '2.850.000đ',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500',
    thumbnails: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500'
    ],
    status: 'Best Seller',
    subtitle: 'Trail Running Hydration Vest - Unisex',
    description: 'Balo nước Salomon Active Skin 8 là người bạn đồng hành hoàn hảo cho cự ly trail ngắn đến trung bình. Thiết kế ôm sát cơ thể như lớp áo thứ hai chống rung lắc, chất liệu lưới co giãn thoáng khí tối đa, đi kèm 2 bình nước mềm Salomon 500ml tiện lợi.',
    features: [
      'Công nghệ Sensifit ôm sát chống nảy tối ưu',
      'Đi kèm 2 bình nước mềm Soft Flask 500ml cao cấp',
      'Nhiều ngăn chứa đồ phía trước và ngăn lớn phía sau',
      'Dây đai ngực tự co giãn điều chỉnh linh hoạt'
    ],
    availableColors: ['Đen', 'Xanh dương'],
    specs: { cushioning: 'Dung tích 8L', support: 'Lưới 3D Mesh', drop: 'Bình 2x500ml', weight: '210g', terrain: 'Chạy trail & Road dài' }
  },
  'garmin-fenix': {
    id: 'garmin-fenix',
    brand: 'Garmin',
    name: 'Đồng Hồ Fenix 7 Pro Sapphire Solar',
    price: '18.990.000đ',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500',
    thumbnails: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500'
    ],
    status: 'Premium',
    subtitle: 'GPS Multisport Smartwatch',
    description: 'Đồng hồ GPS thể thao cao cấp nhất dành cho các vận động viên ultra trail. Garmin Fenix 7 Pro sở hữu kính Sapphire chống trầy xước sạc năng lượng mặt trời siêu bền, bản đồ topo chi tiết, đo nhịp tim thế hệ mới và thời lượng pin cực khủng lên tới nhiều tuần hoạt động liên tục.',
    features: [
      'Mặt kính sạc pin mặt trời Power Sapphire chống trầy',
      'Định vị đa băng tần GPS/GLONASS/Galileo cực kỳ chính xác',
      'Bản đồ dẫn đường offline chi tiết từng lối mòn (TopoActive)',
      'Tích hợp đèn pin LED chiếu sáng khẩn cấp trên đường chạy đêm'
    ],
    availableColors: ['Đen', 'Xám'],
    specs: { cushioning: 'Pin 22 ngày', support: 'Kính Sapphire', drop: 'Chống nước 10ATM', weight: '73g', terrain: 'Leo núi & Chạy Ultra' }
  },
  'trail-socks': {
    id: 'trail-socks',
    brand: 'Compressport',
    name: 'Tất Chạy Trail PRS V4.0',
    price: '450.000đ',
    image: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?q=80&w=500',
    thumbnails: [
      'https://images.unsplash.com/photo-1582966772680-860e372bb558?q=80&w=500'
    ],
    status: 'New',
    subtitle: 'High Performance Trail Socks',
    description: 'Tất chạy trail Compressport Pro Racing Socks v4.0 Trail được gia cố đệm dày đặc tại các vùng ngón chân và gót chân giúp giảm lực va đập khi chạy xuống dốc. Công nghệ chấm 3D.Dots tăng cường lưu thông máu, mát-xa bàn chân nhẹ nhàng và ngăn ngừa phồng rộp.',
    features: [
      'Công nghệ 3D.Dots chống trượt và chống phồng rộp tối đa',
      'Gia cố đệm bảo vệ mắt cá chân và gân Achilles',
      'Sợi vải dệt siêu thoáng khí thoát mồ hôi cực nhanh',
      'Độ bó nhẹ hỗ trợ vòm gan bàn chân giảm mỏi'
    ],
    availableColors: ['Đen', 'Trắng', 'Đỏ', 'Xanh dương'],
    specs: { cushioning: 'Đệm 3D.Dots dày', support: 'Nâng đỡ vòm', drop: 'Kháng khuẩn', weight: '37g', terrain: 'Mọi địa hình chạy mòn' }
  },
  'flask-500': {
    id: 'flask-500',
    brand: 'Salomon',
    name: 'Bình Nước Mềm Soft Flask 500ml',
    price: '550.000đ',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=500',
    thumbnails: [
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=500'
    ],
    status: '',
    subtitle: 'Flexible Soft Water Flask',
    description: 'Bình nước mềm Salomon Soft Flask 500ml thiết kế tự động xẹp lại khi uống để tránh hiện tượng nước xóc bên trong. Đầu van hút thông minh silicon chống rò rỉ nước, chất liệu TPU cao cấp hoàn toàn không chứa chất độc hại BPA và PVC.',
    features: [
      'Tự động xẹp nhỏ lại khi nước giảm chống rung lắc',
      'Van hút silicon tiện lợi mở khóa nước khi cắn nhẹ',
      'Chất liệu nhựa dẻo TPU siêu bền chịu lực co bóp tốt',
      'Hoàn toàn không chứa BPA và PVC gây hại sức khỏe'
    ],
    availableColors: ['Xanh dương'],
    specs: { cushioning: 'Thể tích 500ml', support: 'Nhựa dẻo TPU', drop: 'BPA & PVC Free', weight: '30g', terrain: 'Chạy trail & Chạy bộ' }
  },
  'gu-tabs': {
    id: 'gu-tabs',
    brand: 'GU Energy',
    name: 'Viên Sủi Điện Giải GU Hydration Drink Tabs',
    price: '219.000đ',
    image: 'https://cdn.hstatic.net/products/200001165929/20230830_jsdi42u6db_5cf9e7362ea3440387a5069d7fb44de3_grande.jpeg',
    thumbnails: [
      'https://cdn.hstatic.net/products/200001165929/20230830_jsdi42u6db_5cf9e7362ea3440387a5069d7fb44de3_grande.jpeg'
    ],
    status: 'Essential',
    subtitle: '12 viên sủi điện giải bù muối - Vị Dâu Hibicus',
    description: 'Viên sủi điện giải GU Hydration Tabs giúp bù đắp lượng muối khoáng thất thoát qua mồ hôi. Thiết kế dạng tuýp sủi nhỏ gọn thuận tiện mang theo, nhanh chóng hoà tan tạo vị thơm ngon thanh mát, cung cấp Natri, Kali giúp cơ thể thăng bằng điện giải phòng chống chuột rút.',
    features: [
      'Bù muối khoáng thiết yếu Natri, Kali nhanh chóng',
      'Định lượng chuẩn 12 viên sủi trong tuýp chống ẩm',
      'Hương vị dâu tây Hibicus tự nhiên dễ uống',
      'Chỉ chứa 10 calo mỗi viên, phù hợp kiểm soát năng lượng'
    ],
    availableColors: ['Đỏ', 'Trắng'],
    specs: { cushioning: '10 Calo / Viên', support: 'Bù muối Natri', drop: 'Dạng sủi tan', weight: '54g', terrain: 'Mọi cự ly chạy trail & road' }
  },
  'gu-gel-real': {
    id: 'gu-gel-real',
    brand: 'GU Energy',
    name: 'Gel Năng Lượng GU Energy Gel Vị Dâu Chuối',
    price: '45.000đ',
    image: 'https://cdn.hstatic.net/products/200001165929/upload_ca2ae7d0cbf744d399dff0fe62d1d134_grande.jpg',
    thumbnails: [
      'https://cdn.hstatic.net/products/200001165929/upload_ca2ae7d0cbf744d399dff0fe62d1d134_grande.jpg'
    ],
    status: 'Hot',
    subtitle: 'Vị Dâu Chuối - Bổ sung năng lượng tức thì',
    description: 'Gel năng lượng GU Energy Gel là thương hiệu số 1 thế giới dành cho chạy bộ địa hình. Gel cung cấp 100 calo năng lượng carbohydrate kép dễ hấp thu, amino axit BCAA bảo vệ cơ bắp chống mỏi và các điện giải thiết yếu.',
    features: [
      'Cung cấp 100 calo năng lượng carbohydrate kép hấp thụ nhanh',
      'Chứa amino axit BCAA chuỗi nhánh hạn chế xơ rách cơ',
      'Bổ sung chất điện giải muối Natri cân bằng nước',
      'Hương vị Dâu Chuối chua ngọt dịu cổ họng'
    ],
    availableColors: ['Hồng', 'Vàng'],
    specs: { cushioning: '100 Calo / Gói', support: 'BCAA x3 lần', drop: 'Điện giải 60mg', weight: '32g', terrain: 'Chạy trail & Thể thao cường độ cao' }
  },
  'tailwind-pack': {
    id: 'tailwind-pack',
    brand: 'Tailwind',
    name: 'Bột Năng Lượng Tailwind Endurance Fuel vị Mâm Xôi',
    price: '98.000đ',
    image: 'https://cdn.hstatic.net/products/200001165929/upload_ad4b3c14e9114eddbec5d1e77b0bf9cc_grande.jpg',
    thumbnails: [
      'https://cdn.hstatic.net/products/200001165929/upload_ad4b3c14e9114eddbec5d1e77b0bf9cc_grande.jpg'
    ],
    status: 'Best Seller',
    subtitle: 'Raspberry Caffeinated - Gói pha 2 servings',
    description: 'Bột pha nước Tailwind Endurance Fuel cung cấp trọn vẹn năng lượng, nước và điện giải trong một gói pha tiện lợi. Phù hợp cho các vận động viên ultra chạy trail dài ngày tự túc nước uống, có chứa caffeine giúp kích thích tinh thần tỉnh táo.',
    features: [
      'Cung cấp 200 calo năng lượng bền vững pha bình nước',
      'Bù muối điện giải dồi dào ngăn ngừa chuột rút vọ bẻ',
      'Chứa Caffeine tự nhiên tăng sự tỉnh táo bền bỉ',
      'Thành phần hữu cơ siêu sạch không gây kích ứng dạ dày'
    ],
    availableColors: ['Đỏ', 'Xanh dương'],
    specs: { cushioning: '200 Calo / Gói', support: 'Có Caffeine', drop: 'Điện giải bù muối', weight: '54g', terrain: 'Chạy trail tự túc cự ly dài' }
  },
  'hammer-recover-real': {
    id: 'hammer-recover-real',
    brand: 'Hammer Nutrition',
    name: 'Thức Uống Phục Hồi Hammer Recoverite Socola',
    price: '105.000đ',
    image: 'https://cdn.hstatic.net/products/200001165929/upload_a5f8396e74d444f8b8eaf1d8955b389d_grande.jpg',
    thumbnails: [
      'https://cdn.hstatic.net/products/200001165929/upload_a5f8396e74d444f8b8eaf1d8955b389d_grande.jpg',
      'https://cdn.hstatic.net/products/200001165929/20230528_x91srwsg4m_b8dd8ccd962349f1920d114ab7b6a22b_large.jpeg'
    ],
    status: 'New',
    subtitle: 'Post-Workout Recovery - Chocolate Flavor',
    description: 'Bột phục hồi cơ bắp Recoverite từ Hammer Nutrition là sản phẩm hồi phục chuẩn khoa học sau chạy bền. Cung cấp tỷ lệ carbohydrate phức tạp và whey protein cô đặc 3:1 cùng hàm lượng lớn L-Glutamine giúp sửa chữa các sợi cơ bị tổn thương.',
    features: [
      'Tỷ lệ phục hồi Carb & Protein 3:1 chuẩn y khoa thể thao',
      'Chứa 3g L-Glutamine tăng tốc độ tái tạo mô cơ',
      'Whey Protein chất lượng cao hấp thụ siêu nhanh',
      'Hương vị Socola nguyên chất ngọt dịu êm ái'
    ],
    availableColors: ['Đen', 'Nâu'],
    specs: { cushioning: 'Whey Protein', support: 'Tái tạo cơ bắp', drop: 'L-Glutamine 3000mg', weight: '49g', terrain: 'Uống ngay trong 30 phút sau khi chạy' }
  },
  'hammer-gel-real': {
    id: 'hammer-gel-real',
    brand: 'Hammer Nutrition',
    name: 'Gel Năng Lượng Hammer Gel Vị Montana Huckleberry',
    price: '49.000đ',
    image: 'https://cdn.hstatic.net/products/200001165929/upload_4532655c9b5c42ed813f44962cfe05f2_grande.jpg',
    thumbnails: [
      'https://cdn.hstatic.net/products/200001165929/upload_4532655c9b5c42ed813f44962cfe05f2_grande.jpg'
    ],
    status: 'Popular',
    subtitle: 'Vị Montana Huckleberry đặc trưng từ quả mọng',
    description: 'Hammer Gel sử dụng carbohydrate phức hợp maltodextrin thay vì đường tinh luyện thông thường, giúp giải phóng năng lượng đều đặn, ổn định và bền bỉ trong suốt quá trình vận động mà không làm tăng đường huyết đột ngột.',
    features: [
      'Nguồn năng lượng bền vững từ carbohydrate phức hợp',
      'Không chứa đường hóa học gây sốc năng lượng',
      'Hương vị quả mọng Montana Huckleberry hoang dã độc đáo',
      'Dễ tiêu hóa phù hợp cả với những dạ dày nhạy cảm nhất'
    ],
    availableColors: ['Tím', 'Xanh dương'],
    specs: { cushioning: '90 Calo / Gói', support: 'Năng lượng bền bỉ', drop: 'Maltodextrin tự nhiên', weight: '33g', terrain: 'Chạy trail dốc dã ngoại' }
  },
  'lecka-bar': {
    id: 'lecka-bar',
    brand: 'Lecka',
    name: 'Thanh Năng Lượng Tự Nhiên Lecka Vị Chuối Quế',
    price: '40.000đ',
    image: 'https://cdn.hstatic.net/products/200001165929/upload_4313a74252a94f94b90421b303c3845e_grande.jpg',
    thumbnails: [
      'https://cdn.hstatic.net/products/200001165929/upload_4313a74252a94f94b90421b303c3845e_grande.jpg'
    ],
    status: 'Eco-Friendly',
    subtitle: 'Thanh hạt dinh dưỡng tự nhiên - Vị Chuối Quế',
    description: 'Thanh năng lượng Lecka là sản phẩm dinh dưỡng thể thao tự nhiên cao cấp được sản xuất tại Việt Nam. Sử dụng 100% nguyên liệu tự nhiên từ chuối, quế, hạt dinh dưỡng lành mạnh, không đường tinh luyện, thân thiện môi trường với bao bì tự phân hủy.',
    features: [
      '100% nguyên liệu tự nhiên thuần chay hữu cơ',
      'Không bổ sung đường hóa học hay chất bảo quản',
      'Cung cấp năng lượng bền vững cùng chất xơ tốt cho tiêu hóa',
      'Bao bì sinh học tự hủy thân thiện môi trường dã ngoại'
    ],
    availableColors: ['Vàng', 'Nâu'],
    specs: { cushioning: '150 Calo / Thanh', support: 'Thuần chay (Vegan)', drop: 'Không đường tinh luyện', weight: '40g', terrain: 'Chạy trail dã ngoại & Trekking leo núi' }
  },
  'lecka-bar-cacao': {
    id: 'lecka-bar-cacao',
    brand: 'Lecka',
    name: 'Thanh Năng Lượng Tự Nhiên Lecka Vị Cacao Chuối',
    price: '40.000đ',
    image: 'https://cdn.hstatic.net/products/200001165929/upload_89eacceb324947b089b62a9b6dafef04_grande.jpg',
    thumbnails: [
      'https://cdn.hstatic.net/products/200001165929/upload_89eacceb324947b089b62a9b6dafef04_grande.jpg'
    ],
    status: 'Popular',
    subtitle: 'Thanh hạt dinh dưỡng tự nhiên - Vị Cacao Chuối',
    description: 'Thanh dinh dưỡng Lecka Cacao Chuối cung cấp hàm lượng calo cao cùng chất chống oxy hoá tự nhiên từ cacao nguyên chất Bến Tre phối hợp với chuối chín sấy dẻo ngọt thơm. Giúp nạp năng lượng nhanh và tăng hưng phấn khi tập luyện.',
    features: [
      'Cacao nguyên chất giàu chất chống oxy hoá tốt cho tim mạch',
      'Chuối dẻo tự nhiên giàu Kali bù khoáng cho cơ bắp',
      'Đồ ăn năng lượng thuần chay, không phẩm màu hoá học',
      'Thân thiện dã ngoại với bao bì tự phân huỷ sinh học'
    ],
    availableColors: ['Nâu', 'Đen'],
    specs: { cushioning: '150 Calo / Thanh', support: 'Thuần chay (Vegan)', drop: 'Cacao Bến Tre', weight: '40g', terrain: 'Trekking leo núi & Chạy trail dã ngoại' }
  },
  'tailwind-rebuild-coffee': {
    id: 'tailwind-rebuild-coffee',
    brand: 'Tailwind',
    name: 'Bột Phục Hồi Tailwind Rebuild Recovery Vị Cà Phê',
    price: '105.000đ',
    image: 'https://cdn.hstatic.net/products/200001165929/upload_f8628d03aee6468081987a8a6475fdbb_grande.jpg',
    thumbnails: [
      'https://cdn.hstatic.net/products/200001165929/upload_f8628d03aee6468081987a8a6475fdbb_grande.jpg'
    ],
    status: 'New Flavor',
    subtitle: 'Post-Workout Rebuild Recovery - Coffee Flavor',
    description: 'Bột phục hồi hoàn hảo Tailwind Rebuild Recovery vị Cà Phê chứa công thức độc quyền từ đạm gạo hữu cơ phối hợp axit amin thiết yếu. Giúp sửa chữa sợi cơ và bù đắp glycogen bị cạn kiệt nhanh gấp đôi sau các cự ly chạy trail siêu dài.',
    features: [
      'Đạm thực vật hữu cơ cao cấp hấp thu siêu nhanh',
      'Hương vị Cà Phê tự nhiên thơm ngon tăng tỉnh táo nhẹ nhàng',
      'Bù muối điện giải dồi dào phục hồi thăng bằng nội môi',
      'Không chứa gluten, sữa động vật hay các chất kích ứng tiêu hoá'
    ],
    availableColors: ['Nâu'],
    specs: { cushioning: 'Đạm hữu cơ', support: 'Tái tạo cơ bắp', drop: 'Axit amin thiết yếu', weight: '59g', terrain: 'Dùng ngay sau các buổi chạy trail dài' }
  },
  'tailwind-rebuild-caramel': {
    id: 'tailwind-rebuild-caramel',
    brand: 'Tailwind',
    name: 'Bột Phục Hồi Tailwind Rebuild Recovery Vị Caramel Muối',
    price: '105.000đ',
    image: 'https://cdn.hstatic.net/products/200001165929/upload_9917b20f06da4ad1907eb925cfd9b99a_grande.jpg',
    thumbnails: [
      'https://cdn.hstatic.net/products/200001165929/upload_9917b20f06da4ad1907eb925cfd9b99a_grande.jpg'
    ],
    status: 'Hot',
    subtitle: 'Post-Workout Rebuild Recovery - Salted Caramel',
    description: 'Bột phục hồi đạm thực vật hữu cơ cao cấp Tailwind Rebuild Recovery vị Caramel Muối thơm ngậy mặn nhẹ sảng khoái. Cung cấp lượng đạm hoàn chỉnh giúp sửa chữa tế bào cơ bắp rách mỏi và phục hồi thể lực tức thì.',
    features: [
      'Công thức phục hồi đạm thực vật sạch tinh khiết nhất',
      'Vị Caramel Muối thơm ngậy mặn nhẹ kích thích vị giác sau chạy',
      'Giúp tái tạo năng lượng dự trữ glycogen hiệu quả',
      'Thành phần thuần chay hữu cơ tự nhiên lành tính'
    ],
    availableColors: ['Vàng', 'Nâu'],
    specs: { cushioning: 'Đạm hữu cơ', support: 'Tái tạo cơ bắp', drop: 'Caramel & Muối biển', weight: '59g', terrain: 'Phục hồi sau các giải marathon & trail' }
  },
  'pillar-recovery-berry': {
    id: 'pillar-recovery-berry',
    brand: 'Pillar Performance',
    name: 'Vi Chất Magie Phục Hồi Pillar Triple Magnesium Berry',
    price: '40.000đ',
    image: 'https://cdn.hstatic.net/products/200001165929/upload_0e36e90b54224a0882255a7198ed9bf9_grande.jpg',
    thumbnails: [
      'https://cdn.hstatic.net/products/200001165929/upload_0e36e90b54224a0882255a7198ed9bf9_grande.jpg'
    ],
    status: 'High Tech',
    subtitle: 'Triple Magnesium Professional Recovery - Gói 5g',
    description: 'Bột phục hồi cơ bắp và chất lượng giấc ngủ chuyên sâu Pillar Performance Triple Magnesium. Chứa 3 dạng magie sinh học dễ hấp thu nhất giúp làm dịu hệ thần kinh, thư giãn sâu các sợi cơ căng mỏi, ngăn ngừa chuột rút đêm hiệu quả.',
    features: [
      'Chứa 3 nguồn Magie sinh khả dụng tối ưu cho thể thao chuyên nghiệp',
      'Hỗ trợ giãn cơ bắp căng thẳng sau vận động nặng',
      'Cải thiện sâu chất lượng giấc ngủ để tăng tốc độ tự hồi phục',
      'Hương vị dâu quả mọng tự nhiên dễ chịu, gói đơn 5g tiện mang đi'
    ],
    availableColors: ['Tím', 'Trắng'],
    specs: { cushioning: '3 Dạng Magie', support: 'Giãn cơ & Giấc ngủ', drop: 'Không đường ngọt hóa học', weight: '5g', terrain: 'Uống tối trước ngày thi đấu hoặc sau chạy' }
  },
  'gu-roctane-chocolate': {
    id: 'gu-roctane-chocolate',
    brand: 'GU Energy',
    name: 'Gel Năng Lượng GU Roctane Vị Socola Muối Biển',
    price: '79.000đ',
    image: 'https://cdn.hstatic.net/products/200001165929/upload_64ff9079187c44ee8abe49e34418719c_grande.jpg',
    thumbnails: [
      'https://cdn.hstatic.net/products/200001165929/upload_64ff9079187c44ee8abe49e34418719c_grande.jpg'
    ],
    status: 'Ultra Spec',
    subtitle: 'Roctane Ultra-Endurance Gel - Sea Salt Chocolate',
    description: 'Dòng gel năng lượng GU Roctane siêu dẻo dai chuyên dụng cho cự ly Ultra Trail từ 70km-100km hoặc khi vận động cường độ cực cao. Bổ sung hàm lượng muối Natri gấp đôi và lượng axit amin BCAA gấp 3 lần dòng gel thông thường để chống vọ bẻ tuyệt đối.',
    features: [
      'Tăng gấp đôi lượng Natri và Kali bù điện giải siêu tốc',
      'Cung cấp gấp 3 lượng BCAA bảo vệ sợi cơ chống dị hóa mỏi',
      'Hương vị Socola Muối Biển ngọt đắng đậm đà, giảm ngán đường',
      'Được khuyên dùng cho các vận động viên cự ly Ultra marathon'
    ],
    availableColors: ['Đen', 'Nâu'],
    specs: { cushioning: '100 Calo / Gói', support: 'BCAA x3 lần', drop: 'Natri 125mg dồi dào', weight: '32g', terrain: 'Chạy trail cự ly Ultra 70km - 100km' }
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
