import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [f, setF] = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const { login } = useAuth()
  const nav = useNavigate()
  const set = (k,v) => setF(x => ({ ...x, [k]:v }))

  const submit = async () => {
    if (!f.email || !f.password) return setErr('Enter your email and password.')
    try {
      setLoading(true); setErr(null)
      await login(f)
      nav('/dashboard')
    } catch(e) { setErr(e.message || 'Login failed. Check your credentials.') }
    finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-head"><h2>Welcome back</h2><p>Login to your KenyaWorks account</p></div>

      <div className="form-stack">
        <div className="field"><label>Email</label><input className="input" type="email" placeholder="john@email.com" value={f.email} onChange={e=>set('email',e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} /></div>
        <div className="field"><label>Password</label><input className="input" type="password" placeholder="Your password" value={f.password} onChange={e=>set('password',e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} /></div>
      </div>

      {err && <div className="alert alert-err">{err}</div>}

      <button className="btn btn-primary btn-lg btn-full" onClick={submit} disabled={loading}>
        {loading ? <><span className="spin" style={{width:18,height:18}} /> Logging in…</> : 'Log In →'}
      </button>
      <div className="auth-foot">No account? <Link to="/register">Create one free</Link></div>

      <div style={{ borderTop:'1px solid var(--border)', paddingTop:16 }}>
        <div className="text-sm muted" style={{ textAlign:'center', marginBottom:10 }}>Demo accounts (password: demo123)</div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-full btn-sm" onClick={() => setF({ email:'worker@demo.com', password:'demo123' })}>🔧 Worker</button>
          <button className="btn btn-outline btn-full btn-sm" onClick={() => setF({ email:'employer@demo.com', password:'demo123' })}>🏢 Employer</button>
        </div>
      </div>
    </div>
  )
}
