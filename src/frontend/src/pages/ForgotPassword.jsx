import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/useAuth.js'

export default function ForgotPassword() {
  const { requestReset } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await requestReset(email)
    setLoading(false)
    if (!result.ok) return setError(result.error)
    navigate('/reset-password', { state: { email: email.trim().toLowerCase() } })
  }

  return (
    <AuthLayout expanded>
      <div className="step-auth-header">
        <h2 className="step-auth-heading">Forgot Password</h2>
        <p
          style={{
            margin: '0.5rem 0 0 0',
            fontSize: '0.94rem',
            color: 'var(--page-text-muted)',
            lineHeight: 1.5,
          }}
        >
          Enter your school email and we&apos;ll send you a 6-digit verification code.
        </p>
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

        <button type="submit" className="step-btn-primary" disabled={loading}>
          {loading ? 'SENDING CODE...' : 'SEND 6-DIGIT CODE'}
        </button>
      </form>

      <div className="step-auth-footer">
        <p>
          Already have a code?{' '}
          <Link to="/reset-password" className="step-auth-link">
            Enter code
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