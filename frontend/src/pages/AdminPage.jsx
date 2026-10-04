import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/productSlice';
import { fetchAllOrders, updateOrderStatus } from '../redux/slices/orderSlice';
import api from '../services/api';
import Loader from '../components/Loader/Loader';
import { toast } from 'react-toastify';
import './AdminPage.css';

const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { products, loading: prodLoading } = useSelector((state) => state.products);
  const { orders, loading: orderLoading } = useSelector((state) => state.orders);

  const [activeTab, setActiveTab] = useState('products');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', brand: '', category: '',
    price: '', discountPrice: '', discountPercent: '',
    stock: '', seller: '', images: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    dispatch(fetchProducts({}));
    dispatch(fetchAllOrders());
  }, [dispatch, user, navigate]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditProduct(null);
    setFormData({
      name: '', description: '', brand: '', category: '',
      price: '', discountPrice: '', discountPercent: '',
      stock: '', seller: '', images: '',
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      brand: product.brand,
      category: product.category,
      price: product.price,
      discountPrice: product.discountPrice,
      discountPercent: product.discountPercent,
      stock: product.stock,
      seller: product.seller,
      images: product.images?.join(', ') || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      discountPrice: Number(formData.discountPrice),
      discountPercent: Number(formData.discountPercent),
      stock: Number(formData.stock),
      images: formData.images.split(',').map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created!');
      }
      setShowModal(false);
      dispatch(fetchProducts({}));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      dispatch(fetchProducts({}));
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }));
    toast.success('Order status updated');
  };

  const stats = {
    totalProducts: products?.length || 0,
    totalOrders: orders?.length || 0,
    totalRevenue: orders?.reduce((a, o) => a + (o.totalPrice || 0), 0) || 0,
  };

  return (
    <div className="admin-page">
      {/* Admin Header */}
      <div className="admin-topbar">
        <h1>🛠️ Admin Dashboard</h1>
        <span className="admin-user-badge">👑 {user?.name}</span>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="stat-card blue">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">🛒</div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📦 Products
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          🛒 Orders
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="admin-section">
          <div className="section-header">
            <h2>Products Management</h2>
            <button className="btn-add-product" onClick={openAddModal}>
              + Add Product
            </button>
          </div>
          {prodLoading ? (
            <Loader />
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <img
                          src={p.images?.[0] || 'https://via.placeholder.com/50'}
                          alt={p.name}
                          className="admin-product-img"
                        />
                      </td>
                      <td className="product-name-cell">{p.name}</td>
                      <td><span className="category-badge">{p.category}</span></td>
                      <td>₹{p.price?.toLocaleString()}</td>
                      <td className="green-text">₹{p.discountPrice?.toLocaleString()} ({p.discountPercent}%)</td>
                      <td>
                        <span className={p.stock > 0 ? 'in-stock' : 'out-stock'}>
                          {p.stock > 0 ? `${p.stock} units` : 'Out of Stock'}
                        </span>
                      </td>
                      <td>⭐ {p.rating?.toFixed(1)}</td>
                      <td>
                        <button className="btn-edit" onClick={() => openEditModal(p)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDeleteProduct(p._id, p.name)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="admin-section">
          <div className="section-header">
            <h2>Orders Management</h2>
          </div>
          {orderLoading ? (
            <Loader />
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order) => (
                    <tr key={order._id}>
                      <td className="order-id-cell">#{order._id.slice(-8).toUpperCase()}</td>
                      <td>{order.user?.name || 'N/A'}</td>
                      <td>{order.items?.length} item(s)</td>
                      <td><strong>₹{order.totalPrice?.toLocaleString()}</strong></td>
                      <td>{order.paymentMethod}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <select
                          className="status-select"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input name="name" value={formData.name} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label>Brand *</label>
                  <input name="brand" value={formData.brand} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={formData.category} onChange={handleFormChange} required>
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home">Home</option>
                    <option value="Appliances">Appliances</option>
                    <option value="Books">Books</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Seller</label>
                  <input name="seller" value={formData.seller} onChange={handleFormChange} />
                </div>
                <div className="form-group">
                  <label>MRP (₹) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label>Selling Price (₹) *</label>
                  <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label>Discount %</label>
                  <input type="number" name="discountPercent" value={formData.discountPercent} onChange={handleFormChange} />
                </div>
                <div className="form-group">
                  <label>Stock *</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleFormChange} required />
                </div>
                <div className="form-group full-width">
                  <label>Image URLs (comma-separated)</label>
                  <input name="images" value={formData.images} onChange={handleFormChange} placeholder="https://..." />
                </div>
                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleFormChange} rows={3} required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-save">
                  {editProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
