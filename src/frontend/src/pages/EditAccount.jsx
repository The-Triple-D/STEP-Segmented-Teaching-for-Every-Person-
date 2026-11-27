import { useState } from 'react'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/useAuth.js'

export default function EditAccount() {
  const { user, updateAccount } = useAuth()
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    schoolId: user.schoolId || '',
    currentPassword: '',
    newPassword: '',
  })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function submit(e) {
    e.preventDefault()
    setMessage('')
    if (form.newPassword && form.newPassword.length < 8) {
      return setError('New password must be at least 8 characters.')
    }
    const result = await updateAccount(form)
    if (!result.ok) return setError(result.error)
    setError('')
    setMessage('Account updated.')
    setForm({ ...form, currentPassword: '', newPassword: '' })
  }

  return (
    <AuthLayout intro={false}>
      <h1>Edit account</h1>
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      <form onSubmit={submit}>
        <p><label>First name<input name="firstName" value={form.firstName} onChange={update} required /></label></p>
        <p><label>Last name<input name="lastName" value={form.lastName} onChange={update} required /></label></p>
        <p><label>University email<input name="email" type="email" value={form.email} onChange={update} required /></label></p>
        <p><label>School ID (optional)<input name="schoolId" type="text" value={form.schoolId} onChange={update} placeholder="e.g. 24-1234-567" /></label></p>
        <h2>Change password (optional)</h2>
        <p><label>Current password<input name="currentPassword" type="password" value={form.currentPassword} onChange={update} autoComplete="current-password" /></label></p>
        <p><label>New password<input name="newPassword" type="password" value={form.newPassword} onChange={update} autoComplete="new-password" /></label></p>
        <button type="submit">Save changes</button>
      </form>
    </AuthLayout>
  )
}