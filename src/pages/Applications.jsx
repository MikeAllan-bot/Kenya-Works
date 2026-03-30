import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobsAPI } from '../lib/api'
import JobModal from '../components/JobModal'

const STATUS = {
  pending:  { label: 'Pending review', cls: 'tg-amber' },
  accepted: { label: '✓ Accepted',     cls: 'tg-green' },
  rejected: { label: 'Declined',       cls: 'tg-red'   },
}

export default function Applications() {
  const [apps, setApps] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobsAPI.getApplications()
      .then(setApps)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spin-wrap"><div className="spin" /></div>

  return (
    <div className="section">
      <div className="sec-head">
        <div className="sec-title">{apps.length} Application{apps.length !== 1 ? 's' : ''}</div>
      </div>

      {apps.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📋</div>
          <h3>No applications yet</h3>
          <p>Browse jobs and tap Apply to get started.</p>
          <Link to="/jobs" className="btn btn-primary" style={{ marginTop:16 }}>Find Jobs →</Link>
        </div>
      ) : (
        <div className="stack">
          {apps.map(app => {
            const job = app.job
            if (!job) return null
            const s = STATUS[app.status] ?? STATUS.pending
            return (
              <div key={app.id} className="card card-click anim" onClick={() => setSelected(job)}>
                <div className="flex justify-between items-center gap-2" style={{ marginBottom:8 }}>
                  <div className="job-title">{job.title}</div>
                  <div className="job-budget">KES {Number(job.budget).toLocaleString()}</div>
                </div>
                <div className="job-foot">
                  <span className={`tag ${s.cls}`}>{s.label}</span>
                  {job.location && <span className="tag tg">📍 {job.location}</span>}
                  <span className="tag tg">
                    {new Date(app.applied_at).toLocaleDateString('en-KE', { day:'numeric', month:'short' })}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selected && <JobModal job={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
