import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('readonly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    
    navigate('/login');
    setLoading(false);
  }

  return (
    <div className='center-layout'>
      <div className='hero-pane'>
        <div className='auth-card'>
          <div className='card-accent' />
          <div className='card-header'>
            <p className='eyebrow'>Create Alkira access</p>
            <h1>Launch your demo identity</h1>
            <p className='subtitle'>
              Configure your role so the dashboard can showcase RBAC-aware UI
              states.
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
              placeholder='Password (min 6 characters)'
              autoComplete='new-password'
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              className='input-field'
              type='password'
              value={confirmPassword}
              placeholder='Confirm password'
              autoComplete='new-password'
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <select
              className='select-field'
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value='readonly'>Read-only</option>
              <option value='readwrite'>Read/Write</option>
            </select>

            <button className='primary-btn' type='submit' disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className='inline-actions'>
            <p className='muted-text'>Already registered?</p>
            <Link to='/login'>Return to sign in</Link>
          </div>
        </div>

        <div className='info-card'>
          <div className='card-accent' />
          <div className='card-header'>
            <p className='eyebrow'>Role guidance</p>
            <h2>Choose the right access</h2>
            <p className='subtitle'>
              Your role controls what you can do once the MFA challenge is
              complete.
            </p>
          </div>
          <div className='badge'>
            <span aria-hidden='true'>🛡️</span> RBAC preview
          </div>
          <ul className='list-muted'>
            <li>Read-only: observe status without any write actions.</li>
            <li>Read/Write: unlocks simulated write operations in the dashboard.</li>
            <li>All users experience the MFA gate to mirror enterprise policy.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
