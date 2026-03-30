import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationBell from './NotificationBell'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <nav className="top-nav">
      <Link to="/" className="logo"><span className="logo-dot" />KenyaWorks</Link>
      <div className="nav-right">
        {user ? (
          <>
            <span className={`role-chip ${user.role}`}>{user.role}</span>
            <NotificationBell />
            <button className="btn btn-sm btn-ghost" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-sm">Log in</Link>
            <Link to="/register" className="btn btn-sm btn-primary">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
