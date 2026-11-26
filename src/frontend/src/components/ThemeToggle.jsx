import { useEffect, useState } from 'react'

const KEY = 'step_theme'

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {

  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(KEY, theme)
    } catch {

    }
  }, [theme])

  return (
    <div
      role="group"
      aria-label="Color theme switcher"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '1.5rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',        
        padding: '0.4rem',    
        borderRadius: '999px',
        background: 'var(--surface-glass)',
        border: '1px solid var(--surface-border)',
        backdropFilter: 'blur(10px)',
        zIndex: 50,
      }}
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-label="Switch to light mode"
        aria-pressed={theme === 'light'}
        title="Light mode"
        style={{
          width: '34px',     
          height: '34px',
          borderRadius: '50%',
          border: 'none',
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
          background: theme === 'light' ? 'var(--btn-primary-bg)' : 'transparent',
          color: theme === 'light' ? '#ffffff' : 'var(--page-text-muted)',
          transition: 'all 0.2s ease',
        }}
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-label="Switch to dark mode"
        aria-pressed={theme === 'dark'}
        title="Dark mode"
        style={{
          width: '34px',     
          height: '34px',
          borderRadius: '50%',
          border: 'none',
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
          background: theme === 'dark' ? 'var(--btn-primary-bg)' : 'transparent',
          color: theme === 'dark' ? '#ffffff' : 'var(--page-text-muted)',
          transition: 'all 0.2s ease',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </button>
    </div>
  )
}