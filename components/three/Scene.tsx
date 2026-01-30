'use client'

import { Suspense, ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'

interface SceneProps {
  children: ReactNode
  className?: string
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-accent-bitcoin border-t-transparent
                      rounded-full animate-spin" />
    </div>
  )
}

export default function Scene({ children, className = '' }: SceneProps) {
  return (
    <div className={`relative ${className}`}>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          dpr={[1, 2]}
          camera={{ fov: 45, position: [0, 0, 5], near: 0.1, far: 100 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ background: 'transparent' }}
        >
          {children}
          <Preload all />
        </Canvas>
      </Suspense>
    </div>
  )
}
