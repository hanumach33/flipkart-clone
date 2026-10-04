import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import Loader from '../components/Loader/Loader';
import Rating from '../components/Rating/Rating';
import { toast } from 'react-toastify';
import './WishlistPage.css';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { wishlistItems, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleMoveToCart = (product) => {
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    dispatch(removeFromWishlist(product._id));
    toast.success(`"${product.name}" moved to cart!`);
  };

  const handleRemove = (productId, name) => {
    dispatch(removeFromWishlist(productId));
    toast.info(`"${name}" removed from wishlist`);
  };

  if (loading) return <Loader />;

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h2>My Wishlist</h2>
          <span className="wishlist-count">{wishlistItems?.length || 0} items</span>
        </div>

        {!wishlistItems || wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">❤️</div>
            <h3>Your wishlist is empty!</h3>
            <p>Save items you love by clicking the heart icon on products.</p>
            <Link to="/products" className="btn-explore">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((product) => (
              <div key={product._id} className="wishlist-card">
                <button
                  className="wishlist-remove-btn"
                  onClick={() => handleRemove(product._id, product.name)}
                  title="Remove from wishlist"
                >
                  ✕
                </button>
                <Link to={`/products/${product._id}`} className="wishlist-img-link">
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/200'}
                    alt={product.name}
                    className="wishlist-img"
                  />
                </Link>
                <div className="wishlist-info">
                  <Link to={`/products/${product._id}`} className="wishlist-name">
                    {product.name}
                  </Link>
                  <Rating value={product.rating} count={product.numReviews} />
                  <div className="wishlist-price-row">
                    <span className="wishlist-discount-price">
                      ₹{product.discountPrice?.toLocaleString()}
                    </span>
                    <span className="wishlist-original-price">
                      ₹{product.price?.toLocaleString()}
                    </span>
                    <span className="wishlist-discount-pct">{product.discountPercent}% off</span>
                  </div>
                  <button
                    className="btn-move-to-cart"
                    onClick={() => handleMoveToCart(product)}
                  >
                    🛒 MOVE TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
