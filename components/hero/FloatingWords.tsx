'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

interface WordConfig {
  text: string
  x: string
  y: string
  size: string
  weight: number
  rotate: number
  opacity: number
  outline?: boolean
}

const words: WordConfig[] = [
  // Large background anchor words
  { text: 'LIBER', x: '8%', y: '12%', size: 'clamp(3rem, 8vw, 8rem)', weight: 900, rotate: -8, opacity: 0.06 },
  { text: 'BLOCK', x: '55%', y: '72%', size: 'clamp(3rem, 9vw, 9rem)', weight: 900, rotate: 5, opacity: 0.05 },
  { text: 'BITCOIN', x: '60%', y: '8%', size: 'clamp(2rem, 5vw, 5rem)', weight: 800, rotate: 3, opacity: 0.07, outline: true },

  // Medium accent words
  { text: 'SOFTWARE', x: '5%', y: '65%', size: 'clamp(1.5rem, 3.5vw, 3.5rem)', weight: 700, rotate: -3, opacity: 0.05 },
  { text: 'FREEDOM', x: '72%', y: '38%', size: 'clamp(1.5rem, 4vw, 4rem)', weight: 700, rotate: -5, opacity: 0.06, outline: true },
  { text: 'CODE', x: '18%', y: '42%', size: 'clamp(2rem, 5vw, 5rem)', weight: 800, rotate: 12, opacity: 0.04 },
  { text: 'CHAIN', x: '78%', y: '58%', size: 'clamp(1.2rem, 3vw, 3rem)', weight: 600, rotate: -10, opacity: 0.05 },

  // Small scattered words
  { text: 'CRYPTO', x: '35%', y: '85%', size: 'clamp(1rem, 2.5vw, 2.5rem)', weight: 600, rotate: 7, opacity: 0.04 },
  { text: 'OPEN SOURCE', x: '15%', y: '88%', size: 'clamp(0.8rem, 1.8vw, 1.8rem)', weight: 500, rotate: -2, opacity: 0.04 },
  { text: 'PRIVACY', x: '82%', y: '18%', size: 'clamp(1rem, 2vw, 2rem)', weight: 600, rotate: -15, opacity: 0.05 },
  { text: 'DECENTRALIZE', x: '3%', y: '35%', size: 'clamp(0.7rem, 1.5vw, 1.5rem)', weight: 500, rotate: 4, opacity: 0.03 },
  { text: 'P2P', x: '45%', y: '20%', size: 'clamp(1.5rem, 3vw, 3rem)', weight: 800, rotate: -6, opacity: 0.04 },
  { text: 'NODES', x: '88%', y: '82%', size: 'clamp(0.9rem, 2vw, 2rem)', weight: 600, rotate: 8, opacity: 0.04 },
  { text: 'HASH', x: '42%', y: '55%', size: 'clamp(1rem, 2.2vw, 2.2rem)', weight: 700, rotate: -12, opacity: 0.03 },
  { text: 'TRUSTLESS', x: '25%', y: '75%', size: 'clamp(0.8rem, 1.6vw, 1.6rem)', weight: 500, rotate: 6, opacity: 0.03 },
]

export default function FloatingWords() {
  const containerRef = useRef<HTMLDivElement>(null)
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const els = wordsRef.current.filter(Boolean) as HTMLSpanElement[]
    const ctx = gsap.context(() => {
      // Staggered entrance animation
      gsap.fromTo(
        els,
        {
          opacity: 0,
          scale: 0.7,
          filter: 'blur(12px)',
        },
        {
          opacity: (i) => words[i]?.opacity ?? 0.04,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.8,
          ease: 'power3.out',
          stagger: {
            each: 0.12,
            from: 'random',
          },
          delay: 0.5,
        }
      )

      // Individual floating animations (each word drifts independently)
      els.forEach((el, i) => {
        const word = words[i]
        if (!word) return

        const floatX = 8 + Math.random() * 16 // 8-24px drift
        const floatY = 6 + Math.random() * 14 // 6-20px drift
        const dur = 5 + Math.random() * 6     // 5-11s cycle

        // Organic floating motion
        gsap.to(el, {
          x: `+=${floatX}`,
          y: `+=${floatY}`,
          duration: dur,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 3,
        })

        // Subtle opacity pulse
        gsap.to(el, {
          opacity: word.opacity * 1.6,
          duration: dur * 0.7,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 2,
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {words.map((word, i) => (
        <span
          key={`${word.text}-${i}`}
          ref={(el) => { wordsRef.current[i] = el }}
          className="absolute whitespace-nowrap leading-none"
          style={{
            left: word.x,
            top: word.y,
            fontSize: word.size,
            fontWeight: word.weight,
            transform: `rotate(${word.rotate}deg)`,
            opacity: 0,
            letterSpacing: word.size > '3rem' ? '0.05em' : '0.08em',
            fontFamily: 'var(--font-geist-mono), monospace',
            ...(word.outline
              ? {
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(247, 147, 26, 0.35)',
                }
              : {
                  background: 'linear-gradient(135deg, rgba(247, 147, 26, 0.7), rgba(212, 175, 55, 0.5))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }),
          }}
        >
          {word.text}
        </span>
      ))}
    </div>
  )
}
