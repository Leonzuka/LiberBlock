'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GlowCard from '@/components/ui/GlowCard'
import TextReveal from '@/components/ui/TextReveal'

gsap.registerPlugin(ScrollTrigger)

// ─── Custom SVG Icons (hand-crafted, cypherpunk aesthetic) ──────────────────

function TerminalIcon({ color }: { color: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="3" y="7" width="34" height="26" rx="3" stroke={color} strokeWidth="1.5" />
      <line x1="3" y1="13" x2="37" y2="13" stroke={color} strokeWidth="0.75" opacity="0.3" />
      <circle cx="7.5" cy="10" r="1.2" fill="#FF5F56" />
      <circle cx="11.5" cy="10" r="1.2" fill="#FFBD2E" />
      <circle cx="15.5" cy="10" r="1.2" fill="#27C93F" />
      <path d="M9 18.5L14 22L9 25.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="17" y1="25.5" x2="27" y2="25.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}

function BoltIcon({ color }: { color: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path
        d="M22 4L9 22H18.5L16 36L31 18H21.5L22 4Z"
        fill={color} fillOpacity="0.1"
        stroke={color} strokeWidth="1.5" strokeLinejoin="round"
      />
      <line x1="33" y1="7" x2="36" y2="4" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <line x1="35" y1="13" x2="38" y2="12" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.25" />
      <line x1="5" y1="28" x2="2" y2="29" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.25" />
      <line x1="7" y1="34" x2="4" y2="37" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.35" />
    </svg>
  )
}

function KeyIcon({ color }: { color: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="14" cy="14" r="9" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.07" />
      <circle cx="14" cy="14" r="4.5" stroke={color} strokeWidth="1" strokeDasharray="2 2" opacity="0.35" />
      <rect x="11.5" y="12.5" width="5" height="4" rx="0.5" stroke={color} strokeWidth="1" />
      <path d="M12.5 12.5V11C12.5 10.2 13.2 9.5 14 9.5C14.8 9.5 15.5 10.2 15.5 11V12.5" stroke={color} strokeWidth="1" fill="none" />
      <line x1="21" y1="21" x2="35" y2="35" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1="28" x2="31" y2="25" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="31.5" y1="31.5" x2="34.5" y2="28.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CircuitIcon({ color }: { color: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="14" y="14" width="12" height="12" rx="2" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.08" />
      <circle cx="20" cy="20" r="2" fill={color} opacity="0.6" />
      <line x1="20" y1="14" x2="20" y2="5" stroke={color} strokeWidth="1" />
      <line x1="20" y1="26" x2="20" y2="35" stroke={color} strokeWidth="1" />
      <line x1="14" y1="20" x2="5" y2="20" stroke={color} strokeWidth="1" />
      <line x1="26" y1="20" x2="35" y2="20" stroke={color} strokeWidth="1" />
      <circle cx="20" cy="5" r="2" fill={color} opacity="0.5" />
      <circle cx="20" cy="35" r="2" fill={color} opacity="0.5" />
      <circle cx="5" cy="20" r="2" fill={color} opacity="0.5" />
      <circle cx="35" cy="20" r="2" fill={color} opacity="0.5" />
      <line x1="14" y1="14" x2="8" y2="8" stroke={color} strokeWidth="0.75" opacity="0.35" />
      <line x1="26" y1="14" x2="32" y2="8" stroke={color} strokeWidth="0.75" opacity="0.35" />
      <line x1="14" y1="26" x2="8" y2="32" stroke={color} strokeWidth="0.75" opacity="0.35" />
      <line x1="26" y1="26" x2="32" y2="32" stroke={color} strokeWidth="0.75" opacity="0.35" />
      <circle cx="8" cy="8" r="1.5" fill={color} opacity="0.25" />
      <circle cx="32" cy="8" r="1.5" fill={color} opacity="0.25" />
      <circle cx="8" cy="32" r="1.5" fill={color} opacity="0.25" />
      <circle cx="32" cy="32" r="1.5" fill={color} opacity="0.25" />
    </svg>
  )
}

// ─── Module-scope data ──────────────────────────────────────────────────────

const values = [
  {
    icon: TerminalIcon,
    title: 'Clean Code',
    description: 'We write maintainable, scalable code that stands the test of time.',
    color: '#F7931A',
  },
  {
    icon: BoltIcon,
    title: 'Performance',
    description: 'Lightning-fast applications optimized for the best user experience.',
    color: '#D4AF37',
  },
  {
    icon: KeyIcon,
    title: 'Security First',
    description: 'Cypherpunk principles guide our approach to data privacy and security.',
    color: '#10B981',
  },
  {
    icon: CircuitIcon,
    title: 'Innovation',
    description: 'Pushing boundaries with cutting-edge technologies and creative solutions.',
    color: '#3B82F6',
  },
]

const principles = [
  {
    number: '01',
    title: 'Decentralization',
    text: 'No single point of failure. No central authority. Power distributed across the network.',
    color: '#F7931A',
  },
  {
    number: '02',
    title: 'Verify, Don\'t Trust',
    text: 'Open source code. Transparent consensus. Every transaction verifiable by anyone.',
    color: '#D4AF37',
  },
  {
    number: '03',
    title: 'Privacy',
    text: 'Your keys, your coins. Financial privacy is a fundamental right, not a privilege.',
    color: '#10B981',
  },
  {
    number: '04',
    title: 'Sovereignty',
    text: 'Be your own bank. No permission needed. Unstoppable, censorship-resistant money.',
    color: '#8B5CF6',
  },
]

const quotes = [
  {
    text: 'The root problem with conventional currency is all the trust that\'s required to make it work.',
    author: 'Satoshi Nakamoto',
  },
  {
    text: 'Privacy is necessary for an open society in the electronic age.',
    author: 'Eric Hughes',
  },
  {
    text: 'Trusted third parties are security holes.',
    author: 'Nick Szabo',
  },
  {
    text: 'A purely peer-to-peer version of electronic cash would allow online payments to be sent directly without going through a financial institution.',
    author: 'Bitcoin Whitepaper',
  },
]

// ─── Isolated animated components (prevent parent re-renders) ───────────────

function BlockHashDisplay() {
  const [hash, setHash] = useState('00000000000000000a3f2e')
  const [blockNumber, setBlockNumber] = useState(879341)

  useEffect(() => {
    const chars = '0123456789abcdef'
    const interval = setInterval(() => {
      let h = '00000000000000000'
      for (let i = 0; i < 47; i++) {
        h += chars[Math.floor(Math.random() * 16)]
      }
      setHash(h.slice(0, 22))
      setBlockNumber((prev) => prev + 1)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="font-mono text-xs text-text-secondary opacity-60 truncate">
      <span className="text-accent-bitcoin">Block #{blockNumber.toLocaleString()}</span>
      {' \u2014 '}
      <span className="hidden sm:inline">{hash}...</span>
    </div>
  )
}

function QuoteRotator() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const quoteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const el = quoteRef.current
      if (!el) return

      gsap.to(el, {
        opacity: 0,
        y: -10,
        duration: 0.4,
        onComplete: () => {
          setCurrentIndex((prev) => (prev + 1) % quotes.length)
          gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 })
        },
      })
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div ref={quoteRef} className="text-center min-h-[80px] flex flex-col justify-center">
      <p className="text-text-secondary italic text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
        &ldquo;{quotes[currentIndex].text}&rdquo;
      </p>
      <p className="text-accent-bitcoin font-mono text-xs mt-3">
        &mdash; {quotes[currentIndex].author}
      </p>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const principlesRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Value cards animation
      cardsRef.current.forEach((card, index) => {
        if (!card) return
        gsap.fromTo(
          card,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.1,
          }
        )
      })

      // Principle cards animation
      principlesRef.current.forEach((card, index) => {
        if (!card) return
        gsap.fromTo(
          card,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.15,
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-32 bg-bg-primary relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[800px] h-[800px] rounded-full opacity-5"
          style={{
            background: 'radial-gradient(circle, #F7931A 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="section-container relative z-10">
        {/* ─── About Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - About text */}
          <div>
            <TextReveal triggerOnScroll>
              <span className="text-accent-bitcoin font-mono text-sm uppercase tracking-widest">
                About Us
              </span>
            </TextReveal>
            <TextReveal delay={0.1} triggerOnScroll>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                Building the{' '}
                <span className="text-gradient">Future</span>
              </h2>
            </TextReveal>

            <div className="space-y-4 text-text-secondary">
              <TextReveal delay={0.2} triggerOnScroll splitBy="words">
                <p>
                  LiberBlock is a digital innovation studio dedicated to creating
                  cutting-edge software solutions with a focus on decentralization,
                  privacy, and user sovereignty.
                </p>
              </TextReveal>
              <TextReveal delay={0.3} triggerOnScroll splitBy="words">
                <p>
                  Our cypherpunk ethos drives us to build technology that empowers
                  individuals and respects their freedom. From blockchain applications
                  to immersive web experiences, we craft digital products that make
                  a difference.
                </p>
              </TextReveal>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10">
              {[
                { value: '12', label: 'Projects' },
                { value: '+5', label: 'Years' },
                { value: '100%', label: 'Liberty' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-accent-bitcoin">
                    {stat.value}
                  </div>
                  <div className="text-text-secondary text-sm mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Values grid with custom icons */}
          <div className="grid grid-cols-2 gap-4">
            {values.map((value, index) => (
              <div
                key={value.title}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el
                }}
              >
                <GlowCard glowColor={value.color} className="p-6 h-full">
                  <value.icon color={value.color} />
                  <h3 className="text-lg font-bold mb-2 mt-4">{value.title}</h3>
                  <p className="text-text-secondary text-sm">
                    {value.description}
                  </p>
                </GlowCard>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Bitcoin Philosophy Section ─── */}
        <div className="mt-32 relative">
          {/* Section header */}
          <div className="text-center mb-16">
            <TextReveal triggerOnScroll>
              <span className="text-accent-bitcoin font-mono text-sm uppercase tracking-widest">
                Why Bitcoin
              </span>
            </TextReveal>
            <TextReveal delay={0.1} triggerOnScroll>
              <h2 className="text-3xl md:text-4xl font-bold mt-4">
                The <span className="text-gradient">Principles</span> We Build On
              </h2>
            </TextReveal>
          </div>

          {/* Principles grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {principles.map((principle, index) => (
              <div
                key={principle.title}
                ref={(el) => {
                  if (el) principlesRef.current[index] = el
                }}
              >
                <div
                  className="group relative bg-bg-card border border-border rounded-xl p-6 h-full
                             hover:border-opacity-30 transition-all duration-500 cursor-default
                             hover:-translate-y-1"
                  style={{
                    ['--principle-color' as string]: principle.color,
                  }}
                >
                  {/* Number */}
                  <span
                    className="font-mono text-xs absolute top-4 right-4 opacity-40"
                    style={{ color: principle.color }}
                  >
                    {principle.number}
                  </span>

                  {/* Accent line */}
                  <div
                    className="w-8 h-0.5 mb-5 rounded-full transition-all duration-500 group-hover:w-12"
                    style={{ backgroundColor: principle.color }}
                  />

                  <h3 className="text-lg font-bold mb-3">{principle.title}</h3>

                  <p className="text-text-secondary text-sm leading-relaxed">
                    {principle.text}
                  </p>

                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                               transition-opacity duration-500 pointer-events-none"
                    style={{
                      boxShadow: `0 0 30px ${principle.color}10, inset 0 1px 0 ${principle.color}20`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Terminal-style quote display */}
          <div className="mt-16">
            <div className="bg-bg-card/50 border border-border rounded-xl p-8 md:p-10 backdrop-blur-sm">
              {/* Terminal header */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                <span className="font-mono text-xs text-text-secondary ml-3 opacity-50">
                  satoshi.txt
                </span>
              </div>

              <QuoteRotator />

              {/* Footer with hash */}
              <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center">
                <BlockHashDisplay />
                <span className="font-mono text-sm text-accent-bitcoin opacity-40 select-none">
                  &#x20BF;
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
