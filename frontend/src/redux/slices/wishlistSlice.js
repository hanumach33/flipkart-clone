import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// ─── Async Thunks ───────────────────────────────────────────────────────────

// Wishlist lives under /auth routes (tied to user profile)
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/wishlist')
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch wishlist.'
      )
    }
  }
)

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/auth/wishlist/${productId}`)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to add to wishlist.'
      )
    }
  }
)

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/auth/wishlist/${productId}`)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to remove from wishlist.'
      )
    }
  }
)

// ─── Slice ───────────────────────────────────────────────────────────────────

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlistItems: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlistError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    const setLoading = (state) => { state.loading = true; state.error = null }
    const setError = (state, action) => { state.loading = false; state.error = action.payload }
    const setItems = (state, action) => {
      state.loading = false
      const payload = action.payload
      // Backend returns { success: true, data: [...] } or just an array
      const items = payload?.data || payload
      state.wishlistItems = Array.isArray(items) ? items : []
    }

    builder
      .addCase(fetchWishlist.pending, setLoading)
      .addCase(fetchWishlist.fulfilled, setItems)
      .addCase(fetchWishlist.rejected, setError)

      .addCase(addToWishlist.pending, setLoading)
      .addCase(addToWishlist.fulfilled, setItems)
      .addCase(addToWishlist.rejected, setError)

      .addCase(removeFromWishlist.pending, setLoading)
      .addCase(removeFromWishlist.fulfilled, setItems)
      .addCase(removeFromWishlist.rejected, setError)
  },
})

export const { clearWishlistError } = wishlistSlice.actions
export default wishlistSlice.reducer
