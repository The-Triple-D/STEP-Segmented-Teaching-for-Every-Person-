import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/useAuth.js'

export default function ResetPassword() {
  const { token } = useParams()
  const { resetPassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirm) return setError('Passwords do not match.')
    const result = await resetPassword(token, password)
    if (!result.ok) return setError(result.error)
    setError('')
    setDone(true)
  }

  if (done) {
    return (
      <AuthLayout expanded>
        <div className="step-auth-header">
          <h2 className="step-auth-heading">Password Changed</h2>
        </div>

        <p role="status" className="step-auth-status">
          Your password has been updated.
        </p>

        <Link
          to="/"
          className="step-btn-primary"
          style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
        >
          BACK TO HOME
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout expanded>
      <div className="step-auth-header">
        <h2 className="step-auth-heading">Reset Password</h2>
      </div>

      {error && (
        <p role="alert" className="step-auth-alert">
          {error}
        </p>
      )}

      <form onSubmit={submit} className="step-auth-form">
        <label className="step-field">
          <span>New password (8+ characters)</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
        </label>

        <label className="step-field">
          <span>Confirm new password</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
        </label>

        <button type="submit" className="step-btn-primary">
          CHANGE PASSWORD
        </button>
      </form>

      <div className="step-auth-footer">
        <p>
          <Link to="/" className="step-auth-link step-auth-link--muted">
            Back
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}