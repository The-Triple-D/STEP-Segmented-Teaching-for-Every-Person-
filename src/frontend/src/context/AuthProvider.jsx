import { useState } from 'react'
import { AuthContext } from './authContext.js'

const USERS_KEY = 'step_users'
const SESSION_KEY = 'step_session'
const TOKENS_KEY = 'step_reset_tokens'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function publicUser(u) {
  if (!u) return null
  return { id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, role: u.role }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const id = read(SESSION_KEY, null)
    return publicUser(read(USERS_KEY, []).find((u) => u.id === id))
  })

  function register({ firstName, lastName, email, password, role }) {
    const users = read(USERS_KEY, [])
    const cleanEmail = email.trim().toLowerCase()
    if (users.some((u) => u.email === cleanEmail)) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    const created = {
      id: crypto.randomUUID(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: cleanEmail,
      password,
      role,
    }
    write(USERS_KEY, [...users, created])
    write(SESSION_KEY, created.id)
    setUser(publicUser(created))
    return { ok: true }
  }

    function login(email, password, role) {
    const found = read(USERS_KEY, []).find((u) => u.email === email.trim().toLowerCase())
    if (!found || found.password !== password) {
      return { ok: false, error: 'Incorrect email or password.' }
    }
    if (role && found.role !== role) {
      const actual = found.role === 'student' ? 'a student' : 'an instructor'
      const label = found.role === 'student' ? 'Student' : 'Instructor'
      return { ok: false, error: `This account is registered as ${actual}. Go back and choose ${label}.` }
    }
    write(SESSION_KEY, found.id)
    setUser(publicUser(found))
    return { ok: true }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  function requestReset(email) {
    const found = read(USERS_KEY, []).find((u) => u.email === email.trim().toLowerCase())
    if (!found) return { ok: true, token: null }
    const token = crypto.randomUUID()
    write(TOKENS_KEY, { ...read(TOKENS_KEY, {}), [token]: found.id })
    return { ok: true, token }
  }

  function resetPassword(token, newPassword) {
    const tokens = read(TOKENS_KEY, {})
    const userId = tokens[token]
    if (!userId) return { ok: false, error: 'This reset link is invalid or already used.' }
    write(
      USERS_KEY,
      read(USERS_KEY, []).map((u) => (u.id === userId ? { ...u, password: newPassword } : u))
    )
    const rest = { ...tokens }
    delete rest[token]
    write(TOKENS_KEY, rest)
    return { ok: true }
  }

  function updateAccount({ firstName, lastName, email, currentPassword, newPassword }) {
    const users = read(USERS_KEY, [])
    const me = users.find((u) => u.id === user.id)
    if (!me) return { ok: false, error: 'Account not found.' }
    const cleanEmail = email.trim().toLowerCase()
    if (users.some((u) => u.email === cleanEmail && u.id !== me.id)) {
      return { ok: false, error: 'Another account already uses this email.' }
    }
    if (newPassword && me.password !== currentPassword) {
      return { ok: false, error: 'Current password is incorrect.' }
    }
    const updated = {
      ...me,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: cleanEmail,
      password: newPassword || me.password,
    }
    write(USERS_KEY, users.map((u) => (u.id === me.id ? updated : u)))
    setUser(publicUser(updated))
    return { ok: true }
  }

  const value = { user, register, login, logout, requestReset, resetPassword, updateAccount }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}