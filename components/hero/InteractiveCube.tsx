'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import LiberBlockFace from './LiberBlockFace'

interface InteractiveCubeProps {
  scrollProgress?: number
  onFaceChange?: (faceIndex: number) => void
}

const faceRotations = [
  { x: 0, y: 0 },           // Front - LiberBlock
  { x: 0, y: Math.PI / 2 }, // Right - ArcaPy
  { x: 0, y: Math.PI },     // Back - GardenRosas
  { x: 0, y: -Math.PI / 2 },// Left - RPG 2D
  { x: -Math.PI / 2, y: 0 },// Top - Libertarian Stone
  { x: Math.PI / 2, y: 0 }, // Bottom - Contact
]

// Determine which face is most visible to the camera based on current rotation
function computeVisibleFace(rotX: number, rotY: number): number {
  let bestFace = 0
  let bestScore = -Infinity
  for (let i = 0; i < faceRotations.length; i++) {
    const { x, y } = faceRotations[i]
    const score = Math.cos(rotX - x) + Math.cos(rotY - y)
    if (score > bestScore) {
      bestScore = score
      bestFace = i
    }
  }
  return bestFace
}

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
  const [isKeyboardControlling, setIsKeyboardControlling] = useState(false)
  const [isTransitioningToIdle, setIsTransitioningToIdle] = useState(false)
  const targetRotation = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const keyVelocity = useRef({ x: 0, y: 0 })
  const swayStartTime = useRef<number | null>(null)
  const keyboardTimeout = useRef<NodeJS.Timeout | null>(null)
  const transitionProgress = useRef(0)

  const { gl, camera } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())

  // Create materials for each face (memoized to avoid re-creating on every render)
  const materials = useMemo(() => {
    const baseMat = { color: '#0A0A0B', roughness: 1, metalness: 0 }
    return [
      new THREE.MeshStandardMaterial(baseMat), // Right (+X)
      new THREE.MeshStandardMaterial(baseMat), // Left (-X)
      new THREE.MeshStandardMaterial(baseMat), // Top (+Y)
      new THREE.MeshStandardMaterial(baseMat), // Bottom (-Y)
      new THREE.MeshStandardMaterial(baseMat), // Front (+Z) - LiberBlock
      new THREE.MeshStandardMaterial(baseMat), // Back (-Z)
    ]
  }, [])

  // Dispose materials on unmount
  useEffect(() => {
    return () => {
      materials.forEach((mat) => mat.dispose())
    }
  }, [materials])

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
      if (isDragging) {
        setIsTransitioningToIdle(true)
        transitionProgress.current = 0
      }
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

  // Handle keyboard events for arrow key rotation
  useEffect(() => {
    const ROTATION_SPEED = 0.06

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isIntroAnimating) return

      let handled = false

      switch (e.key) {
        case 'ArrowLeft':
          keyVelocity.current.y = -ROTATION_SPEED
          handled = true
          break
        case 'ArrowRight':
          keyVelocity.current.y = ROTATION_SPEED
          handled = true
          break
        case 'ArrowUp':
          keyVelocity.current.x = -ROTATION_SPEED
          handled = true
          break
        case 'ArrowDown':
          keyVelocity.current.x = ROTATION_SPEED
          handled = true
          break
      }

      if (handled) {
        e.preventDefault()
        setIsKeyboardControlling(true)

        // Clear existing timeout
        if (keyboardTimeout.current) {
          clearTimeout(keyboardTimeout.current)
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        // Reset the velocity for the released key
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          keyVelocity.current.y = 0
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          keyVelocity.current.x = 0
        }

        // Set timeout to return to idle after keyboard control stops
        keyboardTimeout.current = setTimeout(() => {
          if (keyVelocity.current.x === 0 && keyVelocity.current.y === 0) {
            setIsKeyboardControlling(false)
            setIsTransitioningToIdle(true)
            transitionProgress.current = 0
          }
        }, 1500)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (keyboardTimeout.current) {
        clearTimeout(keyboardTimeout.current)
      }
    }
  }, [isIntroAnimating])

  // Animation frame
  useFrame((state, delta) => {
    if (!groupRef.current) return

    const mesh = groupRef.current

    // Don't apply any transformations during intro animation
    if (isIntroAnimating) {
      return
    }

    // Check if user is actively controlling (drag or keyboard)
    const isUserControlling = isDragging || isKeyboardControlling

    if (isDragging) {
      // Cancel any transition when user takes control
      if (isTransitioningToIdle) setIsTransitioningToIdle(false)
      swayStartTime.current = null

      // Apply velocity from drag
      mesh.rotation.x += velocity.current.x
      mesh.rotation.y += velocity.current.y

      // Dampen velocity
      velocity.current.x *= 0.95
      velocity.current.y *= 0.95
    } else if (isKeyboardControlling) {
      // Cancel any transition when user takes control
      if (isTransitioningToIdle) setIsTransitioningToIdle(false)
      swayStartTime.current = null

      // Apply keyboard rotation
      mesh.rotation.x += keyVelocity.current.x
      mesh.rotation.y += keyVelocity.current.y
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
      // Initialize sway start time on first frame after intro or after user control
      if (swayStartTime.current === null) {
        swayStartTime.current = state.clock.elapsedTime
      }

      // Time since sway started (begins at 0)
      const swayTime = state.clock.elapsedTime - swayStartTime.current

      // Target sway positions
      const targetSwayY = Math.sin(swayTime * 0.4) * 0.4
      const targetSwayX = Math.sin(swayTime * 0.3) * 0.1

      if (isTransitioningToIdle) {
        // Smoothly transition from current rotation to sway
        transitionProgress.current = Math.min(transitionProgress.current + delta * 0.5, 1)

        mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetSwayX, transitionProgress.current * 0.03)
        mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, targetSwayY, transitionProgress.current * 0.03)

        // End transition when close enough to target
        if (transitionProgress.current >= 1) {
          setIsTransitioningToIdle(false)
        }
      } else {
        // Normal sway - gentle left-right (shows left and right faces)
        mesh.rotation.y = targetSwayY
        mesh.rotation.x = targetSwayX
      }
    }

    // Detect which face is visible for non-scroll modes (drag, keyboard, idle)
    if (scrollProgress <= 0.01) {
      const detected = computeVisibleFace(mesh.rotation.x, mesh.rotation.y)
      if (detected !== currentFace) {
        setCurrentFace(detected)
        onFaceChange?.(detected)
      }
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
      <LiberBlockFace isActive={currentFace === 0} />
    </group>
  )
}
