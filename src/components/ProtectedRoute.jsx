import React from 'react';

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { session, isMfaVerified, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!session) {
    return <Navigate to='/login' replace />;
  }
  if (!isMfaVerified) {
    return <Navigate to='/mfa' replace />;
  }
  return children;
}
