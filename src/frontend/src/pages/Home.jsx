import { Link, useLocation } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/useAuth.js'

export default function Home() {
  const { user } = useAuth()
  const location = useLocation()

  if (user) {
    return (
      <AuthLayout intro={false}>
        <h1>Welcome back, {user.firstName}</h1>
        <p className="center">You are signed in as {user.role}.</p>
        <p><Link className="big-link" to="/courses">Go to courses</Link></p>
        <p><Link className="big-link big-link--alt" to="/account">Edit account</Link></p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <h1>What is your role?</h1>
      <p className="center">Please select your role to get started.</p>
      <p><Link className="big-link" to="/login?role=student" state={location.state}>Student</Link></p>
      <p><Link className="big-link" to="/login?role=instructor" state={location.state}>Instructor</Link></p>
    </AuthLayout>
  )
}