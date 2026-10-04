import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// ─── Async Thunks ───────────────────────────────────────────────────────────

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/orders', orderData)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to place order.'
      )
    }
  }
)

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/orders/my')
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch orders.'
      )
    }
  }
)

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/orders/${id}`)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch order.'
      )
    }
  }
)

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/orders', { params })
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch all orders.'
      )
    }
  }
)

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status })
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update order status.'
      )
    }
  }
)

// ─── Slice ───────────────────────────────────────────────────────────────────

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    order: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null
    },
    clearOrderSuccess: (state) => {
      state.success = false
    },
    clearOrder: (state) => {
      state.order = null
    },
  },
  extraReducers: (builder) => {
    // createOrder
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false
        state.order = action.payload
        state.success = true
        state.orders.unshift(action.payload)
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // fetchMyOrders
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // fetchOrderById
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false
        state.order = action.payload
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // fetchAllOrders (admin)
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload.orders || action.payload
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // updateOrderStatus
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false
        const idx = state.orders.findIndex((o) => o._id === action.payload._id)
        if (idx !== -1) state.orders[idx] = action.payload
        if (state.order?._id === action.payload._id) state.order = action.payload
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearOrderError, clearOrderSuccess, clearOrder } = orderSlice.actions
export default orderSlice.reducer
