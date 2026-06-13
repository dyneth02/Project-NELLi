import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  FiMapPin,
  FiCalendar,
  FiAlertCircle,
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
  FiRefreshCw,
  FiArrowRight,
  FiCheck,
  FiTool,
  FiPlus,
} from 'react-icons/fi'
import clsx from 'clsx'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
// 1. Updated import to the new hook
import { useGroupMaterialize } from '../../hooks/useAnimations'
import Aurora from '../../components/effects/Aurora'
import { analyticsApi } from '../../api/analyticsApi'
import { bookingApi } from '../../api/bookingApi'
import { ticketApi } from '../../api/ticketApi'

function unwrap(res) {
  if (res == null) return null
  return res.data !== undefined ? res.data : res
}

function timeAgo(isoString) {
  if (!isoString) return ''
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

function toBookingActivities(raw) {
  const list = Array.isArray(raw) ? raw : raw?.content || []
  return list.map((b) => {
    let message
    switch (b.status) {
      case 'PENDING':
        message = `New booking request for ${b.facilityName}${b.userName ? ` by ${b.userName}` : ''}`
        break
      case 'APPROVED':
        message = `Booking for ${b.facilityName} approved${b.approvedByName ? ` by ${b.approvedByName}` : ''}`
        break
      case 'REJECTED':
        message = `Booking for ${b.facilityName} rejected${b.approvedByName ? ` by ${b.approvedByName}` : ''}`
        break
      case 'CANCELLED':
        message = `Booking for ${b.facilityName} cancelled${b.approvedByName ? ` by ${b.approvedByName}` : ''}`
        break
      default:
        message = `Booking for ${b.facilityName}`
    }
    return {
      type: 'booking',
      message,
      time: timeAgo(b.createdAt),
      createdAt: b.createdAt,
      action: b.status === 'PENDING' ? 'Review' : null,
    }
  })
}

function toTicketActivities(raw) {
  const list = Array.isArray(raw) ? raw : raw?.content || []
  return list.map((t) => {
    const loc = t.facilityName ? ` at ${t.facilityName}` : ''
    const ref = t.ticketNumber ? `Ticket ${t.ticketNumber}` : 'Ticket'
    let message
    switch (t.status) {
      case 'OPEN':
        message = `New maintenance ticket: ${(t.description || '').slice(0, 60)}${loc}`
        break
      case 'IN_PROGRESS':
        message = `${ref} in progress${loc}`
        break
      case 'RESOLVED':
        message = `${ref} resolved${t.assignedToName ? ` by ${t.assignedToName}` : ''}${loc}`
        break
      case 'CLOSED':
        message = `${ref} closed${loc}`
        break
      default:
        message = `${ref}${loc}`
    }
    return {
      type: 'ticket',
      message,
      time: timeAgo(t.createdAt),
      createdAt: t.createdAt,
      action: t.status === 'OPEN' && !t.assignedToId ? 'Assign' : null,
    }
  })
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null)
  const [pendingCount, setPendingCount] = useState(0)
  const [unassignedCount, setUnassignedCount] = useState(0)
  const [topFacilities, setTopFacilities] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // 2. Switched to useGroupMaterialize (removed the stagger prop)
  const widgetRefs = useGroupMaterialize(6, { duration: 0.8 })

  const fetchData = useCallback(async () => {
    try {
      const [overviewRes, bookingsRes, ticketsRes, facilitiesRes, allBookingsRes, allTicketsRes] =
        await Promise.allSettled([
          analyticsApi.getOverview(),
          bookingApi.getAllBookings({ status: 'PENDING' }),
          ticketApi.getAllTickets({ assigned: 'false' }),
          analyticsApi.getTopUsedFacilities(5),
          bookingApi.getAllBookings({}),
          ticketApi.getAllTickets({}),
        ])

      if (overviewRes.status === 'fulfilled') setOverview(unwrap(overviewRes.value))

      if (bookingsRes.status === 'fulfilled') {
        const b = unwrap(bookingsRes.value)
        setPendingCount(Array.isArray(b) ? b.length : b?.totalElements || b?.count || 0)
      }
      if (ticketsRes.status === 'fulfilled') {
        const t = unwrap(ticketsRes.value)
        setUnassignedCount(Array.isArray(t) ? t.length : t?.totalElements || t?.count || 0)
      }
      if (facilitiesRes.status === 'fulfilled') {
        const f = unwrap(facilitiesRes.value)
        setTopFacilities(Array.isArray(f) ? f.slice(0, 5) : [])
      }

      const bookingActivities =
        allBookingsRes.status === 'fulfilled' ? toBookingActivities(unwrap(allBookingsRes.value)) : []
      const ticketActivities =
        allTicketsRes.status === 'fulfilled' ? toTicketActivities(unwrap(allTicketsRes.value)) : []

      const combined = [...bookingActivities, ...ticketActivities]
        .filter((item) => item.createdAt)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)

      setRecentActivity(combined)
    } catch {
      setOverview({ totalFacilities: 24, totalBookings: 342, totalTickets: 89, activeUsers: 156 })
      setPendingCount(7)
      setUnassignedCount(4)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleRefresh = () => { setRefreshing(true); fetchData() }

  const stats = [
    {
      icon: <FiMapPin size={22} />,
      label: 'Total Facilities',
      value: overview?.totalFacilities ?? 0,
      trend: '+2 this month',
      trendUp: true,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: <FiCalendar size={22} />,
      label: 'Total Bookings',
      value: overview?.totalBookings ?? 0,
      trend: `${pendingCount} pending`,
      trendUp: false,
      color: 'text-status-warning',
      bgColor: 'bg-status-warning/10',
    },
    {
      icon: <FiAlertCircle size={22} />,
      label: 'Total Tickets',
      value: overview?.totalTickets ?? 0,
      trend: `${unassignedCount} unassigned`,
      trendUp: false,
      color: 'text-status-info',
      bgColor: 'bg-status-info/10',
    },
    {
      icon: <FiUsers size={22} />,
      label: 'Active Users',
      value: overview?.activeUsers ?? 0,
      trend: '+12 this month',
      trendUp: true,
      color: 'text-status-success',
      bgColor: 'bg-status-success/10',
    },
  ]

  return (
    <div className="relative min-h-screen">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <Aurora
          colorStops={['#0891b2', '#06b6d4', '#40e0d0']}
          blend={0.3}
          amplitude={0.8}
          speed={0.3}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
              Admin Dashboard
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">Operational overview for administrators</p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleRefresh} icon={<FiRefreshCw className={clsx(refreshing && 'animate-spin')} />}>
            Refresh
          </Button>
        </div>

        {/* Pending Alert */}
        {(pendingCount > 0 || unassignedCount > 0) && (
            <Card className="mb-6 border-l-4 border-l-status-warning" padding="sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FiAlertCircle size={20} className="text-status-warning flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {pendingCount > 0 && `${pendingCount} booking${pendingCount > 1 ? 's' : ''} awaiting approval`}
                      {pendingCount > 0 && unassignedCount > 0 && ' · '}
                      {unassignedCount > 0 && `${unassignedCount} unassigned ticket${unassignedCount > 1 ? 's' : ''}`}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">Action required</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {pendingCount > 0 && (
                      <Link to="/admin/bookings">
                        <Button variant="primary" size="sm">Review Bookings</Button>
                      </Link>
                  )}
                  {unassignedCount > 0 && (
                      <Link to="/admin/tickets">
                        <Button variant="secondary" size="sm">Assign Tickets</Button>
                      </Link>
                  )}
                </div>
              </div>
            </Card>
        )}

        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((_, i) => (
                  <Card key={i} padding="sm" className="animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-xl" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/3" />
                        <div className="h-6 bg-[var(--bg-tertiary)] rounded w-1/4" />
                      </div>
                    </div>
                  </Card>
              ))}
            </div>
        ) : (
            /* Stats Cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, i) => (
                  // 3. Changed ref={widgetRefs.refs[i]} to ref={widgetRefs.setRef(i)}
                  <Card ref={widgetRefs.setRef(i)} key={i} padding="sm" hover>
                    <div className="flex items-center gap-4">
                      <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center', stat.bgColor)}>
                        <span className={stat.color}>{stat.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
                        <p className={clsx('text-2xl font-bold', stat.color)}>{stat.value}</p>
                        <p className={clsx('text-xs flex items-center gap-1', stat.trendUp ? 'text-status-success' : 'text-status-warning')}>
                          {stat.trendUp ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                          {stat.trend}
                        </p>
                      </div>
                    </div>
                  </Card>
              ))}
            </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <Link to="/admin/bookings">
            <Card padding="sm" hover className="text-center">
              <FiCheck size={20} className="mx-auto text-status-success mb-1" />
              <p className="text-sm font-medium text-[var(--text-primary)]">Approve Bookings</p>
            </Card>
          </Link>
          <Link to="/admin/tickets">
            <Card padding="sm" hover className="text-center">
              <FiTool size={20} className="mx-auto text-status-info mb-1" />
              <p className="text-sm font-medium text-[var(--text-primary)]">Assign Tickets</p>
            </Card>
          </Link>
          <Link to="/admin/facilities">
            <Card padding="sm" hover className="text-center">
              <FiPlus size={20} className="mx-auto text-primary mb-1" />
              <p className="text-sm font-medium text-[var(--text-primary)]">Add Facility</p>
            </Card>
          </Link>
          <Link to="/admin/users">
            <Card padding="sm" hover className="text-center">
              <FiUsers size={20} className="mx-auto text-status-warning mb-1" />
              <p className="text-sm font-medium text-[var(--text-primary)]">Manage Users</p>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          {/* 4. Changed ref={widgetRefs.refs[4]} to ref={widgetRefs.setRef(4)} */}
          <Card ref={widgetRefs.setRef(4)}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-bold text-[var(--text-primary)]">Recent Activity</h3>
            </div>
            {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="animate-pulse flex items-center gap-3">
                        <div className="w-8 h-8 bg-[var(--bg-tertiary)] rounded-full" />
                        <div className="flex-1 space-y-1">
                          <div className="h-4 bg-[var(--bg-tertiary)] rounded w-3/4" />
                          <div className="h-3 bg-[var(--bg-tertiary)] rounded w-1/4" />
                        </div>
                      </div>
                  ))}
                </div>
            ) : (
                <div className="space-y-3">
                  {recentActivity.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-tertiary)]">
                        <div className={clsx(
                            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                            item.type === 'booking' ? 'bg-primary/10' : 'bg-status-info/10',
                        )}>
                          {item.type === 'booking' ? (
                              <FiCalendar size={14} className="text-primary" />
                          ) : (
                              <FiAlertCircle size={14} className="text-status-info" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--text-primary)] truncate">{item.message}</p>
                          <p className="text-xs text-[var(--text-muted)]">{item.time}</p>
                        </div>
                        {item.action && (
                            <Link
                                to={item.type === 'booking' ? '/admin/bookings' : '/admin/tickets'}
                                className="text-xs text-primary font-medium hover:underline flex-shrink-0"
                            >
                              {item.action}
                            </Link>
                        )}
                      </div>
                  ))}
                </div>
            )}
          </Card>

          {/* Top Facilities */}
          {/* 5. Changed ref={widgetRefs.refs[5]} to ref={widgetRefs.setRef(5)} */}
          <Card ref={widgetRefs.setRef(5)}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-bold text-[var(--text-primary)]">Top Facilities</h3>
              <Link to="/admin/facilities" className="text-sm text-primary hover:underline flex items-center gap-1">
                View All <FiArrowRight size={14} />
              </Link>
            </div>
            {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="animate-pulse flex items-center gap-3">
                        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/3 flex-1" />
                        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-12" />
                      </div>
                  ))}
                </div>
            ) : topFacilities.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-8">No data available</p>
            ) : (
                <div className="space-y-3">
                  {topFacilities.map((f, i) => {
                    const utilization = f.utilization || f.bookingCount || 0
                    const maxUtil = Math.max(...topFacilities.map((x) => x.utilization || x.bookingCount || 0), 1)
                    return (
                        <div key={f.id} className="flex items-center gap-3">
                          <span className="text-sm font-bold text-[var(--text-muted)] w-6">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                                {f.name || f.facilityName}
                              </p>
                              <span className="text-xs text-[var(--text-muted)] ml-2">{utilization} bookings</span>
                            </div>
                            <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                              <div
                                  className="h-full bg-gradient-accent rounded-full transition-all duration-500"
                                  style={{ width: `${(utilization / maxUtil) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                    )
                  })}
                </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}