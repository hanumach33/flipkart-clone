import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'
import './Header.css'

const NAV_LINKS = [
  { label: 'Electronics', icon: '📱', to: '/products?category=Electronics' },
  { label: 'TVs & Appliances', icon: '📺', to: '/products?category=Appliances' },
  { label: 'Fashion', icon: '👗', to: '/products?category=Fashion' },
  { label: 'Beauty', icon: '💄', to: '/products?category=Beauty' },
  { label: 'Home & Furniture', icon: '🛋️', to: '/products?category=Home' },
  { label: 'Grocery', icon: '🛒', to: '/products?category=Grocery' },
  { label: 'Sports', icon: '⚽', to: '/products?category=Sports' },
  { label: 'Books', icon: '📚', to: '/products?category=Books' },
  { label: 'Toys', icon: '🧸', to: '/products?category=Toys' },
]

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.cart)
  const { wishlistItems } = useSelector((state) => state.wishlist)

  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)
  const wishlistCount = wishlistItems.length

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    setShowDropdown(false)
    navigate('/')
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="header">
      {/* ── Top Row ── */}
      <div className="header-top">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <div className="header-logo-name">
            Flipkart<span>★</span>
          </div>
          <div className="header-logo-plus">
            <span className="header-logo-plus-icon">✦</span>
            Explore&nbsp;<em>Plus</em>
          </div>
        </Link>

        {/* Search bar */}
        <form className="header-search" onSubmit={handleSearch}>
          <input
            className="header-search-input"
            type="text"
            placeholder="Search for products, brands and more"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="header-search-btn" type="submit" aria-label="Search">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
          </button>
        </form>

        {/* Actions */}
        <div className="header-actions">
          {token && user ? (
            // ── Logged in ──
            <div className="header-dropdown" ref={dropdownRef}>
              <button
                className="header-btn"
                onClick={() => setShowDropdown((v) => !v)}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
                <span>{user.name?.split(' ')[0] || 'Account'}</span>
                <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>
              {showDropdown && (
                <div className="header-dropdown-menu">
                  <Link
                    to="/orders"
                    className="header-dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    📦 My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="header-dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    ❤️ Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                  </Link>
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      className="header-dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      ⚙️ Admin Panel
                    </Link>
                  )}
                  <div className="header-dropdown-divider" />
                  <button
                    className="header-dropdown-item danger"
                    onClick={handleLogout}
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '10px 16px' }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // ── Guest ──
            <Link to="/login" className="header-btn header-btn-login">
              Login
            </Link>
          )}

          {/* Wishlist */}
          <Link to="/wishlist" className="header-btn" title="Wishlist">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishlistCount > 0 && (
              <span className="header-cart-count">{wishlistCount}</span>
            )}
            <span className="hide-mobile">Wishlist</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="header-btn" title="Cart">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className="header-cart-count">{cartCount}</span>
            )}
            <span className="hide-mobile">Cart</span>
          </Link>
        </div>
      </div>

      {/* ── Bottom Nav ── */}
      <nav className="header-bottom">
        <div className="header-bottom-inner">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.to} className="header-nav-item">
              <span className="nav-icon">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
          <Link to="/products?sale=true" className="header-nav-item sale">
            <span className="nav-icon">🔥</span>
            <span>Sale</span>
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Header
