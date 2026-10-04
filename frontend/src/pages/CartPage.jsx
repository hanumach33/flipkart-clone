import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../redux/slices/cartSlice';
import { createOrder } from '../redux/slices/orderSlice';
import Loader from '../components/Loader/Loader';
import { toast } from 'react-toastify';
import './CartPage.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, loading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQtyChange = (itemId, qty) => {
    if (qty < 1) return;
    dispatch(updateCartItem({ itemId, quantity: qty }));
  };

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.info('Item removed from cart');
  };

  const handlePlaceOrder = async () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    const orderData = {
      items: cartItems.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0] || '',
        price: item.price,
        quantity: item.quantity,
      })),
      shippingAddress: {
        address: '123 Main Street',
        city: 'Hyderabad',
        postalCode: '500001',
        country: 'India',
      },
      paymentMethod: 'COD',
      itemsPrice: itemsTotal,
      taxPrice: tax,
      shippingPrice: shipping,
      totalPrice: grandTotal,
    };
    try {
      await dispatch(createOrder(orderData)).unwrap();
      toast.success('🎉 Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error(err || 'Failed to place order');
    }
  };

  const itemsTotal = cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  const originalTotal = cartItems?.reduce(
    (acc, item) => acc + (item.product?.price || item.price) * item.quantity,
    0
  ) || 0;
  const discount = originalTotal - itemsTotal;
  const shipping = itemsTotal > 500 ? 0 : 40;
  const tax = Math.round(itemsTotal * 0.03);
  const grandTotal = itemsTotal + shipping + tax;

  if (loading) return <Loader />;

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Left: Cart Items */}
        <div className="cart-items-section">
          <div className="cart-header-bar">
            <h2>My Cart ({cartItems?.length || 0} items)</h2>
          </div>

          {!cartItems || cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your cart is empty!</h3>
              <p>Add items to it now.</p>
              <Link to="/products" className="btn-shop-now">
                Shop Now
              </Link>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="cart-item-image">
                    <img
                      src={item.product?.images?.[0] || 'https://via.placeholder.com/100'}
                      alt={item.product?.name}
                    />
                  </div>
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.product?.name}</h4>
                    <p className="cart-item-brand">{item.product?.brand}</p>
                    <div className="cart-item-pricing">
                      <span className="cart-item-price">₹{item.price?.toLocaleString()}</span>
                      {item.product?.price > item.price && (
                        <span className="cart-item-original">
                          ₹{item.product?.price?.toLocaleString()}
                        </span>
                      )}
                      {item.product?.discountPercent > 0 && (
                        <span className="cart-item-discount">
                          {item.product.discountPercent}% off
                        </span>
                      )}
                    </div>
                    <p className="cart-delivery-info">
                      🚚 Free delivery {shipping === 0 ? '' : `by tomorrow`}
                    </p>
                    <div className="cart-item-actions">
                      <div className="qty-control">
                        <button
                          onClick={() => handleQtyChange(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQtyChange(item._id, item.quantity + 1)}>
                          +
                        </button>
                      </div>
                      <button className="btn-remove" onClick={() => handleRemove(item._id)}>
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="cart-place-order-bar">
                <button className="btn-place-order" onClick={handlePlaceOrder}>
                  PLACE ORDER
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right: Price Summary */}
        {cartItems && cartItems.length > 0 && (
          <div className="price-summary">
            <h3 className="price-summary-title">PRICE DETAILS</h3>
            <div className="price-row">
              <span>Price ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span>
              <span>₹{originalTotal.toLocaleString()}</span>
            </div>
            <div className="price-row discount-row">
              <span>Discount</span>
              <span className="green-text">− ₹{discount.toLocaleString()}</span>
            </div>
            <div className="price-row">
              <span>Delivery Charges</span>
              <span className={shipping === 0 ? 'green-text' : ''}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            <div className="price-row">
              <span>Secured Packaging Fee</span>
              <span>₹{tax}</span>
            </div>
            <div className="price-divider" />
            <div className="price-row total-row">
              <span>Total Amount</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>
            <div className="price-divider" />
            <p className="savings-text">
              You will save ₹{discount.toLocaleString()} on this order
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
