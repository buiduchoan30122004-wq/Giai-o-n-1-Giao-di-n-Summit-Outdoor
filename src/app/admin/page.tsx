'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Loader2, 
  RefreshCw,
  Home,
  CheckCircle,
  AlertTriangle,
  FileText,
  Settings
} from 'lucide-react';
import Link from 'next/link';

import { Product, Customer, Order } from '@/types';

type TabType = 'products' | 'customers' | 'orders';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [googleScriptUrl, setGoogleScriptUrl] = useState('');
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modals state
  const [productModal, setProductModal] = useState<{ open: boolean; editId?: number }>({ open: false });
  const [customerModal, setCustomerModal] = useState<{ open: boolean; editId?: number }>({ open: false });
  const [orderModal, setOrderModal] = useState<{ open: boolean }>({ open: false });

  // Forms state
  const [productForm, setProductForm] = useState({
    brand: '',
    name: '',
    price: 0,
    image_url: '',
    description: '',
    stock: 10,
    category: 'trail',
    status: '',
    subtitle: '',
    thumbnails: '',
    available_colors: 'Đen, Trắng, Xám, Đỏ, Xanh dương',
    available_sizes: 'US 7.5, US 8, US 8.5, US 9, US 9.5, US 10, US 10.5, US 11, US 12',
    specs_cushioning: 'Chưa cập nhật',
    specs_support: 'Chưa cập nhật',
    specs_drop: 'Chưa cập nhật',
    specs_weight: 'Chưa cập nhật',
    specs_terrain: 'Chưa cập nhật',
    features: ''
  });

  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferred_brand: '',
    experience_level: 'Mới bắt đầu',
    interests: ''
  });

  const [orderForm, setOrderForm] = useState({
    customer_id: 0,
    product_id: 0,
    quantity: 1
  });

  // Fetch Data
  const fetchData = async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    setErrorMessage(null);
    try {
      const [resProd, resCust, resOrd] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/customers'),
        fetch('/api/admin/orders')
      ]);

      const dataProd = await resProd.json();
      const dataCust = await resCust.json();
      const dataOrd = await resOrd.json();

      if (dataProd.success) setProducts(dataProd.products);
      if (dataCust.success) setCustomers(dataCust.customers);
      if (dataOrd.success) setOrders(dataOrd.orders);

      if (!dataProd.success || !dataCust.success || !dataOrd.success) {
        setErrorMessage('Không thể tải một số dữ liệu từ server.');
      }
    } catch (error) {
      setErrorMessage('Lỗi kết nối với máy chủ API.');
    } finally {
      if (!isBackground) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (typeof window !== 'undefined') {
      setGoogleScriptUrl(localStorage.getItem('google_script_url') || '');
    }

    // Tự động đồng bộ thời gian thực mỗi 10 giây (Real-time polling)
    const interval = setInterval(() => {
      fetchData(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Alert Handler helper
  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Filtered arrays based on selected date range
  const filteredCustomers = customers.filter(c => {
    if (!c.created_at) return true;
    const date = new Date(c.created_at);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start) { start.setHours(0, 0, 0, 0); if (date < start) return false; }
    if (end) { end.setHours(23, 59, 59, 999); if (date > end) return false; }
    return true;
  });

  const filteredOrders = orders.filter(o => {
    if (!o.created_at) return true;
    const date = new Date(o.created_at);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start) { start.setHours(0, 0, 0, 0); if (date < start) return false; }
    if (end) { end.setHours(23, 59, 59, 999); if (date > end) return false; }
    return true;
  });

  // Client-side exporters
  // Exporter to Excel (via CSV with UTF-8 BOM for perfect Vietnamese support in Excel)
  const handleExportToExcel = (type: 'customers' | 'orders') => {
    let headers: string[] = [];
    let rows: any[][] = [];
    let title = '';

    if (type === 'customers') {
      title = `Summit_Outdoor_Khach_Hang_${new Date().toISOString().slice(0, 10)}`;
      headers = ['ID', 'Họ Tên', 'Email', 'SĐT', 'Thương Hiệu Quan Tâm', 'Trình Độ', 'Phân Loại', 'Ghi Chú / Sở Thích', 'Ngày Đăng Ký'];
      rows = filteredCustomers.map(c => {
        const isWaitlist = c.preferred_brand || c.experience_level;
        const typeText = isWaitlist ? 'Waitlist (Popup)' : 'Mua Hàng (Checkout)';
        return [
          c.id,
          c.name,
          c.email,
          c.phone || '',
          c.preferred_brand || '',
          c.experience_level || '',
          typeText,
          c.interests || '',
          new Date(c.created_at).toLocaleDateString('vi-VN')
        ];
      });
    } else {
      title = `Summit_Outdoor_Don_Hang_${new Date().toISOString().slice(0, 10)}`;
      headers = ['Mã Đơn', 'Khách Hàng', 'SĐT', 'Sản Phẩm', 'Số Lượng', 'Tổng Tiền (VND)', 'Trạng Thái', 'Phương Thức', 'Địa Chỉ', 'Ghi Chú', 'Mã Giao Dịch Sepay', 'Ngày Đặt'];
      rows = filteredOrders.map(o => {
        const productDetails = o.items ? o.items.map(item => `${item.name} (x${item.quantity})`).join('; ') : o.product_name || '';
        const statusText = o.status === 'confirmed' ? (o.payment_method === 'cod' ? 'Đang giao hàng (COD)' : 'Đã thanh toán') : (o.status === 'cancelled' ? 'Đã hủy' : 'Chờ thanh toán');
        return [
          o.order_code || `ORD-${o.id}`,
          o.customer_name || '',
          o.customer_phone || '',
          productDetails,
          o.quantity || 1,
          o.total_price,
          statusText,
          o.payment_method === 'cod' ? 'COD' : 'QR Ngân hàng',
          o.address || '',
          o.notes || '',
          o.transaction_id || '',
          new Date(o.created_at).toLocaleDateString('vi-VN')
        ];
      });
    }

    const BOM = '\uFEFF';
    const csvContent = BOM + [
      headers.join(','),
      ...rows.map(row => row.map(val => {
        const strVal = String(val === null || val === undefined ? '' : val);
        return `"${strVal.replace(/"/g, '""')}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerSuccess('Đã xuất file Excel thành công!');
  };

  // Product CRUD
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.brand || !productForm.name || productForm.price < 0 || productForm.stock < 0) {
      alert('Vui lòng điền đầy đủ các thông tin hợp lệ.');
      return;
    }

    try {
      const isEdit = productModal.editId !== undefined;
      const url = '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const specsObj = {
        cushioning: productForm.specs_cushioning || 'Chưa cập nhật',
        support: productForm.specs_support || 'Chưa cập nhật',
        drop: productForm.specs_drop || 'Chưa cập nhật',
        weight: productForm.specs_weight || 'Chưa cập nhật',
        terrain: productForm.specs_terrain || 'Chưa cập nhật'
      };

      const payload = {
        brand: productForm.brand,
        name: productForm.name,
        price: productForm.price,
        image_url: productForm.image_url,
        description: productForm.description,
        stock: productForm.stock,
        category: productForm.category,
        status: productForm.status,
        subtitle: productForm.subtitle,
        thumbnails: productForm.thumbnails,
        available_colors: productForm.available_colors,
        available_sizes: productForm.available_sizes,
        specs: JSON.stringify(specsObj),
        features: productForm.features
      };

      const body = isEdit ? { ...payload, id: productModal.editId } : payload;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (data.success) {
        triggerSuccess(isEdit ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
        setProductModal({ open: false });
        fetchData();
      } else {
        alert(data.error || 'Thao tác thất bại.');
      }
    } catch (err) {
      alert('Lỗi kết nối server.');
    }
  };

  const handleProductEdit = (product: Product) => {
    let cushioning = 'Chưa cập nhật';
    let support = 'Chưa cập nhật';
    let drop = 'Chưa cập nhật';
    let weight = 'Chưa cập nhật';
    let terrain = 'Chưa cập nhật';
    
    if (product.specs) {
      try {
        const parsed = JSON.parse(product.specs);
        cushioning = parsed.cushioning || cushioning;
        support = parsed.support || support;
        drop = parsed.drop || drop;
        weight = parsed.weight || weight;
        terrain = parsed.terrain || terrain;
      } catch (e) {
        console.error('Failed to parse product specs JSON:', e);
      }
    }

    setProductForm({
      brand: product.brand,
      name: product.name,
      price: product.price,
      image_url: product.image_url || '',
      description: product.description || '',
      stock: product.stock,
      category: product.category || 'trail',
      status: product.status || '',
      subtitle: product.subtitle || '',
      thumbnails: product.thumbnails || '',
      available_colors: product.available_colors || '',
      available_sizes: product.available_sizes || '',
      specs_cushioning: cushioning,
      specs_support: support,
      specs_drop: drop,
      specs_weight: weight,
      specs_terrain: terrain,
      features: product.features || ''
    });
    setProductModal({ open: true, editId: product.id });
  };

  const handleProductDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('Xóa sản phẩm thành công!');
        fetchData();
      } else {
        alert(data.error || 'Không thể xóa sản phẩm.');
      }
    } catch (err) {
      alert('Lỗi kết nối.');
    }
  };

  // Customer CRUD
  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.name || !customerForm.email) {
      alert('Tên và Email là bắt buộc.');
      return;
    }

    try {
      const isEdit = customerModal.editId !== undefined;
      const url = '/api/admin/customers';
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit ? { ...customerForm, id: customerModal.editId } : customerForm;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (data.success) {
        triggerSuccess(isEdit ? 'Cập nhật thông tin khách hàng thành công!' : 'Thêm khách hàng thành công!');
        setCustomerModal({ open: false });
        fetchData();
      } else {
        alert(data.error || 'Thao tác thất bại.');
      }
    } catch (err) {
      alert('Lỗi kết nối.');
    }
  };

  const handleCustomerEdit = (cust: Customer) => {
    setCustomerForm({
      name: cust.name,
      email: cust.email,
      phone: cust.phone || '',
      preferred_brand: cust.preferred_brand || '',
      experience_level: cust.experience_level || 'Mới bắt đầu',
      interests: cust.interests || ''
    });
    setCustomerModal({ open: true, editId: cust.id });
  };

  const handleCustomerDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khách hàng này không?')) return;
    try {
      const res = await fetch(`/api/admin/customers?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('Xóa thông tin khách hàng thành công!');
        fetchData();
      } else {
        alert(data.error || 'Không thể xóa.');
      }
    } catch (err) {
      alert('Lỗi kết nối.');
    }
  };

  // Order Operations
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { customer_id, product_id, quantity } = orderForm;
    if (!customer_id || !product_id || quantity <= 0) {
      alert('Vui lòng chọn đầy đủ khách hàng, sản phẩm và số lượng.');
      return;
    }

    // Client-side stock check for validation feedback
    const selectedProduct = products.find(p => p.id === Number(product_id));
    if (selectedProduct && selectedProduct.stock < quantity) {
      alert(`Sản phẩm chỉ còn tồn kho ${selectedProduct.stock} cái, không đủ để bán ${quantity} cái.`);
      return;
    }

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: Number(customer_id),
          product_id: Number(product_id),
          quantity: Number(quantity)
        })
      });
      const data = await res.json();

      if (data.success) {
        triggerSuccess('Tạo đơn hàng mới thành công! Tồn kho đã tự động cập nhật.');
        setOrderModal({ open: false });
        fetchData();
      } else {
        alert(data.error || 'Đặt hàng thất bại.');
      }
    } catch (err) {
      alert('Lỗi kết nối.');
    }
  };

  const handleOrderConfirm = async (id: number) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'confirmed' })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('Đã duyệt đơn hàng thành công (Manual Confirm)!');
        fetchData();
      } else {
        alert(data.error || 'Thất bại.');
      }
    } catch (err) {
      alert('Lỗi kết nối.');
    }
  };

  const handleOrderCancel = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn HỦY đơn hàng này? Số lượng tồn kho sản phẩm sẽ được hoàn lại.')) return;
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'cancelled' })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('Đã hủy đơn hàng và hoàn trả số lượng tồn kho sản phẩm!');
        fetchData();
      } else {
        alert(data.error || 'Thất bại.');
      }
    } catch (err) {
      alert('Lỗi kết nối.');
    }
  };

  const handleOrderDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn XÓA đơn hàng này khỏi dữ liệu?')) return;
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('Xóa đơn hàng thành công!');
        fetchData();
      } else {
        alert(data.error || 'Thất bại.');
      }
    } catch (err) {
      alert('Lỗi kết nối.');
    }
  };

  const openAddProductModal = () => {
    setProductForm({
      brand: '',
      name: '',
      price: 0,
      image_url: '',
      description: '',
      stock: 10,
      category: 'trail',
      status: '',
      subtitle: '',
      thumbnails: '',
      available_colors: 'Đen, Trắng, Xám, Đỏ, Xanh dương',
      available_sizes: 'US 7.5, US 8, US 8.5, US 9, US 9.5, US 10, US 10.5, US 11, US 12',
      specs_cushioning: 'Chưa cập nhật',
      specs_support: 'Chưa cập nhật',
      specs_drop: 'Chưa cập nhật',
      specs_weight: 'Chưa cập nhật',
      specs_terrain: 'Chưa cập nhật',
      features: ''
    });
    setProductModal({ open: true });
  };

  const openAddCustomerModal = () => {
    setCustomerForm({ name: '', email: '', phone: '', preferred_brand: '', experience_level: 'Mới bắt đầu', interests: '' });
    setCustomerModal({ open: true });
  };

  const openAddOrderModal = () => {
    setOrderForm({
      customer_id: customers.length > 0 ? customers[0].id : 0,
      product_id: products.length > 0 ? products[0].id : 0,
      quantity: 1
    });
    setOrderModal({ open: true });
  };

  return (
    <div className="admin-layout">
      {/* Top Banner Message */}
      {successMessage && (
        <div className="alert alert-success animate-fade-in">
          <CheckCircle size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger animate-fade-in">
          <AlertTriangle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Header Panel */}
      <header className="admin-header">
        <div className="header-left">
          <div className="header-title-container" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="13,6 3,24 23,24" fill="#e11d48" />
              <polygon points="21,11 13,24 29,24" fill="#0f172a" />
              <polygon points="13,24 16,19 18,24" fill="#ffffff" />
            </svg>
            <div>
              <h1 style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>
                SUMMIT<span style={{ color: '#e11d48' }}>OUTDOOR</span> ADMIN
              </h1>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Trang quản trị vận hành hệ thống cửa hàng & CRM</p>
            </div>
          </div>
        </div>
        <button className="refresh-btn" onClick={() => fetchData()} disabled={isLoading}>
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          <span>Làm mới</span>
        </button>
      </header>

      {/* Dashboard Sub-Info Bar */}
      <section className="stats-container">
        <div className="stat-card">
          <div className="stat-icon p-color"><Package size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{products.length}</span>
            <span className="stat-label">Sản Phẩm</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon c-color"><Users size={24} /></div>
          <div className="stat-info">
             <span className="stat-value">{customers.length}</span>
             <span className="stat-label">Khách Hàng (Hệ Thống)</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon o-color"><ShoppingCart size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{orders.length}</span>
            <span className="stat-label">Đơn Hàng</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Navigation Tabs */}
        <div className="tabs-bar">
          <button 
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} />
            <span>Sản Phẩm</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <Users size={18} />
            <span>Khách Hàng</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart size={18} />
            <span>Đơn Hàng</span>
          </button>
        </div>

        {/* Tab contents */}
        {isLoading ? (
          <div className="loading-state">
            <Loader2 className="animate-spin" size={32} />
            <p>Đang tải dữ liệu từ SQLite...</p>
          </div>
        ) : (
          <div className="tab-content-container">
            {/* 1. PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="data-table-container">
                <div className="table-actions-header">
                  <h3>Danh Sách Sản Phẩm</h3>
                  <button className="action-btn-primary" onClick={openAddProductModal}>
                    <Plus size={16} />
                    <span>Thêm Sản Phẩm</span>
                  </button>
                </div>

                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ảnh</th>
                      <th>Thương hiệu</th>
                      <th>Tên sản phẩm</th>
                      <th>Giá tiền</th>
                      <th>Tồn kho</th>
                      <th>Mô tả</th>
                      <th className="text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="empty-row">Chưa có sản phẩm nào. Nhấp để thêm sản phẩm đầu tiên!</td>
                      </tr>
                    ) : (
                      products.map((prod) => (
                        <tr key={prod.id}>
                          <td>
                            {prod.image_url ? (
                              <img src={prod.image_url} alt={prod.name} className="table-thumbnail" />
                            ) : (
                              <div className="table-thumbnail-placeholder">Không ảnh</div>
                            )}
                          </td>
                          <td className="font-weight-600 color-accent">{prod.brand}</td>
                          <td className="font-weight-600">{prod.name}</td>
                          <td>${prod.price.toFixed(2)}</td>
                          <td>
                            <span className={`stock-badge ${prod.stock <= 3 ? 'low-stock' : 'in-stock'}`}>
                              {prod.stock} cái
                            </span>
                          </td>
                          <td className="table-cell-desc" title={prod.description}>{prod.description || '-'}</td>
                          <td className="text-right">
                            <div className="cell-actions">
                              <button className="icon-btn-edit" onClick={() => handleProductEdit(prod)}>
                                <Edit2 size={14} />
                              </button>
                              <button className="icon-btn-delete" onClick={() => handleProductDelete(prod.id)}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 2. CUSTOMERS TAB */}
            {activeTab === 'customers' && (
              <div className="data-table-container">
                <div className="table-actions-header">
                  <h3>Danh Sách Khách Hàng (Tất Cả)</h3>
                  <button className="action-btn-primary" onClick={openAddCustomerModal}>
                    <Plus size={16} />
                    <span>Thêm Khách Hàng</span>
                  </button>
                </div>

                {/* Filter and Export Bar */}
                <div className="filter-export-bar" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '15px', padding: '15px', background: '#f8fafc', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Lọc theo ngày:</span>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)} 
                      onClick={(e) => { try { e.currentTarget.showPicker(); } catch (err) {} }}
                      onFocus={(e) => { try { e.currentTarget.showPicker(); } catch (err) {} }}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>đến</span>
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)} 
                      onClick={(e) => { try { e.currentTarget.showPicker(); } catch (err) {} }}
                      onFocus={(e) => { try { e.currentTarget.showPicker(); } catch (err) {} }}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
                    />
                    {(startDate || endDate) && (
                      <button 
                        onClick={() => { setStartDate(''); setEndDate(''); }} 
                        style={{ padding: '6px 12px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}
                      >
                        Xoá lọc
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleExportToExcel('customers')} 
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'background 0.2s' }}
                    >
                      🟢 Xuất Excel
                    </button>
                  </div>
                </div>

                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên</th>
                      <th>Email</th>
                      <th>SĐT</th>
                      <th>Hãng yêu thích</th>
                      <th>Trình độ</th>
                      <th>Phân loại</th>
                      <th>Sở thích</th>
                      <th className="text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="empty-row">Không tìm thấy khách hàng nào.</td>
                      </tr>
                    ) : (
                      filteredCustomers.map((cust) => {
                        const isWaitlist = cust.preferred_brand || cust.experience_level;
                        return (
                          <tr key={cust.id}>
                            <td>#{cust.id}</td>
                            <td className="font-weight-600">{cust.name}</td>
                            <td className="color-accent">{cust.email}</td>
                            <td>{cust.phone || '-'}</td>
                            <td><span className="brand-tag">{cust.preferred_brand || '-'}</span></td>
                            <td>{cust.experience_level || '-'}</td>
                            <td>
                              <span style={{ 
                                display: 'inline-block',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                color: '#ffffff',
                                backgroundColor: isWaitlist ? '#10b981' : '#2563eb'
                              }}>
                                {isWaitlist ? 'Waitlist (Popup)' : 'Mua hàng (Checkout)'}
                              </span>
                            </td>
                            <td className="table-cell-desc" title={cust.interests}>{cust.interests || '-'}</td>
                            <td className="text-right">
                              <div className="cell-actions">
                                <button className="icon-btn-edit" onClick={() => handleCustomerEdit(cust)}>
                                  <Edit2 size={14} />
                                </button>
                                <button className="icon-btn-delete" onClick={() => handleCustomerDelete(cust.id)}>
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 3. ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="data-table-container">
                <div className="table-actions-header">
                  <h3>Lịch Sử Đơn Hàng</h3>
                  <button className="action-btn-primary" onClick={openAddOrderModal}>
                    <Plus size={16} />
                    <span>Tạo Đơn Hàng Mới</span>
                  </button>
                </div>

                {/* Filter and Export Bar */}
                <div className="filter-export-bar" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '15px', padding: '15px', background: '#f8fafc', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Lọc theo ngày:</span>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)} 
                      onClick={(e) => { try { e.currentTarget.showPicker(); } catch (err) {} }}
                      onFocus={(e) => { try { e.currentTarget.showPicker(); } catch (err) {} }}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>đến</span>
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)} 
                      onClick={(e) => { try { e.currentTarget.showPicker(); } catch (err) {} }}
                      onFocus={(e) => { try { e.currentTarget.showPicker(); } catch (err) {} }}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
                    />
                    {(startDate || endDate) && (
                      <button 
                        onClick={() => { setStartDate(''); setEndDate(''); }} 
                        style={{ padding: '6px 12px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}
                      >
                        Xoá lọc
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleExportToExcel('orders')} 
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'background 0.2s' }}
                    >
                      🟢 Xuất Excel
                    </button>
                  </div>
                </div>

                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Khách hàng</th>
                      <th>Sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Tổng tiền</th>
                      <th>Trạng thái</th>
                      <th>Ngày đặt</th>
                      <th className="text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="empty-row">Chưa có đơn đặt hàng nào trong hệ thống.</td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id}>
                          <td className="font-weight-600">ORD-{ord.id}</td>
                          <td>
                            <div className="table-user-cell">
                              <span className="font-weight-600">{ord.customer_name || 'Khách bị xóa'}</span>
                              <span className="text-small">{ord.customer_email || '-'} | {ord.customer_phone || '-'}</span>
                              {ord.address && (
                                <span className="text-small text-muted" style={{ marginTop: '3px', display: 'block', fontSize: '11px', color: '#6b7280' }}>
                                  🏠 {ord.address}
                                </span>
                              )}
                              {ord.notes && (
                                <span className="text-small text-muted" style={{ marginTop: '1px', display: 'block', fontSize: '11px', fontStyle: 'italic', color: '#8c95a5' }}>
                                  📝 {ord.notes}
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {ord.items && ord.items.length > 0 ? (
                                (() => {
                                  const items = ord.items;
                                  return items.map((item, idx) => (
                                    <div key={idx} className="table-user-cell" style={{ borderBottom: idx < items.length - 1 ? '1px dashed #e5e7eb' : 'none', paddingBottom: idx < items.length - 1 ? '4px' : '0' }}>
                                      <span className="font-weight-600" style={{ fontSize: '13px' }}>
                                        {item.name || 'Sản phẩm bị xóa'} <span style={{ color: '#e11d48', fontWeight: 'bold' }}>x{item.quantity}</span>
                                      </span>
                                      <span className="text-small color-accent" style={{ fontSize: '11px' }}>{item.brand || ''}</span>
                                    </div>
                                  ));
                                })()
                              ) : (
                                <div className="table-user-cell">
                                  <span className="font-weight-600">{ord.product_name || 'Sản phẩm bị xóa'}</span>
                                  <span className="text-small color-accent">{ord.product_brand || ''}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="text-center font-weight-600">{ord.quantity}</td>
                          <td className="font-weight-600 color-accent">{ord.total_price ? Number(ord.total_price).toLocaleString('vi-VN') + 'đ' : '0đ'}</td>
                          <td>
                            <div>
                              <span className={`status-pill ${ord.status}`}>
                                {ord.status === 'pending' ? 'Chờ thanh toán' : ''}
                                {ord.status === 'confirmed' ? (ord.payment_method === 'cod' ? 'Đang giao hàng (COD)' : 'Đã thanh toán') : ''}
                                {ord.status === 'cancelled' ? 'Đã hủy' : ''}
                              </span>
                              <div style={{ marginTop: '4px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '1.5px', color: '#6b7280' }}>
                                <span style={{ fontWeight: '500', color: '#374151' }}>
                                  {ord.payment_method === 'cod' ? '💵 COD (Thanh toán khi nhận)' : '🏦 Chuyển khoản QR'}
                                </span>
                                {ord.status === 'confirmed' && ord.transaction_id && (
                                  <>
                                    <span>💳 GD: {ord.transaction_id}</span>
                                    <span>💰 Nhận: {ord.payment_amount ? Number(ord.payment_amount).toLocaleString('vi-VN') + 'đ' : ''}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>{new Date(ord.created_at).toLocaleDateString('vi-VN')}</td>
                          <td className="text-right">
                            <div className="cell-actions-horizontal">
                              {ord.status === 'pending' && (
                                <button 
                                  className="btn-manual-confirm"
                                  onClick={() => handleOrderConfirm(ord.id)}
                                  title="Duyệt đơn thủ công (Manual Confirm)"
                                >
                                  <Check size={13} />
                                  <span>Duyệt đơn</span>
                                </button>
                              )}
                              {ord.status !== 'cancelled' && (
                                <button 
                                  className="btn-cancel-order"
                                  onClick={() => handleOrderCancel(ord.id)}
                                  title="Hủy đơn & hoàn kho"
                                >
                                  <X size={13} />
                                  <span>Hủy</span>
                                </button>
                              )}
                              <button 
                                className="icon-btn-delete"
                                onClick={() => handleOrderDelete(ord.id)}
                                title="Xóa vĩnh viễn đơn"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================= MODALS SECTION ================= */}

      {/* 1. PRODUCT FORM MODAL */}
      {productModal.open && (
        <div className="modal-backdrop">
          <div className="modal-container animate-scale-in">
            <div className="modal-header">
              <h2>{productModal.editId ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h2>
              <button className="modal-close-btn" onClick={() => setProductModal({ open: false })}>✕</button>
            </div>
            <form onSubmit={handleProductSubmit}>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Thương hiệu *</label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: Salomon, Hoka" 
                      value={productForm.brand} 
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Tên sản phẩm *</label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: Speedcross 6" 
                      value={productForm.name} 
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Giá tiền ($) *</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      value={productForm.price} 
                      onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Tồn kho ban đầu *</label>
                    <input 
                      type="number" 
                      min="0"
                      value={productForm.stock} 
                      onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Danh mục *</label>
                    <select 
                      value={productForm.category} 
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)',
                        fontSize: '13.5px',
                        outline: 'none'
                      }}
                    >
                      <option value="trail">Giày chạy Trail (Trail Running)</option>
                      <option value="hiking">Giày leo núi (Hiking)</option>
                      <option value="nutrition">Dinh dưỡng (Nutrition)</option>
                      <option value="accessories">Phụ kiện (Accessories)</option>
                      <option value="women">Bộ sưu tập Nữ (Women)</option>
                      <option value="sale">Khuyến mãi (Sale)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Trạng thái nhãn (Status)</label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: New, Hot, Sale (hoặc trống)" 
                      value={productForm.status} 
                      onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Tiêu đề phụ (Subtitle)</label>
                  <input 
                    type="text" 
                    placeholder="Ví dụ: Giày chạy địa hình chuyên nghiệp - Unisex" 
                    value={productForm.subtitle} 
                    onChange={(e) => setProductForm({ ...productForm, subtitle: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Đường dẫn ảnh sản phẩm chính (Unsplash / URL)</label>
                  <input 
                    type="text" 
                    placeholder="Đường dẫn https://images.unsplash.com/..." 
                    value={productForm.image_url} 
                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Danh sách ảnh phụ (Thumbnails) - Phân tách bởi dấu phẩy</label>
                  <textarea 
                    rows={2}
                    placeholder="Đường dẫn ảnh 1, Đường dẫn ảnh 2, Đường dẫn ảnh 3..." 
                    value={productForm.thumbnails} 
                    onChange={(e) => setProductForm({ ...productForm, thumbnails: e.target.value })}
                  />
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Màu sắc khả dụng (Phân tách bởi dấu phẩy)</label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: Đen, Trắng, Xám, Đỏ, Vàng" 
                      value={productForm.available_colors} 
                      onChange={(e) => setProductForm({ ...productForm, available_colors: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Kích cỡ khả dụng (Phân tách bởi dấu phẩy)</label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: US 8, US 8.5, US 9, US 10" 
                      value={productForm.available_sizes} 
                      onChange={(e) => setProductForm({ ...productForm, available_sizes: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ margin: '15px 0 10px 0', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                  <h4 style={{ fontSize: '13.5px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-accent)' }}>Thông Số Kỹ Thuật (Specs)</h4>
                  <div className="form-group-row" style={{ marginBottom: '8px' }}>
                    <div className="form-group">
                      <label>Đệm gót (Cushioning)</label>
                      <input 
                        type="text" 
                        value={productForm.specs_cushioning} 
                        onChange={(e) => setProductForm({ ...productForm, specs_cushioning: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Hỗ trợ lực (Support)</label>
                      <input 
                        type="text" 
                        value={productForm.specs_support} 
                        onChange={(e) => setProductForm({ ...productForm, specs_support: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Độ chênh lệch gót-mũi (Drop)</label>
                      <input 
                        type="text" 
                        value={productForm.specs_drop} 
                        onChange={(e) => setProductForm({ ...productForm, specs_drop: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group-row">
                    <div className="form-group">
                      <label>Trọng lượng (Weight)</label>
                      <input 
                        type="text" 
                        value={productForm.specs_weight} 
                        onChange={(e) => setProductForm({ ...productForm, specs_weight: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ flex: '2' }}>
                      <label>Địa hình khuyên dùng (Terrain)</label>
                      <input 
                        type="text" 
                        value={productForm.specs_terrain} 
                        onChange={(e) => setProductForm({ ...productForm, specs_terrain: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Mô tả chi tiết sản phẩm</label>
                  <textarea 
                    rows={3}
                    placeholder="Mô tả công nghệ sản phẩm, chất liệu, trải nghiệm thực tế..." 
                    value={productForm.description} 
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Đặc điểm nổi bật (Features) - Phân tách bởi dấu phẩy hoặc xuống dòng</label>
                  <textarea 
                    rows={2}
                    placeholder="Ví dụ: Đế ngoài Contagrip® bám cực tốt, Lớp màng chống nước GORE-TEX..." 
                    value={productForm.features} 
                    onChange={(e) => setProductForm({ ...productForm, features: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setProductModal({ open: false })}>Hủy</button>
                <button type="submit" className="btn-primary">Lưu Lại</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CUSTOMER FORM MODAL */}
      {customerModal.open && (
        <div className="modal-backdrop">
          <div className="modal-container animate-scale-in">
            <div className="modal-header">
              <h2>{customerModal.editId ? 'Chỉnh Sửa Khách Hàng' : 'Thêm Khách Hàng Mới'}</h2>
              <button className="modal-close-btn" onClick={() => setCustomerModal({ open: false })}>✕</button>
            </div>
            <form onSubmit={handleCustomerSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Tên khách hàng *</label>
                  <input 
                    type="text" 
                    placeholder="Ví dụ: Nguyễn Văn A" 
                    value={customerForm.name} 
                    onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Email liên hệ *</label>
                    <input 
                      type="email" 
                      placeholder="Ví dụ: customer@gmail.com" 
                      value={customerForm.email} 
                      onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: 0987654321" 
                      value={customerForm.phone} 
                      onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Thương hiệu yêu thích nhất</label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: Salomon, Hoka, Altra" 
                      value={customerForm.preferred_brand} 
                      onChange={(e) => setCustomerForm({ ...customerForm, preferred_brand: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Kinh nghiệm chạy bộ</label>
                    <select 
                      value={customerForm.experience_level}
                      onChange={(e) => setCustomerForm({ ...customerForm, experience_level: e.target.value })}
                    >
                      <option value="Mới bắt đầu">Mới bắt đầu</option>
                      <option value="Road runner chuyển hệ">Road runner chuyển hệ</option>
                      <option value="Đã có kinh nghiệm">Đã có kinh nghiệm</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Sở thích chạy bộ / Ghi chú</label>
                  <textarea 
                    rows={3}
                    placeholder="Chạy cự ly bao nhiêu, thích địa hình gì, thói quen tập luyện..." 
                    value={customerForm.interests} 
                    onChange={(e) => setCustomerForm({ ...customerForm, interests: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setCustomerModal({ open: false })}>Hủy</button>
                <button type="submit" className="btn-primary">Lưu Lại</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ORDER FORM MODAL */}
      {orderModal.open && (
        <div className="modal-backdrop">
          <div className="modal-container animate-scale-in">
            <div className="modal-header">
              <h2>Tạo Đơn Hàng Mới (Trừ Kho Tự Động)</h2>
              <button className="modal-close-btn" onClick={() => setOrderModal({ open: false })}>✕</button>
            </div>
            <form onSubmit={handleOrderSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Chọn Khách Hàng mua đồ</label>
                  <select 
                    value={orderForm.customer_id}
                    onChange={(e) => setOrderForm({ ...orderForm, customer_id: Number(e.target.value) })}
                    required
                  >
                    <option value="" disabled>-- Chọn khách hàng --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Chọn Sản Phẩm muốn bán</label>
                  <select 
                    value={orderForm.product_id}
                    onChange={(e) => setOrderForm({ ...orderForm, product_id: Number(e.target.value) })}
                    required
                  >
                    <option value="" disabled>-- Chọn sản phẩm --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.brand} - {p.name} (Tồn kho: {p.stock} cái | Giá: ${p.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Số lượng mua</label>
                  <input 
                    type="number" 
                    min="1"
                    value={orderForm.quantity} 
                    onChange={(e) => setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) || 1 })}
                    required
                  />
                  {orderForm.product_id > 0 && (() => {
                    const selProd = products.find(p => p.id === Number(orderForm.product_id));
                    if (selProd) {
                      return (
                        <span className={`stock-check-status ${selProd.stock < orderForm.quantity ? 'error' : 'success'}`}>
                          {selProd.stock < orderForm.quantity 
                            ? `⚠️ Không đủ hàng! Kho chỉ còn lại ${selProd.stock} sản phẩm.` 
                            : `✓ Hợp lệ. Còn lại ${selProd.stock - orderForm.quantity} sản phẩm trong kho.`}
                        </span>
                      );
                    }
                  })()}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setOrderModal({ open: false })}>Hủy</button>
                <button type="submit" className="btn-primary" disabled={
                  (() => {
                    const selProd = products.find(p => p.id === Number(orderForm.product_id));
                    return selProd ? selProd.stock < orderForm.quantity : true;
                  })()
                }>
                  Tạo Đơn Hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. GOOGLE SHEETS SETUP MODAL */}
      {showScriptModal && (
        <div className="modal-backdrop" style={{ zIndex: 1000 }}>
          <div className="modal-container animate-scale-in" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h2>Cấu Hình Kết Nối Google Sheets</h2>
              <button className="modal-close-btn" onClick={() => setShowScriptModal(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>
                Hệ thống CRM sẽ xuất báo cáo trực tiếp thành file Google Sheets lưu trong Google Drive của bạn (không thông qua bên thứ ba để bảo vệ tuyệt đối thông tin khách hàng).
              </p>
              
              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                <b style={{ color: '#0f766e', display: 'block', marginBottom: '8px' }}>Hướng dẫn cài đặt trong 20 giây:</b>
                <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', margin: 0, color: '#334155' }}>
                  <li>Truy cập đường dẫn: <a href="https://script.new" target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'underline' }}>script.new</a> (Trang tạo Google Apps Script mới).</li>
                  <li>Xóa toàn bộ code cũ và <b>dán đoạn mã Code</b> ở khung bên dưới vào.</li>
                  <li>Click nút <b>Deploy (Tạm dịch: Triển khai)</b> ở góc trên bên phải &gt; chọn <b>New deployment</b>.</li>
                  <li>Chọn loại deployment là <b>Web App</b> (click biểu tượng bánh răng).</li>
                  <li>Cấu hình:
                    <ul style={{ paddingLeft: '15px', marginTop: '4px' }}>
                      <li>Execute as (Chạy dưới dạng): <b>Me (Tôi)</b></li>
                      <li>Who has access (Ai có quyền truy cập): <b>Anyone (Bất kỳ ai)</b></li>
                    </ul>
                  </li>
                  <li>Nhấn nút <b>Deploy</b>, xác thực cấp quyền cho Google tài khoản của bạn, sau đó <b>Copy URL Web App</b> được cấp và dán vào ô cấu hình bên dưới.</li>
                </ol>
              </div>

              <div className="form-group">
                <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>Đoạn Mã Code Apps Script (Click để tự động copy):</label>
                <textarea 
                  readOnly 
                  onClick={(e) => {
                    e.currentTarget.select();
                    navigator.clipboard.writeText(e.currentTarget.value);
                    alert('Đã copy đoạn mã Apps Script vào Clipboard!');
                  }}
                  style={{ width: '100%', height: '120px', fontFamily: 'monospace', fontSize: '11px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f1f5f9', cursor: 'pointer' }}
                  value={`function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const title = data.title || "Exported Sheet";
    const headers = data.headers || [];
    const rows = data.rows || [];
    
    const ss = SpreadsheetApp.create(title);
    const sheet = ss.getActiveSheet();
    
    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#f1f5f9");
    
    rows.forEach(row => sheet.appendRow(row));
    
    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      url: ss.getUrl()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`}
                />
              </div>

              <div className="form-group">
                <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>Dán URL Web App Google Apps Script của bạn vào đây *</label>
                <input 
                  type="url" 
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={googleScriptUrl}
                  onChange={(e) => setGoogleScriptUrl(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setShowScriptModal(false)}>Hủy</button>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={() => {
                  if (!googleScriptUrl.startsWith('https://script.google.com/')) {
                    alert('Đường dẫn Web App Apps Script không hợp lệ. Vui lòng kiểm tra lại.');
                    return;
                  }
                  localStorage.setItem('google_script_url', googleScriptUrl);
                  setShowScriptModal(false);
                  triggerSuccess('Đã lưu cấu hình kết nối Google Sheets thành công!');
                }}
              >
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled JSX for responsive, gorgeous glassmorphism UI */}
      <style jsx>{`
        .admin-layout {
          min-height: 100vh;
          background-color: var(--bg-primary);
          color: var(--text-primary);
          font-family: var(--font-sans);
          padding: 24px;
          overflow-y: auto;
        }

        /* Alert styling */
        .alert {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          border-radius: var(--radius-md);
          font-size: 13.5px;
          font-weight: 600;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
        }
        .alert-success {
          background-color: #052e16;
          border: 1px solid #16a34a;
          color: #4ade80;
        }
        .alert-danger {
          background-color: #450a0a;
          border: 1px solid #dc2626;
          color: #fca5a5;
        }

        /* Header block */
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .back-home-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .back-home-btn:hover {
          color: var(--text-primary);
          border-color: var(--text-muted);
        }
        .header-title-container h1 {
          font-size: 22px;
          font-weight: 700;
        }
        .header-title-container p {
          font-size: 12.5px;
          color: var(--text-secondary);
        }
        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }
        .refresh-btn:hover {
          background-color: var(--bg-tertiary);
        }

        /* Quick stats widget */
        .stats-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        @media (max-width: 768px) {
          .stats-container {
            grid-template-columns: 1fr;
          }
        }
        .stat-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .p-color { background-color: rgba(21, 128, 61, 0.2); color: #22c55e; }
        .c-color { background-color: rgba(59, 130, 246, 0.2); color: #3b82f6; }
        .o-color { background-color: rgba(245, 158, 11, 0.2); color: #f59e0b; }
        .stat-info {
          display: flex;
          flex-direction: column;
        }
        .stat-value {
          font-size: 20px;
          font-weight: 700;
        }
        .stat-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        /* Main Workspace Navigation Tabs */
        .tabs-bar {
          display: flex;
          gap: 8px;
          border-bottom: 2px solid var(--border-color);
          margin-bottom: 20px;
        }
        .tab-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 14.5px;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }
        .tab-btn:hover {
          color: var(--text-primary);
        }
        .tab-btn.active {
          color: var(--accent-primary);
        }
        .tab-btn.active::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--accent-primary);
        }

        /* Tables container formatting */
        .data-table-container {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .table-actions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
          flex-wrap: wrap;
          gap: 12px;
        }
        .table-actions-header h3 {
          font-size: 16px;
          font-weight: 700;
        }
        .action-btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background-color: var(--accent-primary);
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .action-btn-primary:hover {
          background-color: var(--accent-hover);
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          color: var(--text-secondary);
          gap: 12px;
        }

        /* Base table elements */
        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }
        .admin-table th, .admin-table td {
          padding: 14px 20px;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
          font-size: 13.5px;
          vertical-align: middle;
        }
        .admin-table th {
          background-color: var(--bg-tertiary);
          color: var(--text-secondary);
          font-weight: 600;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }
        .admin-table tr:hover td {
          background-color: #ffffff02;
        }
        .empty-row {
          text-align: center !important;
          color: var(--text-muted);
          padding: 60px 20px !important;
          font-style: italic;
        }

        /* Column format and utilities */
        .text-right { text-align: right !important; }
        .text-center { text-align: center !important; }
        .font-weight-600 { font-weight: 600; }
        .color-accent { color: var(--text-accent) !important; }
        .table-cell-desc {
          max-width: 250px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--text-secondary);
        }

        /* Thumbnails and tags */
        .table-thumbnail {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          border: 1px solid var(--border-color);
        }
        .table-thumbnail-placeholder {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          background-color: var(--bg-tertiary);
          color: var(--text-muted);
          font-size: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          border: 1px solid var(--border-color);
        }
        .brand-tag {
          font-family: monospace;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-size: 11px;
          color: var(--text-accent);
          font-weight: 600;
        }
        .stock-badge {
          font-size: 12px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 10px;
        }
        .stock-badge.in-stock { background-color: #064e3b; color: #34d399; }
        .stock-badge.low-stock { background-color: #78350f; color: #fbbf24; }

        .table-user-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .text-small {
          font-size: 11.5px;
          color: var(--text-muted);
        }

        /* Order status pills */
        .status-pill {
          font-size: 11.5px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
        }
        .status-pill.pending { background-color: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
        .status-pill.confirmed { background-color: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); }
        .status-pill.cancelled { background-color: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); }

        /* Action buttons in rows */
        .cell-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
        .cell-actions-horizontal {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 6px;
          flex-wrap: nowrap;
        }
        .icon-btn-edit, .icon-btn-delete {
          width: 30px;
          height: 30px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .icon-btn-edit { background-color: var(--bg-tertiary); color: var(--text-secondary); }
        .icon-btn-edit:hover { border-color: var(--text-accent); color: var(--text-accent); }
        .icon-btn-delete { background-color: var(--bg-tertiary); color: var(--text-secondary); }
        .icon-btn-delete:hover { border-color: #ef4444; color: #ef4444; }

        /* Confirmation controls */
        .btn-manual-confirm {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          background-color: #064e3b;
          border: 1px solid #059669;
          color: #34d399;
          font-weight: 600;
          font-size: 11.5px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .btn-manual-confirm:hover {
          background-color: #047857;
        }
        .btn-cancel-order {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          background-color: #450a0a;
          border: 1px solid #b91c1c;
          color: #fca5a5;
          font-weight: 600;
          font-size: 11.5px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .btn-cancel-order:hover {
          background-color: #7f1d1d;
        }

        /* Modal backdrop and containers */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
          padding: 20px;
        }
        .modal-container {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 550px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 24px;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--bg-tertiary);
        }
        .modal-header h2 {
          font-size: 16px;
          font-weight: 700;
        }
        .modal-close-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 18px;
          cursor: pointer;
        }
        .modal-close-btn:hover { color: var(--text-primary); }

        .modal-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 60vh;
          overflow-y: auto;
        }

        /* Form elements styling */
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }
        .form-group-row {
          display: flex;
          gap: 16px;
        }
        @media (max-width: 480px) {
          .form-group-row {
            flex-direction: column;
            gap: 16px;
          }
        }
        .form-group label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .form-group input, .form-group select, .form-group textarea {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          padding: 10px 14px;
          font-size: 13.5px;
          outline: none;
          font-family: var(--font-sans);
          transition: border-color 0.2s;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          border-color: var(--accent-primary);
        }
        .stock-check-status {
          font-size: 11px;
          font-weight: 600;
          margin-top: 4px;
        }
        .stock-check-status.success { color: #4ade80; }
        .stock-check-status.error { color: #f87171; }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 18px 24px;
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-tertiary);
        }
        .btn-secondary {
          background-color: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover { border-color: var(--text-muted); color: var(--text-primary); }
        
        .btn-primary {
          background-color: var(--accent-primary);
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary:hover:not(:disabled) { background-color: var(--accent-hover); }
        .btn-primary:disabled { background-color: var(--border-color); color: var(--text-muted); cursor: not-allowed; }

        /* Animation utilities */
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-scale-in {
          animation: scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
