import { useState } from 'react'
import { usePreferences } from '../context/usePreferences.js'
import './Settings.css'

export default function Settings() {
  const {
    preferences,
    studentId,
    loading,
    saving,
    error,
    canEdit,
    updatePreferences,
  } = usePreferences()

  const [changes, setChanges] = useState({})
  const [message, setMessage] = useState('')
  const [validationError, setValidationError] = useState('')

  const draft = {
    ...preferences,
    ...changes,
  }

  function handleChange(field, value) {
    setChanges((previous) => ({
      ...previous,
      [field]: value,
    }))

    setMessage('')
    setValidationError('')
  }

  async function handleSave(e) {
    e.preventDefault()

    const fontSize = Number(draft.fontSize)
    const lineSpacing = Number(draft.lineSpacing)

    if (!Number.isFinite(fontSize) || fontSize < 0.85 || fontSize > 1.6) {
      setValidationError('Font size must be between 85% and 160%.')
      return
    }

    if (!Number.isFinite(lineSpacing) || lineSpacing <= 0) {
      setValidationError('Line spacing must be greater than zero.')
      return
    }

    if (!['TEXT', 'AUDIO', 'TRANSCRIPT', 'VISUAL_SUMMARY'].includes(draft.preferredFormat)) {
      setValidationError('Please select a valid learning format.')
      return
    }

    setValidationError('')
    setMessage('')

    const payload = { ...changes }

    if ('fontSize' in payload) {
      payload.fontSize = fontSize
    }

    if ('lineSpacing' in payload) {
      payload.lineSpacing = lineSpacing
    }

    const success = await updatePreferences(payload)

    if (success) {
      setChanges({})
      setMessage(
        studentId
          ? 'Preferences saved successfully.'
          : 'Temporary preferences applied successfully.'
      )
    }
  }

  return (
    <section className="settings-shell" aria-labelledby="settings-title">
      <div className="settings-card">
        <h1 id="settings-title">Accessibility settings</h1>
        <p>Personalize your learning experience.</p>

        {loading && (
          <p role="status">Loading your preferences...</p>
        )}

        {!loading && !studentId && canEdit && (
          <p>These settings are temporary for non-student accounts.</p>
        )}

        <form onSubmit={handleSave}>
          <fieldset disabled={!canEdit} className="settings-fields">
            <legend>Display preferences</legend>

            <div className="settings-field">
              <label htmlFor="font-size">
                Font size: {Math.round(draft.fontSize * 100)}%
              </label>

              <input
                id="font-size"
                type="range"
                min="0.85"
                max="1.6"
                step="0.01"
                value={draft.fontSize}
                aria-valuetext={`${Math.round(draft.fontSize * 100)}%`}
                onChange={(e) => handleChange('fontSize', Number(e.target.value))}
              />

              <div className="settings-range-labels">
                <span>85%</span>
                <span>160%</span>
              </div>
            </div>

            <div className="settings-field">
              <label htmlFor="line-spacing">Line spacing</label>

              <input
                id="line-spacing"
                type="number"
                min="0"
                step="any"
                required
                value={draft.lineSpacing}
                aria-describedby="line-spacing-help"
                onChange={(e) => handleChange('lineSpacing', e.target.value)}
              />

              <small id="line-spacing-help">
                Suggested values: 1.2, 1.5, or 2.0.
              </small>
            </div>

            <div className="settings-field">
              <label className="settings-checkbox">
                <input
                  type="checkbox"
                  checked={draft.highContrast}
                  onChange={(e) => handleChange('highContrast', e.target.checked)}
                />
                High contrast
              </label>

              <small>Increase contrast for better readability.</small>
            </div>

            <div className="settings-field">
              <label className="settings-checkbox">
                <input
                  type="checkbox"
                  checked={draft.lowStimulation}
                  onChange={(e) => handleChange('lowStimulation', e.target.checked)}
                />
                Low stimulation
              </label>

              <small>Reduce distracting animations and transitions.</small>
            </div>

            <div className="settings-field">
              <label htmlFor="preferred-format">
                Preferred learning format
              </label>

              <select
                id="preferred-format"
                value={draft.preferredFormat}
                onChange={(e) => handleChange('preferredFormat', e.target.value)}
              >
                <option value="TEXT">Text</option>
                <option value="AUDIO">Audio</option>
                <option value="TRANSCRIPT">Transcript</option>
                <option value="VISUAL_SUMMARY">Visual Summary</option>
              </select>
            </div>

            <div className="settings-preview">
              <h2>Reading preview</h2>

              <p
                style={{
                  fontSize: `${draft.fontSize / preferences.fontSize}rem`,
                  lineHeight: Number(draft.lineSpacing) > 0
                    ? Number(draft.lineSpacing)
                    : preferences.lineSpacing,
                }}
              >
                Learn at your own pace. Make learning comfortable
                and accessible for you.
              </p>
            </div>

            <button
              type="submit"
              className="step-btn-primary"
              disabled={!canEdit}
            >
              {saving ? 'SAVING...' : 'SAVE PREFERENCES'}
            </button>
          </fieldset>

          {(validationError || error) && (
            <p role="alert" className="step-auth-alert">
              {validationError || error}
            </p>
          )}

          {message && (
            <p role="status" className="step-auth-status">
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}