# 3D & WebGL - React Three Fiber

## Setup Básico

### Canvas Component (Scene.tsx)
```tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      dpr={[1, 2]} // Device pixel ratio [min, max]
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      }}
    >
      <Suspense fallback={null}>
        <Lights />
        <InteractiveCube />
        <Effects />
      </Suspense>
    </Canvas>
  );
}
```

## Lighting Setup (Lights.tsx)

### Bitcoin/Cypherpunk Lighting
```tsx
export default function Lights() {
  return (
    <>
      {/* Ambient - luz ambiente suave */}
      <ambientLight intensity={0.2} />

      {/* Key light - Bitcoin orange */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        color="#F7931A"
      />

      {/* Fill light - ouro */}
      <pointLight
        position={[-5, 0, 0]}
        intensity={0.5}
        color="#D4AF37"
      />

      {/* Rim light - destaque */}
      <spotLight
        position={[0, 10, 0]}
        intensity={0.8}
        angle={0.5}
        penumbra={0.5}
        color="#FF9500"
      />
    </>
  );
}
```

## Geometries & Materials

### Cube with Custom Material
```tsx
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export default function InteractiveCube() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        color="#F7931A"
        metalness={0.8}
        roughness={0.2}
        emissive="#FF9500"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}
```

### Shader Material (Advanced)
```tsx
import { useRef } from 'react';
import { ShaderMaterial } from 'three';

const glowVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragmentShader = `
  uniform vec3 glowColor;
  varying vec3 vNormal;

  void main() {
    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(glowColor, 1.0) * intensity;
  }
`;

export default function GlowCube() {
  const materialRef = useRef<ShaderMaterial>(null);

  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={glowVertexShader}
        fragmentShader={glowFragmentShader}
        uniforms={{
          glowColor: { value: [0.97, 0.58, 0.1] } // #F7931A em RGB
        }}
        transparent
      />
    </mesh>
  );
}
```

## Drei Helpers

### Useful Drei Components
```tsx
import {
  OrbitControls,     // Controles de câmera
  PerspectiveCamera, // Câmera customizada
  Environment,       // HDR lighting
  useGLTF,          // Load 3D models
  Text3D,           // Texto 3D
  Float,            // Floating animation
  Stars             // Starfield
} from '@react-three/drei';

// Exemplo com OrbitControls
<OrbitControls
  enableZoom={false}
  enablePan={false}
  maxPolarAngle={Math.PI / 2}
  minPolarAngle={Math.PI / 2}
/>
```

## Performance Patterns

### InstancedMesh (Múltiplos objetos idênticos)
```tsx
import { useRef } from 'react';
import { InstancedMesh, Object3D } from 'three';

export default function ParticleField() {
  const meshRef = useRef<InstancedMesh>(null);
  const count = 100;
  const temp = new Object3D();

  useEffect(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < count; i++) {
      temp.position.set(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5
      );
      temp.updateMatrix();
      meshRef.current.setMatrixAt(i, temp.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#F7931A" />
    </instancedMesh>
  );
}
```

### LOD (Level of Detail)
```tsx
import { Lod } from '@react-three/drei';

export default function OptimizedModel() {
  return (
    <Lod distances={[0, 10, 20]}>
      <mesh><icosahedronGeometry args={[1, 3]} /></mesh>
      <mesh><icosahedronGeometry args={[1, 2]} /></mesh>
      <mesh><icosahedronGeometry args={[1, 1]} /></mesh>
    </Lod>
  );
}
```

## Mobile Fallbacks

### Conditional 3D Rendering
```tsx
'use client';

import { useEffect, useState } from 'react';

export default function Scene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  if (isMobile) {
    return <StaticCubeImage />;
  }

  return <InteractiveCube />;
}
```

### Reduced Complexity on Mobile
```tsx
const particleCount = isMobile ? 50 : 200;
const quality = isMobile ? 'low' : 'high';
```

## Debug Tools

### Performance Monitor
```tsx
import { Perf } from 'r3f-perf';

// Em desenvolvimento
<Canvas>
  <Perf position="top-left" />
  {/* Scene content */}
</Canvas>
```

### Stats
```tsx
import { Stats } from '@react-three/drei';

<Canvas>
  <Stats />
  {/* Scene content */}
</Canvas>
```

## Best Practices

1. **Sempre usar dynamic import** para componentes 3D
2. **Suspense** com fallback para loading states
3. **useFrame** para animações (não useEffect)
4. **InstancedMesh** para múltiplos objetos idênticos
5. **Mobile fallbacks** para dispositivos menos potentes
6. **Dispose** de geometrias/materiais não utilizados
7. **Texture compression** (usar .ktx2 ou .webp)

## Atualização
Última modificação: 2026-01-30
Componentes 3D ativos: InteractiveCube, PlexusField, Scene
