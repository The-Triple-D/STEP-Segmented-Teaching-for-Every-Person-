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
  const [error, setError] = useState('')

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function submit(e) {
    e.preventDefault()
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    const result = register({ ...form, role })
    if (!result.ok) return setError(result.error)
    navigate('/courses')
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
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={update}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
        </label>

        <label className="step-field">
          <span>Confirm password</span>
          <input
            name="confirm"
            type="password"
            value={form.confirm}
            onChange={update}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
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