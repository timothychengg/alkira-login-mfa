import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
  validateEmail,
  validatePassword,
  getPasswordError,
} from '../auth/validators';
import { login } from '../auth/MockApi';

export default function Login() {
  const { beginLogin } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) return setError('Enter a valid email address.');
    if (!validatePassword(pw)) return setError(getPasswordError(pw));

    setLoading(true);
    try {
      const { tempLoginToken } = await login(email, pw);

      beginLogin({ email }, tempLoginToken);
      nav('/mfa');
    } catch (err) {
      setError(err?.message || 'Login failed');
      setEmail('');
      setPw('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='container'>
      <h1>Login</h1>
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor='email'>Email</label>
        <input
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='address@domain.com'
          type='email'
          autoComplete='email'
          required
        />

        <label htmlFor='pw'>Password</label>
        <input
          id='pw'
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          type='password'
          placeholder='••••••••'
          autoComplete='current-password'
          required
        />

        {error && (
          <div className='error' role='alert' aria-live='assertive'>
            {error}
          </div>
        )}

        <button type='submit' disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: 16, textAlign: 'center' }}>
        Don’t have an account?{' '}
        <Link to='/signup' style={{ textDecoration: 'underline' }}>
          Sign up
        </Link>
      </p>
    </div>
  );
}
