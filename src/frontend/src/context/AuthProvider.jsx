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
    if (data.message && data.message !== 'No message available') {
      return data.message
    }
  } catch {
  }
  if (res.status === 409) return 'An account with this email is already registered.'
  if (res.status === 401) return 'Invalid email or password.'
  return fallbackMessage
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

  async function requestReset(email) {
    try {
      const res = await fetch(`${API_BASE}/forgotPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      if (!res.ok) {
        return { ok: true, token: null }
      }
      const data = await res.json()
      return { ok: true, token: data.token || null }
    } catch {
      return { ok: false, token: null }
    }
  }

  async function resetPassword(token, newPassword) {
    try {
      const res = await fetch(`${API_BASE}/resetPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      })
      if (!res.ok) {
        const message = await parseError(res, 'This reset link is invalid or already used.')
        return { ok: false, error: message }
      }
      return { ok: true }
    } catch {
      return { ok: false, error: 'Unable to reach the server. Check if the backend is running.' }
    }
  }

  async function updateAccount({ firstName, lastName, email, currentPassword, newPassword }) {
    if (!user) return { ok: false, error: 'Account not found.' }
    const cleanEmail = email.trim().toLowerCase()

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: cleanEmail,
      isStudent: Boolean(user.isStudent),
      isInstructor: Boolean(user.isInstructor),
      isAdmin: Boolean(user.isAdmin),
      ...(newPassword ? { passwordHash: newPassword } : {}),
    }

    try {
      const res = await fetch(`${API_BASE}/putUser?id=${encodeURIComponent(user.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const message = await parseError(res, 'Could not update account.')
        return { ok: false, error: message }
      }
      const updatedFromServer = await res.json()
      const updated = {
        ...publicUser(updatedFromServer),
        profileId: user.profileId ?? null,
      }
      const remember = Boolean(localStorage.getItem(SESSION_KEY))
      writeSession(updated, remember)
      setUser(updated)
      return { ok: true, user: updated }
    } catch {
      return { ok: false, error: 'Unable to reach the server. Check if the backend is running.' }
    }
  }

  const value = { user, register, login, logout, requestReset, resetPassword, updateAccount }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}