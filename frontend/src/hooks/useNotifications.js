import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { notificationApi } from '../api/notificationApi.js'

function parseUnreadPayload(raw) {
  if (raw == null) return 0
  const inner = raw.data !== undefined ? raw.data : raw
  if (typeof inner === 'number') return inner
  if (typeof inner === 'string') return Number.parseInt(inner, 10) || 0
  return (
    inner.count ??
    inner.unreadCount ??
    inner.unread ??
    0
  )
}

/**
 * Unread notification count for the authenticated user.
 * @param {{ pollIntervalMs?: number }} [options]
 */
export function useNotifications(options = {}) {
  const { pollIntervalMs = 120_000 } = options
  const { isAuthenticated } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const refetch = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0)
      return
    }
    setIsLoading(true)
    try {
      const res = await notificationApi.getUnreadCount()
      setUnreadCount(parseUnreadPayload(res))
    } catch {
      setUnreadCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    if (!isAuthenticated || !pollIntervalMs) return undefined
    const id = window.setInterval(refetch, pollIntervalMs)
    return () => window.clearInterval(id)
  }, [isAuthenticated, pollIntervalMs, refetch])

  return { unreadCount, isLoading, refetch }
}
