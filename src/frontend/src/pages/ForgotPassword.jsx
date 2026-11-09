import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/useAuth.js'

export default function ForgotPassword() {
  const { requestReset } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [token, setToken] = useState(null)

  function submit(e) {
    e.preventDefault()
    const result = requestReset(email)
    setToken(result.token)
    setSent(true)
  }

  return (
    <AuthLayout>
      <h1>Forgot password</h1>
      <form onSubmit={submit}>
        <p>
          <label>
            University email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" required autoComplete="email" />
          </label>
        </p>
        <button type="submit">Send reset link</button>
      </form>
      {sent && (
        <div role="status" className="auth-notice">
          <p>If an account exists for that email, a reset link has been sent.</p>
          {token && (
            <p>Mock mode only: <Link to={`/reset-password/${token}`}>open the reset page</Link></p>
          )}
        </div>
      )}
      <p className="center auth-after"><Link to="/">Back to home</Link></p>
    </AuthLayout>
  )
}