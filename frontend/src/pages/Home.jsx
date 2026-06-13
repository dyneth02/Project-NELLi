import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiCalendar,
  FiAlertCircle,
  FiBell,
  FiBarChart2,
  FiArrowRight,
  FiArrowDown,
  FiCheck,
  FiZap,
  FiShield,
  FiUsers,
  FiClock,
  FiMapPin,
  FiSmartphone,
} from 'react-icons/fi'
import { FaQrcode } from "react-icons/fa";
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import SoftAurora from '../components/effects/SoftAurora'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function useCountUp(end, duration = 2000, start = 0) {
  const [count, setCount] = useState(start)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            hasAnimated.current = true
            const startTime = performance.now()
            const animate = (currentTime) => {
              const elapsed = currentTime - startTime
              const progress = Math.min(elapsed / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              setCount(Math.floor(eased * (end - start) + start))
              if (progress < 1) requestAnimationFrame(animate)
            }
            requestAnimationFrame(animate)
            observer.disconnect()
          }
        },
        { threshold: 0.5 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration, start])

  return [count, ref]
}

const Home = () => {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const stepsRef = useRef(null)
  const ctaRef = useRef(null)

  const [facilitiesCount, facilitiesRef] = useCountUp(500, 2000, 0)
  const [bookingsCount, bookingsRef] = useCountUp(10000, 2000, 0)
  const [uptimeCount, uptimeRef] = useCountUp(99, 1500, 0)
  const [statsVisible, setStatsVisible] = useState(false)

  // Adjusted features array to nest QR code inside Smart Booking
  const features = [
    {
      icon: <FiCalendar size={32} />,
      title: 'Smart Booking',
      description:
          'Book facilities with intelligent conflict detection and instant approval workflow.',
      subFeature: {
        icon: <FaQrcode size={32} />,
        title: 'QR Code Verification',
        description:
            'Download a unique QR code pass upon booking. Scan it on-site to digitally validate your access when your schedule arrives.',
      },
    },
    {
      icon: <FiAlertCircle size={32} />,
      title: 'Maintenance Tracking',
      description:
          'Report and track maintenance issues with photo attachments and status updates.',
    },
    {
      icon: <FiBell size={32} />,
      title: 'Real-time Notifications',
      description:
          'Stay informed with instant notifications for bookings, tickets, and updates.',
    },
    {
      icon: <FiBarChart2 size={32} />,
      title: 'Analytics Dashboard',
      description:
          'Gain insights with comprehensive analytics and facility utilization reports.',
    },
  ]

  const steps = [
    {
      number: '01',
      title: 'Create Account',
      description: 'Sign up with your university email or Google account',
    },
    {
      number: '02',
      title: 'Browse Facilities',
      description: 'Search and filter available rooms, labs, and equipment',
    },
    {
      number: '03',
      title: 'Book & Manage',
      description: 'Request bookings and track maintenance tickets',
    },
    {
      number: '04',
      title: 'Get Notified',
      description: 'Receive instant updates on approvals and status changes',
    },
  ]

  // Optimized hero entrance animation with will-change for 60fps
  useEffect(() => {
    const el = heroRef.current
    if (!el) return

    const elements = [
      el.querySelector('.hero-badge'),
      el.querySelector('.hero-title'),
      el.querySelector('.hero-subtitle'),
      el.querySelector('.hero-ctas'),
      el.querySelector('.hero-stats'),
    ].filter(Boolean)

    elements.forEach((el) => {
      el.style.willChange = 'transform, opacity'
    })

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        elements.forEach((el) => {
          el.style.willChange = 'auto'
        })
      }
    })

    tl.fromTo(
        el.querySelector('.hero-badge'),
        { opacity: 0, y: 24, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7 },
    )
        .fromTo(
            el.querySelector('.hero-title'),
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 0.8 },
            '-=0.4',
        )
        .fromTo(
            el.querySelector('.hero-subtitle'),
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7 },
            '-=0.5',
        )
        .fromTo(
            el.querySelector('.hero-ctas'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 },
            '-=0.4',
        )
        .fromTo(
            el.querySelector('.hero-stats'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 },
            '-=0.3',
        )

    return () => {
      tl.kill()
    }
  }, [])

  // Stats visibility observer
  useEffect(() => {
    const statsEl = document.getElementById('home-stats')
    if (!statsEl) return
    const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !statsVisible) {
            setStatsVisible(true)
          }
        },
        { threshold: 0.3 },
    )
    observer.observe(statsEl)
    return () => observer.disconnect()
  }, [statsVisible])

  // Feature cards staggered reveal with optimized transforms
  useEffect(() => {
    const section = featuresRef.current
    if (!section) return

    const cards = section.querySelectorAll('.feature-card')
    cards.forEach((card) => {
      card.style.willChange = 'transform, opacity'
    })

    const ctx = gsap.context(() => {
      gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              once: true,
            },
            onComplete: () => {
              cards.forEach((card) => {
                card.style.willChange = 'auto'
              })
            }
          },
      )
    })

    return () => ctx.revert()
  }, [])

  // Steps reveal animation
  useEffect(() => {
    const section = stepsRef.current
    if (!section) return

    const items = section.querySelectorAll('.step-item')
    items.forEach((item) => {
      item.style.willChange = 'transform, opacity'
    })

    const ctx = gsap.context(() => {
      gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              once: true,
            },
            onComplete: () => {
              items.forEach((item) => {
                item.style.willChange = 'auto'
              })
            }
          },
      )
    })

    return () => ctx.revert()
  }, [])

  // CTA section reveal
  useEffect(() => {
    const section = ctaRef.current
    if (!section) return

    const content = section.querySelector('.cta-content')
    if (content) content.style.willChange = 'transform, opacity'

    const ctx = gsap.context(() => {
      gsap.fromTo(
          content,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              once: true,
            },
            onComplete: () => {
              if (content) content.style.willChange = 'auto'
            }
          },
      )
    })

    return () => ctx.revert()
  }, [])

  const scrollToSection = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
      <div className="relative overflow-x-hidden">
        {/* Global SoftAurora Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <SoftAurora
              speed={0.6}
              scale={1.5}
              brightness={1.0}
              color1="#f7f7f7"
              color2="#06b6d4"
              noiseFrequency={2.5}
              noiseAmplitude={1.0}
              bandHeight={0.5}
              bandSpread={1.0}
              octaveDecay={0.1}
              layerOffset={0}
              colorSpeed={1.0}
              enableMouseInteraction={true}
              mouseInfluence={0.1}
          />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10">
          {/* Modern Hero Section - Split Layout */}
          <section className="relative min-h-screen flex items-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/60 via-[var(--bg-primary)]/40 to-[var(--bg-primary)]/80" />

            <div className="container-custom relative z-10 w-full">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[90vh] py-20">
                {/* Left: Content */}
                <div ref={heroRef} className="space-y-8">
                  <div className="hero-badge inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 backdrop-blur-md">
                    <FiZap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">Now Open for Bookings</span>
                  </div>

                  <div className="space-y-4">
                    <h1 className="hero-title text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tight">
                    <span className="bg-gradient-to-r from-primary via-primary-cyan to-primary bg-clip-text text-transparent animate-gradient">
                      NELLi
                    </span>
                    </h1>
                    <p className="hero-subtitle text-lg md:text-xl text-[var(--text-primary)] font-medium">
                      Network for Equipment Labs and Location Incidents
                    </p>
                  </div>

                  <p className="hero-text text-xl text-[var(--text-secondary)]/80 max-w-xl leading-relaxed">
                    Modernize your campus operations with intelligent facility booking
                    and maintenance management
                  </p>

                  <div className="hero-ctas flex flex-wrap items-center gap-4">
                    <Button
                        variant="primary"
                        size="lg"
                        icon={<FiArrowRight />}
                        iconPosition="right"
                        onClick={() => navigate('/register')}
                        className="shadow-glow-lg hover:shadow-glow-xl transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Get Started Free
                    </Button>
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => scrollToSection('features')}
                        className="backdrop-blur-md border-[var(--border-accent)]"
                    >
                      Explore Features
                    </Button>
                  </div>

                  {/* Trust Badges */}
                  <div className="hero-trust flex flex-wrap items-center gap-6 pt-4">
                    <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
                      <FiCheck className="w-4 h-4 text-primary" />
                      <span>No credit card</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
                      <FiCheck className="w-4 h-4 text-primary" />
                      <span>Free forever plan</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
                      <FiCheck className="w-4 h-4 text-primary" />
                      <span>99.9% uptime</span>
                    </div>
                  </div>
                </div>

                {/* Right: Floating UI Mockup */}
                <div className="hero-visual relative hidden lg:block">
                  <FloatingMockup />
                </div>
              </div>

              {/* Stats Row */}
              <div id="home-stats" className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pb-12">
                <StatCard value={statsVisible ? `${facilitiesCount}+` : '500+'} label="Facilities" ref={facilitiesRef} />
                <StatCard value={statsVisible ? `${(bookingsCount / 1000).toFixed(0)}K+` : '10K+'} label="Bookings" ref={bookingsRef} />
                <StatCard value={statsVisible ? `${uptimeCount}%` : '99%'} label="Uptime" ref={uptimeRef} />
                <StatCard value="24/7" label="Support" />
              </div>
            </div>

            {/* Scroll Indicator */}
            <button
                onClick={() => scrollToSection('features')}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--text-muted)] hover:text-primary transition-colors duration-300 animate-bounce"
                aria-label="Scroll to features"
            >
              <FiArrowDown size={24} />
            </button>
          </section>

          {/* Logo Cloud */}
          <LogoCloud />

          {/* Bento Features Section */}
          <section id="features" ref={featuresRef} className="py-24 md:py-32 relative">
            <div className="absolute inset-0 bg-[var(--bg-secondary)]/70 backdrop-blur-sm" />
            <div className="container-custom relative z-10">
              <BentoHeader />
              <BentoGrid features={features} />
            </div>
          </section>

          {/* How It Works - Horizontal Timeline */}
          <section ref={stepsRef} className="py-24 md:py-32 relative">
            <div className="absolute inset-0 bg-[var(--bg-primary)]/50" />
            <div className="container-custom relative z-10">
              <StepsHeader />
              <HorizontalSteps steps={steps} />
            </div>
          </section>

          {/* Modern CTA Section */}
          <section ref={ctaRef} className="py-24 md:py-32 relative overflow-hidden">
            <div className="absolute inset-0" />
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-cyan/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="container-custom relative z-10">
              <div className="cta-content max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
                  <FiShield className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">Trusted by 100+ institutions</span>
                </div>

                <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
                  Ready to <span className="text-gradient">Transform</span> Your Campus?
                </h2>

                <p className="text-xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
                  Join hundreds of institutions already using NELLi to streamline operations and enhance student experience
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                      variant="primary"
                      size="lg"
                      icon={<FiArrowRight />}
                      iconPosition="right"
                      onClick={() => navigate('/register')}
                      className="shadow-glow-lg hover:shadow-glow-xl transition-all duration-300 hover:-translate-y-0.5 text-lg px-10 py-5"
                  >
                    Start Your Free Trial
                  </Button>
                  <Button
                      variant="secondary"
                      size="lg"
                      className="text-lg px-8 py-5 backdrop-blur-md"
                  >
                    Schedule Demo
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
  )
}

/* ── Modern Sub-components ─────────────────────────────────────────── */

function StatCard({ value, label, ref }) {
  return (
      <div ref={ref} className="text-center p-6 rounded-2xl bg-[var(--bg-card)]/50 backdrop-blur-md border border-[var(--border-accent)]/50 hover:border-[var(--border-accent)] transition-all duration-300 group">
        <p className="text-3xl md:text-4xl font-bold text-gradient mb-1">{value}</p>
        <p className="text-[var(--text-muted)] text-sm font-medium">{label}</p>
      </div>
  )
}

function FloatingMockup() {
  return (
      <div className="relative w-full h-[500px] perspective-1000">
        {/* Main Card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-[var(--bg-card)]/90 backdrop-blur-xl rounded-2xl border border-[var(--border-accent)] shadow-2xl p-6 animate-float">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
              <FiCalendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Lab Booking</p>
              <p className="text-xs text-[var(--text-muted)]">Chemistry Lab A</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-2 bg-[var(--bg-primary)] rounded-full w-full" />
            <div className="h-2 bg-[var(--bg-primary)] rounded-full w-4/5" />
            <div className="h-2 bg-[var(--bg-primary)] rounded-full w-3/5" />
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--border-default)]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-muted)]">Tomorrow, 2:00 PM</span>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">Confirmed</span>
            </div>
          </div>
        </div>

        {/* Floating Badge 1 */}
        <div className="absolute top-10 right-10 bg-[var(--bg-card)]/90 backdrop-blur-xl rounded-xl border border-[var(--border-accent)] shadow-xl p-4 animate-float-slow">
          <div className="flex items-center gap-2">
            <FiCheck className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-[var(--text-primary)]">Booking Approved</span>
          </div>
        </div>

        {/* Floating Badge 2 */}
        <div className="absolute bottom-20 left-0 bg-[var(--bg-card)]/90 backdrop-blur-xl rounded-xl border border-[var(--border-accent)] shadow-xl p-4 animate-float-slower">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
              <FiUsers className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Active Users</p>
              <p className="text-sm font-bold text-[var(--text-primary)]">2,847</p>
            </div>
          </div>
        </div>

        {/* Floating Badge 3 */}
        <div className="absolute top-20 left-10 bg-primary/10 backdrop-blur-xl rounded-full px-4 py-2 border border-primary/20 animate-pulse">
          <span className="text-sm font-semibold text-primary">Live</span>
        </div>
      </div>
  )
}

function LogoCloud() {
  const logos = [
    { name: 'SLIIT', icon: FiMapPin },
    { name: 'University', icon: FiUsers },
    { name: 'Campus', icon: FiClock },
    { name: 'EduTech', icon: FiZap },
    { name: 'Facility', icon: FiShield },
  ]

  return (
      <section className="py-16 relative border-y border-[var(--border-default)]">
        <div className="absolute inset-0 bg-[var(--bg-secondary)]/50" />
        <div className="container-custom relative z-10">
          <p className="text-center text-[var(--text-muted)] text-sm mb-8 font-medium">Trusted by leading institutions</p>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
            {logos.map((logo) => (
                <div key={logo.name} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-300 group">
                  <logo.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-semibold">{logo.name}</span>
                </div>
            ))}
          </div>
        </div>
      </section>
  )
}

function BentoHeader() {
  const headerRef = useRef(null)

  useEffect(() => {
    const el = headerRef.current
    if (!el) return

    el.style.willChange = 'transform, opacity'

    const ctx = gsap.context(() => {
      gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
            onComplete: () => {
              el.style.willChange = 'auto'
            }
          },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
      <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
          <FiZap className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Features</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-display font-bold mb-6">
          <span className="text-gradient">Powerful</span> Features
        </h2>
        <p className="text-xl text-[var(--text-secondary)]">
          Everything you need to manage campus operations efficiently
        </p>
      </div>
  )
}

function BentoGrid({ features }) {
  const gridRef = useRef(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const cards = grid.querySelectorAll('.bento-card')
    cards.forEach((card) => {
      card.style.willChange = 'transform, opacity'
    })

    const ctx = gsap.context(() => {
      gsap.fromTo(
          cards,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 80%',
              once: true,
            },
            onComplete: () => {
              cards.forEach((card) => {
                card.style.willChange = 'auto'
              })
            }
          },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
      <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {features.map((feature, index) => (
            <div
                key={index}
                className={`bento-card group p-6 rounded-2xl bg-[var(--bg-card)]/60 backdrop-blur-md border border-[var(--border-accent)]/50 hover:border-[var(--border-accent)] transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-md flex flex-col ${
                    index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                } ${index === 3 ? 'md:col-span-2' : ''}`}
            >
              <div className={`w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center mb-4 group-hover:shadow-glow-md group-hover:scale-105 transition-all duration-300 ${index === 0 ? 'md:w-16 md:h-16' : ''}`}>
                <span className="text-white">{feature.icon}</span>
              </div>

              <h3 className={`font-display font-bold text-[var(--text-primary)] mb-2 ${index === 0 ? 'text-2xl' : 'text-xl'}`}>
                {feature.title}
              </h3>

              <p className={`text-[var(--text-secondary)] leading-relaxed ${index === 0 ? 'text-base mb-6' : 'text-sm'}`}>
                {feature.description}
              </p>

              {/* Render the nested QR code sub-feature for the first card */}
              {feature.subFeature && (
                  <div className="pt-6 border-t border-[var(--border-accent)]/50">
                    <div className="items-center gap-3 mb-3">
                      <div className="w-16 h-16 bg-[#0fd1ce] rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
                        {feature.subFeature.icon}
                      </div>
                      <h4 className="mt-6 font-display font-bold text-[var(--text-primary)] text-2xl">
                        {feature.subFeature.title}
                      </h4>
                    </div>
                    <p className="text-[var(--text-secondary)] text-md leading-relaxed">
                      {feature.subFeature.description}
                    </p>
                  </div>
              )}
            </div>
        ))}
      </div>
  )
}

function StepsHeader() {
  const headerRef = useRef(null)

  useEffect(() => {
    const el = headerRef.current
    if (!el) return

    el.style.willChange = 'transform, opacity'

    const ctx = gsap.context(() => {
      gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
            onComplete: () => {
              el.style.willChange = 'auto'
            }
          },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
      <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
          <FiUsers className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">How It Works</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-display font-bold mb-6">
          Get Started in <span className="text-gradient">4 Steps</span>
        </h2>
        <p className="text-xl text-[var(--text-secondary)]">
          From signup to booking in minutes
        </p>
      </div>
  )
}

function HorizontalSteps({ steps }) {
  const stepsRef = useRef(null)

  useEffect(() => {
    const container = stepsRef.current
    if (!container) return

    const items = container.querySelectorAll('.horizontal-step')
    items.forEach((item) => {
      item.style.willChange = 'transform, opacity'
    })

    const ctx = gsap.context(() => {
      gsap.fromTo(
          items,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 80%',
              once: true,
            },
            onComplete: () => {
              items.forEach((item) => {
                item.style.willChange = 'auto'
              })
            }
          },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
      <div ref={stepsRef} className="relative">
        {/* Connecting Line */}
        <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--border-accent)] to-transparent" />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
              <div key={index} className="horizontal-step relative">
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-gradient-accent rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
                    <div className="relative w-full h-full bg-[var(--bg-card)] rounded-full flex items-center justify-center border-2 border-[var(--border-accent)] shadow-glow-md hover:shadow-glow-lg transition-all duration-300 hover:scale-105">
                      <span className="text-2xl font-bold text-gradient">{step.number}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-display font-bold text-[var(--text-primary)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </div>
          ))}
        </div>
      </div>
  )
}

export default Home