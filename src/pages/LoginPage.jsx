import React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    console.log('Login successful');
    navigate('/mfa');

    setLoading(false);
  }
  return (
    <div className='center-layout'>
      <div className='hero-pane'>
        <div className='auth-card'>
          <div className='card-accent' />
          <div className='card-header'>
            <p className='eyebrow'>Alkira secure edge</p>
            <h1>Welcome back</h1>
            <p className='subtitle'>
              Sign in to manage your Alkira network fabric and MFA policies.
            </p>
          </div>

          {error && <div className='alert error'>{error}</div>}

          <form className='form-stack' onSubmit={handleSubmit}>
            <input
              className='input-field'
              type='email'
              value={email}
              placeholder='Work email'
              autoComplete='email'
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className='input-field'
              type='password'
              value={password}
              placeholder='Password'
              autoComplete='current-password'
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className='primary-btn' type='submit' disabled={loading}>
              {loading ? 'Logging in...' : 'Continue to MFA'}
            </button>
          </form>

          <p className='helper-text'>
            No account yet? <Link to='/signup'>Create an Alkira identity</Link>.
          </p>
        </div>

        <div className='info-card'>
          <div className='card-accent' />
          <div className='card-header'>
            <p className='eyebrow'>Session safeguards</p>
            <h2>What to expect</h2>
            <p className='subtitle'>
              MFA is required for every login to mirror Alkira production security
              posture.
            </p>
          </div>
          <ul className='list-muted'>
            <li>Use your demo credentials to authenticate.</li>
            <li>We’ll route you to MFA verification immediately after login.</li>
            <li>Roles are honored in the dashboard to show RBAC differences.</li>
          </ul>
          <div className='code-pill'>MFA demo code: 123456</div>
        </div>
      </div>
    </div>
  );
}
