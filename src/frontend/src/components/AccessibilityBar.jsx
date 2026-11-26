import { useEffect, useState } from 'react'

const KEY = 'step_display'
const MIN = 0.85
const MAX = 1.6

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    const saved = raw ? JSON.parse(raw) : {}
    return {
      contrast: saved.contrast === true,
      scale: typeof saved.scale === 'number' ? saved.scale : 1,
    }
  } catch {
    return { contrast: false, scale: 1 }
  }
}

function step(scale, delta) {
  return Math.round((scale + delta) * 100) / 100
}

export default function AccessibilityBar() {
  const [display, setDisplay] = useState(load)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.contrast = display.contrast ? 'high' : 'normal'
    root.style.setProperty('--text-scale', String(display.scale))
    try {
      localStorage.setItem(KEY, JSON.stringify(display))
    } catch {
      return
    }
  }, [display])

  return (
    <div className="a11y-bar" role="group" aria-label="Display options">
      <label>
        <input
          type="checkbox"
          checked={display.contrast}
          onChange={(e) => setDisplay({ ...display, contrast: e.target.checked })}
        />
        High contrast
      </label>
      <span className="a11y-bar__size">
        <button
          type="button"
          aria-label="Decrease font size"
          disabled={display.scale <= MIN}
          onClick={() => setDisplay({ ...display, scale: Math.max(MIN, step(display.scale, -0.1)) })}
        >
          A-
        </button>
        <button
          type="button"
          aria-label="Increase font size"
          disabled={display.scale >= MAX}
          onClick={() => setDisplay({ ...display, scale: Math.min(MAX, step(display.scale, 0.1)) })}
        >
          A+
        </button>
        <span aria-live="polite">Font size {Math.round(display.scale * 100)}%</span>
      </span>
    </div>
  )
}