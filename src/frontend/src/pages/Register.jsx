import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const role = params.get('role')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirm: '',
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

  return (
    <div>
      <h1>Register as {role === 'student' ? 'a student' : 'an instructor'}</h1>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={submit}>
        <p><label>First name<br /><input name="firstName" value={form.firstName} onChange={update} required autoComplete="given-name" /></label></p>
        <p><label>Last name<br /><input name="lastName" value={form.lastName} onChange={update} required autoComplete="family-name" /></label></p>
        <p><label>Email<br /><input name="email" type="email" value={form.email} onChange={update} required autoComplete="email" /></label></p>
        <p><label>Password (8+ characters)<br /><input name="password" type="password" value={form.password} onChange={update} required autoComplete="new-password" /></label></p>
        <p><label>Confirm password<br /><input name="confirm" type="password" value={form.confirm} onChange={update} required autoComplete="new-password" /></label></p>
        <button type="submit">Create account</button>
      </form>
      <p>Already have an account? <Link to={`/login?role=${role}`}>Log in</Link></p>
      <p><Link to="/">Choose a different role</Link></p>
    </div>
  )
}