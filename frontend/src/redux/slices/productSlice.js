import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// ─── Async Thunks ───────────────────────────────────────────────────────────

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products', { params })
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch products.'
      )
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch product.'
      )
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products/categories')
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch categories.'
      )
    }
  }
)

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/products', productData)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create product.'
      )
    }
  }
)

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/products/${id}`, productData)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update product.'
      )
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`)
      return id
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete product.'
      )
    }
  }
)

export const addReview = createAsyncThunk(
  'products/addReview',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/products/${productId}/reviews`, reviewData)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to submit review.'
      )
    }
  }
)

// ─── Slice ───────────────────────────────────────────────────────────────────

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    categories: [],
    loading: false,
    error: null,
    page: 1,
    pages: 1,
    total: 0,
  },
  reducers: {
    clearProductError: (state) => {
      state.error = null
    },
    clearProduct: (state) => {
      state.product = null
    },
  },
  extraReducers: (builder) => {
    // fetchProducts
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products || action.payload
        state.page = action.payload.page || 1
        state.pages = action.payload.pages || 1
        state.total = action.payload.total || (action.payload.products || action.payload).length
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // fetchProductById
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
        state.product = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.product = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // fetchCategories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // createProduct
    builder
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload)
        state.total += 1
      })

    // updateProduct
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      const idx = state.products.findIndex((p) => p._id === action.payload._id)
      if (idx !== -1) state.products[idx] = action.payload
      if (state.product?._id === action.payload._id) state.product = action.payload
    })

    // deleteProduct
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.products = state.products.filter((p) => p._id !== action.payload)
      state.total -= 1
    })

    // addReview
    builder.addCase(addReview.fulfilled, (state, action) => {
      state.product = action.payload
    })
  },
})

export const { clearProductError, clearProduct } = productSlice.actions
export default productSlice.reducer
