import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute() {
  const { accessToken } = useAuth();
  if (!accessToken) return <Navigate to='/login' replace />;
  return <Outlet />;
}
