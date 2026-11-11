export default function AuthLayout({ children, intro = true }) {
  return (
    <div className={intro ? 'auth-split' : 'auth-split auth-split--single'}>
      {intro && (
        <section className="auth-intro" aria-label="About STEP">
          <p className="auth-intro__welcome">Welcome to</p>
          <p className="auth-intro__brand">STEP</p>
          <p className="auth-intro__tag">Segmented Teaching for Every Person</p>
          <p className="auth-intro__text">
            STEP is an accessible web-based learning platform that turns lengthy lectures
            and dense PDFs into bite-sized micro-lessons with built-in check-in questions.
            Students can switch between text, audio, and visual formats, follow calm,
            low-pressure progress tracking, and use low-stimulation settings, all in an
            interface built to align with WCAG 2.1 Level AA, without disclosing a diagnosis.
          </p>
        </section>
      )}
      <section className="auth-card">{children}</section>
    </div>
  )
}