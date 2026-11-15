import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'

export default function LandingPage() {
  const navigate = useNavigate()
  const [expandingRole, setExpandingRole] = useState(null)

  function handleSelectRole(role) {
    setExpandingRole(role)
    setTimeout(() => {
      navigate(`/login?role=${role}`)
    }, 180)
  }

  return (
    <AuthLayout expanded={Boolean(expandingRole)}>
      <div
        aria-label="Choose your portal"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <button
          type="button"
          onClick={() => handleSelectRole('student')}
          className="step-btn-primary"
        >
          STUDENT
        </button>

        <button
          type="button"
          onClick={() => handleSelectRole('instructor')}
          className="step-btn-secondary"
        >
          INSTRUCTOR
        </button>
      </div>
    </AuthLayout>
  )
}