import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { registerUser, clearError } from '../redux/slices/authSlice'
import Loader from '../components/Loader/Loader'

const RegisterPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, token } = useSelector((state) => state.auth)

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (token) navigate('/', { replace: true })
  }, [token, navigate])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
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
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
    dispatch(registerUser({ name: form.name, email: form.email, password: form.password }))
      .unwrap()
      .then(() => {
        toast.success('Account created successfully! Welcome to Flipkart.')
        navigate('/')
      })
      .catch(() => {})
  }

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '12px 0',
    borderBottom: hasError ? '2px solid #f44336' : '2px solid #e0e0e0',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    outline: 'none',
    fontSize: '15px',
    color: '#212121',
    background: 'transparent',
    transition: 'border-color 0.2s',
  })

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
            <p style={{ fontSize: '18px', fontWeight: '500', color: '#fff' }}>
              Sign up
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginTop: '12px', lineHeight: '1.8' }}>
              Discover millions of products at unbeatable prices. Join crores of happy shoppers!
            </p>
          </div>
          <img
            src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/login_img_c4a81e.png"
            alt="Register"
            style={{ width: '100%', maxWidth: '200px', marginTop: '24px' }}
            onError={(e) => (e.target.style.display = 'none')}
          />
        </div>

        {/* ── Right Form ── */}
        <div style={{
          background: '#fff',
          padding: '32px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '20px', color: '#212121' }}>
            Create Account
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                name="name"
                placeholder="Enter Full Name"
                value={form.name}
                onChange={handleChange}
                style={inputStyle(!!errors.name)}
                onFocus={(e) => { if (!errors.name) e.target.style.borderBottomColor = '#2874f0' }}
                onBlur={(e) => { if (!errors.name) e.target.style.borderBottomColor = '#e0e0e0' }}
              />
              {errors.name && <p style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={form.email}
                onChange={handleChange}
                style={inputStyle(!!errors.email)}
                onFocus={(e) => { if (!errors.email) e.target.style.borderBottomColor = '#2874f0' }}
                onBlur={(e) => { if (!errors.email) e.target.style.borderBottomColor = '#e0e0e0' }}
              />
              {errors.email && <p style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create Password (min 6 chars)"
                  value={form.password}
                  onChange={handleChange}
                  style={{ ...inputStyle(!!errors.password), paddingRight: '60px' }}
                  onFocus={(e) => { if (!errors.password) e.target.style.borderBottomColor = '#2874f0' }}
                  onBlur={(e) => { if (!errors.password) e.target.style.borderBottomColor = '#e0e0e0' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#2874f0',
                    fontSize: '13px', fontWeight: '600',
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <p style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '20px' }}>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                style={inputStyle(!!errors.confirmPassword)}
                onFocus={(e) => { if (!errors.confirmPassword) e.target.style.borderBottomColor = '#2874f0' }}
                onBlur={(e) => { if (!errors.confirmPassword) e.target.style.borderBottomColor = '#e0e0e0' }}
              />
              {errors.confirmPassword && (
                <p style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>{errors.confirmPassword}</p>
              )}
            </div>

            <p style={{ fontSize: '12px', color: '#878787', marginBottom: '16px', lineHeight: '1.6' }}>
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
              {loading ? 'Creating Account...' : 'REGISTER'}
            </button>

            {/* Login link */}
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#212121' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#2874f0', fontWeight: '600' }}>
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
