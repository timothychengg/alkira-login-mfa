import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function ProtectedRoute() {
  const { user, accessToken } = useAuth();
  if (!user || !accessToken) return <Navigate to='/login' replace />;
  return <Outlet />;
}
