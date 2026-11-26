import { useState } from 'react'
import { AuthContext } from './authContext.js'

const USER_KEY = 'step_user'
const SESSION_KEY = 'step_session'
const TOKENS_KEY = 'step_reset_tokens'
const API_BASE = 'http://localhost:8080/user/api'

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

function readStoredUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) ?? localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeSession(userObj, remember) {
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
  const store = remember ? localStorage : sessionStorage
  store.setItem(SESSION_KEY, JSON.stringify(userObj))
}

function publicUser(u) {
  if (!u) return null
  const isStudent = Boolean(u.isStudent)
  const isInstructor = Boolean(u.isInstructor)
  const isAdmin = Boolean(u.isAdmin)
  const role = u.role || (isInstructor ? 'instructor' : isStudent ? 'student' : 'user')
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    isStudent,
    isInstructor,
    isAdmin,
    role,
  }
}

async function parseError(res, fallbackMessage) {
  try {
    const data = await res.json()
    return data.message || data.error || fallbackMessage
  } catch {
    return fallbackMessage
  }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => publicUser(readStoredUser()))

  async function register({ firstName, lastName, email, password, role }) {
    const cleanEmail = email.trim().toLowerCase()
    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: cleanEmail,
      passwordHash: password,
      isStudent: role === 'student',
      isInstructor: role === 'instructor',
      isAdmin: false,
    }

    try {
      const res = await fetch(`${API_BASE}/createUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const message = await parseError(res, 'Could not create account.')
        return { ok: false, error: message }
      }
      const created = publicUser(await res.json())
      writeSession(created, true)
      setUser(created)
      return { ok: true, user: created }
    } catch {
      return { ok: false, error: 'Unable to reach the server. Check if the backend is running.' }
    }
  }

  async function login(email, password, role, remember = false) {
    const cleanEmail = email.trim().toLowerCase()

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, passwordHash: password }),
      })
      if (!res.ok) {
        const message = await parseError(res, 'Incorrect email or password.')
        return { ok: false, error: message }
      }
      const found = publicUser(await res.json())
      if (role === 'student' && !found.isStudent) {
        return { ok: false, error: 'This account is not registered as a student.' }
      }
      if (role === 'instructor' && !found.isInstructor) {
        return { ok: false, error: 'This account is not registered as an instructor.' }
      }
      writeSession(found, remember)
      setUser(found)
      return { ok: true, user: found }
    } catch {
      return { ok: false, error: 'Unable to reach the server. Check if the backend is running.' }
    }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  function requestReset(email) {
    const users = read(USER_KEY, [])
    const found = users.find((u) => u.email === email.trim().toLowerCase())
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
      USER_KEY,
      read(USER_KEY, []).map((u) => (u.id === userId ? { ...u, password: newPassword } : u))
    )
    const rest = { ...tokens }
    delete rest[token]
    write(TOKENS_KEY, rest)
    return { ok: true }
  }

  function updateAccount({ firstName, lastName, email, currentPassword, newPassword }) {
    if (!user) return { ok: false, error: 'Account not found.' }
    const cleanEmail = email.trim().toLowerCase()
    const updated = {
      ...user,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: cleanEmail,
      password: newPassword || user.password,
    }
    writeSession(updated, Boolean(localStorage.getItem(SESSION_KEY)))
    setUser(updated)
    return { ok: true }
  }

  const value = { user, register, login, logout, requestReset, resetPassword, updateAccount }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}