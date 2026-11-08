import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <header>
        <nav aria-label="Main">
          <Link to="/">Courses</Link>{' '}
          <Link to="/progress">Progress</Link>{' '}
          <Link to="/settings">Settings</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}