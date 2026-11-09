import { useState } from 'react'
import { useAuth } from '../context/useAuth.js'

export default function EditAccount() {
  const { user, updateAccount } = useAuth()
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    currentPassword: '',
    newPassword: '',
  })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function submit(e) {
    e.preventDefault()
    setMessage('')
    if (form.newPassword && form.newPassword.length < 8) {
      return setError('New password must be at least 8 characters.')
    }
    const result = updateAccount(form)
    if (!result.ok) return setError(result.error)
    setError('')
    setMessage('Account updated.')
    setForm({ ...form, currentPassword: '', newPassword: '' })
  }

  return (
    <div>
      <h1>Edit account</h1>
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      <form onSubmit={submit}>
        <p><label>First name<br /><input name="firstName" value={form.firstName} onChange={update} required /></label></p>
        <p><label>Last name<br /><input name="lastName" value={form.lastName} onChange={update} required /></label></p>
        <p><label>Email<br /><input name="email" type="email" value={form.email} onChange={update} required /></label></p>
        <h2>Change password (optional)</h2>
        <p><label>Current password<br /><input name="currentPassword" type="password" value={form.currentPassword} onChange={update} autoComplete="current-password" /></label></p>
        <p><label>New password<br /><input name="newPassword" type="password" value={form.newPassword} onChange={update} autoComplete="new-password" /></label></p>
        <button type="submit">Save changes</button>
      </form>
    </div>
  )
}