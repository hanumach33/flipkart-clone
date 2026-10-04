import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PrivateRoute, { AdminRoute } from './components/PrivateRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';

import './styles/global.css';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Header />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <h2 style={{ fontSize: '2rem', color: '#878787' }}>404 — Page Not Found</h2>
                <a href="/" style={{ color: '#2874f0', textDecoration: 'none', fontSize: '1rem' }}>
                  ← Go to Homepage
                </a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
