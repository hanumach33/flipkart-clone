import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, fetchCategories } from '../redux/slices/productSlice'
import ProductCard from '../components/ProductCard/ProductCard'
import Loader from '../components/Loader/Loader'

const SORT_OPTIONS = [
  { label: 'Relevance', value: '' },
  { label: 'Price — Low to High', value: 'price_asc' },
  { label: 'Price — High to Low', value: 'price_desc' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Newest First', value: 'newest' },
]

const RATING_OPTIONS = [4, 3, 2, 1]

const ProductListPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const { products, categories, loading, pages, total } = useSelector((state) => state.products)

  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get('category') ? [searchParams.get('category')] : []
  )
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [selectedRating, setSelectedRating] = useState('')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '')
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1)

  const searchQuery = searchParams.get('search') || ''

  const fetchWithFilters = useCallback(() => {
    const params = {
      page: currentPage,
      limit: 20,
    }
    if (selectedCategories.length > 0) params.category = selectedCategories.join(',')
    if (searchQuery) params.search = searchQuery
    if (sortBy) params.sort = sortBy
    if (priceRange.min) params.minPrice = priceRange.min
    if (priceRange.max) params.maxPrice = priceRange.max
    if (selectedRating) params.minRating = selectedRating
    dispatch(fetchProducts(params))
  }, [dispatch, currentPage, selectedCategories, searchQuery, sortBy, priceRange, selectedRating])

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    fetchWithFilters()
  }, [fetchWithFilters])

  const toggleCategory = (cat) => {
    setCurrentPage(1)
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const handleSort = (val) => {
    setSortBy(val)
    setCurrentPage(1)
  }

  const handleClear = () => {
    setSelectedCategories([])
    setPriceRange({ min: '', max: '' })
    setSelectedRating('')
    setSortBy('')
    setCurrentPage(1)
  }

  const allCategories = categories.length > 0
    ? categories
    : ['Electronics', 'Fashion', 'Home', 'Appliances', 'Sports', 'Books', 'Beauty', 'Toys', 'Grocery', 'Mobiles']

  const sidebarStyle = {
    width: '240px',
    flexShrink: 0,
    background: '#fff',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    padding: '16px',
    height: 'fit-content',
    position: 'sticky',
    top: '80px',
  }

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '16px' }}>
        {/* Search heading */}
        {searchQuery && (
          <div style={{ background: '#fff', padding: '12px 16px', marginBottom: '8px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <span style={{ color: '#878787', fontSize: '14px' }}>
              Search results for{' '}
              <strong style={{ color: '#212121' }}>"{searchQuery}"</strong>
              {' '}— {total} results
            </span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          {/* ── Sidebar Filters ── */}
          <div style={sidebarStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#212121' }}>Filters</h3>
              <button
                onClick={handleClear}
                style={{ color: '#2874f0', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
              >
                CLEAR ALL
              </button>
            </div>

            {/* Categories */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#212121', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Category
              </h4>
              {allCategories.map((cat) => {
                const catStr = typeof cat === 'object' ? cat.name || cat._id : cat
                return (
                  <label
                    key={catStr}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer' }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(catStr)}
                      onChange={() => toggleCategory(catStr)}
                      style={{ accentColor: '#2874f0', width: '15px', height: '15px' }}
                    />
                    <span style={{ fontSize: '13px', color: '#212121' }}>{catStr}</span>
                  </label>
                )
              })}
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: '20px', borderTop: '1px solid #e0e0e0', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#212121', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Price Range
              </h4>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  style={{ width: '80px', padding: '6px 8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '13px' }}
                />
                <span style={{ color: '#878787' }}>—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  style={{ width: '80px', padding: '6px 8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '13px' }}
                />
              </div>
              <button
                onClick={fetchWithFilters}
                style={{ marginTop: '10px', padding: '6px 16px', background: '#2874f0', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
              >
                Apply
              </button>
            </div>

            {/* Customer Rating */}
            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#212121', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Customer Rating
              </h4>
              {RATING_OPTIONS.map((r) => (
                <label
                  key={r}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer' }}
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={selectedRating === String(r)}
                    onChange={() => { setSelectedRating(String(r)); setCurrentPage(1) }}
                    style={{ accentColor: '#2874f0' }}
                  />
                  <span style={{ fontSize: '13px', color: '#212121' }}>
                    {'★'.repeat(r)}{'☆'.repeat(5 - r)} & above
                  </span>
                </label>
              ))}
              {selectedRating && (
                <button
                  onClick={() => setSelectedRating('')}
                  style={{ color: '#2874f0', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}
                >
                  Clear rating
                </button>
              )}
            </div>
          </div>

          {/* ── Product Grid ── */}
          <div style={{ flex: 1 }}>
            {/* Sort bar */}
            <div style={{
              background: '#fff',
              padding: '12px 16px',
              borderRadius: '4px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              overflowX: 'auto',
            }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#212121', whiteSpace: 'nowrap' }}>Sort By</span>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSort(opt.value)}
                  style={{
                    padding: '6px 0',
                    background: 'none',
                    border: 'none',
                    borderBottom: sortBy === opt.value ? '2px solid #2874f0' : '2px solid transparent',
                    color: sortBy === opt.value ? '#2874f0' : '#878787',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: sortBy === opt.value ? '700' : '400',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {loading ? (
              <Loader />
            ) : products.length === 0 ? (
              <div style={{
                background: '#fff',
                borderRadius: '4px',
                padding: '60px 20px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>🔍</div>
                <h2 style={{ color: '#212121', marginBottom: '8px' }}>No products found</h2>
                <p style={{ color: '#878787' }}>Try adjusting your filters or search terms</p>
                <button
                  onClick={handleClear}
                  style={{ marginTop: '16px', padding: '10px 24px', background: '#2874f0', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '8px',
                }}>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '24px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        background: '#fff',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        opacity: currentPage === 1 ? 0.5 : 1,
                      }}
                    >
                      ‹ Prev
                    </button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        style={{
                          padding: '8px 14px',
                          border: page === currentPage ? '1px solid #2874f0' : '1px solid #e0e0e0',
                          borderRadius: '4px',
                          background: page === currentPage ? '#2874f0' : '#fff',
                          color: page === currentPage ? '#fff' : '#212121',
                          cursor: 'pointer',
                          fontWeight: page === currentPage ? '700' : '400',
                        }}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(pages, p + 1))}
                      disabled={currentPage === pages}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        background: '#fff',
                        cursor: currentPage === pages ? 'not-allowed' : 'pointer',
                        opacity: currentPage === pages ? 0.5 : 1,
                      }}
                    >
                      Next ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListPage
