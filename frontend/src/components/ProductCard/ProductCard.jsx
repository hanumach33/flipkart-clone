import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { addToCart } from '../../redux/slices/cartSlice'
import { addToWishlist } from '../../redux/slices/wishlistSlice'
import './ProductCard.css'

const formatPrice = (n) =>
  '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

  if (!product) return null

  const {
    _id,
    name,
    image,
    images,
    price,
    discountPrice,
    rating = 0,
    numReviews = 0,
    stock,
    countInStock,
    brand,
  } = product

  const displayPrice = discountPrice || price
  const originalPrice = discountPrice && discountPrice < price ? price : null
  const discountPercent =
    originalPrice && originalPrice > 0
      ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
      : product.discountPercent || null

  const mainImage = image || (images && images[0]) || 'https://via.placeholder.com/250x250?text=Flipkart+Product'
  const inStock = stock === undefined ? (countInStock === undefined || countInStock > 0) : stock > 0

  const handleClick = () => navigate(`/products/${_id}`)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    if (!token) {
      toast.info('Please login to add items to cart')
      navigate('/login')
      return
    }
    dispatch(addToCart({ productId: _id, quantity: 1 }))
      .unwrap()
      .then(() => toast.success(`"${name}" added to cart! 🛒`))
      .catch((err) => toast.error(err || 'Failed to add to cart'))
  }

  const handleWishlist = (e) => {
    e.stopPropagation()
    if (!token) {
      toast.info('Please login to add to wishlist')
      navigate('/login')
      return
    }
    dispatch(addToWishlist(_id))
      .unwrap()
      .then(() => toast.success('Added to wishlist! ❤️'))
      .catch((err) => toast.error(err || 'Failed to add to wishlist'))
  }

  return (
    <div className="product-card" onClick={handleClick} role="button" tabIndex={0}>
      {/* Discount badge */}
      {discountPercent && discountPercent > 0 && (
        <span className="product-card-badge">{discountPercent}% OFF</span>
      )}

      {/* Wishlist Heart Button Top Right */}
      <button
        className="wishlist-heart-btn"
        onClick={handleWishlist}
        title="Add to Wishlist"
      >
        ❤️
      </button>

      {/* Image */}
      <div className="product-card-image-wrapper">
        <img
          className="product-card-image"
          src={mainImage}
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/250x250?text=Flipkart+Product'
          }}
        />
        {!inStock && <div className="product-card-oos">OUT OF STOCK</div>}
      </div>

      {/* Body */}
      <div className="product-card-body">
        {brand && <div className="product-card-brand">{brand}</div>}
        <div className="product-card-name" title={name}>{name}</div>

        {/* Rating */}
        <div className="product-card-rating">
          <span className="product-card-rating-badge">
            {rating ? rating.toFixed(1) : '4.2'} ★
          </span>
          <span className="product-card-rating-count">
            ({numReviews ? numReviews.toLocaleString() : '100+'})
          </span>
        </div>

        {/* Price */}
        <div className="product-card-price">
          <span className="price-final">{formatPrice(displayPrice)}</span>
          {originalPrice && (
            <span className="price-original">{formatPrice(originalPrice)}</span>
          )}
          {discountPercent && discountPercent > 0 && (
            <span className="price-discount">{discountPercent}% off</span>
          )}
        </div>

        <div className="product-card-delivery">🚚 Free delivery</div>

        {/* Direct Add to Cart Button */}
        <button
          className="product-card-add-btn"
          onClick={handleAddToCart}
          disabled={!inStock}
        >
          🛒 ADD TO CART
        </button>
      </div>
    </div>
  )
}

export default ProductCard
