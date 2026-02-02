'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Hook para detectar mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isMobile
}

// Partículas 3D que formam o "404" e reagem ao mouse/touch
function Particles404({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Points>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  // Reduzir partículas no mobile
  const particleCount = isMobile ? 600 : 2000

  const { positions, originalPositions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const originalPositions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    const bitcoinOrange = new THREE.Color('#F7931A')
    const gold = new THREE.Color('#D4AF37')

    // Criar pontos que formam "404" - escala ajustada para mobile
    const scale = isMobile ? 0.7 : 1
    const text404Points: [number, number][] = []

    // Primeiro "4"
    for (let y = 0; y < 10; y++) text404Points.push([-3.5 * scale, (1 - y * 0.2) * scale])
    for (let x = 0; x < 5; x++) text404Points.push([(-3.5 + x * 0.15) * scale, -0.2 * scale])
    for (let y = 0; y < 5; y++) text404Points.push([-3.0 * scale, (1 - y * 0.2) * scale])

    // "0"
    for (let y = 0; y < 10; y++) {
      text404Points.push([-1.2 * scale, (1 - y * 0.2) * scale])
      text404Points.push([0.2 * scale, (1 - y * 0.2) * scale])
    }
    for (let x = 0; x < 8; x++) {
      text404Points.push([(-1.2 + x * 0.175) * scale, 1 * scale])
      text404Points.push([(-1.2 + x * 0.175) * scale, -1 * scale])
    }

    // Segundo "4"
    for (let y = 0; y < 10; y++) text404Points.push([1.3 * scale, (1 - y * 0.2) * scale])
    for (let x = 0; x < 5; x++) text404Points.push([(1.3 + x * 0.15) * scale, -0.2 * scale])
    for (let y = 0; y < 5; y++) text404Points.push([1.8 * scale, (1 - y * 0.2) * scale])

    const multiplier = isMobile ? 4 : 8

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      if (i < text404Points.length * multiplier) {
        const pointIndex = Math.floor(i / multiplier) % text404Points.length
        const point = text404Points[pointIndex]
        const spread = isMobile ? 0.1 : 0.15

        positions[i3] = point[0] + (Math.random() - 0.5) * spread
        positions[i3 + 1] = point[1] + (Math.random() - 0.5) * spread
        positions[i3 + 2] = (Math.random() - 0.5) * 0.5
      } else {
        const spreadX = isMobile ? 8 : 12
        const spreadY = isMobile ? 6 : 8
        positions[i3] = (Math.random() - 0.5) * spreadX
        positions[i3 + 1] = (Math.random() - 0.5) * spreadY
        positions[i3 + 2] = (Math.random() - 0.5) * 4 - 2
      }

      originalPositions[i3] = positions[i3]
      originalPositions[i3 + 1] = positions[i3 + 1]
      originalPositions[i3 + 2] = positions[i3 + 2]

      const color = Math.random() > 0.5 ? bitcoinOrange : gold
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }

    return { positions, originalPositions, colors }
  }, [particleCount, isMobile])

  // Rastrear mouse e touch
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        mousePos.current.x = (touch.clientX / window.innerWidth) * 2 - 1
        mousePos.current.y = -(touch.clientY / window.innerHeight) * 2 + 1
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchstart', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchMove)
    }
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return

    const positionAttr = meshRef.current.geometry.attributes.position as THREE.BufferAttribute
    const posArray = positionAttr.array as Float32Array
    const time = state.clock.elapsedTime

    const mouseX = mousePos.current.x * viewport.width * 0.5
    const mouseY = mousePos.current.y * viewport.height * 0.5

    const repulsionRadius = isMobile ? 1.2 : 1.5
    const repulsionForce = isMobile ? 0.12 : 0.15

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      const dx = posArray[i3] - mouseX
      const dy = posArray[i3 + 1] - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < repulsionRadius && dist > 0.01) {
        const force = (repulsionRadius - dist) * repulsionForce
        posArray[i3] += (dx / dist) * force
        posArray[i3 + 1] += (dy / dist) * force
      }

      posArray[i3] += (originalPositions[i3] - posArray[i3]) * 0.03
      posArray[i3 + 1] += (originalPositions[i3 + 1] - posArray[i3 + 1]) * 0.03
      posArray[i3 + 2] += (originalPositions[i3 + 2] - posArray[i3 + 2]) * 0.03

      const movementScale = isMobile ? 0.001 : 0.002
      posArray[i3] += Math.sin(time * 0.5 + i * 0.1) * movementScale
      posArray[i3 + 1] += Math.cos(time * 0.3 + i * 0.1) * movementScale
    }

    positionAttr.needsUpdate = true
    meshRef.current.rotation.y = Math.sin(time * 0.1) * 0.05
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.08 : 0.06}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Linhas de conexão estilo plexus (desativado no mobile para performance)
function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null)
  const { viewport } = useThree()
  const mousePos = useRef({ x: 0, y: 0 })

  const nodeCount = 40
  const { positions, velocities, lineGeometry } = useMemo(() => {
    const positions = new Float32Array(nodeCount * 3)
    const velocities = new Float32Array(nodeCount * 3)

    for (let i = 0; i < nodeCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 14
      positions[i3 + 1] = (Math.random() - 0.5) * 10
      positions[i3 + 2] = (Math.random() - 0.5) * 4 - 3

      velocities[i3] = (Math.random() - 0.5) * 0.015
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.015
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.008
    }

    const geometry = new THREE.BufferGeometry()
    const maxConnections = nodeCount * nodeCount
    const linePositions = new Float32Array(maxConnections * 6)
    const lineColors = new Float32Array(maxConnections * 6)

    geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3))
    geometry.setDrawRange(0, 0)

    return { positions, velocities, lineGeometry: geometry }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((state) => {
    if (!linesRef.current) return

    const time = state.clock.elapsedTime
    const mouseX = mousePos.current.x * viewport.width * 0.5
    const mouseY = mousePos.current.y * viewport.height * 0.5

    for (let i = 0; i < nodeCount; i++) {
      const i3 = i * 3
      positions[i3] += velocities[i3]
      positions[i3 + 1] += velocities[i3 + 1]
      positions[i3 + 2] += velocities[i3 + 2]

      positions[i3] += Math.sin(time * 0.3 + i) * 0.003
      positions[i3 + 1] += Math.cos(time * 0.2 + i) * 0.003

      const dx = positions[i3] - mouseX
      const dy = positions[i3 + 1] - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 2.5 && dist > 0.01) {
        const force = (2.5 - dist) * 0.02
        positions[i3] += (dx / dist) * force
        positions[i3 + 1] += (dy / dist) * force
      }

      if (Math.abs(positions[i3]) > 8) velocities[i3] *= -1
      if (Math.abs(positions[i3 + 1]) > 6) velocities[i3 + 1] *= -1
      if (positions[i3 + 2] > -1 || positions[i3 + 2] < -5) velocities[i3 + 2] *= -1
    }

    const linePositions = lineGeometry.attributes.position.array as Float32Array
    const lineColors = lineGeometry.attributes.color.array as Float32Array
    let lineIndex = 0

    const bitcoinColor = new THREE.Color('#F7931A')

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const i3 = i * 3
        const j3 = j * 3

        const dx = positions[i3] - positions[j3]
        const dy = positions[i3 + 1] - positions[j3 + 1]
        const dz = positions[i3 + 2] - positions[j3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < 2.5) {
          const alpha = (1 - dist / 2.5) * 0.3

          linePositions[lineIndex * 6] = positions[i3]
          linePositions[lineIndex * 6 + 1] = positions[i3 + 1]
          linePositions[lineIndex * 6 + 2] = positions[i3 + 2]
          linePositions[lineIndex * 6 + 3] = positions[j3]
          linePositions[lineIndex * 6 + 4] = positions[j3 + 1]
          linePositions[lineIndex * 6 + 5] = positions[j3 + 2]

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
    <lineSegments ref={linesRef} geometry={lineGeometry}>
      <lineBasicMaterial vertexColors transparent opacity={0.4} blending={THREE.AdditiveBlending} />
    </lineSegments>
  )
}

// Efeito de texto glitch
function GlitchText({ children, className }: { children: string; className?: string }) {
  const [glitchText, setGlitchText] = useState(children)
  const [isGlitching, setIsGlitching] = useState(false)

  const glitch = useCallback(() => {
    if (isGlitching) return
    setIsGlitching(true)

    const chars = '!<>-_\\/[]{}—=+*^?#_₿⚡'
    const original = children
    let iterations = 0

    const interval = setInterval(() => {
      setGlitchText(
        original
          .split('')
          .map((char, index) => {
            if (index < iterations) return original[index]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )

      if (iterations >= original.length) {
        clearInterval(interval)
        setGlitchText(original)
        setIsGlitching(false)
      }
      iterations += 1 / 2
    }, 40)
  }, [children, isGlitching])

  useEffect(() => {
    const timeout = setTimeout(glitch, 500)
    const interval = setInterval(glitch, 4000)
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [glitch])

  return (
    <span
      className={className}
      onMouseEnter={glitch}
      onTouchStart={glitch}
      style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
    >
      {glitchText}
    </span>
  )
}

// Matrix rain - simplificado para mobile
function MatrixRain({ isMobile }: { isMobile: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const chars = '01₿⚡∞Ξ◊⬡▲△▽◇○●◈⬢'.split('')
    const fontSize = isMobile ? 12 : 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 11, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = isMobile ? '#F7931A10' : '#F7931A15'
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        ctx.fillText(char, x, y)

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const intervalTime = isMobile ? 80 : 50
    const interval = setInterval(draw, intervalTime)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resize)
    }
  }, [isMobile])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-60"
      aria-hidden="true"
    />
  )
}

export default function NotFound() {
  const [mounted, setMounted] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-primary">
      {/* Matrix Rain Background */}
      {mounted && <MatrixRain isMobile={isMobile} />}

      {/* 3D Canvas */}
      {mounted && (
        <div className="absolute inset-0">
          <Canvas
            dpr={isMobile ? [1, 1.5] : [1, 2]}
            camera={{
              fov: isMobile ? 60 : 50,
              position: [0, 0, isMobile ? 5 : 6],
              near: 0.1,
              far: 100
            }}
            gl={{
              antialias: !isMobile,
              alpha: true,
              powerPreference: isMobile ? 'low-power' : 'high-performance'
            }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.5} />
            <Particles404 isMobile={isMobile} />
            {!isMobile && <ConnectionLines />}
          </Canvas>
        </div>
      )}

      {/* Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10,10,11,0.4) 70%, rgba(10,10,11,0.8) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Glitch 404 */}
        <div className="relative mb-2">
          <h1 className="text-[6rem] sm:text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold leading-none select-none">
            <GlitchText className="text-gradient drop-shadow-[0_0_30px_rgba(247,147,26,0.5)]">
              404
            </GlitchText>
          </h1>

          {/* Scanline effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            }}
          />
        </div>

        {/* Subtitle */}
        <p className="text-text-secondary text-base sm:text-lg md:text-xl mb-2 font-mono tracking-wider">
          <span className="text-accent-bitcoin">&gt;</span> BLOCK_NOT_FOUND
        </p>

        <p className="text-text-secondary/60 text-sm md:text-base mb-8 text-center max-w-md px-4">
          The page you&apos;re looking for doesn&apos;t exist on the blockchain.
          <br />
          <span className="text-accent-gold/80">Invalid hash or orphan block.</span>
        </p>

        {/* CTA Button */}
        <Link
          href="/"
          className="group relative px-6 sm:px-8 py-3 sm:py-4 overflow-hidden rounded-lg transition-all duration-300 active:scale-95"
        >
          {/* Button glow background */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent-bitcoin to-accent-gold opacity-90 group-hover:opacity-100 transition-opacity" />

          {/* Animated border */}
          <div className="absolute inset-[1px] bg-bg-primary rounded-lg group-hover:bg-transparent transition-colors duration-300" />

          {/* Button content */}
          <span className="relative flex items-center gap-2 sm:gap-3 text-accent-bitcoin group-hover:text-bg-primary font-semibold transition-colors duration-300 text-sm sm:text-base">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Genesis Block
          </span>
        </Link>

        {/* Decorative hash */}
        <p className="mt-8 sm:mt-12 text-xs text-text-secondary/30 font-mono tracking-tight">
          0x404...{typeof window !== 'undefined' ? Math.random().toString(16).slice(2, 10) : '00000000'}
        </p>
      </div>

      {/* Corner decorations - hidden on mobile */}
      <div className="absolute top-8 left-8 text-accent-bitcoin/20 font-mono text-xs hidden md:block">
        <div>STATUS: 404</div>
        <div>CHAIN: MAINNET</div>
        <div>PEERS: 0</div>
      </div>

      <div className="absolute bottom-8 right-8 text-accent-bitcoin/20 font-mono text-xs hidden md:block text-right">
        <div>BLOCK: NULL</div>
        <div>NONCE: ∞</div>
        <div>HASH: INVALID</div>
      </div>
    </div>
  )
}
