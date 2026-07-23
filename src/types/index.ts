export interface Product {
  id: number;
  brand: string;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
  stock: number;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  preferred_brand?: string;
  experience_level?: string;
  interests?: string;
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  brand: string;
  price: string;
  image?: string;
  quantity: number;
}

export interface Order {
  id: number;
  customer_id: number;
  product_id: number;
  quantity: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at?: string;
  // Join fields
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  product_name?: string;
  product_brand?: string;
  order_code?: string;
  address?: string;
  notes?: string;
  payment_method?: 'cod' | 'qr';
  transaction_id?: string;
  payment_amount?: number;
  payment_date?: string;
  items?: OrderItem[];
}
