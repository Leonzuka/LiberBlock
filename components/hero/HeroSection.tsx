'use client'

import { useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '@/lib/projects'
import TextReveal from '@/components/ui/TextReveal'

// Dynamic imports for 3D components (no SSR)
const Scene = dynamic(() => import('@/components/three/Scene'), { ssr: false })
const InteractiveCube = dynamic(() => import('./InteractiveCube'), { ssr: false })
const PlexusField = dynamic(() => import('./PlexusField'), { ssr: false })
const Lights = dynamic(() => import('@/components/three/Lights'), { ssr: false })

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeFace, setActiveFace] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Pin the hero section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=400%',
        pin: containerRef.current,
        scrub: 1,
        onUpdate: (self) => {
          setScrollProgress(self.progress)
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleFaceChange = (faceIndex: number) => {
    setActiveFace(faceIndex)
  }

  const currentProject = projects[activeFace] || projects[0]

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[500vh]"
    >
      <div
        ref={containerRef}
        className="h-screen w-full flex items-center justify-center relative overflow-hidden"
      >
        {/* 3D Scene */}
        {isLoaded && (
          <div className="absolute inset-0 z-0">
            <Scene className="w-full h-full">
              <Lights />
              <PlexusField
                particleCount={150}
                connectionDistance={1.8}
                mouseRepulsion={0.5}
              />
              <InteractiveCube
                scrollProgress={scrollProgress}
                onFaceChange={handleFaceChange}
              />
            </Scene>
          </div>
        )}

        {/* Content Overlay */}
        <div className="relative z-10 section-container w-full h-full flex flex-col justify-between py-32">
          {/* Top tagline */}
          <div className="text-center">
            <TextReveal delay={0.5}>
              <p className="text-text-secondary font-mono text-sm tracking-widest uppercase">
                Digital Innovation Studio
              </p>
            </TextReveal>
          </div>

          {/* Center - Project info panel */}
          <div className="flex justify-between items-center gap-8">
            {/* Left side - Project info */}
            <div
              className={`max-w-md transition-all duration-700 transform
                          ${scrollProgress > 0.05 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
            >
              <div className="glassmorphism rounded-xl p-6">
                <span
                  className="inline-block px-3 py-1 text-xs font-mono rounded-full mb-4"
                  style={{
                    backgroundColor: `${currentProject.color}20`,
                    color: currentProject.color,
                    border: `1px solid ${currentProject.color}40`,
                  }}
                >
                  {String(activeFace + 1).padStart(2, '0')} / 06
                </span>
                <h2 className="text-3xl font-bold mb-2">{currentProject.title}</h2>
                <p className="text-text-secondary mb-4">
                  {currentProject.description}
                </p>
                {currentProject.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs font-mono bg-bg-card rounded border border-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Instructions */}
            <div
              className={`text-right transition-all duration-700 transform
                          ${scrollProgress < 0.05 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
            >
              <p className="text-text-secondary text-sm">
                <span className="text-accent-bitcoin">Drag</span> to explore
              </p>
              <p className="text-text-secondary text-sm">
                <span className="text-accent-bitcoin">Scroll</span> to navigate
              </p>
            </div>
          </div>

          {/* Bottom - Scroll indicator */}
          <div className="text-center">
            <div
              className={`inline-flex flex-col items-center gap-2 transition-opacity duration-500
                          ${scrollProgress > 0.02 ? 'opacity-0' : 'opacity-100'}`}
            >
              <span className="text-text-secondary text-xs font-mono uppercase tracking-widest">
                Scroll to explore
              </span>
              <div className="w-6 h-10 rounded-full border border-border flex justify-center pt-2">
                <div className="w-1 h-2 bg-accent-bitcoin rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-bg-secondary z-20">
          <div
            className="h-full bg-gradient-to-r from-accent-bitcoin to-accent-gold transition-all duration-100"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>
    </section>
  )
}
