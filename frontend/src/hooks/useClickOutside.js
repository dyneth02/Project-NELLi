import { useEffect } from 'react'

/**
 * Invoke handler when a pointer event occurs outside the given element(s).
 * @param {React.RefObject<HTMLElement | null>} ref
 * @param {(event: MouseEvent | TouchEvent) => void} handler
 * @param {boolean} [enabled=true]
 */
export function useClickOutside(ref, handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined

    const listener = (event) => {
      const el = ref.current
      if (!el || el.contains(event.target)) return
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener, { passive: true })
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler, enabled])
}
