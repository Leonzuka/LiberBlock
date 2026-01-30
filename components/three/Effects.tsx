'use client'

import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

export default function Effects() {
  const { gl } = useThree()

  useEffect(() => {
    gl.toneMapping = 1 // ACESFilmicToneMapping
    gl.toneMappingExposure = 1.2
  }, [gl])

  return null
}
