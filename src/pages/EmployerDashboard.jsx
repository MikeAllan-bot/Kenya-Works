import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobsAPI } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function EmployerDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobsAPI.getMyJobs()
      .then(setJobs)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const totalApplicants = jobs.reduce((s, j) => s + (j.applications?.length ?? 0), 0)
  const active = jobs.filter(j => j.status === 'open').length
  const first = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div>
      <div style={{ padding:'22px 18px 0' }}>
        <div style={{ fontFamily:'var(--font-head)', fontSize:'1.35rem', fontWeight:800, marginBottom:3 }}>Dashboard</div>
        <div className="muted text-sm">Welcome back, {first}</div>
      </div>

      <div className="section">
        <div className="metrics">
          <div className="metric"><div className="metric-val">{jobs.length}</div><div className="metric-lbl">Posted</div></div>
          <div className="metric"><div className="metric-val">{totalApplicants}</div><div className="metric-lbl">Applicants</div></div>
          <div className="metric"><div className="metric-val">{active}</div><div className="metric-lbl">Active</div></div>
        </div>
      </div>

      <hr className="divider" />

      <div className="section">
        <div className="sec-head">
          <div className="sec-title">Your Jobs</div>
          <Link to="/post-job" className="btn btn-sm btn-primary">+ Post Job</Link>
        </div>

        {loading && <div className="spin-wrap"><div className="spin" /></div>}

        {!loading && jobs.length === 0 && (
          <div className="empty">
            <div className="empty-icon">📌</div>
            <h3>No jobs posted yet</h3>
            <p>Post your first job and start receiving applications.</p>
            <Link to="/post-job" className="btn btn-primary" style={{ marginTop:16 }}>Post First Job →</Link>
          </div>
        )}

        <div className="stack">
          {jobs.map(job => (
            <div key={job.id} className="card anim">
              <div className="flex justify-between items-center gap-2" style={{ marginBottom:8 }}>
                <div className="job-title">{job.title}</div>
                <div className="job-budget">KES {Number(job.budget).toLocaleString()}</div>
              </div>
              <div className="job-desc" style={{ marginBottom:10 }}>
                {job.description?.slice(0, 80)}…
              </div>
              <div className="job-foot">
                <span className={`tag ${job.status === 'open' ? 'tg-green' : 'tg-red'}`}>
                  ● {job.status}
                </span>
                <span className="tag tg-amber">👥 {job.applications?.length ?? 0} applied</span>
                {job.location && <span className="tag tg">📍 {job.location}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:'0 18px 24px' }}>
        <Link to="/post-job" className="btn btn-primary btn-full btn-lg">+ Post a New Job</Link>
      </div>
    </div>
  )
}
