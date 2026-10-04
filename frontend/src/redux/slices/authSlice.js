import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Load persisted user/token from localStorage
const storedToken = localStorage.getItem('token') || null
const storedUser = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null

// ─── Async Thunks ───────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      const user = data.data || data          // handle { success, data } envelope
      localStorage.setItem('token', user.token)
      localStorage.setItem('user', JSON.stringify(user))
      return user
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Login failed. Please try again.'
      )
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      const user = data.data || data
      localStorage.setItem('token', user.token)
      localStorage.setItem('user', JSON.stringify(user))
      return user
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Registration failed. Please try again.'
      )
    }
  }
)

export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/profile')
      const user = data.data || data
      localStorage.setItem('user', JSON.stringify(user))
      return user
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch profile.'
      )
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/auth/profile', profileData)
      const user = data.data || data
      localStorage.setItem('user', JSON.stringify(user))
      return user
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Profile update failed.'
      )
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
})

// ─── Slice ───────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser,
    token: storedToken,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // loginUser
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.token = action.payload.token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // registerUser
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.token = action.payload.token
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // getUserProfile
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // updateProfile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null
      state.token = null
      state.loading = false
      state.error = null
    })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
