import { useState, useEffect, useCallback } from 'react'
import { notificationsAPI } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) return
    try {
      const data = await notificationsAPI.getAll()
      setNotifications(data)
      setUnread(data.filter(n => !n.read).length)
    } catch (e) {
      console.error('notifications load error', e)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    load()

    // Realtime: new notification arrives → prepend + bump unread count
    const channel = notificationsAPI.subscribe(user.id, (payload) => {
      const n = payload.new
      setNotifications(prev => [n, ...prev])
      setUnread(c => c + 1)
    })

    return () => notificationsAPI.unsubscribe(channel)
  }, [user, load])

  const markRead = async (id) => {
    await notificationsAPI.markRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    setUnread(c => Math.max(0, c - 1))
  }

  const markAllRead = async () => {
    await notificationsAPI.markAllRead()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnread(0)
  }

  return { notifications, unread, loading, markRead, markAllRead, reload: load }
}
