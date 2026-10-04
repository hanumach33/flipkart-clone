import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// ─── Async Thunks ───────────────────────────────────────────────────────────

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/cart')
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch cart.'
      )
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/cart', { productId, quantity })
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to add item to cart.'
      )
    }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/cart/${itemId}`, { quantity })
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update cart item.'
      )
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/cart/${itemId}`)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to remove item from cart.'
      )
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/cart/clear')
      return []
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to clear cart.'
      )
    }
  }
)

// ─── Slice ───────────────────────────────────────────────────────────────────

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCartError: (state) => {
      state.error = null
    },
    // Local-only add (for guest users)
    addItemLocally: (state, action) => {
      const { product, quantity } = action.payload
      const existing = state.cartItems.find(
        (item) => item.product._id === product._id
      )
      if (existing) {
        existing.quantity += quantity
      } else {
        state.cartItems.push({ product, quantity })
      }
    },
    removeItemLocally: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.product._id !== action.payload
      )
    },
    resetCart: (state) => {
      state.cartItems = []
    },
  },
  extraReducers: (builder) => {
    const setLoading = (state) => { state.loading = true; state.error = null }
    const setError = (state, action) => { state.loading = false; state.error = action.payload }
    const setItems = (state, action) => {
      state.loading = false
      state.cartItems = action.payload.items || action.payload || []
    }

    builder
      .addCase(fetchCart.pending, setLoading)
      .addCase(fetchCart.fulfilled, setItems)
      .addCase(fetchCart.rejected, setError)

      .addCase(addToCart.pending, setLoading)
      .addCase(addToCart.fulfilled, setItems)
      .addCase(addToCart.rejected, setError)

      .addCase(updateCartItem.pending, setLoading)
      .addCase(updateCartItem.fulfilled, setItems)
      .addCase(updateCartItem.rejected, setError)

      .addCase(removeFromCart.pending, setLoading)
      .addCase(removeFromCart.fulfilled, setItems)
      .addCase(removeFromCart.rejected, setError)

      .addCase(clearCart.pending, setLoading)
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false
        state.cartItems = []
      })
      .addCase(clearCart.rejected, setError)
  },
})

export const { clearCartError, addItemLocally, removeItemLocally, resetCart } = cartSlice.actions
export default cartSlice.reducer
