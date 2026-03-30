import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [p] = useSearchParams()
  const [role, setRole] = useState(p.get('role') === 'employer' ? 'employer' : 'worker')
  const [f, setF] = useState({ name:'', email:'', password:'', phone:'', skills:'' })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const { register } = useAuth()
  const nav = useNavigate()
  const set = (k,v) => setF(x => ({ ...x, [k]:v }))

  const submit = async () => {
    if (!f.name || !f.email || !f.password || !f.phone) return setErr('Please fill all required fields.')
    if (f.password.length < 6) return setErr('Password must be at least 6 characters.')
    try {
      setLoading(true); setErr(null)
      await register({ ...f, role, skills: role==='worker' ? f.skills.split(',').map(s=>s.trim()).filter(Boolean) : [] })
      nav('/dashboard')
    } catch(e) { setErr(e.message || 'Registration failed.') }
    finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-head"><h2>Create account</h2><p>Join thousands earning through KenyaWorks</p></div>

      <div>
        <div className="sec-title" style={{ marginBottom:9 }}>I am a…</div>
        <div className="role-toggle">
          <button className={`role-btn ${role==='worker'?'on':''}`} onClick={() => setRole('worker')}>
            <span className="role-icon">🔧</span><span className="role-name">Worker</span><span className="role-sub">Find & do jobs</span>
          </button>
          <button className={`role-btn ${role==='employer'?'on':''}`} onClick={() => setRole('employer')}>
            <span className="role-icon">🏢</span><span className="role-name">Employer</span><span className="role-sub">Post & hire</span>
          </button>
        </div>
      </div>

      <div className="form-stack">
        <div className="form-row">
          <div className="field"><label>Full Name *</label><input className="input" placeholder="John Kamau" value={f.name} onChange={e=>set('name',e.target.value)} /></div>
          <div className="field"><label>Phone (M-Pesa) *</label><input className="input" placeholder="0712 345 678" value={f.phone} onChange={e=>set('phone',e.target.value)} /></div>
        </div>
        <div className="field"><label>Email *</label><input className="input" type="email" placeholder="john@email.com" value={f.email} onChange={e=>set('email',e.target.value)} /></div>
        <div className="field"><label>Password *</label><input className="input" type="password" placeholder="Min. 6 characters" value={f.password} onChange={e=>set('password',e.target.value)} /></div>
        {role === 'worker' && (
          <div className="field"><label>Skills (comma separated)</label><input className="input" placeholder="Carpentry, Welding, Plumbing" value={f.skills} onChange={e=>set('skills',e.target.value)} /></div>
        )}
      </div>

      {err && <div className="alert alert-err">{err}</div>}

      <button className="btn btn-primary btn-lg btn-full" onClick={submit} disabled={loading}>
        {loading ? <><span className="spin" style={{width:18,height:18}} /> Creating…</> : 'Create Account →'}
      </button>
      <div className="auth-foot">Already have an account? <Link to="/login">Log in</Link></div>
    </div>
  )
}
