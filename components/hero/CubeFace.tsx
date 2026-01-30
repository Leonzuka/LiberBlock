'use client'

import { useRef } from 'react'
import { useTexture, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Hexagon, Github, Linkedin, Twitter, Mail } from 'lucide-react'

interface CubeFaceProps {
  project: {
    id: string
    title: string
    description: string
    texture: string
    type: 'animated' | 'screenshot' | 'logo' | 'contact'
    color: string
  }
  position: [number, number, number]
  rotation: [number, number, number]
  isActive: boolean
}

function LogoFace({ isActive }: { isActive: boolean }) {
  return (
    <Html
      transform
      occlude
      distanceFactor={1.5}
      position={[0, 0, 0.01]}
      className="pointer-events-none"
    >
      <div
        className={`w-[200px] h-[200px] flex flex-col items-center justify-center
                    bg-bg-primary/90 backdrop-blur transition-all duration-500
                    ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-80'}`}
      >
        <Hexagon
          className={`w-16 h-16 text-accent-bitcoin mb-4
                      ${isActive ? 'animate-pulse-glow' : ''}`}
          strokeWidth={1.5}
        />
        <span className="text-2xl font-bold tracking-tight text-text-primary">
          Liber<span className="text-accent-bitcoin">Block</span>
        </span>
        <span className="text-sm text-text-secondary mt-2">Digital Innovation</span>
      </div>
    </Html>
  )
}

function ContactFace({ isActive }: { isActive: boolean }) {
  const icons = [
    { Icon: Github, href: '#', label: 'GitHub' },
    { Icon: Linkedin, href: '#', label: 'LinkedIn' },
    { Icon: Twitter, href: '#', label: 'Twitter' },
    { Icon: Mail, href: '#', label: 'Email' },
  ]

  return (
    <Html
      transform
      occlude
      distanceFactor={1.5}
      position={[0, 0, 0.01]}
      className="pointer-events-none"
    >
      <div
        className={`w-[200px] h-[200px] flex flex-col items-center justify-center
                    bg-bg-primary/90 backdrop-blur p-4 transition-all duration-500
                    ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-80'}`}
      >
        <span className="text-lg font-bold text-text-primary mb-2">Get in Touch</span>
        <span className="text-xs text-text-secondary mb-4 text-center">
          Let&apos;s build something amazing
        </span>
        <div className="flex gap-3">
          {icons.map(({ Icon, label }) => (
            <div
              key={label}
              className="w-10 h-10 rounded-lg border border-border flex items-center
                         justify-center text-text-secondary hover:text-accent-bitcoin
                         hover:border-accent-bitcoin transition-colors"
            >
              <Icon className="w-5 h-5" />
            </div>
          ))}
        </div>
      </div>
    </Html>
  )
}

function TextureFace({
  texturePath,
  isActive,
}: {
  texturePath: string
  isActive: boolean
}) {
  const texture = useTexture(texturePath)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        materialRef.current.emissiveIntensity,
        isActive ? 0.3 : 0.1,
        0.1
      )
    }
  })

  return (
    <meshStandardMaterial
      ref={materialRef}
      map={texture}
      emissive="#F7931A"
      emissiveIntensity={0.1}
      roughness={0.4}
      metalness={0.6}
    />
  )
}

function PlaceholderFace({ color, title }: { color: string; title: string }) {
  return (
    <meshStandardMaterial color={color} roughness={0.5} metalness={0.5}>
      <Html transform distanceFactor={1.5} position={[0, 0, 0.01]}>
        <div className="w-[150px] text-center">
          <span className="text-sm font-bold text-white">{title}</span>
        </div>
      </Html>
    </meshStandardMaterial>
  )
}

export default function CubeFace({ project, isActive }: CubeFaceProps) {
  if (project.type === 'logo') {
    return <LogoFace isActive={isActive} />
  }

  if (project.type === 'contact') {
    return <ContactFace isActive={isActive} />
  }

  if (project.texture) {
    return <TextureFace texturePath={project.texture} isActive={isActive} />
  }

  return <PlaceholderFace color={project.color} title={project.title} />
}
