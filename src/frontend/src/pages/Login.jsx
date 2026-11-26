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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    const result = login(email, password, role, remember)
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

      {error && (
        <p role="alert" className="step-auth-alert">
          {error}
        </p>
      )}

      <form onSubmit={submit} className="step-auth-form">
        <label className="step-field">
          <span>School email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@cit.edu"
            required
            autoComplete="email"
          />
        </label>

        <label className="step-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
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