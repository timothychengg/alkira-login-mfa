import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOtp } from '../auth/mockApi.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Mfa() {
  const nav = useNavigate();
  const { tempLoginToken, signIn } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!tempLoginToken) {
    return (
      <div className='container'>
        <h1>MFA</h1>
        <div className='error' role='alert'>
          Session expired. Please log in again.
        </div>
        <div className='actions'>
          <button onClick={() => nav('/login')}>Back to login</button>
        </div>
      </div>
    );
  }

  async function onVerify(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user, accessToken } = await verifyOtp(tempLoginToken, code);
      signIn(user, accessToken);
      nav('/app');
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='container'>
      <h1>Enter 6-digit code</h1>
      <form onSubmit={onVerify}>
        <label htmlFor='otp'>One Time Code</label>
        <input
          id='otp'
          aria-label='One Time Code'
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder='123456'
        />
        {error && (
          <div className='error' role='alert'>
            {error}
          </div>
        )}
        <div className='actions'>
          <button disabled={loading}>
            {loading ? 'Verifying…' : 'Verify'}
          </button>
        </div>
      </form>
      <p className='note' style={{ marginTop: 12 }}>
        Demo OTP: <code>123456</code>
      </p>
    </div>
  );
}
