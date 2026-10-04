import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { loginUser, clearError } from '../redux/slices/authSlice'
import Loader from '../components/Loader/Loader'

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, token } = useSelector((state) => state.auth)

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  // Redirect if already logged in
  useEffect(() => {
    if (token) navigate('/', { replace: true })
  }, [token, navigate])

  // Show server errors via toast
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const validate = () => {
    const newErrors = {}
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address'
    }
    if (!form.password) {
      newErrors.password = 'Password is required'
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    dispatch(loginUser({ email: form.email, password: form.password }))
      .unwrap()
      .then(() => {
        toast.success('Welcome back!')
        navigate('/')
      })
      .catch(() => {})
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 128px)',
      background: '#f1f3f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '750px',
        minHeight: '420px',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}>
        {/* ── Left Panel ── */}
        <div style={{
          background: 'linear-gradient(135deg, #1a237e 0%, #2874f0 100%)',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: '0 0 40%',
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '12px', fontStyle: 'italic' }}>
              Flipkart<span style={{ color: '#ffe500' }}>★</span>
            </h1>
            <p style={{ fontSize: '18px', fontWeight: '500', color: '#fff', lineHeight: '1.6' }}>
              Login
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginTop: '12px', lineHeight: '1.8' }}>
              Get access to your Orders, Wishlist and Recommendations
            </p>
          </div>
          <img
            src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/login_img_c4a81e.png"
            alt="Login"
            style={{ width: '100%', maxWidth: '200px', marginTop: '24px' }}
            onError={(e) => (e.target.style.display = 'none')}
          />
        </div>

        {/* ── Right Form ── */}
        <div style={{
          background: '#fff',
          padding: '40px 32px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '24px', color: '#212121' }}>
            Login
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={form.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  borderBottom: errors.email ? '2px solid #f44336' : '2px solid #e0e0e0',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  color: '#212121',
                  background: 'transparent',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { if (!errors.email) e.target.style.borderBottomColor = '#2874f0' }}
                onBlur={(e) => { if (!errors.email) e.target.style.borderBottomColor = '#e0e0e0' }}
              />
              {errors.email && (
                <p style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter Password"
                  value={form.password}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    paddingRight: '60px',
                    borderBottom: errors.password ? '2px solid #f44336' : '2px solid #e0e0e0',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    color: '#212121',
                    background: 'transparent',
                  }}
                  onFocus={(e) => { if (!errors.password) e.target.style.borderBottomColor = '#2874f0' }}
                  onBlur={(e) => { if (!errors.password) e.target.style.borderBottomColor = '#e0e0e0' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#2874f0',
                    fontSize: '13px',
                    fontWeight: '600',
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>{errors.password}</p>
              )}
            </div>

            <p style={{ fontSize: '12px', color: '#878787', marginBottom: '20px', lineHeight: '1.6' }}>
              By continuing, you agree to Flipkart's{' '}
              <span style={{ color: '#2874f0', cursor: 'pointer' }}>Terms of Use</span> and{' '}
              <span style={{ color: '#2874f0', cursor: 'pointer' }}>Privacy Policy</span>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: '#fb641b',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginBottom: '16px',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading ? <Loader size={20} /> : null}
              {loading ? 'Logging in...' : 'LOGIN'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
              <span style={{ color: '#878787', fontSize: '12px' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
            </div>

            {/* Phone button (UI only) */}
            <button
              type="button"
              style={{
                width: '100%',
                padding: '12px',
                background: 'transparent',
                color: '#2874f0',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '20px',
              }}
            >
              📱 Continue with Phone
            </button>

            {/* Register link */}
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#212121' }}>
              New to Flipkart?{' '}
              <Link to="/register" style={{ color: '#2874f0', fontWeight: '600' }}>
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
