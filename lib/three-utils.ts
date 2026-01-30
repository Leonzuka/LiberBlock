import * as THREE from 'three'

// Simple noise function for particle movement
export function noise3D(x: number, y: number, z: number, seed = 0): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 45.164 + seed) * 43758.5453
  return n - Math.floor(n)
}

// Smooth noise using interpolation
export function smoothNoise3D(
  x: number,
  y: number,
  z: number,
  seed = 0
): number {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const z0 = Math.floor(z)

  const fx = x - x0
  const fy = y - y0
  const fz = z - z0

  // Smooth interpolation
  const sx = fx * fx * (3 - 2 * fx)
  const sy = fy * fy * (3 - 2 * fy)
  const sz = fz * fz * (3 - 2 * fz)

  // Get corner values
  const n000 = noise3D(x0, y0, z0, seed)
  const n100 = noise3D(x0 + 1, y0, z0, seed)
  const n010 = noise3D(x0, y0 + 1, z0, seed)
  const n110 = noise3D(x0 + 1, y0 + 1, z0, seed)
  const n001 = noise3D(x0, y0, z0 + 1, seed)
  const n101 = noise3D(x0 + 1, y0, z0 + 1, seed)
  const n011 = noise3D(x0, y0 + 1, z0 + 1, seed)
  const n111 = noise3D(x0 + 1, y0 + 1, z0 + 1, seed)

  // Interpolate
  const nx00 = n000 + sx * (n100 - n000)
  const nx10 = n010 + sx * (n110 - n010)
  const nx01 = n001 + sx * (n101 - n001)
  const nx11 = n011 + sx * (n111 - n011)

  const nxy0 = nx00 + sy * (nx10 - nx00)
  const nxy1 = nx01 + sy * (nx11 - nx01)

  return nxy0 + sz * (nxy1 - nxy0)
}

// Convert screen coordinates to 3D world position
export function screenToWorld(
  x: number,
  y: number,
  camera: THREE.Camera,
  depth = 0
): THREE.Vector3 {
  const vector = new THREE.Vector3(x, y, depth)
  vector.unproject(camera)

  const dir = vector.sub(camera.position).normalize()
  const distance = -camera.position.z / dir.z

  return camera.position.clone().add(dir.multiplyScalar(distance))
}

// Lerp with delta time for frame-independent animations
export function damp(
  current: number,
  target: number,
  smoothing: number,
  dt: number
): number {
  return THREE.MathUtils.lerp(
    current,
    target,
    1 - Math.exp(-smoothing * dt)
  )
}

// Clamp a value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

// Map a value from one range to another
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

// Create gradient texture
export function createGradientTexture(
  colorStart: string,
  colorEnd: string,
  size = 256
): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get canvas context')

  const gradient = ctx.createLinearGradient(0, 0, size, size)
  gradient.addColorStop(0, colorStart)
  gradient.addColorStop(1, colorEnd)

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true

  return texture
}

// Dispose of Three.js objects properly
export function disposeObject(obj: THREE.Object3D): void {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) child.geometry.dispose()

      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => {
            disposeMaterial(m)
          })
        } else {
          disposeMaterial(child.material)
        }
      }
    }
  })
}

function disposeMaterial(material: THREE.Material): void {
  material.dispose()

  // Dispose textures if they exist
  const mat = material as THREE.MeshStandardMaterial
  if (mat.map) mat.map.dispose()
  if (mat.normalMap) mat.normalMap.dispose()
  if (mat.roughnessMap) mat.roughnessMap.dispose()
  if (mat.metalnessMap) mat.metalnessMap.dispose()
  if (mat.emissiveMap) mat.emissiveMap.dispose()
}

// Get device pixel ratio safely
export function getDevicePixelRatio(max = 2): number {
  if (typeof window === 'undefined') return 1
  return Math.min(window.devicePixelRatio || 1, max)
}

// Check if device supports WebGL
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

// Check if device is mobile
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}
