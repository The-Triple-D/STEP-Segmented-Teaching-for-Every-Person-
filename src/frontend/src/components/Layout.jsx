import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import AccessibilityBar from './AccessibilityBar.jsx'
import { useAuth } from '../context/useAuth.js'

const AUTH_PREFIXES = ['/login', '/register', '/forgot-password', '/reset-password', '/account']

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const authPage = pathname === '/' || AUTH_PREFIXES.some((p) => pathname.startsWith(p))

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <>
      <header>
        <nav aria-label="Main">
          <Link to="/">Home</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/progress">Progress</Link>
          <Link to="/settings">Settings</Link>
          {user && (
            <>
              <Link to="/account">Account ({user.firstName})</Link>
              <button type="button" onClick={handleLogout}>Log out</button>
            </>
          )}
        </nav>
        <AccessibilityBar />
      </header>
      <main className={authPage ? 'auth-main' : undefined}>
        <Outlet />
      </main>
    </>
  )
}