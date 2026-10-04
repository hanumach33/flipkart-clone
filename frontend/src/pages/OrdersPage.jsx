import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../redux/slices/orderSlice';
import Loader from '../components/Loader/Loader';
import './OrdersPage.css';

const statusColors = {
  Processing: '#2874f0',
  Shipped: '#ff9f00',
  Delivered: '#388e3c',
  Cancelled: '#f44336',
};

const statusIcons = {
  Processing: '⏳',
  Shipped: '🚚',
  Delivered: '✅',
  Cancelled: '❌',
};

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h2 className="orders-title">My Orders</h2>

        {!orders || orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h3>No orders yet!</h3>
            <p>When you place an order, it will appear here.</p>
            <Link to="/products" className="btn-shop">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                {/* Order Header */}
                <div className="order-card-header">
                  <div className="order-meta">
                    <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                    <span className="order-date">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div
                    className="order-status-badge"
                    style={{ backgroundColor: statusColors[order.status] || '#2874f0' }}
                  >
                    {statusIcons[order.status]} {order.status}
                  </div>
                </div>

                {/* Order Items */}
                <div className="order-items-list">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <img
                        src={item.image || 'https://via.placeholder.com/60'}
                        alt={item.name}
                        className="order-item-img"
                      />
                      <div className="order-item-details">
                        <p className="order-item-name">{item.name}</p>
                        <p className="order-item-qty">Qty: {item.quantity}</p>
                        <p className="order-item-price">₹{item.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="order-card-footer">
                  <div className="order-address">
                    <span>📍</span>
                    <span>
                      {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
                      {order.shippingAddress?.postalCode}
                    </span>
                  </div>
                  <div className="order-total">
                    <span>Total: </span>
                    <strong>₹{order.totalPrice?.toLocaleString()}</strong>
                  </div>
                  <div className="order-payment">
                    <span>Payment: </span>
                    <span className="payment-method">{order.paymentMethod}</span>
                    {order.isPaid ? (
                      <span className="paid-badge">Paid</span>
                    ) : (
                      <span className="pending-badge">Pending</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
