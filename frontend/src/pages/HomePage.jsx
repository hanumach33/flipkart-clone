import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchProducts } from '../redux/slices/productSlice'
import Banner from '../components/Banner/Banner'
import ProductCard from '../components/ProductCard/ProductCard'
import Loader from '../components/Loader/Loader'

const CATEGORIES = [
  { label: 'Mobiles', icon: '📱', query: 'Mobiles' },
  { label: 'Fashion', icon: '👗', query: 'Fashion' },
  { label: 'Electronics', icon: '💻', query: 'Electronics' },
  { label: 'Home', icon: '🏠', query: 'Home' },
  { label: 'Appliances', icon: '🫙', query: 'Appliances' },
  { label: 'Beauty', icon: '💄', query: 'Beauty' },
  { label: 'Toys', icon: '🧸', query: 'Toys' },
  { label: 'Sports', icon: '⚽', query: 'Sports' },
  { label: 'Books', icon: '📚', query: 'Books' },
  { label: 'Grocery', icon: '🛒', query: 'Grocery' },
]

const HomePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { products, loading } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchProducts({ limit: 20 }))
  }, [dispatch])

  const electronics = products.filter(
    (p) => p.category?.toLowerCase().includes('electronic') ||
           p.category?.toLowerCase().includes('mobile') ||
           p.category?.toLowerCase().includes('laptop')
  ).slice(0, 8)

  const fashion = products.filter(
    (p) => p.category?.toLowerCase().includes('fashion') ||
           p.category?.toLowerCase().includes('clothing') ||
           p.category?.toLowerCase().includes('apparel')
  ).slice(0, 8)

  // Fallback: show all products if no category match
  const featuredProducts = electronics.length > 0 ? electronics : products.slice(0, 8)
  const trendingProducts = fashion.length > 0 ? fashion : products.slice(8, 20)

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
      {/* ── Banner ── */}
      <Banner />

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 16px' }}>
        {/* ── Category Icons ── */}
        <div style={{
          background: '#fff',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          padding: '20px 0 12px',
          margin: '16px 0',
        }}>
          <div style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '0',
            paddingBottom: '4px',
            scrollbarWidth: 'none',
          }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => navigate(`/products?category=${cat.query}`)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  minWidth: '90px',
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  flex: '1',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span style={{ fontSize: '36px', lineHeight: '1' }}>{cat.icon}</span>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#212121', textAlign: 'center' }}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {loading && <Loader />}

        {/* ── Featured Electronics Section ── */}
        {!loading && featuredProducts.length > 0 && (
          <div style={{
            background: '#fff',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#212121' }}>
                🔥 Top Deals on Electronics
              </h2>
              <button
                onClick={() => navigate('/products?category=Electronics')}
                style={{
                  padding: '8px 20px',
                  background: '#2874f0',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                }}
              >
                VIEW ALL
              </button>
            </div>
            {/* Horizontal scroll row */}
            <div style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              paddingBottom: '8px',
              scrollbarWidth: 'thin',
            }}>
              {featuredProducts.map((product) => (
                <div key={product._id} style={{ minWidth: '180px', maxWidth: '180px' }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Promotional Banners ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '16px',
        }}>
          {[
            { bg: '#e3f2fd', title: '🛡️ Flipkart Assured', sub: 'Quality Checked Products', icon: '✅' },
            { bg: '#fff8e1', title: '⚡ Same Day Delivery', sub: 'On 5,000+ products', icon: '🚀' },
            { bg: '#f3e5f5', title: '↩️ Easy Returns', sub: '7-day hassle-free returns', icon: '🎁' },
          ].map((promo) => (
            <div
              key={promo.title}
              style={{
                background: promo.bg,
                borderRadius: '4px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <span style={{ fontSize: '36px' }}>{promo.icon}</span>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#212121' }}>{promo.title}</div>
                <div style={{ fontSize: '12px', color: '#616161' }}>{promo.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Trending Fashion Section ── */}
        {!loading && trendingProducts.length > 0 && (
          <div style={{
            background: '#fff',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#212121' }}>
                👗 Trending Products
              </h2>
              <button
                onClick={() => navigate('/products')}
                style={{
                  padding: '8px 20px',
                  background: '#2874f0',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                }}
              >
                VIEW ALL
              </button>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '12px',
            }}>
              {trendingProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* ── No products placeholder ── */}
        {!loading && products.length === 0 && (
          <div style={{
            background: '#fff',
            borderRadius: '4px',
            padding: '60px 20px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            marginBottom: '16px',
          }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>🛍️</div>
            <h2 style={{ color: '#212121', marginBottom: '8px' }}>No products yet</h2>
            <p style={{ color: '#878787' }}>Products will appear here once added by admin.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
