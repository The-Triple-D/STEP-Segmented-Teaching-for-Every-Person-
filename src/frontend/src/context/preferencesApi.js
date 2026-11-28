const API_BASE = 'http://localhost:8080'

async function readResponse(res) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Request failed: ${res.status}`)
  }

  return res.json()
}

export async function loadPreferences(userId, signal) {
  const studentRes = await fetch(
    `${API_BASE}/api/students/user/${encodeURIComponent(userId)}`,
    { signal }
  )

  const student = await readResponse(studentRes)

  const preferenceRes = await fetch(
    `${API_BASE}/api/students/${encodeURIComponent(student.id)}/preferences`,
    { signal }
  )

  if (preferenceRes.status === 404) {
    return {
      studentId: student.id,
      preferences: null,
    }
  }

  return {
    studentId: student.id,
    preferences: await readResponse(preferenceRes),
  }
}

export async function savePreferences(studentId, preferenceId, preferences) {
  const url = preferenceId
    ? `${API_BASE}/api/preferences/${encodeURIComponent(preferenceId)}`
    : `${API_BASE}/api/students/${encodeURIComponent(studentId)}/preferences`

  const res = await fetch(url, {
    method: preferenceId ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences),
  })

  return readResponse(res)
}