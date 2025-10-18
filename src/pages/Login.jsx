import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, sendOtp } from '../auth/mockApi.js';
import { validateEmail, validatePassword } from '../auth/validators.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Login() {
  const nav = useNavigate();
  const { setTempLoginToken } = useAuth();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();

    setError('');
    if (!validateEmail(email)) return setError('Enter a valid email.');
    if (!validatePassword(pw)) return setError('Password must be 8+ chars and include a number.');

    setLoading(true);
    try {
      const { tempLoginToken } = await login(email, pw);
      await sendOtp(tempLoginToken);
      setTempLoginToken(tempLoginToken);
      nav('/mfa');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='container'>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor='email'>Email</label>
        <input
          id='email'
          aria-label='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='address@domain.com'
        />
        <label htmlFor='pw'>Password</label>
        <input
          id='pw'
          aria-label='Password'
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          type='password'
          placeholder='••••••••'
        />
        {error && (
          <div role='alert' className='error'>
            {error}
          </div>
        )}
        <div className='actions'>
          <button disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <Link className='link' to='/signup'>
            Create account
          </Link>
        </div>
      </form>
      <p className='note' style={{ marginTop: 12 }}>
        Demo: reader@demo.com / writer@demo.com (Password1!)
      </p>
    </div>
  );
}
