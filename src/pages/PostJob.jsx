import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobsAPI } from '../lib/api'

const CATS = ['Construction','Cleaning','Delivery','Cooking','Driving','Tech','Other']

export default function PostJob() {
  const nav = useNavigate()
  const [f, setF] = useState({ title:'', description:'', budget:'', category:'Construction', location:'', skills:'', deadline:'' })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const [done, setDone] = useState(false)
  const set = (k,v) => setF(x => ({ ...x, [k]:v }))

  const submit = async () => {
    if (!f.title || !f.description || !f.budget) return setErr('Title, description and budget are required.')
    if (isNaN(Number(f.budget)) || Number(f.budget) <= 0) return setErr('Enter a valid budget amount in KES.')
    try {
      setLoading(true); setErr(null)
      await jobsAPI.create({
        title: f.title, description: f.description,
        budget: Number(f.budget), category: f.category,
        location: f.location || 'Nairobi',
        skills: f.skills.split(',').map(s => s.trim()).filter(Boolean),
        deadline: f.deadline || null,
      })
      setDone(true)
      setTimeout(() => nav('/dashboard'), 1800)
    } catch(e) { setErr(e.message || 'Failed to post job.') }
    finally { setLoading(false) }
  }

  if (done) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'64px 24px', gap:14, textAlign:'center' }}>
      <div style={{ fontSize:'3rem' }}>🎉</div>
      <h2 style={{ fontFamily:'var(--font-head)' }}>Job Posted!</h2>
      <p className="muted">Workers are being notified. Redirecting…</p>
      <div className="spin" />
    </div>
  )

  return (
    <div style={{ padding:'22px 18px' }}>
      <div style={{ marginBottom:22 }}>
        <div style={{ fontFamily:'var(--font-head)', fontSize:'1.35rem', fontWeight:800 }}>Post a Job</div>
        <div className="muted text-sm" style={{ marginTop:3 }}>Reach skilled workers across Nairobi instantly</div>
      </div>

      <div className="form-stack">
        <div className="field">
          <label>Job Title *</label>
          <input className="input" placeholder="e.g. Experienced Carpenter needed — Westlands" value={f.title} onChange={e=>set('title',e.target.value)} />
        </div>
        <div className="field">
          <label>Description *</label>
          <textarea className="input" placeholder="Describe the work, requirements and timeline…" value={f.description} onChange={e=>set('description',e.target.value)} />
        </div>
        <div className="form-row">
          <div className="field">
            <label>Budget (KES) *</label>
            <input className="input" type="number" placeholder="5000" value={f.budget} onChange={e=>set('budget',e.target.value)} />
          </div>
          <div className="field">
            <label>Category</label>
            <select className="input" value={f.category} onChange={e=>set('category',e.target.value)}>
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label>Location</label>
            <input className="input" placeholder="Westlands, Nairobi" value={f.location} onChange={e=>set('location',e.target.value)} />
          </div>
          <div className="field">
            <label>Deadline</label>
            <input className="input" type="date" value={f.deadline} onChange={e=>set('deadline',e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Skills Needed (comma separated)</label>
          <input className="input" placeholder="Carpentry, Welding, Electrical" value={f.skills} onChange={e=>set('skills',e.target.value)} />
        </div>
      </div>

      {err && <div className="alert alert-err" style={{ marginTop:14 }}>{err}</div>}

      <div style={{ marginTop:20, display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--green-light)', borderRadius:'var(--r-md)', padding:'11px 13px' }}>
          <span className="mpesa">M-PESA</span>
          <span className="text-sm" style={{ color:'var(--green-dark)' }}>Worker will be paid via M-Pesa on job completion.</span>
        </div>
        <button className="btn btn-primary btn-lg btn-full" onClick={submit} disabled={loading}>
          {loading ? <><span className="spin" style={{width:18,height:18}} /> Posting…</> : 'Post Job →'}
        </button>
      </div>
    </div>
  )
}
