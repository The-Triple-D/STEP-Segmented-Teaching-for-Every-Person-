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
    <AuthLayout>
      <h1>{label} login</h1>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={submit}>
        <p>
          <label>
            University email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" required autoComplete="email" />
          </label>
        </p>
        <p>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </label>
        </p>
        <div className="auth-row">
          <label className="auth-check">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Keep me signed in
          </label>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <button type="submit">Log in</button>
      </form>
      <p className="center auth-after">
        Need an account? <Link to={`/register?role=${role}`}>Sign up</Link>
      </p>
      <p className="center"><Link to="/">Choose a different role</Link></p>
    </AuthLayout>
  )
}