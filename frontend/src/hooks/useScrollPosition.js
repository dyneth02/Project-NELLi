import { useEffect, useState } from 'react'

/**
 * Track window scroll position and whether it passes a threshold.
 * @param {number} [threshold=20] Pixels from top to set `scrolled` to true.
 * @returns {{ scrolled: boolean, scrollY: number }}
 */
export function useScrollPosition(threshold = 20) {
  const [scrolled, setScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(
    typeof window !== 'undefined' ? window.scrollY : 0,
  )

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrollY(y)
      setScrolled(y > threshold)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return { scrolled, scrollY }
}
