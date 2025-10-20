import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { verifyMfa } from '../auth/MockApi';

export default function Mfa() {
  const { user, tempLoginToken, accessToken, finalizeMfa } = useAuth();
  const nav = useNavigate();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const otpRef = useRef(null);

  useEffect(() => {
    if (!tempLoginToken && !accessToken) {
      nav('/login', { replace: true });
    }
  }, [tempLoginToken, accessToken, nav]);

  useEffect(() => {
    otpRef.current?.focus();
  }, []);

  useEffect(() => {
    if (otp.length === 6 && !loading) handleSubmit();
  }, [otp]);

  async function handleSubmit() {
    if (loading) return;
    setError('');

    if (otp.length < 6) {
      setError('Enter the 6-digit code.');
      otpRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      const { accessToken: finalToken } = await verifyMfa({
        otp,
        tempLoginToken,
      });

      finalizeMfa(finalToken);
      nav('/app', { replace: true });
    } catch (err) {
      setOtp('');
      setError(err?.message || 'Verification failed');
      otpRef.current?.focus();
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    handleSubmit();
  }

  return (
    <div className='container'>
      <h1>Enter the OTP</h1>
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor='otp'>OTP</label>
        <input
          id='otp'
          ref={otpRef}
          type='text'
          value={otp}
          onChange={(e) => {
            setError('');
            const v = e.target.value.replace(/\D/g, '');
            if (v.length <= 6) setOtp(v);
          }}
          placeholder='123456'
          maxLength={6}
          inputMode='numeric'
          autoComplete='one-time-code'
        />

        {error && (
          <div className='error' role='alert' aria-live='assertive'>
            {error}
          </div>
        )}

        <button type='submit' disabled={loading} aria-disabled={loading}>
          {loading ? 'Verifying…' : 'Verify'}
        </button>

        <p style={{ marginTop: 12, opacity: 0.8 }}>
          Demo OTP: <code>123456</code>
        </p>
      </form>
    </div>
  );
}
