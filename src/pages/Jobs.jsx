import { useState, useEffect } from 'react'
import { jobsAPI } from '../lib/api'
import JobCard from '../components/JobCard'
import JobModal from '../components/JobModal'

const CATS = ['All','Construction','Cleaning','Delivery','Cooking','Driving','Tech','Other']

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const [selected, setSelected] = useState(null)
  const [appliedIds, setAppliedIds] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    setLoading(true)
    try { setJobs(await jobsAPI.getAll({ category: cat, search })) }
    catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [cat])

  useEffect(() => {
    const t = setTimeout(fetch, 350)
    return () => clearTimeout(t)
  }, [search])

  return (
    <div>
      <div className="section" style={{ paddingBottom:0 }}>
        <div className="search-wrap" style={{ marginBottom:10 }}>
          <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="input search-input" placeholder="Search jobs, skills, location…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:12, scrollbarWidth:'none' }}>
          {CATS.map(c => (
            <button key={c} className={`btn btn-sm ${cat===c ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flexShrink:0 }} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
      </div>

      <div className="section" style={{ paddingTop:8 }}>
        <div className="sec-head">
          <div className="sec-title">{jobs.length} job{jobs.length!==1?'s':''} found</div>
        </div>

        {loading && <div className="spin-wrap"><div className="spin" /></div>}

        {!loading && jobs.length === 0 && (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <h3>No jobs found</h3>
            <p>Try a different search or category</p>
          </div>
        )}

        <div className="stack">
          {jobs.map(j => (
            <JobCard key={j.id} job={j} onClick={setSelected} applied={appliedIds.includes(j.id)} />
          ))}
        </div>
      </div>

      {selected && (
        <JobModal job={selected} onClose={() => setSelected(null)}
          onApplied={id => setAppliedIds(a => [...a, id])} />
      )}
    </div>
  )
}
