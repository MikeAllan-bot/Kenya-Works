import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobsAPI } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import JobCard from '../components/JobCard'
import JobModal from '../components/JobModal'

export default function WorkerDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState({ applied: 0, completed: 0, earned: 0 })
  const [selected, setSelected] = useState(null)
  const [appliedIds, setAppliedIds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      jobsAPI.getAll(),
      jobsAPI.getApplications(),
    ]).then(([allJobs, apps]) => {
      setJobs(allJobs.slice(0, 5))
      const ids = apps.map(a => a.job?.id).filter(Boolean)
      setAppliedIds(ids)
      setStats({
        applied: apps.length,
        completed: user?.completed_jobs ?? 0,
        earned: user?.total_earned ?? 0,
      })
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const first = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div>
      <div style={{ padding:'22px 18px 0' }}>
        <div style={{ fontFamily:'var(--font-head)', fontSize:'1.35rem', fontWeight:800, marginBottom:3 }}>
          {greeting}, {first} 👋
        </div>
        <div className="muted text-sm">Here's what's available today</div>
      </div>

      <div className="section">
        <div className="metrics">
          <div className="metric"><div className="metric-val">{stats.applied}</div><div className="metric-lbl">Applied</div></div>
          <div className="metric"><div className="metric-val">{stats.completed}</div><div className="metric-lbl">Completed</div></div>
          <div className="metric">
            <div className="metric-val" style={{ fontSize: stats.earned >= 10000 ? '1.1rem' : '1.45rem' }}>
              {stats.earned >= 1000 ? `${(stats.earned/1000).toFixed(0)}K` : stats.earned}
            </div>
            <div className="metric-lbl">KES Earned</div>
          </div>
        </div>
      </div>

      <hr className="divider" />

      <div className="section">
        <div className="sec-head">
          <div className="sec-title">Recent Opportunities</div>
          <Link to="/jobs" className="btn btn-sm btn-ghost">Browse all →</Link>
        </div>

        {loading && <div className="spin-wrap"><div className="spin" /></div>}

        <div className="stack">
          {jobs.map(j => (
            <JobCard key={j.id} job={j} onClick={setSelected} applied={appliedIds.includes(j.id)} />
          ))}
        </div>
      </div>

      <div style={{ padding:'0 18px 24px' }}>
        <Link to="/jobs" className="btn btn-outline btn-full btn-lg">Browse All Jobs →</Link>
      </div>

      {selected && (
        <JobModal job={selected} onClose={() => setSelected(null)}
          onApplied={id => setAppliedIds(a => [...a, id])} />
      )}
    </div>
  )
}
