import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'

import Landing           from './pages/Landing'
import Login             from './pages/Login'
import Register          from './pages/Register'
import Jobs              from './pages/Jobs'
import WorkerDashboard   from './pages/WorkerDashboard'
import Applications      from './pages/Applications'
import EmployerDashboard from './pages/EmployerDashboard'
import PostJob           from './pages/PostJob'
import MyJobs            from './pages/MyJobs'
import Profile           from './pages/Profile'
import Notifications     from './pages/Notifications'

function Guard({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="spin-wrap"><div className="spin" /></div>
  if (!user)   return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />
  return children
}

function Dashboard() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return user.role === 'employer' ? <EmployerDashboard /> : <WorkerDashboard />
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <div className="shell">
      <Navbar />
      <div className="page">
        <Routes>
          <Route path="/"              element={user ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/login"         element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register"      element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/jobs"          element={<Jobs />} />

          <Route path="/dashboard"     element={<Guard><Dashboard /></Guard>} />
          <Route path="/applications"  element={<Guard role="worker"><Applications /></Guard>} />
          <Route path="/post-job"      element={<Guard role="employer"><PostJob /></Guard>} />
          <Route path="/my-jobs"       element={<Guard role="employer"><MyJobs /></Guard>} />
          <Route path="/notifications" element={<Guard><Notifications /></Guard>} />
          <Route path="/profile"       element={<Guard><Profile /></Guard>} />

          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
