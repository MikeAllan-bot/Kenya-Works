const ICONS = { Construction:'🔨', Cleaning:'🧹', Delivery:'🏍️', Cooking:'🍳', Driving:'🚗', Tech:'💻', Other:'📦' }

export default function JobCard({ job, onClick, applied, showCount }) {
  const count = job.applications?.length ?? 0
  return (
    <div className="card card-click anim" onClick={() => onClick?.(job)}>
      <div className="flex justify-between items-center gap-2" style={{ marginBottom: 8 }}>
        <div className="job-title">{job.title}</div>
        <div className="job-budget">KES {Number(job.budget).toLocaleString()}</div>
      </div>
      <div className="job-desc" style={{ marginBottom: 10 }}>
        {job.description?.slice(0, 95)}{job.description?.length > 95 ? '…' : ''}
      </div>
      <div className="job-foot">
        <span className="tag tg-green">{ICONS[job.category] ?? '💼'} {job.category}</span>
        {job.location && <span className="tag tg">📍 {job.location}</span>}
        {showCount && <span className="tag tg-amber">👥 {count}</span>}
        {applied && <span className="tag tg-green">✓ Applied</span>}
        {job.status === 'closed' && <span className="tag tg-red">Closed</span>}
      </div>
    </div>
  )
}
