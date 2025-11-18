import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '../components/TextField';
import { emailSchema, passwordSchema } from '../utils/validators';
import { useAuth } from '../state/AuthContext';

export default function Signup() {
  const { signUp } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'readOnly' | 'readWrite'>('readOnly');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = emailSchema.safeParse(email);
    const pw = passwordSchema.safeParse(password);
    const newErrors: typeof errors = {};
    if (!res.success) newErrors.email = res.error.issues[0].message;
    if (!pw.success) newErrors.password = pw.error.issues[0].message;
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      setLoading(true);
      await signUp(email, password, role);
      nav('/login', { state: { prefillEmail: email } });
    } catch (err: any) {
      setErrors({ form: err.message || 'Sign up failed' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='max-w-md mx-auto mt-10 card'>
      <h1 className='text-xl font-semibold mb-4'>Create your account</h1>
      <p className='helper mb-6'>Pick a role to demo access control.</p>
      {errors.form && (
        <div className='mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800'>
          {errors.form}
        </div>
      )}
      <form onSubmit={handleSubmit} className='space-y-4'>
        <TextField
          label='Email'
          name='email'
          value={email}
          onChange={setEmail}
          placeholder='you@example.com'
          autoComplete='email'
          error={errors.email}
        />
        <TextField
          label='Password'
          name='password'
          value={password}
          onChange={setPassword}
          placeholder='Min 8 chars, 1 upper, 1 lower, 1 number'
          type='password'
          autoComplete='new-password'
          error={errors.password}
        />
        <div>
          <label className='label'>Role</label>
          <div className='flex gap-3'>
            <label className='badge cursor-pointer'>
              <input
                className='mr-2'
                type='radio'
                name='role'
                value='readOnly'
                checked={role === 'readOnly'}
                onChange={() => setRole('readOnly')}
              />
              readOnly
            </label>
            <label className='badge cursor-pointer'>
              <input
                className='mr-2'
                type='radio'
                name='role'
                value='readWrite'
                checked={role === 'readWrite'}
                onChange={() => setRole('readWrite')}
              />
              readWrite
            </label>
          </div>
        </div>
        <button className='button w-full' disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <p className='mt-4 text-sm'>
        Already have an account?{' '}
        <Link className='link' to='/login'>
          Sign in
        </Link>
      </p>
    </div>
  );
}
