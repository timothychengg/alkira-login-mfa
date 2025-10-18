import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../auth/mockApi.js';
import { validateEmail, validatePassword } from '../auth/validators.js';

export default function Signup() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) return setError('Enter a valid email.');
    if (!validatePassword(pw)) return setError('Password must be 8+ chars and include a number.');
    setLoading(true);

    try {
      await signup(email, pw);
      setOk(true);
      setTimeout(() => nav('/login'), 800);
    } catch (err) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='container'>
      <h1>Sign up</h1>
      {ok ? (
        <div className='note'>Account created! Redirecting to login…</div>
      ) : (
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
              {loading ? 'Creating…' : 'Create account'}
            </button>
            <Link className='link' to='/login'>
              Back to login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
