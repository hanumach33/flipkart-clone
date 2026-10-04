import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { fetchProductById, addReview, clearProduct } from '../redux/slices/productSlice'
import { addToCart } from '../redux/slices/cartSlice'
import { addToWishlist } from '../redux/slices/wishlistSlice'
import Loader from '../components/Loader/Loader'
import Rating from '../components/Rating/Rating'

const formatPrice = (n) =>
  '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })

const ProductDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { product, loading, error } = useSelector((state) => state.products)
  const { token, user } = useSelector((state) => state.auth)
  const { loading: cartLoading } = useSelector((state) => state.cart)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {
    dispatch(fetchProductById(id))
    return () => dispatch(clearProduct())
  }, [id, dispatch])

  if (loading) return <Loader fullPage />

  if (error || !product) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '60px' }}>😕</div>
        <h2 style={{ marginTop: '16px', color: '#212121' }}>Product not found</h2>
        <button
          onClick={() => navigate('/products')}
          style={{ marginTop: '16px', padding: '10px 24px', background: '#2874f0', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Browse Products
        </button>
      </div>
    )
  }

  const {
    name, brand, description, price, discountPrice, rating: productRating = 0,
    numReviews = 0, images = [], image, countInStock, highlights = [],
    specifications = {}, reviews = [], category,
  } = product

  const allImages = images.length > 0 ? images : image ? [image] : ['https://via.placeholder.com/400x400?text=No+Image']
  const displayPrice = discountPrice || price
  const originalPrice = discountPrice ? price : null
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : null
  const inStock = countInStock === undefined || countInStock > 0

  const handleAddToCart = () => {
    if (!token) { toast.info('Please login to add to cart'); navigate('/login'); return }
    dispatch(addToCart({ productId: product._id, quantity }))
      .unwrap()
      .then(() => toast.success(`${quantity} item(s) added to cart!`))
      .catch((err) => toast.error(err || 'Failed to add to cart'))
  }

  const handleBuyNow = () => {
    if (!token) { toast.info('Please login to buy'); navigate('/login'); return }
    dispatch(addToCart({ productId: product._id, quantity }))
      .unwrap()
      .then(() => navigate('/cart'))
      .catch((err) => toast.error(err || 'Error'))
  }

  const handleWishlist = () => {
    if (!token) { toast.info('Please login to add to wishlist'); navigate('/login'); return }
    dispatch(addToWishlist(product._id))
      .unwrap()
      .then(() => toast.success('Added to wishlist!'))
      .catch((err) => toast.error(err || 'Error'))
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (!reviewForm.comment.trim()) { setReviewError('Please write a review comment.'); return }
    dispatch(addReview({ productId: product._id, reviewData: reviewForm }))
      .unwrap()
      .then(() => { toast.success('Review submitted!'); setReviewForm({ rating: 5, comment: '' }) })
      .catch((err) => toast.error(err || 'Failed to submit review'))
  }

  // Star distribution for reviews
  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }))

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh', paddingBottom: '40px' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '16px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '12px', color: '#878787', marginBottom: '12px' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
          {' › '}
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/products')}>{category || 'Products'}</span>
          {' › '}
          <span style={{ color: '#212121' }}>{name?.substring(0, 40)}</span>
        </div>

        {/* ── Main Product Card ── */}
        <div style={{ background: '#fff', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '0' }}>
          {/* ── Left: Image Gallery ── */}
          <div style={{ width: '440px', flexShrink: 0, padding: '20px', borderRight: '1px solid #f0f0f0' }}>
            {/* Main Image */}
            <div style={{
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              height: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              marginBottom: '12px',
            }}>
              <img
                src={allImages[selectedImage]}
                alt={name}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image' }}
              />
            </div>
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {allImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      width: '60px', height: '60px', border: `2px solid ${selectedImage === idx ? '#2874f0' : '#e0e0e0'}`,
                      borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <img src={img} alt={`thumb-${idx}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/60?text=img' }} />
                  </div>
                ))}
              </div>
            )}
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={handleAddToCart}
                disabled={!inStock || cartLoading}
                style={{
                  flex: 1, padding: '14px', background: '#ff9f00', color: '#fff', border: 'none',
                  borderRadius: '4px', fontSize: '16px', fontWeight: '700', cursor: inStock ? 'pointer' : 'not-allowed',
                  opacity: inStock ? 1 : 0.6, letterSpacing: '0.5px',
                }}
              >
                🛒 ADD TO CART
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                style={{
                  flex: 1, padding: '14px', background: '#fb641b', color: '#fff', border: 'none',
                  borderRadius: '4px', fontSize: '16px', fontWeight: '700', cursor: inStock ? 'pointer' : 'not-allowed',
                  opacity: inStock ? 1 : 0.6, letterSpacing: '0.5px',
                }}
              >
                ⚡ BUY NOW
              </button>
            </div>
            <button
              onClick={handleWishlist}
              style={{
                width: '100%', marginTop: '10px', padding: '12px', background: '#fff', color: '#212121',
                border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px', fontWeight: '600',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              ♡ Add to Wishlist
            </button>
          </div>

          {/* ── Right: Product Info ── */}
          <div style={{ flex: 1, padding: '24px' }}>
            {/* Name */}
            <h1 style={{ fontSize: '20px', fontWeight: '400', color: '#212121', marginBottom: '8px', lineHeight: '1.4' }}>
              {name}
            </h1>
            {brand && <div style={{ fontSize: '13px', color: '#878787', marginBottom: '8px' }}>Brand: <strong>{brand}</strong></div>}

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{
                background: productRating >= 3 ? '#388e3c' : productRating >= 2 ? '#ff9800' : '#f44336',
                color: '#fff', padding: '3px 8px', borderRadius: '3px', fontSize: '13px', fontWeight: '700',
                display: 'inline-flex', alignItems: 'center', gap: '3px',
              }}>
                {productRating.toFixed(1)} ★
              </span>
              <span style={{ color: '#878787', fontSize: '13px' }}>{numReviews.toLocaleString()} Ratings & Reviews</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '28px', fontWeight: '700', color: '#212121' }}>{formatPrice(displayPrice)}</span>
              {originalPrice && (
                <span style={{ fontSize: '16px', color: '#878787', textDecoration: 'line-through' }}>{formatPrice(originalPrice)}</span>
              )}
              {discountPercent && discountPercent > 0 && (
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#388e3c' }}>{discountPercent}% off</span>
              )}
            </div>

            {/* Offers */}
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '4px', padding: '12px 16px', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#212121', marginBottom: '10px' }}>Available Offers</h4>
              {[
                { icon: '🏦', text: '10% off on Bank of Baroda Credit Cards, max ₹1000. On orders of ₹5,000 and above' },
                { icon: '💳', text: '5% Unlimited Cashback on Flipkart Axis Bank Credit Card' },
                { icon: '🎁', text: 'Get GST invoice and save up to 28% on business purchases' },
              ].map((offer, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '13px' }}>
                  <span>{offer.icon}</span>
                  <span style={{ color: '#212121' }}>{offer.text}</span>
                </div>
              ))}
            </div>

            {/* Delivery */}
            <div style={{ display: 'flex', gap: '32px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#878787' }}>Delivery</span>
                <div style={{ fontSize: '13px', color: '#212121', marginTop: '2px' }}>
                  🚚 Free delivery by <strong>Tomorrow</strong>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#878787' }}>Warranty</span>
                <div style={{ fontSize: '13px', color: '#212121', marginTop: '2px' }}>1 Year Manufacturer Warranty</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#878787' }}>Return</span>
                <div style={{ fontSize: '13px', color: '#212121', marginTop: '2px' }}>7 Day Replacement Policy</div>
              </div>
            </div>

            {/* Quantity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', color: '#878787' }}>Quantity:</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ width: '32px', height: '32px', background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  −
                </button>
                <span style={{ padding: '0 16px', fontSize: '15px', fontWeight: '600' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(countInStock || 10, q + 1))}
                  style={{ width: '32px', height: '32px', background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  +
                </button>
              </div>
              {countInStock !== undefined && (
                <span style={{ fontSize: '12px', color: inStock ? '#388e3c' : '#f44336', fontWeight: '600' }}>
                  {inStock ? `${countInStock} in stock` : 'Out of Stock'}
                </span>
              )}
            </div>

            {/* Description */}
            {description && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#212121', marginBottom: '8px' }}>Description</h4>
                <p style={{ fontSize: '13px', color: '#212121', lineHeight: '1.8' }}>{description}</p>
              </div>
            )}

            {/* Highlights */}
            {highlights.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#212121', marginBottom: '8px' }}>Highlights</h4>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                  {highlights.map((h, i) => (
                    <li key={i} style={{ fontSize: '13px', color: '#212121', marginBottom: '6px' }}>{h}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ── Specifications ── */}
        {Object.keys(specifications).length > 0 && (
          <div style={{ background: '#fff', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', marginTop: '8px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#212121', marginBottom: '16px', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px' }}>
              Specifications
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {Object.entries(specifications).map(([key, val]) => (
                  <tr key={key} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '10px 16px', width: '30%', color: '#878787', fontSize: '13px', fontWeight: '500' }}>{key}</td>
                    <td style={{ padding: '10px 16px', color: '#212121', fontSize: '13px' }}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Reviews ── */}
        <div style={{ background: '#fff', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', marginTop: '8px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#212121', marginBottom: '16px', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px' }}>
            Ratings & Reviews
          </h3>

          {/* Rating Summary */}
          {numReviews > 0 && (
            <div style={{ display: 'flex', gap: '40px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: '700', color: '#212121', lineHeight: '1' }}>
                  {productRating.toFixed(1)}
                </div>
                <Rating value={productRating} count={numReviews} size={20} />
                <div style={{ fontSize: '12px', color: '#878787', marginTop: '4px' }}>{numReviews} reviews</div>
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                {starCounts.map(({ star, count }) => (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#878787', width: '16px', textAlign: 'right' }}>{star}</span>
                    <span style={{ color: '#ff9f00', fontSize: '12px' }}>★</span>
                    <div style={{ flex: 1, height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: numReviews > 0 ? `${(count / numReviews) * 100}%` : '0%',
                        height: '100%',
                        background: '#388e3c',
                        borderRadius: '4px',
                      }} />
                    </div>
                    <span style={{ fontSize: '12px', color: '#878787', width: '20px' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Cards */}
          {reviews.length === 0 ? (
            <p style={{ color: '#878787', fontSize: '14px' }}>No reviews yet. Be the first to review!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {reviews.map((review) => (
                <div key={review._id} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{
                      background: review.rating >= 3 ? '#388e3c' : '#f44336',
                      color: '#fff', padding: '2px 6px', borderRadius: '3px', fontSize: '12px', fontWeight: '600',
                    }}>
                      {review.rating} ★
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#212121' }}>{review.name}</span>
                    <span style={{ fontSize: '12px', color: '#878787' }}>
                      {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#212121', lineHeight: '1.6' }}>{review.comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add Review Form */}
          {token ? (
            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#212121' }}>
                Write a Review
              </h4>
              <form onSubmit={handleReviewSubmit}>
                {/* Star Rating */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '13px', color: '#878787', display: 'block', marginBottom: '6px' }}>Your Rating</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: '28px', color: star <= reviewForm.rating ? '#ff9f00' : '#e0e0e0',
                          padding: '0',
                        }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                {/* Comment */}
                <div style={{ marginBottom: '12px' }}>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => { setReviewForm({ ...reviewForm, comment: e.target.value }); setReviewError('') }}
                    placeholder="Tell others what you think about this product..."
                    rows={4}
                    style={{
                      width: '100%', padding: '12px', border: reviewError ? '1px solid #f44336' : '1px solid #e0e0e0',
                      borderRadius: '4px', fontSize: '13px', resize: 'vertical', outline: 'none', color: '#212121',
                    }}
                  />
                  {reviewError && <p style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>{reviewError}</p>}
                </div>
                <button
                  type="submit"
                  style={{
                    padding: '10px 28px', background: '#2874f0', color: '#fff', border: 'none',
                    borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
                  }}
                >
                  Submit Review
                </button>
              </form>
            </div>
          ) : (
            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '16px' }}>
              <p style={{ color: '#878787', fontSize: '14px' }}>
                <span
                  onClick={() => navigate('/login')}
                  style={{ color: '#2874f0', cursor: 'pointer', fontWeight: '600' }}
                >
                  Login
                </span>{' '}to write a review.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
