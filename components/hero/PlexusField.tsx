'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface PlexusFieldProps {
  particleCount?: number
  connectionDistance?: number
  mouseRepulsion?: number
}

export default function PlexusField({
  particleCount = 150,
  connectionDistance = 2,
  mouseRepulsion = 0.5,
}: PlexusFieldProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const mousePos = useRef(new THREE.Vector2(0, 0))
  const { viewport, size } = useThree()

  // Adjust particle count for mobile
  const adjustedCount = useMemo(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return Math.floor(particleCount * 0.5)
    }
    return particleCount
  }, [particleCount])

  // Generate initial particle positions
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(adjustedCount * 3)
    const velocities = new Float32Array(adjustedCount * 3)

    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3
      // Spread particles in a 3D space
      positions[i3] = (Math.random() - 0.5) * 10
      positions[i3 + 1] = (Math.random() - 0.5) * 10
      positions[i3 + 2] = (Math.random() - 0.5) * 5 - 2

      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01
    }

    return { positions, velocities }
  }, [adjustedCount])

  // Create line geometry for connections
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    // Max possible connections
    const maxConnections = adjustedCount * adjustedCount
    const linePositions = new Float32Array(maxConnections * 6)
    const lineColors = new Float32Array(maxConnections * 6)

    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(linePositions, 3)
    )
    geometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3))
    geometry.setDrawRange(0, 0)

    return geometry
  }, [adjustedCount])

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / size.width) * 2 - 1
      mousePos.current.y = -(e.clientY / size.height) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [size])

  // Animation loop
  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return

    const positionAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute
    const positions = positionAttr.array as Float32Array

    // Convert mouse to world coordinates
    const mouseWorld = new THREE.Vector3(
      mousePos.current.x * viewport.width * 0.5,
      mousePos.current.y * viewport.height * 0.5,
      0
    )

    // Update particle positions
    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3

      // Apply velocity
      positions[i3] += velocities[i3]
      positions[i3 + 1] += velocities[i3 + 1]
      positions[i3 + 2] += velocities[i3 + 2]

      // Add noise-based movement
      const time = state.clock.elapsedTime
      positions[i3] += Math.sin(time * 0.5 + i) * 0.002
      positions[i3 + 1] += Math.cos(time * 0.3 + i) * 0.002

      // Mouse repulsion
      const dx = positions[i3] - mouseWorld.x
      const dy = positions[i3 + 1] - mouseWorld.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 2) {
        const force = ((2 - dist) / 2) * mouseRepulsion * 0.05
        positions[i3] += (dx / dist) * force
        positions[i3 + 1] += (dy / dist) * force
      }

      // Boundary wrapping
      if (positions[i3] > 6) positions[i3] = -6
      if (positions[i3] < -6) positions[i3] = 6
      if (positions[i3 + 1] > 6) positions[i3 + 1] = -6
      if (positions[i3 + 1] < -6) positions[i3 + 1] = 6
      if (positions[i3 + 2] > 0) positions[i3 + 2] = -5
      if (positions[i3 + 2] < -5) positions[i3 + 2] = 0
    }

    positionAttr.needsUpdate = true

    // Update connections
    const linePositions = lineGeometry.attributes.position.array as Float32Array
    const lineColors = lineGeometry.attributes.color.array as Float32Array
    let lineIndex = 0

    const bitcoinColor = new THREE.Color('#F7931A')

    for (let i = 0; i < adjustedCount; i++) {
      for (let j = i + 1; j < adjustedCount; j++) {
        const i3 = i * 3
        const j3 = j * 3

        const dx = positions[i3] - positions[j3]
        const dy = positions[i3 + 1] - positions[j3 + 1]
        const dz = positions[i3 + 2] - positions[j3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < connectionDistance) {
          const alpha = 1 - dist / connectionDistance

          // Start point
          linePositions[lineIndex * 6] = positions[i3]
          linePositions[lineIndex * 6 + 1] = positions[i3 + 1]
          linePositions[lineIndex * 6 + 2] = positions[i3 + 2]

          // End point
          linePositions[lineIndex * 6 + 3] = positions[j3]
          linePositions[lineIndex * 6 + 4] = positions[j3 + 1]
          linePositions[lineIndex * 6 + 5] = positions[j3 + 2]

          // Colors with alpha
          lineColors[lineIndex * 6] = bitcoinColor.r * alpha
          lineColors[lineIndex * 6 + 1] = bitcoinColor.g * alpha
          lineColors[lineIndex * 6 + 2] = bitcoinColor.b * alpha
          lineColors[lineIndex * 6 + 3] = bitcoinColor.r * alpha
          lineColors[lineIndex * 6 + 4] = bitcoinColor.g * alpha
          lineColors[lineIndex * 6 + 5] = bitcoinColor.b * alpha

          lineIndex++
        }
      }
    }

    lineGeometry.setDrawRange(0, lineIndex * 2)
    lineGeometry.attributes.position.needsUpdate = true
    lineGeometry.attributes.color.needsUpdate = true
  })

  return (
    <group>
      {/* Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={adjustedCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#F7931A"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Connection lines */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  )
}
