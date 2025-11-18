import React from 'react';

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { session, isMfaVerified, loading } = useAuth();

  if (loading) {
    return (
      <div className='center-layout'>
        <div className='auth-card'>
          <div className='card-accent' />
          <div className='card-header'>
            <p className='eyebrow'>Alkira secure access</p>
            <h2>Preparing your workspace</h2>
            <p className='subtitle'>
              Sit tight while we verify your latest authentication state.
            </p>
          </div>
          <div className='loading-indicator'>
            <span className='loading-dot' />
            <span className='loading-dot' />
            <span className='loading-dot' />
            <span>Loading</span>
          </div>
        </div>
      </div>
    );
  }
  if (!session) {
    return <Navigate to='/login' replace />;
  }
  if (!isMfaVerified) {
    return <Navigate to='/mfa' replace />;
  }
  return children;
}
