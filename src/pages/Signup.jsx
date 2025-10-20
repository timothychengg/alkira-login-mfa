import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../auth/MockApi';
import {
  validateEmail,
  validatePassword,
  getPasswordError,
} from '../auth/validators';

export default function Signup() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      return setError('Enter a valid email address.');
    }
    if (!validatePassword(pw)) {
      return setError(getPasswordError(pw));
    }
    if (pw !== confirmPw) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      await signup(email, pw);
      setOk(true);
      setTimeout(() => nav('/login'), 800);
    } catch (err) {
      setError(err?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='container'>
      <h1>Create an Account</h1>

      {ok ? (
        <div className='note' role='status' aria-live='polite'>
          Account created! Redirecting to login…
        </div>
      ) : (
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
            placeholder='At least 8 chars, upper, lower, number, special'
            autoComplete='new-password'
            required
          />

          <label htmlFor='confirmPw'>Confirm Password</label>
          <input
            id='confirmPw'
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            type='password'
            placeholder='Re-enter password'
            autoComplete='new-password'
            required
          />

          {error && (
            <div className='error' role='alert' aria-live='assertive'>
              {error}
            </div>
          )}

          <button type='submit' disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>
      )}

      <p style={{ marginTop: 16, textAlign: 'center' }}>
        Already have an account?{' '}
        <Link to='/login' style={{ textDecoration: 'underline' }}>
          Log in
        </Link>
      </p>
    </div>
  );
}
