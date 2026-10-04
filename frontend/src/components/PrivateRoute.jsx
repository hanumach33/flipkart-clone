import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ─── PrivateRoute ─────────────────────────────────────────────────────────────
// Redirects unauthenticated users to /login
const PrivateRoute = () => {
  const { token } = useSelector((state) => state.auth);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// ─── AdminRoute ───────────────────────────────────────────────────────────────
// Redirects non-admin users to /
export const AdminRoute = () => {
  const { token, user } = useSelector((state) => state.auth);
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
};

export default PrivateRoute;
