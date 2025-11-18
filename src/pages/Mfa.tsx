import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TextField from '../components/TextField';
import { otpSchema } from '../utils/validators';
import { useAuth } from '../state/AuthContext';

export default function Mfa() {
  const nav = useNavigate();
  const { state } = useLocation();
  const { verifyMfaCode } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = otpSchema.safeParse(otp);
    if (!res.success) {
      setError(res.error.issues[0].message);
      return;
    }
    try {
      setLoading(true);
      await verifyMfaCode(otp);
      nav((state as any)?.from?.pathname ?? '/app');
    } catch (err: any) {
      setError(err.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex justify-center items-center min-h-[80vh]'>
      <div className='max-w-md w-full card text-center'>
        <h1 className='text-xl font-semibold mb-4'>
          Multi-Factor Authentication
        </h1>
        <p className='helper mb-6'>
          Enter the 6-digit code. Demo OTP is <code>123456</code>.
        </p>

        {error && (
          <div className='mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            ref={inputRef}
            name='otp'
            type='text'
            inputMode='numeric'
            maxLength={6}
            className='input text-center tracking-widest text-lg font-mono'
            placeholder='123456'
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit(e);
            }}
          />
          <button className='button w-full' disabled={loading}>
            {loading ? 'Verifying…' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  );
}
