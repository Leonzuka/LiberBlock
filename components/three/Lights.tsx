'use client'

export default function Lights() {
  return (
    <>
      {/* Ambient light - bright enough for true colors */}
      <ambientLight intensity={1.2} color="#ffffff" />

      {/* Main front light - white for accurate colors */}
      <directionalLight
        position={[0, 0, 5]}
        intensity={0.8}
        color="#ffffff"
      />

      {/* Subtle accent light - very low intensity orange */}
      <pointLight
        position={[5, 5, 5]}
        intensity={0.3}
        color="#F7931A"
      />

      {/* Subtle rim light - very low intensity */}
      <pointLight
        position={[-5, -2, -5]}
        intensity={0.2}
        color="#4169E1"
      />
    </>
  )
}
