'use client'

import { useEffect, useRef, ReactNode } from 'react'
import Lenis from 'lenis'

interface SmoothScrollProps {
  children: ReactNode
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null)

  const rafId = useRef<number>(0)

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenisRef.current?.raf(time)
      rafId.current = requestAnimationFrame(raf)
    }

    rafId.current = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId.current)
      lenisRef.current?.destroy()
    }
  }, [])

  return <>{children}</>
}
