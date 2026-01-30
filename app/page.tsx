'use client'

import dynamic from 'next/dynamic'

// Dynamic imports for heavy 3D components
const HeroSection = dynamic(() => import('@/components/hero/HeroSection'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-bg-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-2 border-accent-bitcoin border-t-transparent rounded-full animate-spin" />
        <p className="text-text-secondary font-mono text-sm">Loading experience...</p>
      </div>
    </div>
  ),
})

import ProjectsSection from '@/components/sections/ProjectsSection'
import AboutSection from '@/components/sections/AboutSection'
import TechStack from '@/components/sections/TechStack'
import ContactSection from '@/components/sections/ContactSection'

export default function Home() {
  return (
    <>
      {/* Hero with 3D Cube and Plexus particles */}
      <HeroSection />

      {/* Projects showcase */}
      <ProjectsSection />

      {/* About LiberBlock */}
      <AboutSection />

      {/* Tech stack */}
      <TechStack />

      {/* Contact section */}
      <ContactSection />
    </>
  )
}
