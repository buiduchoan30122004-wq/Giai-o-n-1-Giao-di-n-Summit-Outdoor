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
  FileText
} from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: number;
  brand: string;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
  stock: number;
  created_at: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  preferred_brand?: string;
  experience_level?: string;
  interests?: string;
  created_at: string;
}

interface Order {
  id: number;
  customer_id: number;
  product_id: number;
  quantity: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  product_brand?: string;
  product_name?: string;
  product_price?: number;
  address?: string;
  notes?: string;
  transaction_id?: string;
  payment_amount?: number;
  payment_date?: string;
  payment_method?: string;
}

type TabType = 'products' | 'customers' | 'orders';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
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
    stock: 10
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
  const fetchData = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Alert Handler helper
  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
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
      const body = isEdit ? { ...productForm, id: productModal.editId } : productForm;

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
    setProductForm({
      brand: product.brand,
      name: product.name,
      price: product.price,
      image_url: product.image_url || '',
      description: product.description || '',
      stock: product.stock
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
    setProductForm({ brand: '', name: '', price: 0, image_url: '', description: '', stock: 10 });
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
          <Link href="/" className="back-home-btn">
            <Home size={16} />
            <span>Trở lại Agent</span>
          </Link>
          <div className="header-title-container">
            <h1>Summit Outdoor Admin</h1>
            <p>Trang quản trị vận hành hệ thống cửa hàng & CRM</p>
          </div>
        </div>
        <button className="refresh-btn" onClick={fetchData} disabled={isLoading}>
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
            <span className="stat-label">Khách Hàng (Waitlist)</span>
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
                  <h3>Danh Sách Khách Hàng</h3>
                  <button className="action-btn-primary" onClick={openAddCustomerModal}>
                    <Plus size={16} />
                    <span>Thêm Khách Hàng</span>
                  </button>
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
                      <th>Sở thích</th>
                      <th className="text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="empty-row">Không tìm thấy khách hàng nào.</td>
                      </tr>
                    ) : (
                      customers.map((cust) => (
                        <tr key={cust.id}>
                          <td>#{cust.id}</td>
                          <td className="font-weight-600">{cust.name}</td>
                          <td className="color-accent">{cust.email}</td>
                          <td>{cust.phone || '-'}</td>
                          <td><span className="brand-tag">{cust.preferred_brand || '-'}</span></td>
                          <td>{cust.experience_level || '-'}</td>
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
                      ))
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
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="empty-row">Chưa có đơn đặt hàng nào trong hệ thống.</td>
                      </tr>
                    ) : (
                      orders.map((ord) => (
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
                            <div className="table-user-cell">
                              <span className="font-weight-600">{ord.product_name || 'Sản phẩm bị xóa'}</span>
                              <span className="text-small color-accent">{ord.product_brand || ''}</span>
                            </div>
                          </td>
                          <td className="text-center font-weight-600">{ord.quantity}</td>
                          <td className="font-weight-600 color-accent">${ord.total_price.toFixed(2)}</td>
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
              <div className="modal-body">
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

                <div className="form-group">
                  <label>Đường dẫn ảnh sản phẩm (Unsplash / URL)</label>
                  <input 
                    type="text" 
                    placeholder="Đường dẫn https://images.unsplash.com/..." 
                    value={productForm.image_url} 
                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Mô tả chi tiết sản phẩm</label>
                  <textarea 
                    rows={4}
                    placeholder="Mô tả công nghệ giày, độ bám, độ drop, trải nghiệm thực tế..." 
                    value={productForm.description} 
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
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
        }
        .admin-table th {
          background-color: var(--bg-tertiary);
          color: var(--text-secondary);
          font-weight: 600;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.05em;
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
