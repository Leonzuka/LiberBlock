'use client'

import { useState, useEffect, RefObject } from 'react'

interface UseScrollProgressOptions {
  offset?: number
  clamp?: boolean
}

export function useScrollProgress(
  ref?: RefObject<HTMLElement>,
  options: UseScrollProgressOptions = {}
) {
  const { offset = 0, clamp = true } = options
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (ref?.current) {
        const element = ref.current
        const rect = element.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const elementTop = rect.top - offset
        const elementHeight = rect.height

        // Calculate how much of the element has scrolled past the viewport
        let rawProgress = -elementTop / (elementHeight - viewportHeight)

        if (clamp) {
          rawProgress = Math.max(0, Math.min(1, rawProgress))
        }

        setProgress(rawProgress)
      } else {
        // Global scroll progress
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight
        const viewportHeight = window.innerHeight
        const rawProgress = scrollTop / (docHeight - viewportHeight)

        setProgress(clamp ? Math.max(0, Math.min(1, rawProgress)) : rawProgress)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initialize

    return () => window.removeEventListener('scroll', handleScroll)
  }, [ref, offset, clamp])

  return progress
}

export default useScrollProgress
