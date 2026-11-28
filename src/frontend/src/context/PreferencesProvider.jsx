import { useEffect, useRef, useState } from 'react'
import { PreferencesContext } from './preferencesContext.js'
import { useAuth } from './useAuth.js'
import { loadPreferences, savePreferences } from './preferencesApi.js'

const DEFAULT_PREFERENCES = {
  fontSize: 1.0,
  lineSpacing: 1.5,
  highContrast: false,
  lowStimulation: false,
  preferredFormat: 'TEXT',
}

function PreferencesSession({ children, studentUserId }) {
  const [preferences, setPreferences] = useState({ ...DEFAULT_PREFERENCES })
  const [studentId, setStudentId] = useState(null)
  const [preferenceId, setPreferenceId] = useState(null)
  const [loading, setLoading] = useState(Boolean(studentUserId))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const savingRef = useRef(false)

  useEffect(() => {
    const root = document.documentElement

    root.style.setProperty('--text-scale', String(preferences.fontSize))
    root.style.setProperty('--line-spacing', String(preferences.lineSpacing))

    root.dataset.contrast = preferences.highContrast ? 'high' : 'normal'
    root.dataset.lowStimulation = String(preferences.lowStimulation)
    root.dataset.preferredFormat = preferences.preferredFormat
    root.dataset.lineSpacing = String(preferences.lineSpacing)
  }, [preferences])

  useEffect(() => {
    if (!studentUserId) return

    const controller = new AbortController()

    async function load() {
      try {
        const result = await loadPreferences(
          studentUserId,
          controller.signal
        )

        if (controller.signal.aborted) return

        setStudentId(result.studentId)

        if (result.preferences) {
          const { id, ...values } = result.preferences

          setPreferenceId(id)
          setPreferences({
            ...DEFAULT_PREFERENCES,
            ...values,
          })
        }
      } catch (err) {
        if (controller.signal.aborted) return

        setError(err.message || 'Unable to load preferences.')
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => controller.abort()
  }, [studentUserId])

  async function updatePreferences(changes) {
    if (loading || savingRef.current) return false

    const updated = {
      ...preferences,
      ...changes,
    }

    if (!studentUserId) {
      setPreferences(updated)
      return true
    }

    if (!studentId) return false

    savingRef.current = true
    setSaving(true)
    setError('')

    try {
      const saved = await savePreferences(
        studentId,
        preferenceId,
        preferenceId ? changes : updated
      )

      const { id, ...values } = saved

      setPreferenceId(id)
      setPreferences({
        ...DEFAULT_PREFERENCES,
        ...values,
      })

      return true
    } catch (err) {
      setError(err.message || 'Unable to save preferences.')
      return false
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }

  const canEdit = !loading && !saving &&
    (!studentUserId || Boolean(studentId))

  const value = {
    preferences,
    studentId,
    preferenceId,
    loading,
    saving,
    error,
    canEdit,
    updatePreferences,
  }

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  )
}

export default function PreferencesProvider({ children }) {
  const { user } = useAuth()

  const studentUserId = user?.isStudent ? user.id : null
  const sessionKey = `${user?.id ?? 'guest'}:${Boolean(user?.isStudent)}`

  return (
    <PreferencesSession
      key={sessionKey}
      studentUserId={studentUserId}
    >
      {children}
    </PreferencesSession>
  )
}