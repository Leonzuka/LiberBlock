'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ExternalLink, Github } from 'lucide-react'
import { projects } from '@/lib/projects'
import GlowCard from '@/components/ui/GlowCard'
import MagneticButton from '@/components/ui/MagneticButton'
import TextReveal from '@/components/ui/TextReveal'

gsap.registerPlugin(ScrollTrigger)

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return

        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 60,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
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

  // Filter only real projects (not logo or contact)
  const displayProjects = projects.filter(
    (p) => p.type === 'animated' || p.type === 'screenshot'
  )

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-32 bg-bg-secondary relative"
    >
      <div className="section-container">
        {/* Section header */}
        <div className="text-center mb-20">
          <TextReveal triggerOnScroll>
            <span className="text-accent-bitcoin font-mono text-sm uppercase tracking-widest">
              Portfolio
            </span>
          </TextReveal>
          <TextReveal delay={0.2} triggerOnScroll>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Featured <span className="text-gradient">Projects</span>
            </h2>
          </TextReveal>
          <TextReveal delay={0.3} triggerOnScroll splitBy="words">
            <p className="text-text-secondary max-w-2xl mx-auto">
              A selection of digital products built with cutting-edge technology
              and cypherpunk aesthetics.
            </p>
          </TextReveal>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayProjects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el
              }}
            >
              <GlowCard glowColor={project.color} className="h-full">
                <div className="p-6">
                  {/* Project image */}
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-6 bg-bg-primary">
                    {project.texture && (
                      <Image
                        src={project.texture}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 to-transparent" />
                  </div>

                  {/* Project info */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                        <p className="text-text-secondary">
                          {project.longDescription}
                        </p>
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs font-mono rounded-full"
                          style={{
                            backgroundColor: `${project.color}15`,
                            color: project.color,
                            border: `1px solid ${project.color}30`,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex gap-3 pt-2">
                      {project.link && (
                        <MagneticButton>
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm
                                       font-medium rounded-lg border border-border
                                       hover:border-accent-bitcoin hover:text-accent-bitcoin
                                       transition-colors duration-300"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Live Demo
                          </a>
                        </MagneticButton>
                      )}
                      {project.github && (
                        <MagneticButton>
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm
                                       font-medium rounded-lg border border-border
                                       hover:border-accent-bitcoin hover:text-accent-bitcoin
                                       transition-colors duration-300"
                          >
                            <Github className="w-4 h-4" />
                            Source
                          </a>
                        </MagneticButton>
                      )}
                    </div>
                  </div>
                </div>
              </GlowCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
