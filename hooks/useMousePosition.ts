'use client'

import { useState, useEffect, RefObject } from 'react'

interface MousePosition {
  x: number
  y: number
  normalizedX: number
  normalizedY: number
}

interface UseMousePositionOptions {
  relative?: RefObject<HTMLElement>
  lerp?: number
}

export function useMousePosition(options: UseMousePositionOptions = {}) {
  const { relative, lerp = 1 } = options

  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  })

  useEffect(() => {
    let animationId: number
    let targetX = 0
    let targetY = 0

    const updatePosition = () => {
      setPosition((prev) => {
        const newX = prev.x + (targetX - prev.x) * lerp
        const newY = prev.y + (targetY - prev.y) * lerp

        const container = relative?.current || document.documentElement
        const rect = container.getBoundingClientRect()

        const normalizedX = ((newX - rect.left) / rect.width) * 2 - 1
        const normalizedY = -((newY - rect.top) / rect.height) * 2 + 1

        return {
          x: newX,
          y: newY,
          normalizedX,
          normalizedY,
        }
      })

      if (lerp < 1) {
        animationId = requestAnimationFrame(updatePosition)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY

      if (lerp >= 1) {
        const container = relative?.current || document.documentElement
        const rect = container.getBoundingClientRect()

        setPosition({
          x: e.clientX,
          y: e.clientY,
          normalizedX: ((e.clientX - rect.left) / rect.width) * 2 - 1,
          normalizedY: -((e.clientY - rect.top) / rect.height) * 2 + 1,
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    if (lerp < 1) {
      animationId = requestAnimationFrame(updatePosition)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [relative, lerp])

  return position
}

export default useMousePosition
