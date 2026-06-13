import Aurora from '../../components/effects/Aurora'

export default function AdminSettings() {
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
      <div className="relative z-10 max-w-3xl p-4 sm:p-6 lg:p-8">
      <h1 className="font-display text-2xl font-bold text-gradient">Admin Settings</h1>
      <p className="mt-2 text-[var(--text-secondary)]">
        Configure platform-wide options and integrations.
      </p>
    </div>
    </div>
  )
}
