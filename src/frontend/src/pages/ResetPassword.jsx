import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/useAuth.js'

export default function ResetPassword() {
  const { verifyOtp, resetPassword, requestReset } = useAuth()
  const location = useLocation()
  const email = location.state?.email || ''

  const [otp, setOtp] = useState('')
  const [verified, setVerified] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(60)
  const [error, setError] = useState('')
  const [resent, setResent] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (cooldown <= 0 || verified || done) return
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown, verified, done])

  if (!email) {
    return <Navigate to="/forgot-password" replace />
  }

  async function handleVerify(e) {
    e.preventDefault()
    setError('')
    if (otp.trim().length !== 6) {
      return setError('Please enter the 6-digit verification code.')
    }
    setLoading(true)
    const result = await verifyOtp(email, otp)
    setLoading(false)
    if (!result.ok) return setError(result.error)
    setVerified(true)
  }

  async function handleReset(e) {
    e.preventDefault()
    setError('')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirm) return setError('Passwords do not match.')
    setLoading(true)
    const result = await resetPassword(email, otp, password)
    setLoading(false)
    if (!result.ok) return setError(result.error)
    setDone(true)
  }

  async function handleResend() {
    if (cooldown > 0 || resending) return
    setError('')
    setResent(false)
    setResending(true)
    const result = await requestReset(email)
    setResending(false)
    if (!result.ok) return setError(result.error)
    setOtp('')
    setResent(true)
    setCooldown(60)
  }

  if (done) {
    return (
      <AuthLayout expanded>
        <div className="step-auth-header">
          <h2 className="step-auth-heading">Password Changed</h2>
        </div>

        <p role="status" className="step-auth-status">
          Your password has been updated. You can now log in with your new password.
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

  if (!verified) {
    return (
      <AuthLayout expanded>
        <div className="step-auth-header">
          <h2 className="step-auth-heading">Verify Code</h2>
          <p
            style={{
              margin: '0.5rem 0 0 0',
              fontSize: '0.92rem',
              color: 'var(--page-text-muted)',
              lineHeight: 1.5,
            }}
          >
            Enter the 6-digit code sent to <strong style={{ color: 'var(--page-text)' }}>{email}</strong>.
          </p>
        </div>

        {resent && !error && (
          <p role="status" className="step-auth-status">
            A new 6-digit code has been sent.
          </p>
        )}

        {error && (
          <p role="alert" className="step-auth-alert">
            {error}
          </p>
        )}

        <form onSubmit={handleVerify} className="step-auth-form">
          <label className="step-field">
            <span>6-digit verification code</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              required
              autoComplete="one-time-code"
              autoFocus
              style={{ letterSpacing: '0.35em', fontWeight: 700, textAlign: 'center' }}
            />
          </label>

          <button type="submit" className="step-btn-primary" disabled={loading}>
            {loading ? 'VERIFYING...' : 'VERIFY CODE'}
          </button>
        </form>

        <div className="step-auth-footer">
          <p>
            Didn&apos;t get the code?{' '}
            {cooldown > 0 ? (
              <span style={{ color: 'var(--page-text-muted)' }}>
                Resend code in {cooldown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="step-auth-link"
                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
              >
                {resending ? 'Sending...' : 'Resend code'}
              </button>
            )}
          </p>
          <p>
            <Link to="/forgot-password" className="step-auth-link step-auth-link--muted">
              ← Back
            </Link>
          </p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout expanded>
      <div className="step-auth-header">
        <h2 className="step-auth-heading">Set New Password</h2>
        <p
          style={{
            margin: '0.5rem 0 0 0',
            fontSize: '0.92rem',
            color: 'var(--page-text-muted)',
          }}
        >
          Code verified. Create a new password for your account.
        </p>
      </div>

      {error && (
        <p role="alert" className="step-auth-alert">
          {error}
        </p>
      )}

      <form onSubmit={handleReset} className="step-auth-form">
        <label className="step-field">
          <span>New password (8+ characters)</span>
          <div className="step-password-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              autoFocus
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
          <span>Confirm new password</span>
          <div className="step-password-wrap">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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

        <button type="submit" className="step-btn-primary" disabled={loading}>
          {loading ? 'SAVING...' : 'CHANGE PASSWORD'}
        </button>
      </form>
    </AuthLayout>
  )
}