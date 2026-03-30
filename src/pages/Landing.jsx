import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobsAPI } from '../lib/api'
import JobCard from '../components/JobCard'
import JobModal from '../components/JobModal'

export default function Landing() {
  const [jobs, setJobs] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => { jobsAPI.getAll().then(setJobs).catch(() => {}) }, [])

  return (
    <div>
      <div className="hero">
        <div className="eyebrow">Kenya's Gig Economy Platform</div>
        <h1>Find work.<br /><span className="accent">Get paid.</span><br />Grow Kenya.</h1>
        <p>Connect skilled workers with employers across Nairobi. Payments via M-Pesa.</p>
        <div className="hero-cta">
          <Link to="/register" className="btn btn-primary btn-lg">Find Work →</Link>
          <Link to="/register?role=employer" className="btn btn-lg">Post a Job</Link>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat"><div className="stat-num">2,400+</div><div className="stat-lbl">Workers</div></div>
        <div className="stat"><div className="stat-num">{jobs.length || 5}</div><div className="stat-lbl">Live Jobs</div></div>
        <div className="stat"><div className="stat-num">KES 4M+</div><div className="stat-lbl">Paid out</div></div>
      </div>

      <div className="section">
        <div className="sec-head">
          <div className="sec-title">Latest Jobs</div>
          <Link to="/jobs" className="btn btn-sm btn-ghost">View all →</Link>
        </div>
        <div className="stack">
          {jobs.slice(0, 4).map(j => <JobCard key={j.id} job={j} onClick={setSelected} />)}
        </div>
      </div>

      <div style={{ padding:'0 18px 32px' }}>
        <div style={{ background:'var(--green)', borderRadius:'var(--r-xl)', padding:'26px 22px', textAlign:'center' }}>
          <div style={{ fontFamily:'var(--font-head)', fontSize:'1.25rem', fontWeight:800, color:'#fff', marginBottom:6 }}>Ready to start earning?</div>
          <div style={{ fontSize:13.5, color:'rgba(255,255,255,.8)', marginBottom:18 }}>Join thousands of workers already on KenyaWorks</div>
          <Link to="/register" className="btn" style={{ background:'#fff', color:'var(--green-dark)', borderColor:'#fff' }}>Create Free Account →</Link>
        </div>
      </div>

      {selected && <JobModal job={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
