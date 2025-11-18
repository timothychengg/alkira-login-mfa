import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import TextField from '../components/TextField'
import { emailSchema, passwordSchema } from '../utils/validators'
import { useAuth } from '../state/AuthContext'

export default function Login() {
  const nav = useNavigate()
  const loc = useLocation()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // If redirected from signup, prefill email
    const st = loc.state?.prefillEmail
    if (st) setEmail(st)
  }, [loc.state])

  async function handleSubmit(e) {
    e.preventDefault()
    const res = emailSchema.safeParse(email)
    const pw = passwordSchema.safeParse(password)
    const newErrors = {}
    if (!res.success) newErrors.email = res.error.issues[0].message
    if (!pw.success) newErrors.password = pw.error.issues[0].message
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return

    try {
      setLoading(true)
      const r = await signIn(email, password)
      if (r.requiresMfa) {
        nav('/mfa', { state: { from: loc.state?.from } })
      } else {
        nav(loc.state?.from?.pathname ?? '/app')
      }
    } catch (err) {
      setErrors({ form: err.message || 'Login failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 card">
      <h1 className="text-xl font-semibold mb-4">Welcome back</h1>
      <p className="helper mb-6">Use <strong>email</strong> and <strong>password</strong> to sign in. You will be asked for MFA.</p>
      {errors.form && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">{errors.form}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField label="Email" name="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" error={errors.email} />
        <TextField label="Password" name="password" value={password} onChange={setPassword} placeholder="••••••••" type="password" autoComplete="current-password" error={errors.password} />
        <button className="button w-full" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p className="mt-4 text-sm">No account? <Link className="link" to="/signup">Sign up</Link></p>
    </div>
  )
}
