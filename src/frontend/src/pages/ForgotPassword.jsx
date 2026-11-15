import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/useAuth.js'

export default function ForgotPassword() {
  const { requestReset } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [token, setToken] = useState(null)
  const [resent, setResent] = useState(false)

  function submit(e) {
    e.preventDefault()
    const result = requestReset(email)
    setToken(result?.token || null)
    setSent(true)
    setResent(false)
  }

  function handleResend() {
    const result = requestReset(email)
    setToken(result?.token || null)
    setResent(true)
  }

  return (
    <AuthLayout expanded>
      {!sent ? (
        <>
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
              Enter your school email and we&apos;ll send you a link to reset your password.
            </p>
          </div>

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

            <button type="submit" className="step-btn-primary">
              SEND RESET LINK
            </button>
          </form>
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          {/* Clean Envelope Icon Badge */}
          <div
            aria-hidden="true"
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'var(--blob-color)',
              color: 'var(--text-accent)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>

          <div className="step-auth-header" style={{ marginBottom: '1.1rem' }}>
            <h2 className="step-auth-heading">Check Your Email</h2>
            <p
              style={{
                margin: '0.55rem 0 0 0',
                fontSize: '0.95rem',
                color: 'var(--page-text-muted)',
                lineHeight: 1.55,
              }}
            >
              We sent a password reset link to{' '}
              <strong style={{ color: 'var(--page-text)' }}>{email}</strong>.
            </p>
          </div>

          {resent && (
            <p role="status" className="step-auth-status" style={{ fontSize: '0.88rem' }}>
              A new reset link has been sent.
            </p>
          )}

          {token && (
            <Link
              to={`/reset-password/${token}`}
              className="step-btn-primary"
              style={{
                display: 'block',
                textAlign: 'center',
                textDecoration: 'none',
                marginBottom: '0.9rem',
              }}
            >
              RESET PASSWORD NOW
            </Link>
          )}

          <p
            style={{
              margin: '0.5rem 0 0 0',
              fontSize: '0.9rem',
              color: 'var(--page-text-muted)',
            }}
          >
            Didn&apos;t receive the email?{' '}
            <button
              type="button"
              onClick={handleResend}
              className="step-auth-link"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                font: 'inherit',
                cursor: 'pointer',
              }}
            >
              Click to resend
            </button>
          </p>
        </div>
      )}

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