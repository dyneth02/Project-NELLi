import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QrScanner from 'qr-scanner'
import { FiCheckCircle, FiUpload, FiXCircle } from 'react-icons/fi'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Aurora from '../components/effects/Aurora'
import { bookingApi } from '../api/bookingApi'

function extractBookingId(raw) {
  if (!raw || typeof raw !== 'string') return null
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed?.bookingId === 'string' && parsed.bookingId.trim()) {
      return parsed.bookingId.trim()
    }
  } catch {
    // not JSON QR payload, continue with plain text
  }
  return raw.trim() || null
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(dateStr) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function durationLabel(start, end) {
  if (!start || !end) return 'N/A'
  const diffMinutes = Math.max(0, Math.round((new Date(end) - new Date(start)) / 60000))
  const h = Math.floor(diffMinutes / 60)
  const m = diffMinutes % 60
  if (h <= 0) return `${m}m`
  return `${h}h${m > 0 ? ` ${m}m` : ''}`
}

export default function BookingVerify() {
  const navigate = useNavigate()
  const [isDecoding, setIsDecoding] = useState(false)
  const [decodedText, setDecodedText] = useState('')
  const [verifiedBooking, setVerifiedBooking] = useState(null)
  const [error, setError] = useState('')

  const validity = useMemo(() => {
    if (!verifiedBooking?.startDateTime || !verifiedBooking?.endDateTime) return null
    const now = new Date()
    const start = new Date(verifiedBooking.startDateTime)
    const end = new Date(verifiedBooking.endDateTime)
    if (now < start) return 'Upcoming booking'
    if (now > end) return 'Booking time passed'
    return 'Currently active booking window'
  }, [verifiedBooking])

  const handleUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsDecoding(true)
    setError('')
    setVerifiedBooking(null)
    setDecodedText('')

    try {
      const scanResult = await QrScanner.scanImage(file, { returnDetailedScanResult: true })
      const rawText = typeof scanResult === 'string' ? scanResult : scanResult?.data
      if (!rawText) {
        setError('Could not decode QR from this image.')
        return
      }
      setDecodedText(rawText)

      const bookingId = extractBookingId(rawText)
      if (!bookingId) {
        setError('QR is valid but booking ID was not found.')
        return
      }
      if (!isUuid(bookingId)) {
        setError('Invalid QR content. Booking ID format is not valid.')
        return
      }

      const res = await bookingApi.getBookingById(bookingId)
      const booking = res?.data?.data ?? res?.data ?? res
      if (!booking?.id) {
        setError('Booking not found for this QR code.')
        return
      }
      if (booking.status !== 'APPROVED') {
        setError(`Booking found but not approved (status: ${booking.status || 'UNKNOWN'}).`)
        return
      }

      setVerifiedBooking(booking)
    } catch (err) {
      const status = err?.response?.status
      if (status === 404) {
        setError('Booking not found for this QR code.')
      } else if (status === 400) {
        setError('Invalid booking identifier in QR code.')
      } else if (status === 403) {
        setError('You are not allowed to verify this booking.')
      } else {
        setError('Invalid QR image or booking verification failed.')
      }
    } finally {
      setIsDecoding(false)
      event.target.value = ''
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Aurora
          colorStops={['#0891b2', '#06b6d4', '#40e0d0']}
          blend={0.3}
          amplitude={0.8}
          speed={0.3}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom py-8">
      <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">
        QR Code Check-in
      </h1>
      <p className="text-[var(--text-secondary)] mb-6">
        Upload a booking QR image to verify that the booking exists and is approved.
      </p>

      <Card className="mb-6">
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
          Upload QR Code Image
        </label>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white cursor-pointer hover:opacity-90 transition-opacity">
            <FiUpload size={16} />
            <span>Select Image</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
          <span className="text-xs text-[var(--text-muted)]">
            Supported: JPG, PNG, WEBP
          </span>
        </div>
      </Card>

      {isDecoding && (
        <Card className="mb-6">
          <LoadingSpinner text="Decoding and verifying booking..." />
        </Card>
      )}

      {error && !isDecoding && (
        <Card className="mb-6 border border-status-error/30">
          <div className="flex items-start gap-3">
            <FiXCircle className="text-status-error mt-0.5" size={18} />
            <div>
              <p className="font-semibold text-status-error">Verification failed</p>
              <p className="text-sm text-[var(--text-secondary)]">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {verifiedBooking && !isDecoding && (
        <Card className="border border-status-success/30">
          <div className="flex items-start gap-3 mb-4">
            <FiCheckCircle className="text-status-success mt-0.5" size={18} />
            <div>
              <p className="font-semibold text-status-success">Booking found and approved</p>
              <p className="text-sm text-[var(--text-secondary)]">{validity}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Info label="Booking ID" value={verifiedBooking.id} mono />
            <Info label="Facility" value={verifiedBooking.facilityName || 'N/A'} />
            <Info label="Date" value={formatDate(verifiedBooking.startDateTime)} />
            <Info
              label="Time"
              value={`${formatTime(verifiedBooking.startDateTime)} - ${formatTime(verifiedBooking.endDateTime)}`}
            />
            <Info label="Duration" value={durationLabel(verifiedBooking.startDateTime, verifiedBooking.endDateTime)} />
            <Info label="Attendees" value={verifiedBooking.expectedAttendees ?? 'N/A'} />
          </div>

          <div className="mt-4 p-3 rounded-lg bg-[var(--bg-tertiary)]">
            <p className="text-xs text-[var(--text-muted)] mb-1">Purpose</p>
            <p className="text-sm text-[var(--text-primary)]">{verifiedBooking.purpose || 'N/A'}</p>
          </div>
        </Card>
      )}

      {!verifiedBooking && decodedText && !error && !isDecoding && (
        <Card className="mt-6">
          <p className="text-sm text-[var(--text-muted)]">
            Decoded payload: <span className="font-mono">{decodedText}</span>
          </p>
        </Card>
      )}

      <div className="mt-6">
        <Button variant="secondary" onClick={() => navigate('/bookings')}>
          Back to My Bookings
        </Button>
      </div>
    </div>
    </div>
  )
}

function Info({ label, value, mono = false }) {
  return (
    <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
      <p className="text-xs text-[var(--text-muted)] mb-0.5">{label}</p>
      <p className={`text-sm text-[var(--text-primary)] ${mono ? 'font-mono break-all' : ''}`}>
        {value}
      </p>
    </div>
  )
}
