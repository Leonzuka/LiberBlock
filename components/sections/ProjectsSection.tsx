'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ExternalLink, Github, Smartphone, Apple } from 'lucide-react'
import { projects } from '@/lib/projects'
import GlowCard from '@/components/ui/GlowCard'
import MagneticButton from '@/components/ui/MagneticButton'
import TextReveal from '@/components/ui/TextReveal'

gsap.registerPlugin(ScrollTrigger)

// Computed once at module scope since projects is a static constant
const displayProjects = projects.filter(
  (p) => p.type === 'animated' || p.type === 'screenshot'
)

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
                <div className="p-8">
                  {/* Project image */}
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-8 bg-bg-primary">
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
                    {/* Type badge */}
                    <span
                      className="absolute top-4 right-4 px-3 py-1 text-[11px] font-mono uppercase tracking-wider rounded-full backdrop-blur-sm"
                      style={{
                        backgroundColor: `${project.color}20`,
                        color: project.color,
                        border: `1px solid ${project.color}40`,
                      }}
                    >
                      {project.description}
                    </span>
                  </div>

                  {/* Project info */}
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-3">{project.title}</h3>
                      <p className="text-text-secondary text-[15px] leading-relaxed">
                        {project.longDescription}
                      </p>
                    </div>

                    {/* Feature highlights */}
                    {project.features && project.features.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.features.map((feature) => (
                          <span
                            key={feature}
                            className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-white/[0.04] text-text-secondary border border-white/[0.06]"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 text-xs font-mono rounded-full"
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
                    <div className="flex flex-wrap gap-3 pt-3 border-t border-white/[0.06]">
                      {project.link && (
                        <MagneticButton>
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm
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
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm
                                       font-medium rounded-lg border border-border
                                       hover:border-accent-bitcoin hover:text-accent-bitcoin
                                       transition-colors duration-300"
                          >
                            <Github className="w-4 h-4" />
                            Source
                          </a>
                        </MagneticButton>
                      )}
                      {project.playStore && (
                        <MagneticButton>
                          <a
                            href={project.playStore}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm
                                       font-medium rounded-lg border border-border
                                       hover:border-accent-bitcoin hover:text-accent-bitcoin
                                       transition-colors duration-300"
                          >
                            <Smartphone className="w-4 h-4" />
                            Google Play
                          </a>
                        </MagneticButton>
                      )}
                      {project.appStore && (
                        <MagneticButton>
                          <a
                            href={project.appStore}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm
                                       font-medium rounded-lg border border-border
                                       hover:border-accent-bitcoin hover:text-accent-bitcoin
                                       transition-colors duration-300"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                            </svg>
                            App Store
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
