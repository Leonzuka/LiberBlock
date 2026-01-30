'use client'

import { useState, useCallback, useRef } from 'react'
import * as THREE from 'three'

interface CubeRotationState {
  rotation: THREE.Euler
  currentFace: number
  isAnimating: boolean
}

interface UseCubeRotationOptions {
  autoRotate?: boolean
  autoRotateSpeed?: number
  snapToFace?: boolean
}

const FACE_ROTATIONS = [
  new THREE.Euler(0, 0, 0),                    // Front
  new THREE.Euler(0, Math.PI / 2, 0),          // Right
  new THREE.Euler(0, Math.PI, 0),              // Back
  new THREE.Euler(0, -Math.PI / 2, 0),         // Left
  new THREE.Euler(-Math.PI / 2, 0, 0),         // Top
  new THREE.Euler(Math.PI / 2, 0, 0),          // Bottom
]

export function useCubeRotation(options: UseCubeRotationOptions = {}) {
  const { autoRotate = true, autoRotateSpeed = 0.005, snapToFace = true } = options

  const [state, setState] = useState<CubeRotationState>({
    rotation: new THREE.Euler(0, 0, 0),
    currentFace: 0,
    isAnimating: false,
  })

  const targetRotation = useRef(new THREE.Euler(0, 0, 0))
  const velocity = useRef({ x: 0, y: 0 })

  const rotateTo = useCallback((faceIndex: number) => {
    if (faceIndex < 0 || faceIndex >= FACE_ROTATIONS.length) return

    targetRotation.current = FACE_ROTATIONS[faceIndex].clone()
    setState((prev) => ({
      ...prev,
      currentFace: faceIndex,
      isAnimating: true,
    }))
  }, [])

  const rotateNext = useCallback(() => {
    const nextFace = (state.currentFace + 1) % FACE_ROTATIONS.length
    rotateTo(nextFace)
  }, [state.currentFace, rotateTo])

  const rotatePrev = useCallback(() => {
    const prevFace =
      (state.currentFace - 1 + FACE_ROTATIONS.length) % FACE_ROTATIONS.length
    rotateTo(prevFace)
  }, [state.currentFace, rotateTo])

  const applyDrag = useCallback((deltaX: number, deltaY: number) => {
    velocity.current.x += deltaY * 0.01
    velocity.current.y += deltaX * 0.01

    setState((prev) => ({
      ...prev,
      isAnimating: false,
    }))
  }, [])

  const update = useCallback(
    (delta: number) => {
      setState((prev) => {
        const newRotation = prev.rotation.clone()

        if (prev.isAnimating) {
          // Lerp to target rotation
          newRotation.x = THREE.MathUtils.lerp(
            newRotation.x,
            targetRotation.current.x,
            0.1
          )
          newRotation.y = THREE.MathUtils.lerp(
            newRotation.y,
            targetRotation.current.y,
            0.1
          )
          newRotation.z = THREE.MathUtils.lerp(
            newRotation.z,
            targetRotation.current.z,
            0.1
          )

          // Check if animation is complete
          const dx = Math.abs(newRotation.x - targetRotation.current.x)
          const dy = Math.abs(newRotation.y - targetRotation.current.y)
          const isComplete = dx < 0.001 && dy < 0.001

          return {
            ...prev,
            rotation: newRotation,
            isAnimating: !isComplete,
          }
        }

        // Apply velocity
        newRotation.x += velocity.current.x
        newRotation.y += velocity.current.y

        // Dampen velocity
        velocity.current.x *= 0.95
        velocity.current.y *= 0.95

        // Auto rotate if idle
        if (
          autoRotate &&
          Math.abs(velocity.current.x) < 0.001 &&
          Math.abs(velocity.current.y) < 0.001
        ) {
          newRotation.y += autoRotateSpeed
        }

        return {
          ...prev,
          rotation: newRotation,
        }
      })
    },
    [autoRotate, autoRotateSpeed]
  )

  return {
    rotation: state.rotation,
    currentFace: state.currentFace,
    isAnimating: state.isAnimating,
    rotateTo,
    rotateNext,
    rotatePrev,
    applyDrag,
    update,
  }
}

export default useCubeRotation
