'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface PlexusFieldProps {
  particleCount?: number
  connectionDistance?: number
  mouseRepulsion?: number
}

// Custom shader for glowing block particles
const particleVertexShader = `
  attribute float size;
  attribute vec3 customColor;
  attribute float pulse;
  varying vec3 vColor;
  varying float vPulse;

  void main() {
    vColor = customColor;
    vPulse = pulse;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const particleFragmentShader = `
  varying vec3 vColor;
  varying float vPulse;

  void main() {
    // Create square/block shape
    vec2 uv = gl_PointCoord - 0.5;
    float dist = max(abs(uv.x), abs(uv.y));

    // Sharp edges with subtle glow
    float alpha = 1.0 - smoothstep(0.35, 0.5, dist);

    // Inner glow effect
    float innerGlow = 1.0 - smoothstep(0.0, 0.4, dist);
    vec3 glowColor = vColor + vec3(0.3, 0.15, 0.0) * innerGlow * vPulse;

    // Outer subtle glow
    float outerGlow = 1.0 - smoothstep(0.3, 0.6, dist);
    alpha = max(alpha, outerGlow * 0.3);

    gl_FragColor = vec4(glowColor, alpha * (0.7 + vPulse * 0.3));
  }
`

// Shader for animated connection lines
const lineVertexShader = `
  attribute vec3 customColor;
  attribute float lineAlpha;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = customColor;
    vAlpha = lineAlpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const lineFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    gl_FragColor = vec4(vColor, vAlpha);
  }
`

export default function PlexusField({
  particleCount = 200,
  connectionDistance = 2.2,
  mouseRepulsion = 0.6,
}: PlexusFieldProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const mousePos = useRef(new THREE.Vector2(0, 0))
  const { viewport, size } = useThree()

  // Adjust particle count for mobile
  const adjustedCount = useMemo(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return Math.floor(particleCount * 0.4)
    }
    return particleCount
  }, [particleCount])

  // Color palette
  const colors = useMemo(() => ({
    bitcoinOrange: new THREE.Color('#F7931A'),
    gold: new THREE.Color('#D4AF37'),
    deepOrange: new THREE.Color('#E8720C'),
    amber: new THREE.Color('#FFBF00'),
  }), [])

  // Generate initial particle data with more variety
  const particleData = useMemo(() => {
    const positions = new Float32Array(adjustedCount * 3)
    const velocities = new Float32Array(adjustedCount * 3)
    const sizes = new Float32Array(adjustedCount)
    const customColors = new Float32Array(adjustedCount * 3)
    const pulses = new Float32Array(adjustedCount)
    const phases = new Float32Array(adjustedCount) // For animation offset

    const colorOptions = [colors.bitcoinOrange, colors.gold, colors.deepOrange, colors.amber]

    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3

      // Distribute in layers for depth
      const layer = Math.floor(Math.random() * 3)
      const zDepth = layer === 0 ? -1 : layer === 1 ? -3 : -5
      const spread = layer === 0 ? 8 : layer === 1 ? 12 : 16

      positions[i3] = (Math.random() - 0.5) * spread
      positions[i3 + 1] = (Math.random() - 0.5) * spread
      positions[i3 + 2] = zDepth + (Math.random() - 0.5) * 2

      // Slower, more organic movement
      const speedFactor = 0.008 + Math.random() * 0.012
      velocities[i3] = (Math.random() - 0.5) * speedFactor
      velocities[i3 + 1] = (Math.random() - 0.5) * speedFactor
      velocities[i3 + 2] = (Math.random() - 0.5) * speedFactor * 0.3

      // Varied sizes - some larger "node" particles
      const isNode = Math.random() > 0.85
      sizes[i] = isNode ? 0.15 + Math.random() * 0.1 : 0.04 + Math.random() * 0.06

      // Color variation
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)]
      customColors[i3] = color.r
      customColors[i3 + 1] = color.g
      customColors[i3 + 2] = color.b

      pulses[i] = 0.5 + Math.random() * 0.5
      phases[i] = Math.random() * Math.PI * 2
    }

    return { positions, velocities, sizes, customColors, pulses, phases }
  }, [adjustedCount, colors])

  // Create shader material for particles
  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }, [])

  // Create line geometry for connections
  const lineData = useMemo(() => {
    const maxConnections = Math.min(adjustedCount * 20, 3000)
    const positions = new Float32Array(maxConnections * 6)
    const colors = new Float32Array(maxConnections * 6)
    const alphas = new Float32Array(maxConnections * 2)

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('lineAlpha', new THREE.BufferAttribute(alphas, 1))
    geometry.setDrawRange(0, 0)

    const material = new THREE.ShaderMaterial({
      vertexShader: lineVertexShader,
      fragmentShader: lineFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    return { geometry, material }
  }, [adjustedCount])

  // Track mouse position with smoothing
  const smoothMouse = useRef(new THREE.Vector2(0, 0))

  // Reusable objects for animation loop (avoid allocations in useFrame)
  const mouseWorldRef = useRef(new THREE.Vector3())
  const tempColor = useRef(new THREE.Color())

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

    const time = state.clock.elapsedTime
    particleMaterial.uniforms.time.value = time

    // Smooth mouse following
    smoothMouse.current.x += (mousePos.current.x - smoothMouse.current.x) * 0.05
    smoothMouse.current.y += (mousePos.current.y - smoothMouse.current.y) * 0.05

    const positionAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const pulseAttr = pointsRef.current.geometry.attributes.pulse as THREE.BufferAttribute
    const positions = positionAttr.array as Float32Array
    const pulses = pulseAttr.array as Float32Array

    // Convert mouse to world coordinates (reuse ref to avoid allocation)
    const mouseWorld = mouseWorldRef.current.set(
      smoothMouse.current.x * viewport.width * 0.5,
      smoothMouse.current.y * viewport.height * 0.5,
      0
    )

    // Update particle positions and pulses
    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3

      // Apply velocity
      positions[i3] += particleData.velocities[i3]
      positions[i3 + 1] += particleData.velocities[i3 + 1]
      positions[i3 + 2] += particleData.velocities[i3 + 2]

      // Organic flowing movement
      const phase = particleData.phases[i]
      positions[i3] += Math.sin(time * 0.3 + phase) * 0.003
      positions[i3 + 1] += Math.cos(time * 0.25 + phase * 1.3) * 0.003
      positions[i3 + 2] += Math.sin(time * 0.2 + phase * 0.7) * 0.001

      // Mouse interaction - attraction for nearby, repulsion for very close
      const dx = positions[i3] - mouseWorld.x
      const dy = positions[i3 + 1] - mouseWorld.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 3 && dist > 0.1) {
        const force = dist < 1.5
          ? ((1.5 - dist) / 1.5) * mouseRepulsion * 0.03 // Repulsion
          : -((3 - dist) / 3) * 0.005 // Subtle attraction
        positions[i3] += (dx / dist) * force
        positions[i3 + 1] += (dy / dist) * force
      }

      // Soft boundary with gradual return
      const boundX = 8, boundY = 8, boundZ = 6
      if (Math.abs(positions[i3]) > boundX) {
        positions[i3] *= 0.99
        particleData.velocities[i3] *= -0.5
      }
      if (Math.abs(positions[i3 + 1]) > boundY) {
        positions[i3 + 1] *= 0.99
        particleData.velocities[i3 + 1] *= -0.5
      }
      if (positions[i3 + 2] > -0.5 || positions[i3 + 2] < -boundZ) {
        particleData.velocities[i3 + 2] *= -0.5
        positions[i3 + 2] = Math.max(-boundZ, Math.min(-0.5, positions[i3 + 2]))
      }

      // Animate pulse for glow effect
      pulses[i] = 0.5 + Math.sin(time * 2 + phase) * 0.3 + Math.sin(time * 0.5 + phase * 2) * 0.2
    }

    positionAttr.needsUpdate = true
    pulseAttr.needsUpdate = true

    // Update connections with animated data flow effect
    const linePositions = lineData.geometry.attributes.position.array as Float32Array
    const lineColors = lineData.geometry.attributes.customColor.array as Float32Array
    const lineAlphas = lineData.geometry.attributes.lineAlpha.array as Float32Array
    let lineIndex = 0
    const maxLines = Math.floor(linePositions.length / 6)

    for (let i = 0; i < adjustedCount && lineIndex < maxLines; i++) {
      for (let j = i + 1; j < adjustedCount && lineIndex < maxLines; j++) {
        const i3 = i * 3
        const j3 = j * 3

        const dx = positions[i3] - positions[j3]
        const dy = positions[i3 + 1] - positions[j3 + 1]
        const dz = positions[i3 + 2] - positions[j3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < connectionDistance) {
          const baseAlpha = Math.pow(1 - dist / connectionDistance, 1.5)

          // Data pulse traveling along connection
          const pulseSpeed = 3
          const pulsePhase = (i + j) * 0.1
          const dataPulse = Math.sin(time * pulseSpeed + pulsePhase) * 0.5 + 0.5

          const idx = lineIndex * 6

          // Start point
          linePositions[idx] = positions[i3]
          linePositions[idx + 1] = positions[i3 + 1]
          linePositions[idx + 2] = positions[i3 + 2]

          // End point
          linePositions[idx + 3] = positions[j3]
          linePositions[idx + 4] = positions[j3 + 1]
          linePositions[idx + 5] = positions[j3 + 2]

          // Color gradient from orange to gold based on depth (reuse ref to avoid allocation)
          const depthFactor = Math.abs(positions[i3 + 2] + positions[j3 + 2]) / 10
          tempColor.current.lerpColors(
            colors.bitcoinOrange,
            colors.gold,
            depthFactor + dataPulse * 0.3
          )

          lineColors[idx] = tempColor.current.r
          lineColors[idx + 1] = tempColor.current.g
          lineColors[idx + 2] = tempColor.current.b
          lineColors[idx + 3] = tempColor.current.r
          lineColors[idx + 4] = tempColor.current.g
          lineColors[idx + 5] = tempColor.current.b

          // Alpha with pulse animation
          const finalAlpha = baseAlpha * (0.15 + dataPulse * 0.15)
          lineAlphas[lineIndex * 2] = finalAlpha
          lineAlphas[lineIndex * 2 + 1] = finalAlpha

          lineIndex++
        }
      }
    }

    lineData.geometry.setDrawRange(0, lineIndex * 2)
    lineData.geometry.attributes.position.needsUpdate = true
    lineData.geometry.attributes.customColor.needsUpdate = true
    lineData.geometry.attributes.lineAlpha.needsUpdate = true
  })

  return (
    <group>
      {/* Glowing block particles */}
      <points ref={pointsRef} material={particleMaterial}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={adjustedCount}
            array={particleData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={adjustedCount}
            array={particleData.sizes}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-customColor"
            count={adjustedCount}
            array={particleData.customColors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-pulse"
            count={adjustedCount}
            array={particleData.pulses}
            itemSize={1}
          />
        </bufferGeometry>
      </points>

      {/* Animated connection lines */}
      <lineSegments
        ref={linesRef}
        geometry={lineData.geometry}
        material={lineData.material}
      />

      {/* Background ambient glow particles (extra layer) */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={Math.floor(adjustedCount * 0.3)}
            array={useMemo(() => {
              const arr = new Float32Array(Math.floor(adjustedCount * 0.3) * 3)
              for (let i = 0; i < arr.length; i += 3) {
                arr[i] = (Math.random() - 0.5) * 20
                arr[i + 1] = (Math.random() - 0.5) * 20
                arr[i + 2] = -8 - Math.random() * 4
              }
              return arr
            }, [adjustedCount])}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#F7931A"
          transparent
          opacity={0.3}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
