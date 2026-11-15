import StepLogo from './StepLogo.jsx'
import ThemeToggle from './ThemeToggle.jsx'

export default function AuthLayout({ children, intro = true, expanded = true }) {
  return (
    <div className="step-split-shell">

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-10%',
          left: '-5%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'var(--blob-color)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: '-12%',
          right: '-5%',
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background: 'var(--blob-color)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />

      <main className={intro ? 'step-split-grid' : 'step-split-grid step-split-grid--single'}>
        {intro && (
          <section aria-labelledby="hero-heading" className="step-split-left">
            <div className="step-split-logo">
              <StepLogo style={{ width: '300px', maxWidth: '100%', height: 'auto', display: 'block' }} />
            </div>

            <h1 id="hero-heading" className="step-split-title">
              <span style={{ color: 'var(--text-accent)' }}>Learn step by step,</span>{' '}
              at a pace that works for you
            </h1>

            <p className="step-split-desc">
              Break overwhelming lectures and readings into manageable, bite-sized
              parts. Watch, read, or listen at your own rhythm, check your
              understanding along the way, and pick up right where you left off.
            </p>
          </section>
        )}

        <section className="step-split-right">
          <div className={`step-glass-card ${expanded ? 'step-glass-card--expanded' : 'step-glass-card--compact'}`}>
            <div className="step-glass-card__inner">{children}</div>
          </div>
        </section>
      </main>

      <ThemeToggle />
    </div>
  )
}