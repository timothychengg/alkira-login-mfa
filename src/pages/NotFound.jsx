import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const nav = useNavigate();

  return (
    <div className='container'>
      <h1>404 - Page Not Found</h1>
      <p className='note' style={{ marginTop: 8 }}>
        The page you’re looking for doesn’t exist.
      </p>

      <div className='actions' style={{ marginTop: 16 }}>
        <button onClick={() => nav('/login')}>Go to Login</button>
      </div>
    </div>
  );
}
