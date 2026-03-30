import { NavLink } from 'react-router-dom'
import { useNotifications } from '../hooks/useNotifications'
import { useAuth } from '../context/AuthContext'

const Home  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const Bag   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-4 0v2"/></svg>
const Doc   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
const Bell  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
const Plus  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
const Grid  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
const User  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>

function BellWithBadge({ unread }) {
  return (
    <div style={{ position:'relative', display:'inline-flex' }}>
      <Bell />
      {unread > 0 && (
        <span style={{
          position:'absolute', top:-4, right:-5,
          minWidth:14, height:14, borderRadius:7,
          background:'var(--red)', color:'#fff',
          fontSize:9, fontWeight:700,
          display:'flex', alignItems:'center', justifyContent:'center',
          padding:'0 3px', lineHeight:1, border:'1.5px solid #fff',
        }}>
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </div>
  )
}

export default function BottomNav() {
  const { user } = useAuth()
  const { unread } = useNotifications()
  if (!user) return null

  const tab = (to, icon, label) => (
    <NavLink key={to} to={to} className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}>
      {icon}<span>{label}</span>
    </NavLink>
  )

  if (user.role === 'employer') return (
    <nav className="bot-nav" style={{ gridTemplateColumns:'repeat(4,1fr)' }}>
      {tab('/dashboard', <Grid />, 'Dashboard')}
      {tab('/post-job',  <Plus />, 'Post Job')}
      {tab('/notifications', <BellWithBadge unread={unread} />, 'Alerts')}
      {tab('/profile',   <User />, 'Profile')}
    </nav>
  )

  return (
    <nav className="bot-nav" style={{ gridTemplateColumns:'repeat(5,1fr)' }}>
      {tab('/dashboard',     <Home />,                       'Home')}
      {tab('/jobs',          <Bag />,                        'Browse')}
      {tab('/applications',  <Doc />,                        'Applied')}
      {tab('/notifications', <BellWithBadge unread={unread} />, 'Alerts')}
      {tab('/profile',       <User />,                       'Profile')}
    </nav>
  )
}
