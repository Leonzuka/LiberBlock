'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture, Edges } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { projects } from '@/lib/projects'

interface InteractiveCubeProps {
  scrollProgress?: number
  onFaceChange?: (faceIndex: number) => void
}

const faceRotations = [
  { x: 0, y: 0 },           // Front - Libertarian Stone
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
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [hasIntroPlayed, setHasIntroPlayed] = useState(false)
  const [isIntroAnimating, setIsIntroAnimating] = useState(true)
  const [currentFace, setCurrentFace] = useState(0)
  const targetRotation = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const swayStartTime = useRef<number | null>(null)

  const { gl, camera } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())

  // Load textures for faces with images
  const textures = useTexture([
    '/textures/Libertarian_Stone_Placeholder.jpeg',
    '/textures/ArcaPy_placeholder.webp',
    '/textures/GardenRosasDecor_placeholder.png',
    '/textures/Jogo2D_placeholder.svg',
  ])

  // Load metal PBR textures
  const metalTextures = useTexture({
    map: '/textures/metal_0084_color_2k.jpg',
    normalMap: '/textures/metal_0084_normal_opengl_2k.png',
    roughnessMap: '/textures/metal_0084_roughness_2k.jpg',
    metalnessMap: '/textures/metal_0084_metallic_2k.jpg',
    aoMap: '/textures/metal_0084_ao_2k.jpg',
  })

  // Configure texture wrapping
  Object.values(metalTextures).forEach((texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  })

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
    // Top face - Logo (metal with orange tint)
    new THREE.MeshStandardMaterial({
      map: metalTextures.map,
      normalMap: metalTextures.normalMap,
      roughnessMap: metalTextures.roughnessMap,
      metalnessMap: metalTextures.metalnessMap,
      aoMap: metalTextures.aoMap,
      color: '#F7931A',
      roughness: 1,
      metalness: 1,
      emissive: '#F7931A',
      emissiveIntensity: 0.15,
    }),
    // Bottom face - Contact (metal with gold tint)
    new THREE.MeshStandardMaterial({
      map: metalTextures.map,
      normalMap: metalTextures.normalMap,
      roughnessMap: metalTextures.roughnessMap,
      metalnessMap: metalTextures.metalnessMap,
      aoMap: metalTextures.aoMap,
      color: '#D4AF37',
      roughness: 1,
      metalness: 1,
      emissive: '#D4AF37',
      emissiveIntensity: 0.15,
    }),
    // Front face - Libertarian Stone
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

  // Intro animation - cube appears with scale and fade in
  useEffect(() => {
    if (!groupRef.current || hasIntroPlayed) return

    const mesh = groupRef.current

    // Initial state
    mesh.scale.set(0, 0, 0)
    mesh.rotation.set(0, 0, 0)

    // Animate entrance
    const timeline = gsap.timeline({
      onComplete: () => {
        setHasIntroPlayed(true)
        setIsIntroAnimating(false)
      },
    })

    timeline.to(mesh.scale, {
      x: 1.2,
      y: 1.2,
      z: 1.2,
      duration: 1.5,
      ease: 'elastic.out(1, 0.6)',
      delay: 0.5,
    })

    // Rotate while scaling up, ending at a position ready for auto-rotation
    timeline.to(
      mesh.rotation,
      {
        x: Math.PI * 0.3,
        y: Math.PI * 1.5,
        duration: 1.8,
        ease: 'power2.inOut',
      },
      0.5
    )

    // Smoothly transition to idle rotation position
    timeline.to(
      mesh.rotation,
      {
        x: 0,
        y: Math.PI * 2, // Complete the rotation
        duration: 0.8,
        ease: 'power1.out',
        onComplete: () => {
          // Normalize to 0 after visual completion
          mesh.rotation.y = 0
          mesh.rotation.x = 0
        }
      }
    )

    return () => {
      timeline.kill()
    }
  }, [hasIntroPlayed])

  // Check if mouse is over the cube using raycasting
  const checkIntersection = (e: PointerEvent): boolean => {
    if (!meshRef.current) return false

    const rect = gl.domElement.getBoundingClientRect()
    mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.current.setFromCamera(mouse.current, camera)
    const intersects = raycaster.current.intersectObject(meshRef.current)

    return intersects.length > 0
  }

  // Handle pointer events
  useEffect(() => {
    const canvas = gl.domElement

    const handlePointerDown = (e: PointerEvent) => {
      if (checkIntersection(e)) {
        setIsDragging(true)
        canvas.style.cursor = 'grabbing'
      }
    }

    const handlePointerUp = () => {
      setIsDragging(false)
      canvas.style.cursor = isHovering ? 'grab' : 'default'
    }

    const handlePointerMove = (e: PointerEvent) => {
      const isOver = checkIntersection(e)
      setIsHovering(isOver)

      if (!isDragging) {
        canvas.style.cursor = isOver ? 'grab' : 'default'
        return
      }

      if (!groupRef.current) return

      velocity.current.x = e.movementY * 0.008
      velocity.current.y = e.movementX * 0.008
    }

    const handlePointerLeave = () => {
      setIsDragging(false)
      setIsHovering(false)
      canvas.style.cursor = 'default'
    }

    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointerup', handlePointerUp)
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerleave', handlePointerLeave)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [gl, camera, isDragging, isHovering])

  // Animation frame
  useFrame((state, delta) => {
    if (!groupRef.current) return

    const mesh = groupRef.current

    // Don't apply any transformations during intro animation
    if (isIntroAnimating) {
      return
    }

    if (isDragging) {
      // Apply velocity from drag
      mesh.rotation.x += velocity.current.x
      mesh.rotation.y += velocity.current.y

      // Dampen velocity
      velocity.current.x *= 0.95
      velocity.current.y *= 0.95
    } else if (scrollProgress > 0.01) {
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
    } else {
      // Initialize sway start time on first frame after intro
      if (swayStartTime.current === null) {
        swayStartTime.current = state.clock.elapsedTime
      }

      // Time since sway started (begins at 0)
      const swayTime = state.clock.elapsedTime - swayStartTime.current

      // Gentle left-right sway (shows left and right faces)
      mesh.rotation.y = Math.sin(swayTime * 0.4) * 0.4
      mesh.rotation.x = Math.sin(swayTime * 0.3) * 0.1
    }

    // Subtle floating effect (reduced)
    mesh.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.03
  })

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        {materials.map((material, index) => (
          <primitive key={index} object={material} attach={`material-${index}`} />
        ))}
        <Edges
          threshold={15}
          scale={1.001}
          color="#F7931A"
          lineWidth={1.5}
        />
      </mesh>
    </group>
  )
}
