'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TextReveal from '@/components/ui/TextReveal'

gsap.registerPlugin(ScrollTrigger)

const technologies = [
  { name: 'React', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Three.js', category: '3D/WebGL' },
  { name: 'GSAP', category: 'Animation' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Python', category: 'Backend' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Flutter', category: 'Language' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'Godot', category: 'Game Dev' },
  { name: 'Unity', category: 'Game Dev' },
  { name: 'Bitcoin', category: 'Blockchain' },
  { name: 'Web 3.0', category: 'Tools' },
  { name: 'Git', category: 'Tools' },
]

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null)
  const techRefs = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      techRefs.current.forEach((tech, index) => {
        if (!tech) return

        gsap.fromTo(
          tech,
          { opacity: 0, scale: 0.8, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: tech,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.05,
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Group technologies by category
  const categories = Array.from(new Set(technologies.map((t) => t.category)))

  return (
    <section
      ref={sectionRef}
      id="tech"
      className="py-32 bg-bg-secondary relative"
    >
      <div className="section-container">
        {/* Section header */}
        <div className="text-center mb-16">
          <TextReveal triggerOnScroll>
            <span className="text-accent-bitcoin font-mono text-sm uppercase tracking-widest">
              Technologies
            </span>
          </TextReveal>
          <TextReveal delay={0.2} triggerOnScroll>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Our <span className="text-gradient">Tech Stack</span>
            </h2>
          </TextReveal>
          <TextReveal delay={0.3} triggerOnScroll splitBy="words">
            <p className="text-text-secondary max-w-2xl mx-auto">
              We leverage modern technologies to build robust, scalable, and
              innovative digital solutions.
            </p>
          </TextReveal>
        </div>

        {/* Tech grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {technologies.map((tech, index) => (
            <div
              key={tech.name}
              ref={(el) => {
                if (el) techRefs.current[index] = el
              }}
              className="group relative"
            >
              <div
                className="flex flex-col items-center justify-center p-4 h-24
                           bg-bg-card border border-border rounded-xl
                           transition-all duration-300 hover:border-accent-bitcoin
                           hover:shadow-lg hover:shadow-accent-bitcoin/10"
              >
                <span className="font-mono text-sm text-text-primary group-hover:text-accent-bitcoin
                                transition-colors duration-300 text-center">
                  {tech.name}
                </span>
                <span className="text-xs text-text-secondary mt-1 opacity-0
                                group-hover:opacity-100 transition-opacity duration-300">
                  {tech.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Categories legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          {categories.map((category) => (
            <span
              key={category}
              className="px-3 py-1 text-xs font-mono rounded-full
                         bg-bg-card border border-border text-text-secondary"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
