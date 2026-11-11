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

  function submit(e) {
    e.preventDefault()
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirm) return setError('Passwords do not match.')
    const result = resetPassword(token, password)
    if (!result.ok) return setError(result.error)
    setError('')
    setDone(true)
  }

  if (done) {
    return (
      <AuthLayout>
        <h1>Password changed</h1>
        <p role="status">Your password has been updated.</p>
        <p><Link className="big-link" to="/">Go to home and log in</Link></p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <h1>Reset password</h1>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={submit}>
        <p><label>New password (8+ characters)<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" /></label></p>
        <p><label>Confirm new password<input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" /></label></p>
        <button type="submit">Change password</button>
      </form>
    </AuthLayout>
  )
}