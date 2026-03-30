import { useState, useRef, useEffect } from 'react'
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
  return `${Math.floor(h / 24)}d ago`
}

export default function NotificationBell() {
  const { notifications, unread, loading, markRead, markAllRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleOpen = () => {
    setOpen(o => !o)
  }

  const handleClick = async (n) => {
    if (!n.read) await markRead(n.id)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Bell button */}
      <button onClick={handleOpen} style={{
        position: 'relative', background: 'none', border: 'none',
        cursor: 'pointer', padding: '6px', color: 'var(--ink-mid)',
        borderRadius: 'var(--r-sm)', transition: 'background .14s',
        display: 'flex', alignItems: 'center',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            minWidth: 16, height: 16, borderRadius: 8,
            background: 'var(--red)', color: '#fff',
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 4px', lineHeight: 1,
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: 'fixed', top: 58, right: 8,
          width: 320, maxWidth: 'calc(100vw - 16px)',
          background: 'var(--white)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-md)',
          zIndex: 999, overflow: 'hidden',
          animation: 'up .18s ease',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '13px 16px', borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>
              Notifications {unread > 0 && <span style={{ color: 'var(--green)', fontSize: 13 }}>({unread} new)</span>}
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} style={{
                fontSize: 12, color: 'var(--green-dark)', background: 'none',
                border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-body)',
              }}>
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {loading && (
              <div style={{ padding: 24, textAlign: 'center' }}>
                <div className="spin" style={{ margin: '0 auto' }} />
              </div>
            )}
            {!loading && notifications.length === 0 && (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--ink-mid)', fontSize: 13 }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>🔔</div>
                No notifications yet
              </div>
            )}
            {notifications.map(n => (
              <div key={n.id} onClick={() => handleClick(n)} style={{
                display: 'flex', gap: 11, padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                background: n.read ? 'var(--white)' : 'var(--green-light)',
                cursor: 'pointer', transition: 'background .14s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = n.read ? 'var(--surface)' : '#d4f0e5'}
                onMouseLeave={e => e.currentTarget.style.background = n.read ? 'var(--white)' : 'var(--green-light)'}
              >
                <span style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: 1 }}>
                  {TYPE_ICON[n.type] ?? '🔔'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 700, lineHeight: 1.3, marginBottom: 2 }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-mid)', lineHeight: 1.4, marginBottom: 4 }}>
                    {n.body}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                    {timeAgo(n.created_at)}
                  </div>
                </div>
                {!n.read && (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--green)', flexShrink: 0, marginTop: 5,
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
