import { useState } from 'react'
import { Link } from 'react-router-dom'
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
    <div>
      <h1>Forgot password</h1>
      <form onSubmit={submit}>
        <p><label>Email<br /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label></p>
        <button type="submit">Send reset link</button>
      </form>
      {sent && (
        <div role="status">
          <p>If an account exists for that email, a reset link has been sent.</p>
          {token && (
            <p>Mock mode only: <Link to={`/reset-password/${token}`}>open the reset page</Link></p>
          )}
        </div>
      )}
        <p><Link to="/">Back to home</Link></p>
    </div>
  )
}