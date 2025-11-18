import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MFAPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { session, isMfaVerified, setIsMfaVerified } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/login');
    } else if (isMfaVerified) {
      navigate('/dashboard');
    }
  }, [session, isMfaVerified, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!code) {
      setError('MFA code is required');
      return;
    }

    if (code.length !== 6) {
      setError('MFA code must be 6 digits');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (code === '123456') {
        setIsMfaVerified(true);
        navigate('/dashboard');
      } else {
        setError('Invalid MFA code. Try again. (123456 for demo)');
      }
      setLoading(false);
    }, 1000);
  }

  return (
    <div className='center-layout'>
      <div className='hero-pane'>
        <div className='auth-card'>
          <div className='card-accent' />
          <div className='card-header'>
            <p className='eyebrow'>Step 2 of 2</p>
            <h1>MFA verification</h1>
            <p className='subtitle'>Complete the challenge to unlock your dashboard.</p>
          </div>

          {error && <div className='alert error'>{error}</div>}

          <form className='form-stack' onSubmit={handleSubmit}>
            <input
              className='input-field'
              type='text'
              inputMode='numeric'
              maxLength={6}
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setCode(value);
              }}
              placeholder='Enter 6-digit code'
            />
            <button className='primary-btn' type='submit' disabled={loading}>
              {loading ? 'Verifying...' : 'Verify and continue'}
            </button>
          </form>

          <p className='helper-text'>
            Stuck? Use the demo code below to proceed.
          </p>
          <div className='code-pill'>123456</div>
        </div>

        <div className='info-card'>
          <div className='card-accent' />
          <div className='card-header'>
            <p className='eyebrow'>Security context</p>
            <h2>Why MFA matters</h2>
            <p className='subtitle'>
              Alkira applies multi-factor authentication to secure access across the
              cloud networking fabric.
            </p>
          </div>
          <ul className='list-muted'>
            <li>Protects privileged actions in the dashboard.</li>
            <li>Mirrors enterprise sign-in flows for production readiness.</li>
            <li>Keeps sessions resilient to credential-based attacks.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
