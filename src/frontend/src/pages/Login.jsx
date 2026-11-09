import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const role = params.get('role')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    const result = login(email, password, role)
    if (!result.ok) return setError(result.error)
    navigate(location.state?.from || '/courses', { replace: true })
  }

  if (role !== 'student' && role !== 'instructor') {
    return <Navigate to="/" replace />
  }

  return (
    <div>
      <h1>Log in as {role === 'student' ? 'a student' : 'an instructor'}</h1>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={submit}>
        <p><label>Email<br /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label></p>
        <p><label>Password<br /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></label></p>
        <button type="submit">Log in</button>
      </form>
      <p><Link to="/forgot-password">Forgot your password?</Link></p>
      <p>No account yet? <Link to={`/register?role=${role}`}>Register as {role === 'student' ? 'a student' : 'an instructor'}</Link></p>
      <p><Link to="/">Choose a different role</Link></p>
    </div>
  )
}