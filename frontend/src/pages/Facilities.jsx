import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  FiSearch,
  FiX,
  FiMapPin,
  FiGrid,
  FiList,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'
import clsx from 'clsx'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Select from '../components/common/Select'
import { useScrollReveal } from '../hooks/useAnimations'
import Aurora from '../components/effects/Aurora'
import { facilityApi } from '../api/facilityApi'
import FacilityCard from '../components/facilities/FacilityCard'

const FACILITY_TABS = [
  { key: '', label: 'All Types' },
  { key: 'LECTURE_HALL', label: 'Lecture Hall' },
  { key: 'LAB', label: 'Laboratory' },
  { key: 'COMPUTER_LAB', label: 'Computer Lab' },
  { key: 'MEETING_ROOM', label: 'Meeting Room' },
  { key: 'AUDITORIUM', label: 'Auditorium' },
  { key: 'SPORTS_FACILITY', label: 'Sports Facility' },
  { key: 'GYMNASIUM', label: 'Gymnasium' },
  { key: 'PLAY_GROUND', label: 'Playground' },
  { key: 'EQUIPMENT', label: 'Equipment' },
]

const SORT_OPTIONS = [
  { label: 'Name (A-Z)', value: 'name_asc' },
  { label: 'Name (Z-A)', value: 'name_desc' },
  { label: 'Capacity (High-Low)', value: 'capacity_desc' },
  { label: 'Capacity (Low-High)', value: 'capacity_asc' },
  { label: 'Recently Added', value: 'newest' },
]

export default function Facilities() {
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeTab, setActiveTab] = useState('')
  const [sortBy, setSortBy] = useState('name_asc')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const ITEMS_PER_PAGE = 9

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch facilities
// Fetch facilities
  const fetchFacilities = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      // Build the query parameters to pass to facilityApi.getAllFacilities
      const params = {}

      if (debouncedSearch) params.keyword = debouncedSearch
      if (activeTab) params.type = activeTab

      // axiosConfig.js intercepts and returns response.data directly
      const payload = await facilityApi.getAllFacilities(params)

      // Unwrap standard API response wrappers if present
      const data = payload?.data ?? payload
      let list = Array.isArray(data) ? data : data?.content || data?.facilities || []

      // 1. APPLY SORTING
      list.sort((a, b) => {
        switch (sortBy) {
          case 'name_asc':
            return (a.name || '').localeCompare(b.name || '')
          case 'name_desc':
            return (b.name || '').localeCompare(a.name || '')
          case 'capacity_desc':
            return (b.capacity || 0) - (a.capacity || 0)
          case 'capacity_asc':
            return (a.capacity || 0) - (b.capacity || 0)
          case 'newest':
            // Assumes your backend returns createdAt as an ISO string or timestamp
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          default:
            return 0
        }
      })

      // 2. APPLY CLIENT-SIDE PAGINATION
      const totalItems = list.length
      const calculatedTotalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))

      // Ensure current page isn't out of bounds after a filter changes
      const currentPage = page > calculatedTotalPages ? 1 : page
      if (page > calculatedTotalPages) setPage(1)

      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
      const paginatedList = list.slice(startIndex, startIndex + ITEMS_PER_PAGE)

      // 3. SET STATE
      setFacilities(paginatedList)
      setTotalPages(data?.totalPages ?? calculatedTotalPages)
      setTotalCount(data?.totalElements ?? totalItems)

    } catch (err) {
      setError('Failed to load facilities')
      setFacilities([])
    } finally {
      setLoading(false)
    }
  }, [page, sortBy, debouncedSearch, activeTab])

  useEffect(() => {
    fetchFacilities()
  }, [fetchFacilities])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1)
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-[var(--text-primary)]">
              Facilities
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">
              {totalCount > 0
                  ? `${totalCount} facilities available`
                  : 'Browse and book campus facilities'}
            </p>
          </div>
          <Link
              to="/bookings/create"
              className="self-start"
          >
            <Button variant="primary" size="md">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="relative">
            <FiSearch
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                aria-hidden
            />
            <input
                type="text"
                placeholder="Search facilities by name, location, or equipment..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl pl-12 pr-12 py-3.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-accent)] focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                aria-label="Search facilities"
            />
            {searchQuery && (
                <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setPage(1)
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    aria-label="Clear search"
                >
                  <FiX size={18} />
                </button>
            )}
          </div>
        </form>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 hide-scrollbar">
          {FACILITY_TABS.map((tab) => (
              <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key)
                    setPage(1)
                  }}
                  className={clsx(
                      'px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2',
                      activeTab === tab.key
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-transparent hover:border-[var(--border-default)]',
                  )}
              >
                {tab.label}
              </button>
          ))}
        </div>

        {/* Toolbar: Sort + View mode */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-3">
            {/* Sort */}
            <Select
                name="sort"
                value={sortBy}
                onChange={(val) => {
                  setSortBy(val)
                  setPage(1)
                }}
                options={SORT_OPTIONS}
                className="w-52"
            />

            {/* View toggle */}
            <div className="hidden sm:flex items-center border border-[var(--border-default)] rounded-lg overflow-hidden">
              <button
                  onClick={() => setViewMode('grid')}
                  className={clsx(
                      'p-2.5 transition-colors',
                      viewMode === 'grid'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                  )}
                  aria-label="Grid view"
              >
                <FiGrid size={18} />
              </button>
              <button
                  onClick={() => setViewMode('list')}
                  className={clsx(
                      'p-2.5 transition-colors',
                      viewMode === 'list'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                  )}
                  aria-label="List view"
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="min-w-0">
          {loading ? (
              <div
                  className={clsx(
                      viewMode === 'grid'
                          ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                          : 'space-y-4',
                  )}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-40 bg-[var(--bg-tertiary)] rounded-t-xl" />
                      <div className="p-5 space-y-3">
                        <div className="h-5 bg-[var(--bg-tertiary)] rounded w-3/4" />
                        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/2" />
                        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-2/3" />
                      </div>
                    </Card>
                ))}
              </div>
          ) : error ? (
              <Card className="text-center py-12">
                <p className="text-status-error mb-4">{error}</p>
                <Button variant="secondary" onClick={fetchFacilities}>
                  Retry
                </Button>
              </Card>
          ) : facilities.length === 0 ? (
              <Card className="text-center py-12">
                <div className="text-[var(--text-muted)] mb-3 flex justify-center">
                  <FiMapPin size={48} />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                  No facilities found
                </h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  Try adjusting your search or category
                </p>
                {(activeTab || debouncedSearch) && (
                    <Button
                        variant="secondary"
                        onClick={() => {
                          setActiveTab('')
                          setSearchQuery('')
                          setPage(1)
                        }}
                    >
                      Clear search & categories
                    </Button>
                )}
              </Card>
          ) : (
              <>
                <div
                    className={clsx(
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                            : 'space-y-4',
                    )}
                >
                  {facilities.map((facility, index) => (
                      <FacilityCardWithAnimation
                          key={facility.id}
                          facility={facility}
                          index={index}
                          viewMode={viewMode}
                      />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <button
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="p-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:border-[var(--border-accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="Previous page"
                      >
                        <FiChevronLeft size={18} />
                      </button>
                      {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                              key={i}
                              onClick={() => setPage(i + 1)}
                              className={clsx(
                                  'w-10 h-10 rounded-lg text-sm font-medium transition-colors',
                                  page === i + 1
                                      ? 'bg-gradient-accent text-white'
                                      : 'bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-accent)]',
                              )}
                          >
                            {i + 1}
                          </button>
                      ))}
                      <button
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="p-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:border-[var(--border-accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="Next page"
                      >
                        <FiChevronRight size={18} />
                      </button>
                    </div>
                )}
              </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Sub-components ─────────────────────────────────────────── */

function FacilityCardWithAnimation({ facility, index, viewMode }) {
  // Using the wrapper around the component strategy to prevent GSAP/CSS Transition conflicts
  const { ref: scrollRef } = useScrollReveal({ y: 30, delay: Math.min(index * 0.05, 0.3) })
  return (
      <div ref={scrollRef}>
        <FacilityCard
            facility={facility}
            className={viewMode === 'list' ? '!flex !flex-col sm:!flex-row' : ''}
        />
      </div>
  )
}