import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/useAuth.js'

export default function EditAccount() {
  const { user, updateAccount } = useAuth()
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    schoolId: user?.schoolId || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  if (!user) {
    return (
      <AuthLayout intro={false}>
        <h1>Edit account</h1>
        <p role="alert">You must be signed in to edit your account.</p>
        <p><Link to="/">Go to login</Link></p>
      </AuthLayout>
    )
  }

  function update(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (form.newPassword) {
      if (!form.currentPassword) {
        return setError('Current password is required to change your password.')
      }
      if (form.newPassword.length < 8) {
        return setError('New password must be at least 8 characters.')
      }
      if (form.newPassword !== form.confirmPassword) {
        return setError('New password and confirmation do not match.')
      }
    }

    setSubmitting(true)
    const result = await updateAccount({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      schoolId: form.schoolId,
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    })
    setSubmitting(false)

    if (!result.ok) {
      return setError(result.error)
    }

    setMessage('Account updated successfully.')
    setForm((prev) => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }))
  }

  return (
    <AuthLayout intro={false}>
      <h1>Edit account</h1>
      <p>
        Role: <strong>{user.role ? user.role.toUpperCase() : 'USER'}</strong>
      </p>

      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      <form onSubmit={submit}>
        <p>
          <label>
            First name
            <input
              name="firstName"
              value={form.firstName}
              onChange={update}
              required
            />
          </label>
        </p>
        <p>
          <label>
            Last name
            <input
              name="lastName"
              value={form.lastName}
              onChange={update}
              required
            />
          </label>
        </p>
        <p>
          <label>
            University email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={update}
              required
            />
          </label>
        </p>
        <p>
          <label>
            School / Employee ID
            <input
              name="schoolId"
              type="text"
              value={form.schoolId}
              onChange={update}
              placeholder="e.g. 24-1234-567"
            />
          </label>
        </p>

        <h2>Change password (optional)</h2>
        <p>
          <label>
            Current password
            <input
              name="currentPassword"
              type="password"
              value={form.currentPassword}
              onChange={update}
              autoComplete="current-password"
            />
          </label>
        </p>
        <p>
          <label>
            New password
            <input
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={update}
              autoComplete="new-password"
            />
          </label>
        </p>
        <p>
          <label>
            Confirm new password
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={update}
              autoComplete="new-password"
            />
          </label>
        </p>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save changes'}
        </button>
      </form>

      <p>
        <Link to="/home">Back to home</Link>
      </p>
    </AuthLayout>
  )
}