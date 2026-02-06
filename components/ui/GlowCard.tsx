'use client'

import { useRef, useState, useCallback, ReactNode } from 'react'

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
}

export default function GlowCard({
  children,
  className = '',
  glowColor = '#F7931A',
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-xl bg-bg-card border border-border
                  transition-all duration-300 ${className}`}
      style={{
        boxShadow: isHovered
          ? `0 0 40px ${glowColor}20, inset 0 0 40px ${glowColor}05`
          : 'none',
      }}
    >
      {/* Glow effect that follows mouse */}
      <div
        className="absolute pointer-events-none transition-opacity duration-300 z-0"
        style={{
          left: 'calc(var(--mouse-x, 0px) - 150px)',
          top: 'calc(var(--mouse-y, 0px) - 150px)',
          width: 300,
          height: 300,
          background: `radial-gradient(circle, ${glowColor}30 0%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Border glow effect */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${glowColor}20, transparent)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
