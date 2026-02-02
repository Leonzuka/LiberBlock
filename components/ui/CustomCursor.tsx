'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const isVisibleRef = useRef(false)

  useEffect(() => {
    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current

    if (!cursor || !cursorDot) return

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    if (isTouchDevice) return

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true
        setIsVisible(true)
      }

      // Ambos seguem instantaneamente
      gsap.set(cursor, { x: e.clientX, y: e.clientY })
      gsap.set(cursorDot, { x: e.clientX, y: e.clientY })
    }

    // Esconde cursor quando sai da viewport (ex: scrollbar)
    const onMouseLeave = () => {
      isVisibleRef.current = false
      setIsVisible(false)
    }

    const onMouseEnter = () => {
      isVisibleRef.current = true
      setIsVisible(true)
    }

    const onMouseEnterInteractive = () => setIsHovering(true)
    const onMouseLeaveInteractive = () => setIsHovering(false)

    const interactiveElements = document.querySelectorAll(
      'a, button, [data-cursor-hover], input, textarea'
    )

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnterInteractive)
      el.addEventListener('mouseleave', onMouseLeaveInteractive)
    })

    window.addEventListener('mousemove', onMouseMove)
    document.documentElement.addEventListener('mouseleave', onMouseLeave)
    document.documentElement.addEventListener('mouseenter', onMouseEnter)

    const observer = new MutationObserver(() => {
      const newElements = document.querySelectorAll(
        'a, button, [data-cursor-hover], input, textarea'
      )
      newElements.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterInteractive)
        el.addEventListener('mouseleave', onMouseLeaveInteractive)
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
      document.documentElement.removeEventListener('mouseenter', onMouseEnter)
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive)
        el.removeEventListener('mouseleave', onMouseLeaveInteractive)
      })
      observer.disconnect()
    }
  }, [])

  return (
    <>
      {/* Círculo externo - segue suave */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2
                    rounded-full border mix-blend-difference
                    transition-[width,height,border-color,background-color,opacity] duration-200 ease-out
                    ${isVisible ? 'opacity-100' : 'opacity-0'}
                    ${isHovering ? 'w-12 h-12 border-accent-bitcoin bg-accent-bitcoin/20' : 'w-8 h-8 border-text-primary'}`}
        style={{ left: 0, top: 0, willChange: 'transform' }}
      />
      {/* Dot interno - segue instantâneo */}
      <div
        ref={cursorDotRef}
        className={`fixed pointer-events-none z-[9999] w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2
                    rounded-full bg-accent-bitcoin
                    transition-opacity duration-200
                    ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ left: 0, top: 0, willChange: 'transform' }}
      />
    </>
  )
}
