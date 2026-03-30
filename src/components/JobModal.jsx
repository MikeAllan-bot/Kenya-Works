import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { jobsAPI } from '../lib/api'

export default function JobModal({ job, onClose, onApplied }) {
  const { user, isWorker } = useAuth()
  const [loading, setLoading] = useState(false)
  const [applied, setApplied] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    if (user && isWorker) jobsAPI.hasApplied(job.id).then(setApplied)
  }, [job.id, user, isWorker])

  const apply = async () => {
    try {
      setLoading(true); setMsg(null)
      await jobsAPI.apply(job.id)
      setApplied(true)
      setMsg({ ok: true, text: '✓ Application sent! The employer will contact you.' })
      onApplied?.(job.id)
    } catch (e) {
      setMsg({ ok: false, text: e.message?.includes('unique') ? 'You already applied.' : (e.message || 'Failed to apply.') })
    } finally { setLoading(false) }
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-handle" />
        <div className="sheet-body">
          <div>
            <div className="sheet-title">{job.title}</div>
            <div className="flex gap-2 mt-1" style={{ flexWrap:'wrap' }}>
              <span className="tag tg-green">{job.category}</span>
              {job.location && <span className="tag tg">📍 {job.location}</span>}
            </div>
          </div>

          <div style={{ background:'var(--surface)', borderRadius:'var(--r-md)', padding:14, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:11, color:'var(--ink-mid)', marginBottom:3 }}>Budget</div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:'1.6rem', fontWeight:800, color:'var(--green)', lineHeight:1 }}>
                KES {Number(job.budget).toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:11, color:'var(--ink-mid)', marginBottom:3 }}>Applicants</div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:'1.6rem', fontWeight:800, lineHeight:1 }}>
                {job.applications?.length ?? 0}
              </div>
            </div>
          </div>

          <div>
            <div className="sec-title" style={{ marginBottom:8 }}>Description</div>
            <p style={{ fontSize:14, lineHeight:1.7, color:'var(--ink-mid)' }}>{job.description}</p>
          </div>

          {job.skills?.length > 0 && (
            <div>
              <div className="sec-title" style={{ marginBottom:8 }}>Skills needed</div>
              <div className="flex gap-2" style={{ flexWrap:'wrap' }}>
                {job.skills.map(s => <span key={s} className="tag tg">{s}</span>)}
              </div>
            </div>
          )}

          {job.employer && (
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 13px', background:'var(--surface)', borderRadius:'var(--r-md)' }}>
              <div className="avatar" style={{ width:38, height:38, fontSize:'0.85rem' }}>
                {job.employer.name?.slice(0,2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{job.employer.name}</div>
                <div style={{ fontSize:11, color:'var(--ink-mid)' }}>⭐ {job.employer.rating?.toFixed(1) ?? '5.0'} rating</div>
              </div>
              <span className="mpesa" style={{ marginLeft:'auto' }}>M-PESA</span>
            </div>
          )}

          {job.deadline && (
            <div className="text-sm muted">📅 Deadline: {new Date(job.deadline).toLocaleDateString('en-KE', { day:'numeric', month:'long', year:'numeric' })}</div>
          )}

          {msg && <div className={`alert ${msg.ok ? 'alert-ok' : 'alert-err'}`}>{msg.text}</div>}

          {isWorker && !applied && !msg?.ok && (
            <button className="btn btn-primary btn-lg btn-full" onClick={apply} disabled={loading}>
              {loading ? <><span className="spin" style={{width:16,height:16}} /> Applying…</> : 'Apply for this Job →'}
            </button>
          )}
          {isWorker && (applied || msg?.ok) && (
            <button className="btn btn-full" disabled style={{ opacity:.6 }}>✓ Applied</button>
          )}
          {!user && (
            <a href="/register" className="btn btn-primary btn-lg btn-full" style={{ textAlign:'center' }}>Sign up to Apply →</a>
          )}
          {user && !isWorker && (
            <div className="alert" style={{ background:'var(--amber-light)', color:'var(--amber)' }}>
              Log in as a worker to apply for jobs.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
