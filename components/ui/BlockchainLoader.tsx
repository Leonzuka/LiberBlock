'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

interface BlockchainLoaderProps {
  onComplete: () => void
}

const BLOCK_COUNT = 5
const HASH_STRINGS = [
  '0x4f3a9b2c',
  '0xe7d1f085',
  '0x1a2b3c4d',
  '0xdeadbeef',
  '0x8f2c9e71',
  '0xab34ef12',
  '0x7c8d9e0f',
  '0xf1e2d3c4',
]

export default function BlockchainLoader({ onComplete }: BlockchainLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete()
        },
      })
      timelineRef.current = tl

      // Phase 1: Background & ambient (0s - 0.5s)
      tl.fromTo(
        '.loader-bg',
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      )
      tl.fromTo(
        '.loader-hash',
        { opacity: 0, y: 20 },
        { opacity: 0.06, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.05 },
        0.2
      )

      // Phase 2: Blocks appear (0.5s - 2.0s)
      tl.fromTo(
        '.chain-block',
        { opacity: 0, scale: 0, transformOrigin: 'center center' },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.6)',
          stagger: 0.2,
        },
        0.5
      )

      // Phase 3: Chain connections draw (0.8s - 2.5s)
      tl.fromTo(
        '.chain-line',
        { strokeDashoffset: 60 },
        {
          strokeDashoffset: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          stagger: 0.2,
        },
        0.8
      )

      // Phase 4: Data pulses along chains (1.5s - 2.5s)
      tl.fromTo(
        '.chain-pulse',
        { opacity: 0, motionPath: undefined },
        {
          opacity: 1,
          duration: 0.3,
          stagger: 0.15,
        },
        1.5
      )
      // Animate pulse dots along the lines
      tl.to(
        '.chain-pulse',
        {
          attr: { cx: '+=60' },
          duration: 0.8,
          ease: 'power1.inOut',
          stagger: 0.15,
          repeat: 1,
          yoyo: true,
        },
        1.6
      )

      // Phase 5: LiberBlock text reveals (2.0s - 2.8s)
      tl.fromTo(
        '.loader-title',
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
        2.0
      )

      // Phase 6: Progress bar fills (2.5s - 3.0s)
      tl.fromTo(
        '.loader-progress-fill',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.8, ease: 'power2.inOut' },
        2.2
      )

      // Phase 7: Exit animation (3.0s - 3.5s)
      tl.to(
        '.loader-content',
        {
          scale: 1.05,
          opacity: 0,
          duration: 0.4,
          ease: 'power3.in',
        },
        3.2
      )
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          pointerEvents: 'none',
        },
        3.4
      )
    }, containerRef)

    return () => {
      ctx.revert()
    }
  }, [onComplete])

  // Calculate SVG positions for blocks and connections
  const blockWidth = 80
  const blockHeight = 60
  const gap = 60
  const totalWidth = BLOCK_COUNT * blockWidth + (BLOCK_COUNT - 1) * gap
  const startX = -totalWidth / 2

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: '#0A0A0B' }}
    >
      {/* Background ambient layer */}
      <div className="loader-bg absolute inset-0 overflow-hidden opacity-0">
        {/* Subtle grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(247,147,26,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(247,147,26,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating hash strings */}
        {HASH_STRINGS.map((hash, i) => (
          <span
            key={i}
            className="loader-hash absolute font-mono text-xs select-none opacity-0"
            style={{
              color: '#F7931A',
              left: `${10 + (i % 4) * 25}%`,
              top: `${15 + Math.floor(i / 4) * 55}%`,
              transform: `rotate(${-15 + i * 5}deg)`,
            }}
          >
            {hash}
          </span>
        ))}
      </div>

      {/* Main content */}
      <div className="loader-content flex flex-col items-center gap-8 px-4">
        {/* Blockchain SVG */}
        <svg
          viewBox={`${startX - 20} -50 ${totalWidth + 40} 100`}
          className="w-full max-w-2xl h-auto"
          style={{ overflow: 'visible' }}
        >
          {/* Chain connection lines */}
          {Array.from({ length: BLOCK_COUNT - 1 }).map((_, i) => {
            const x1 = startX + (i + 1) * blockWidth + i * gap
            const x2 = x1 + gap
            const y = 0
            return (
              <g key={`line-${i}`}>
                <line
                  className="chain-line"
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke="#F7931A"
                  strokeWidth="2"
                  strokeDasharray="60"
                  strokeDashoffset="60"
                  opacity="0.6"
                />
                {/* Pulse dot */}
                <circle
                  className="chain-pulse"
                  cx={x1}
                  cy={y}
                  r="4"
                  fill="#F7931A"
                  opacity="0"
                  style={{
                    filter: 'drop-shadow(0 0 6px rgba(247,147,26,0.8))',
                  }}
                />
              </g>
            )
          })}

          {/* Blocks */}
          {Array.from({ length: BLOCK_COUNT }).map((_, i) => {
            const x = startX + i * (blockWidth + gap)
            const y = -blockHeight / 2
            return (
              <g key={`block-${i}`} className="chain-block" style={{ opacity: 0 }}>
                <rect
                  x={x}
                  y={y}
                  width={blockWidth}
                  height={blockHeight}
                  rx="6"
                  ry="6"
                  fill="rgba(247,147,26,0.08)"
                  stroke="#F7931A"
                  strokeWidth="2"
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(247,147,26,0.4))',
                  }}
                />
                {/* Block inner hash text */}
                <text
                  x={x + blockWidth / 2}
                  y={y + blockHeight / 2 - 6}
                  textAnchor="middle"
                  fill="#F7931A"
                  fontSize="10"
                  fontFamily="monospace"
                  opacity="0.7"
                >
                  #{String(i + 1).padStart(3, '0')}
                </text>
                {/* Block icon (chain link) */}
                <text
                  x={x + blockWidth / 2}
                  y={y + blockHeight / 2 + 12}
                  textAnchor="middle"
                  fill="#D4AF37"
                  fontSize="16"
                  opacity="0.9"
                >
                  &#x26D3;
                </text>
              </g>
            )
          })}
        </svg>

        {/* LiberBlock title */}
        <div className="loader-title opacity-0">
          <h1
            className="text-3xl md:text-4xl font-bold tracking-wider font-sans"
            style={{
              background: 'linear-gradient(135deg, #F7931A, #D4AF37, #F7931A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            LiberBlock
          </h1>
          <p className="text-center font-mono text-xs mt-2" style={{ color: '#888888' }}>
            Initializing decentralized portfolio...
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-48 md:w-64 h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#1A1A1D' }}>
          <div
            className="loader-progress-fill h-full rounded-full"
            style={{
              backgroundColor: '#F7931A',
              boxShadow: '0 0 12px rgba(247,147,26,0.5)',
              transform: 'scaleX(0)',
              transformOrigin: 'left center',
            }}
          />
        </div>
      </div>
    </div>
  )
}
