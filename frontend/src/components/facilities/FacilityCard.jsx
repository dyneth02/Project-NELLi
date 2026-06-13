import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { FiMapPin, FiUsers, FiCalendar, FiArrowRight } from 'react-icons/fi'
import clsx from 'clsx'
import Badge from '../common/Badge'
import Card from '../common/Card'

const FacilityCard = forwardRef(({ facility, className }, ref) => {
  const name = facility.name || facility.facilityName || 'Unnamed Facility'
  const facilityType = facility.type || null
  const typeLabel = facilityType || 'General'
  const capacity = facility.capacity ?? '?'
  const location = facility.location || ''
  const status = facility.status || 'ACTIVE'
  const equipment = facility.equipment || []
  const imageUrl = facilityType ? `/${facilityType}.jpg` : null

  const statusMap = {
    ACTIVE: { variant: 'success', label: 'Active' },
    OUT_OF_SERVICE: { variant: 'error', label: 'Out of Service' },
    MAINTENANCE: { variant: 'warning', label: 'Maintenance' },
  }
  const { variant, label } = statusMap[status] || { variant: 'default', label: status }

  return (
    <Card
      ref={ref}
      hover
      className={clsx('overflow-hidden group', className)}
    >
      {/* Image placeholder */}
      <div
        className="relative h-40 bg-gradient-card bg-cover bg-center overflow-hidden rounded-es-3xl rounded-se-3xl"
        style={imageUrl ? { backgroundImage: `url('${imageUrl}')` } : undefined}
      >
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.15)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <FiMapPin size={48} className="text-[var(--text-muted)] opacity-30" />
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-display font-bold text-[var(--text-primary)] mb-3 truncate group-hover:text-primary transition-colors">
          {name}
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="info">{typeLabel}</Badge>
          <Badge variant={variant}>{label}</Badge>
        </div>

        <div className="space-y-2 mb-4">
          {location && (
            <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
              <FiMapPin size={14} className="text-[var(--text-muted)] flex-shrink-0" />
              <span className="truncate">{location}</span>
            </p>
          )}
          <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
            <FiUsers size={14} className="text-[var(--text-muted)] flex-shrink-0" />
            Capacity: {capacity != null ? `${capacity} people` : 'Unknown'}
          </p>
        </div>

        {/* Equipment tags */}
        {equipment.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {equipment.slice(0, 3).map((eq, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
              >
                {eq}
              </span>
            ))}
            {equipment.length > 3 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                +{equipment.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to={`/facilities/${facility.id}`}
            className="flex-1 text-center px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            View Details
          </Link>
          {status === 'ACTIVE' && (
            <Link
              to={`/bookings/create?facility=${facility.id}`}
              className="px-4 py-2.5 rounded-lg bg-gradient-accent text-white text-sm font-medium hover:shadow-glow-md transition-all flex items-center gap-1"
            >
              <FiCalendar size={14} /> Book
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
})

FacilityCard.displayName = 'FacilityCard'

export default FacilityCard
