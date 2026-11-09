import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

export default function Home() {
  const { user } = useAuth()
  const location = useLocation()

  if (user) {
    return (
      <div>
        <h1>Welcome back, {user.firstName}</h1>
        <p>You are signed in as {user.role}.</p>
        <p><Link className="big-link" to="/courses">Go to courses</Link></p>
        <p><Link className="big-link big-link--alt" to="/account">Edit account</Link></p>
      </div>
    )
  }

  return (
    <div>
      <h1>STEP</h1>
      <p className="tagline">Segmented Teaching for Every Person</p>
      <p><Link className="big-link" to="/role/student" state={location.state}>I am a student</Link></p>
      <p><Link className="big-link" to="/role/instructor" state={location.state}>I am an instructor</Link></p>
    </div>
  )
}