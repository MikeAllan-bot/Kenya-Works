import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, logout, isWorker } = useAuth()
  const nav = useNavigate()
  const [confirm, setConfirm] = useState(false)

  const initials = user?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() ?? '??'

  const doLogout = async () => { await logout(); nav('/') }

  return (
    <div className="section">

      {/* Avatar card */}
      <div style={{ display:'flex', alignItems:'center', gap:16, padding:18, background:'var(--surface)', borderRadius:'var(--r-xl)', marginBottom:14 }}>
        <div className="avatar" style={{ width:60, height:60, fontSize:'1.3rem' }}>{initials}</div>
        <div>
          <div style={{ fontFamily:'var(--font-head)', fontSize:'1.1rem', fontWeight:800 }}>{user?.name}</div>
          <div className="text-sm muted">{user?.email}</div>
          <div style={{ marginTop:6 }}>
            <span className={`role-chip ${user?.role}`}>{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="card" style={{ marginBottom:12 }}>
        <div className="sec-title" style={{ marginBottom:12 }}>Account Details</div>
        {[
          ['Full Name',  user?.name],
          ['Email',      user?.email],
          ['Phone',      user?.phone || '—'],
          ['Member since', user?.created_at ? new Date(user.created_at).toLocaleDateString('en-KE', { month:'long', year:'numeric' }) : '—'],
        ].map(([label, value]) => (
          <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid var(--border)' }}>
            <span className="text-sm muted">{label}</span>
            <span className="text-sm bold">{value}</span>
          </div>
        ))}
      </div>

      {/* Skills (worker) */}
      {isWorker && user?.skills?.length > 0 && (
        <div className="card" style={{ marginBottom:12 }}>
          <div className="sec-title" style={{ marginBottom:10 }}>Skills</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {user.skills.map(s => <span key={s} className="tag tg-green">{s}</span>)}
          </div>
        </div>
      )}

      {/* M-Pesa */}
      <div className="card" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
        <div>
          <div className="text-sm bold">M-Pesa Number</div>
          <div className="text-sm muted">{user?.phone || 'Not set'}</div>
        </div>
        <span className="mpesa">M-PESA</span>
      </div>

      {/* Stats */}
      <div className="metrics" style={{ marginBottom:22 }}>
        <div className="metric">
          <div className="metric-val">{isWorker ? (user?.completed_jobs ?? 0) : '—'}</div>
          <div className="metric-lbl">{isWorker ? 'Completed' : 'Posted'}</div>
        </div>
        <div className="metric">
          <div className="metric-val" style={{ fontSize:'1.1rem' }}>
            {isWorker ? (user?.total_earned ? `${Math.round(user.total_earned/1000)}K` : '0') : '—'}
          </div>
          <div className="metric-lbl">{isWorker ? 'KES Earned' : 'Active'}</div>
        </div>
        <div className="metric">
          <div className="metric-val">{user?.rating?.toFixed(1) ?? '5.0'}</div>
          <div className="metric-lbl">Rating</div>
        </div>
      </div>

      {!confirm ? (
        <button className="btn btn-danger btn-full" onClick={() => setConfirm(true)}>Log Out</button>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div className="alert alert-err" style={{ textAlign:'center' }}>Are you sure you want to log out?</div>
          <div className="flex gap-2">
            <button className="btn btn-full" onClick={() => setConfirm(false)}>Cancel</button>
            <button className="btn btn-danger btn-full" onClick={doLogout}>Yes, Log Out</button>
          </div>
        </div>
      )}
    </div>
  )
}
