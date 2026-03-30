import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobsAPI } from '../lib/api'
import MpesaModal from '../components/MpesaModal'

export default function MyJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [updating, setUpdating] = useState(null)
  const [payTarget, setPayTarget] = useState(null) // { job, worker }

  useEffect(() => {
    jobsAPI.getMyJobs().then(setJobs).catch(console.error).finally(() => setLoading(false))
  }, [])

  const acceptApplicant = async (appId, jobId) => {
    try {
      setUpdating(appId)
      await jobsAPI.updateApplicationStatus(appId, 'accepted')
      setJobs(prev => prev.map(j => j.id !== jobId ? j : {
        ...j,
        applications: j.applications.map(a => ({ ...a, status: a.id === appId ? 'accepted' : a.status }))
      }))
    } catch (e) { alert(e.message) }
    finally { setUpdating(null) }
  }

  const handlePaySuccess = (jobId) => {
    setPayTarget(null)
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'completed' } : j))
  }

  if (loading) return <div className="spin-wrap"><div className="spin" /></div>

  return (
    <div className="section">
      <div className="sec-head">
        <div className="sec-title">{jobs.length} Job{jobs.length !== 1 ? 's' : ''}</div>
        <Link to="/post-job" className="btn btn-sm btn-primary">+ New</Link>
      </div>

      {jobs.length === 0 && (
        <div className="empty">
          <div className="empty-icon">📌</div>
          <h3>No jobs yet</h3>
          <p>Post your first job to start finding workers.</p>
          <Link to="/post-job" className="btn btn-primary" style={{ marginTop:16 }}>Post a Job →</Link>
        </div>
      )}

      <div className="stack">
        {jobs.map(job => (
          <div key={job.id}>
            <div className="card card-click anim" onClick={() => setExpanded(expanded === job.id ? null : job.id)}>
              <div className="flex justify-between items-center gap-2" style={{ marginBottom:8 }}>
                <div className="job-title">{job.title}</div>
                <div className="job-budget">KES {Number(job.budget).toLocaleString()}</div>
              </div>
              <div className="job-foot">
                <span className={`tag ${job.status === 'open' ? 'tg-green' : job.status === 'completed' ? 'tg' : 'tg-red'}`}>
                  ● {job.status}
                </span>
                <span className="tag tg-amber">👥 {job.applications?.length ?? 0} applied</span>
                {job.location && <span className="tag tg">📍 {job.location}</span>}
                <span className="tag tg" style={{ marginLeft:'auto' }}>
                  {expanded === job.id ? '▲ hide' : '▼ applicants'}
                </span>
              </div>
            </div>

            {expanded === job.id && (
              <div style={{ marginTop:-8, background:'var(--surface)', border:'1px solid var(--border)', borderTop:'none', borderRadius:`0 0 var(--r-lg) var(--r-lg)`, padding:14 }}>
                {!job.applications?.length ? (
                  <div className="text-sm muted" style={{ textAlign:'center', padding:'10px 0' }}>No applicants yet</div>
                ) : (
                  <div className="stack" style={{ gap:8 }}>
                    <div className="sec-title" style={{ marginBottom:4 }}>Applicants</div>
                    {job.applications.map((app, i) => {
                      const w = app.worker ?? {}
                      const initials = w.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() ?? '??'
                      return (
                        <div key={app.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'var(--white)', borderRadius:'var(--r-md)', border:'1px solid var(--border)' }}>
                          <div className="avatar" style={{ width:36, height:36, fontSize:'0.8rem' }}>{initials}</div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:13, fontWeight:600 }}>{w.name ?? `Applicant ${i+1}`}</div>
                            <div style={{ fontSize:11, color:'var(--ink-mid)' }}>{w.phone ?? '—'}</div>
                            {w.skills?.length > 0 && (
                              <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:4 }}>
                                {w.skills.slice(0,3).map(s => <span key={s} className="tag tg" style={{ fontSize:10 }}>{s}</span>)}
                              </div>
                            )}
                          </div>
                          <div style={{ display:'flex', flexDirection:'column', gap:5, alignItems:'flex-end', flexShrink:0 }}>
                            {app.status === 'accepted' ? (
                              <>
                                <span className="tag tg-green">✓ Accepted</span>
                                {job.status !== 'completed' && (
                                  <button
                                    className="btn btn-sm"
                                    style={{ background:'var(--green)', color:'#fff', borderColor:'var(--green)', fontSize:11 }}
                                    onClick={() => setPayTarget({ job, worker: w })}
                                  >
                                    💰 Pay M-Pesa
                                  </button>
                                )}
                                {job.status === 'completed' && (
                                  <span className="mpesa" style={{ fontSize:10 }}>PAID</span>
                                )}
                              </>
                            ) : app.status === 'rejected' ? (
                              <span className="tag tg-red">Declined</span>
                            ) : (
                              <button
                                className="btn btn-sm btn-primary"
                                disabled={!!updating}
                                onClick={() => acceptApplicant(app.id, job.id)}
                              >
                                {updating === app.id ? '…' : 'Accept'}
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {payTarget && (
        <MpesaModal
          job={payTarget.job}
          workerId={payTarget.worker.id}
          workerName={payTarget.worker.name}
          onClose={() => setPayTarget(null)}
          onSuccess={() => handlePaySuccess(payTarget.job.id)}
        />
      )}
    </div>
  )
}
