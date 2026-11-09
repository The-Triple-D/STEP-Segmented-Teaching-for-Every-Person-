import { Link, Navigate, useLocation, useParams } from 'react-router-dom'

export default function RoleChoice() {
  const { role } = useParams()
  const location = useLocation()

  if (role !== 'student' && role !== 'instructor') {
    return <Navigate to="/" replace />
  }

  const label = role === 'student' ? 'a student' : 'an instructor'

  return (
    <div>
      <h1>I am {label}</h1>
      <p><Link className="big-link" to={`/login?role=${role}`} state={location.state}>Log in</Link></p>
      <p><Link className="big-link big-link--alt" to={`/register?role=${role}`}>Register</Link></p>
      <p><Link to="/">Back</Link></p>
    </div>
  )
}