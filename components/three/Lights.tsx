'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Lights() {
  const orbitLightRef = useRef<THREE.PointLight>(null)
  const topLightRef = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Orbiting light around the cube
    if (orbitLightRef.current) {
      orbitLightRef.current.position.x = Math.sin(time * 0.5) * 4
      orbitLightRef.current.position.z = Math.cos(time * 0.5) * 4
      orbitLightRef.current.position.y = Math.sin(time * 0.3) * 2
    }

    // Top light gentle movement
    if (topLightRef.current) {
      topLightRef.current.position.x = Math.sin(time * 0.4) * 1.5
      topLightRef.current.position.z = Math.cos(time * 0.4) * 1.5
    }
  })

  return (
    <>
      {/* Ambient light - base illumination */}
      <ambientLight intensity={0.6} color="#ffffff" />

      {/* Main front light - white for accurate colors */}
      <directionalLight
        position={[0, 0, 5]}
        intensity={0.6}
        color="#ffffff"
      />

      {/* Orbiting light - illuminates metal textures dynamically */}
      <pointLight
        ref={orbitLightRef}
        position={[4, 2, 4]}
        intensity={1.5}
        color="#ffffff"
        distance={12}
        decay={2}
      />

      {/* Top light - illuminates top/bottom faces */}
      <pointLight
        ref={topLightRef}
        position={[0, 5, 0]}
        intensity={1.2}
        color="#F7931A"
        distance={10}
        decay={2}
      />

      {/* Bottom fill light */}
      <pointLight
        position={[0, -5, 2]}
        intensity={0.8}
        color="#D4AF37"
        distance={10}
        decay={2}
      />

      {/* Accent rim light */}
      <pointLight
        position={[-5, -2, -5]}
        intensity={0.4}
        color="#4169E1"
      />
    </>
  )
}
