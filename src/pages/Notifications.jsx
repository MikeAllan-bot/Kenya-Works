import { useNotifications } from '../hooks/useNotifications'

const TYPE_ICON = {
  application_received: '📩',
  application_accepted: '🎉',
  application_rejected: '📋',
  job_assigned:         '✅',
  payment_initiated:    '⏳',
  payment_success:      '💰',
  payment_failed:       '❌',
  new_job_posted:       '📌',
}

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts)
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7)  return `${d}d ago`
  return new Date(ts).toLocaleDateString('en-KE', { day:'numeric', month:'short' })
}

export default function Notifications() {
  const { notifications, unread, loading, markRead, markAllRead } = useNotifications()

  return (
    <div className="section">
      <div className="sec-head">
        <div className="sec-title">
          Notifications {unread > 0 && <span style={{ color:'var(--green)', marginLeft:4 }}>({unread} new)</span>}
        </div>
        {unread > 0 && (
          <button className="btn btn-sm btn-ghost" onClick={markAllRead}>Mark all read</button>
        )}
      </div>

      {loading && <div className="spin-wrap"><div className="spin" /></div>}

      {!loading && notifications.length === 0 && (
        <div className="empty">
          <div className="empty-icon">🔔</div>
          <h3>No notifications yet</h3>
          <p>You'll see updates about your jobs and payments here.</p>
        </div>
      )}

      <div className="stack" style={{ gap:0 }}>
        {notifications.map((n, i) => (
          <div key={n.id}
            onClick={() => !n.read && markRead(n.id)}
            style={{
              display:'flex', gap:13, padding:'14px 4px',
              borderBottom: i < notifications.length - 1 ? '1px solid var(--border)' : 'none',
              cursor: n.read ? 'default' : 'pointer',
              background: n.read ? 'transparent' : 'var(--green-light)',
              borderRadius: !n.read ? 'var(--r-md)' : 0,
              paddingLeft: !n.read ? 12 : 4,
              paddingRight: !n.read ? 12 : 4,
              transition: 'background .14s',
            }}
          >
            <div style={{
              width:40, height:40, borderRadius:'50%',
              background: n.read ? 'var(--surface)' : 'rgba(29,158,117,.15)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'1.15rem', flexShrink:0,
            }}>
              {TYPE_ICON[n.type] ?? '🔔'}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{
                fontSize:14, fontWeight: n.read ? 500 : 700,
                lineHeight:1.3, marginBottom:3, color:'var(--ink)',
              }}>
                {n.title}
              </div>
              <div style={{ fontSize:13, color:'var(--ink-mid)', lineHeight:1.5, marginBottom:4 }}>
                {n.body}
              </div>
              <div style={{ fontSize:11, color:'var(--ink-soft)' }}>{timeAgo(n.created_at)}</div>
            </div>
            {!n.read && (
              <div style={{
                width:9, height:9, borderRadius:'50%',
                background:'var(--green)', flexShrink:0, marginTop:6,
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
