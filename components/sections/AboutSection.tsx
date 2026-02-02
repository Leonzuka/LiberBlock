'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Hexagon, Code, Zap, Shield, Blocks } from 'lucide-react'
import GlowCard from '@/components/ui/GlowCard'
import TextReveal from '@/components/ui/TextReveal'

gsap.registerPlugin(ScrollTrigger)

const values = [
  {
    icon: Code,
    title: 'Clean Code',
    description:
      'We write maintainable, scalable code that stands the test of time.',
    color: '#F7931A',
  },
  {
    icon: Zap,
    title: 'Performance',
    description:
      'Lightning-fast applications optimized for the best user experience.',
    color: '#D4AF37',
  },
  {
    icon: Shield,
    title: 'Security First',
    description:
      'Cypherpunk principles guide our approach to data privacy and security.',
    color: '#10B981',
  },
  {
    icon: Blocks,
    title: 'Innovation',
    description:
      'Pushing boundaries with cutting-edge technologies and creative solutions.',
    color: '#3B82F6',
  },
]

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
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
            background:
              'radial-gradient(circle, #F7931A 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="section-container relative z-10">
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
                { value: '100%', label: 'Passion' },
              ].map((stat, index) => (
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

          {/* Right side - Values grid */}
          <div className="grid grid-cols-2 gap-4">
            {values.map((value, index) => (
              <div
                key={value.title}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el
                }}
              >
                <GlowCard glowColor={value.color} className="p-6 h-full">
                  <value.icon
                    className="w-10 h-10 mb-4"
                    style={{ color: value.color }}
                  />
                  <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                  <p className="text-text-secondary text-sm">
                    {value.description}
                  </p>
                </GlowCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
