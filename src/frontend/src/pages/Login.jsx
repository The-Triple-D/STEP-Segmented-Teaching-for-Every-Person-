import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/useAuth.js'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const role = params.get('role')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const justRegistered = Boolean(location.state?.registered)

  async function submit(e) {
    e.preventDefault()
    setError('')
    const result = await login(identifier, password, role, remember)
    if (!result.ok) return setError(result.error)
    navigate(location.state?.from || '/courses', { replace: true })
  }

  if (role !== 'student' && role !== 'instructor') {
    return <Navigate to="/" replace />
  }

  const label = role === 'student' ? 'Student' : 'Instructor'

  return (
    <AuthLayout expanded>
      <div className="step-auth-header">
        <h2 className="step-auth-heading">{label} Log in</h2>
      </div>

      {justRegistered && !error && (
        <p role="status" className="step-auth-status">
          Account created! Please log in to continue.
        </p>
      )}

      {error && (
        <p role="alert" className="step-auth-alert">
          {error}
        </p>
      )}

      <form onSubmit={submit} className="step-auth-form">
        <label className="step-field">
          <span>Email Address / ID Number</span>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="example@cit.edu or 12-3456-789"
            required
            autoComplete="username"
          />
        </label>

        <label className="step-field">
          <span>Password</span>
          <div className="step-password-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="step-password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-pressed={showPassword}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        <div className="step-auth-row">
          <label className="step-auth-check">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Keep me signed in</span>
          </label>
          <Link to="/forgot-password" className="step-auth-link">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="step-btn-primary">
          LOG IN
        </button>
      </form>

      <div className="step-auth-footer">
        <p>
          No account yet?{' '}
          <Link to={`/register?role=${role}`} className="step-auth-link">
            Register
          </Link>
        </p>
        <p>
          <Link to="/" className="step-auth-link step-auth-link--muted">
            ← Back
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}