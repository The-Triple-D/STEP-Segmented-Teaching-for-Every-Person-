import { useNavigate } from 'react-router-dom'
import StepLogo from '../components/StepLogo.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '2.5rem clamp(1.5rem, 6vw, 5rem)',
      }}
    >
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

      <main
        style={{
          width: '100%',
          maxWidth: '1240px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: 'clamp(2.5rem, 6vw, 6rem)',
          zIndex: 1,
        }}
      >
        <section
          aria-labelledby="hero-heading"
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '560px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <div
            style={{
              marginBottom: '1rem',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <StepLogo
              style={{
                width: '300px',
                maxWidth: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>

          <h1
            id="hero-heading"
            style={{
              textAlign: 'left',
              fontSize: 'clamp(2.0rem, 3.2vw, 3.4rem)',
              lineHeight: 1.2,
              fontWeight: 700,
              margin: '0 0 1rem 0',
              letterSpacing: '-0.02em',
              textWrap: 'balance',
            }}
          >
            <span style={{ color: 'var(--text-accent)' }}>Learn step by step,</span>{' '}
            at a pace that works for you
          </h1>

          <p
            style={{
              textAlign: 'left',
              fontSize: '1.25rem',
              lineHeight: 1.68,
              color: 'var(--page-text-muted)',
              margin: 0,
              maxWidth: '52ch',
            }}
          >
            Break overwhelming lectures and readings into manageable, bite-sized
            parts. Watch, read, or listen at your own rhythm, check your
            understanding along the way, and pick up right where you left off.
          </p>
        </section>

        <section
          aria-label="Choose your portal"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '2.25rem',
              borderRadius: '24px',
              background: 'var(--surface-glass)',
              border: '1px solid var(--surface-border)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxShadow: '0 20px 45px -15px rgba(20, 14, 48, 0.25)',
            }}
          >
            <button
              type="button"
              onClick={() => navigate('/login?role=student')}
              style={{
                width: '100%',
                padding: '1.05rem 2rem',
                borderRadius: '999px',
                border: '2px solid var(--btn-primary-bg)',
                background: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)',
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                boxShadow: '0 10px 24px -6px rgba(104, 66, 255, 0.45)',
                transition: 'background 0.2s ease, transform 0.15s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = 'var(--btn-primary-hover)')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'var(--btn-primary-bg)')}
            >
              STUDENT
            </button>

            <button
              type="button"
              onClick={() => navigate('/login?role=instructor')}
              style={{
                width: '100%',
                padding: '1.05rem 2rem',
                borderRadius: '999px',
                border: '2px solid var(--btn-secondary-border)',
                background: 'var(--btn-secondary-bg)',
                color: 'var(--btn-secondary-text)',
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'background 0.2s ease, transform 0.15s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = 'var(--btn-secondary-hover)')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'var(--btn-secondary-bg)')}
            >
              INSTRUCTOR
            </button>
          </div>
        </section>
      </main>

      <ThemeToggle />
    </div>
  )
}