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
    <div>
      <h1>MFA Verification</h1>
      <p>Please enter the MFA Demo Code: 123456</p>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          maxLength={6}
          value={code}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            setCode(value);
          }}
          placeholder='Enter MFA Code'
        ></input>
        <button type='submit' disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
}
