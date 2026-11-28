import { usePreferences } from '../context/usePreferences.js'

const MIN = 0.85
const MAX = 1.6

function step(scale, delta) {
  return Math.round((scale + delta) * 100) / 100
}

export default function AccessibilityBar() {
  const {
    preferences,
    loading,
    saving,
    error,
    canEdit,
    updatePreferences,
  } = usePreferences()

  return (
    <div className="a11y-bar" role="group" aria-label="Display options">
      <label>
        <input
          type="checkbox"
          checked={preferences.highContrast}
          disabled={!canEdit}
          onChange={(e) => updatePreferences({ highContrast: e.target.checked })}
        />
        High contrast
      </label>
      <span className="a11y-bar__size">
        <button
          type="button"
          aria-label="Decrease font size"
          disabled={!canEdit || preferences.fontSize <= MIN}
          onClick={() => updatePreferences({ fontSize: Math.max(MIN, step(preferences.fontSize, -0.1)) })}
        >
          A-
        </button>
        <button
          type="button"
          aria-label="Increase font size"
          disabled={!canEdit || preferences.fontSize >= MAX}
          onClick={() => updatePreferences({ fontSize: Math.min(MAX, step(preferences.fontSize, 0.1)) })}
        >
          A+
        </button>
        <span aria-live="polite">Font size {Math.round(preferences.fontSize * 100)}%</span>
      </span>

      {loading && (
        <span role="status">Loading preferences...</span>
      )}

      {saving && (
        <span role="status">Saving preferences...</span>
      )}

      {error && (
        <span role="alert">{error}</span>
      )}
    </div>
  )
}