'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { projects } from '@/lib/projects'

interface InteractiveCubeProps {
  scrollProgress?: number
  onFaceChange?: (faceIndex: number) => void
}

const faceRotations = [
  { x: 0, y: 0 },           // Front - Pedra Libertária
  { x: 0, y: Math.PI / 2 }, // Right - ArcaPy
  { x: 0, y: Math.PI },     // Back - GardenRosas
  { x: 0, y: -Math.PI / 2 },// Left - RPG 2D
  { x: -Math.PI / 2, y: 0 },// Top - Logo
  { x: Math.PI / 2, y: 0 }, // Bottom - Contact
]

export default function InteractiveCube({
  scrollProgress = 0,
  onFaceChange,
}: InteractiveCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isIdle, setIsIdle] = useState(true)
  const [currentFace, setCurrentFace] = useState(0)
  const lastInteraction = useRef(Date.now())
  const targetRotation = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })

  const { gl } = useThree()

  // Load textures for faces with images
  const textures = useTexture([
    '/textures/Libertarian_Stone_Placeholder.jpeg',
    '/textures/ArcaPy_placeholder.webp',
    '/textures/GardenRosasDecor_placeholder.png',
    '/textures/Jogo2D_placeholder.svg',
  ])

  // Create materials for each face
  const materials = [
    // Right face - ArcaPy
    new THREE.MeshStandardMaterial({
      map: textures[1],
      roughness: 1,
      metalness: 0,
    }),
    // Left face - RPG 2D
    new THREE.MeshStandardMaterial({
      map: textures[3],
      roughness: 1,
      metalness: 0,
    }),
    // Top face - Logo (orange gradient)
    new THREE.MeshStandardMaterial({
      color: '#F7931A',
      roughness: 0.3,
      metalness: 0.8,
      emissive: '#F7931A',
      emissiveIntensity: 0.2,
    }),
    // Bottom face - Contact (gold)
    new THREE.MeshStandardMaterial({
      color: '#D4AF37',
      roughness: 0.3,
      metalness: 0.8,
      emissive: '#D4AF37',
      emissiveIntensity: 0.2,
    }),
    // Front face - Pedra Libertária
    new THREE.MeshStandardMaterial({
      map: textures[0],
      roughness: 1,
      metalness: 0,
    }),
    // Back face - GardenRosas
    new THREE.MeshStandardMaterial({
      map: textures[2],
      roughness: 1,
      metalness: 0,
    }),
  ]

  // Handle pointer events
  useEffect(() => {
    const canvas = gl.domElement

    const handlePointerDown = (e: PointerEvent) => {
      setIsDragging(true)
      setIsIdle(false)
      lastInteraction.current = Date.now()
    }

    const handlePointerUp = () => {
      setIsDragging(false)
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || !meshRef.current) return

      velocity.current.x = e.movementY * 0.01
      velocity.current.y = e.movementX * 0.01

      lastInteraction.current = Date.now()
    }

    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointerup', handlePointerUp)
    canvas.addEventListener('pointermove', handlePointerMove)

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointermove', handlePointerMove)
    }
  }, [gl, isDragging])

  // Animation frame
  useFrame((state, delta) => {
    if (!meshRef.current) return

    const mesh = meshRef.current

    // Check for idle state (2 seconds without interaction)
    if (Date.now() - lastInteraction.current > 2000) {
      setIsIdle(true)
    }

    if (isDragging) {
      // Apply velocity from drag
      mesh.rotation.x += velocity.current.x
      mesh.rotation.y += velocity.current.y

      // Dampen velocity
      velocity.current.x *= 0.95
      velocity.current.y *= 0.95
    } else if (scrollProgress > 0) {
      // Scroll-based rotation
      const faceIndex = Math.min(
        Math.floor(scrollProgress * 6),
        5
      )

      if (faceIndex !== currentFace) {
        setCurrentFace(faceIndex)
        onFaceChange?.(faceIndex)
      }

      const target = faceRotations[faceIndex]
      targetRotation.current = { x: target.x, y: target.y }

      mesh.rotation.x = THREE.MathUtils.lerp(
        mesh.rotation.x,
        targetRotation.current.x,
        0.05
      )
      mesh.rotation.y = THREE.MathUtils.lerp(
        mesh.rotation.y,
        targetRotation.current.y,
        0.05
      )
    } else if (isIdle) {
      // Slow auto-rotation when idle
      mesh.rotation.y += delta * 0.2
      mesh.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    } else {
      // Apply inertia when not dragging
      mesh.rotation.x += velocity.current.x
      mesh.rotation.y += velocity.current.y

      velocity.current.x *= 0.98
      velocity.current.y *= 0.98
    }

    // Subtle floating effect
    mesh.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
  })

  return (
    <mesh ref={meshRef} scale={1.2}>
      <boxGeometry args={[2, 2, 2]} />
      {materials.map((material, index) => (
        <primitive key={index} object={material} attach={`material-${index}`} />
      ))}
    </mesh>
  )
}
