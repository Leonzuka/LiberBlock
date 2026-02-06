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
const FloatingWords = dynamic(() => import('./FloatingWords'), { ssr: false })

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
        className="h-screen w-full relative overflow-hidden"
      >
        {/* Floating words behind the cube */}
        {isLoaded && (
          <div className="absolute inset-0 z-[5]">
            <FloatingWords />
          </div>
        )}

        {/* 3D Scene - Full screen canvas */}
        {isLoaded && (
          <div className="absolute inset-0 z-10">
            <Scene className="w-full h-full">
              <Lights />
              <PlexusField
                particleCount={180}
                connectionDistance={2.0}
                mouseRepulsion={0.6}
              />
              <InteractiveCube
                scrollProgress={scrollProgress}
                onFaceChange={handleFaceChange}
              />
            </Scene>
          </div>
        )}

        {/* Content Overlay - pointer-events: none to allow cube interaction */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Right side - Instructions (only visible at start) */}
          <div
            className={`absolute top-1/2 right-8 -translate-y-1/2 text-right transition-all duration-700
                        ${scrollProgress < 0.05 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}
          >
            <div className="space-y-3">
              <p className="text-text-secondary text-sm">
                <span className="text-accent-bitcoin">Drag</span> to explore
              </p>
              <p className="text-text-secondary text-sm">
                <span className="text-accent-bitcoin">← → ↑ ↓</span> to rotate
              </p>
              <p className="text-text-secondary text-sm">
                <span className="text-accent-bitcoin">Scroll</span> to navigate
              </p>
            </div>
          </div>

          {/* Bottom left - Project info panel */}
          <div
            className={`absolute bottom-24 left-8 max-w-sm transition-all duration-700 transform pointer-events-auto
                        ${scrollProgress > 0.05 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="glassmorphism rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="inline-block px-3 py-1 text-xs font-mono rounded-full"
                  style={{
                    backgroundColor: `${currentProject.color}20`,
                    color: currentProject.color,
                    border: `1px solid ${currentProject.color}40`,
                  }}
                >
                  {String(activeFace + 1).padStart(2, '0')} / 06
                </span>
                <div
                  className="h-px flex-1"
                  style={{ backgroundColor: `${currentProject.color}40` }}
                />
              </div>
              <h2 className="text-2xl font-bold mb-2">{currentProject.title}</h2>
              <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                {currentProject.description}
              </p>
              {currentProject.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentProject.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs font-mono bg-bg-primary/50 rounded border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom right - Face indicators */}
          <div
            className={`absolute bottom-24 right-8 transition-all duration-700
                        ${scrollProgress > 0.05 ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="flex flex-col gap-2">
              {projects.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeFace
                      ? 'bg-accent-bitcoin scale-125'
                      : 'bg-border hover:bg-text-secondary'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Bottom center - Scroll indicator (only visible at start) */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <div
              className={`flex flex-col items-center gap-2 transition-opacity duration-500
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
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-bg-secondary z-30">
          <div
            className="h-full bg-gradient-to-r from-accent-bitcoin to-accent-gold transition-all duration-100"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>
    </section>
  )
}
