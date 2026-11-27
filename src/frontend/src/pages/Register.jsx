import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/useAuth.js'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const role = params.get('role')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    const result = await register({ ...form, role })
    if (!result.ok) return setError(result.error)
    navigate(`/login?role=${role}`, { replace: true, state: { registered: true } })
  }

  if (role !== 'student' && role !== 'instructor') {
    return <Navigate to="/" replace />
  }

  const label = role === 'student' ? 'Student' : 'Instructor'

  return (
    <AuthLayout expanded>
      <div className="step-auth-header">
        <h2 className="step-auth-heading">{label} Register</h2>
      </div>

      {error && (
        <p role="alert" className="step-auth-alert">
          {error}
        </p>
      )}

      <form onSubmit={submit} className="step-auth-form">
        <div className="step-field-row">
          <label className="step-field">
            <span>First name</span>
            <input
              name="firstName"
              value={form.firstName}
              onChange={update}
              required
              autoComplete="given-name"
            />
          </label>

          <label className="step-field">
            <span>Last name</span>
            <input
              name="lastName"
              value={form.lastName}
              onChange={update}
              required
              autoComplete="family-name"
            />
          </label>
        </div>

        <label className="step-field">
          <span>School email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={update}
            placeholder="example@cit.edu"
            required
            autoComplete="email"
          />
        </label>

        <label className="step-field">
          <span>Password (8+ characters)</span>
          <div className="step-password-wrap">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={update}
              placeholder="••••••••"
              required
              autoComplete="new-password"
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

        <label className="step-field">
          <span>Confirm password</span>
          <div className="step-password-wrap">
            <input
              name="confirm"
              type={showConfirm ? 'text' : 'password'}
              value={form.confirm}
              onChange={update}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="step-password-toggle"
              onClick={() => setShowConfirm((prev) => !prev)}
              aria-pressed={showConfirm}
              aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirm ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        <button type="submit" className="step-btn-primary">
          CREATE ACCOUNT
        </button>
      </form>

      <div className="step-auth-footer">
        <p>
          Already have an account?{' '}
          <Link to={`/login?role=${role}`} className="step-auth-link">
            Log in
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