# Performance Optimization - LiberBlock

## Bundle Optimization

### Dynamic Imports
```tsx
import dynamic from 'next/dynamic';

// 3D components - NO SSR
const Scene = dynamic(() => import('@/components/three/Scene'), {
  ssr: false,
  loading: () => <Skeleton />
});

// Heavy components - Lazy load
const ContactForm = dynamic(() => import('@/components/ui/ContactForm'), {
  loading: () => <FormSkeleton />
});
```

### Code Splitting by Route
```tsx
// app/page.tsx - Load sections progressively
const HeroSection = dynamic(() => import('@/components/hero/HeroSection'));
const ProjectsSection = dynamic(() => import('@/components/sections/ProjectsSection'));
const AboutSection = dynamic(() => import('@/components/sections/AboutSection'));
```

## Image Optimization

### Next.js Image Component
```tsx
import Image from 'next/image';

<Image
  src="/images/project.jpg"
  alt="Project preview"
  width={800}
  height={600}
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/..." // Low quality placeholder
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Format Guidelines
- **WebP** para fotos (80-90% quality)
- **SVG** para logos/icons
- **PNG** para transparências necessárias
- Max width: 1920px para hero images
- Compress antes de commit

## 3D Performance

### Mobile Fallbacks
```tsx
'use client';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

export default function Scene() {
  if (isMobile) {
    return <StaticCubeImage />;
  }

  return <Interactive3DCube />;
}
```

### Texture Optimization
```tsx
// Compressão de texturas
const textureLoader = new TextureLoader();
const texture = textureLoader.load('/textures/cube.jpg');
texture.minFilter = LinearFilter;
texture.magFilter = LinearFilter;
texture.generateMipmaps = false;

// Usar .ktx2 para texturas comprimidas (até 70% menor)
```

### Instancing (Multiple Objects)
```tsx
import { InstancedMesh } from 'three';

// Ao invés de 100 <mesh>, use 1 <instancedMesh>
<instancedMesh args={[undefined, undefined, 100]}>
  <sphereGeometry args={[0.1, 16, 16]} />
  <meshStandardMaterial color="#F7931A" />
</instancedMesh>
```

### LOD (Level of Detail)
```tsx
// Geometrias simplificadas à distância
<Lod distances={[0, 10, 20]}>
  <mesh><icosahedronGeometry args={[1, 4]} /></mesh> {/* High detail */}
  <mesh><icosahedronGeometry args={[1, 2]} /></mesh> {/* Medium */}
  <mesh><icosahedronGeometry args={[1, 1]} /></mesh> {/* Low */}
</Lod>
```

### Particle Count Reduction
```tsx
const particleCount = useMemo(() => {
  if (window.innerWidth < 768) return 50;    // Mobile
  if (window.innerWidth < 1024) return 100;  // Tablet
  return 200;                                 // Desktop
}, []);
```

## React Optimization

### Memoization
```tsx
import { memo, useMemo, useCallback } from 'react';

// Componente pesado
const HeavyComponent = memo(({ data }: Props) => {
  return <div>{/* Render pesado */}</div>;
});

// Cálculos custosos
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// Callbacks
const handleClick = useCallback(() => {
  doSomething(data);
}, [data]);
```

### Virtual Scrolling
```tsx
// Para listas longas (>50 items)
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={projects.length}
  itemSize={100}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <ProjectCard project={projects[index]} />
    </div>
  )}
</FixedSizeList>
```

## Font Loading

### Font Display Strategy
```tsx
// app/layout.tsx
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap', // FOUT ao invés de FOIT
  variable: '--font-space-grotesk',
  preload: true
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
  preload: true
});
```

## Tailwind Purging

### PurgeCSS Configuration
```js
// tailwind.config.ts
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Resto da config...
}
```

## GSAP Performance

### Transform Properties Only
```tsx
// BOM - GPU accelerated
gsap.to(element, { x: 100, y: 50, scale: 1.2, rotation: 45 });

// RUIM - Força layout reflow
gsap.to(element, { left: 100, top: 50, width: '200px' });
```

### Will-Change
```tsx
<div className="will-change-transform">
  {/* Element com animações GSAP */}
</div>
```

### Batch Updates
```tsx
// Agrupe updates
gsap.set([el1, el2, el3], { opacity: 0 });

// Ao invés de
gsap.set(el1, { opacity: 0 });
gsap.set(el2, { opacity: 0 });
gsap.set(el3, { opacity: 0 });
```

## Monitoring

### Web Vitals
```tsx
// app/layout.tsx
export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric);
  // Send to analytics
}
```

### Key Metrics
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **FCP** (First Contentful Paint): < 1.8s
- **TTI** (Time to Interactive): < 3.8s

## Build Optimization

### Next.js Config
```js
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'gsap'],
  }
}
```

## Mobile Checklist

- [ ] Reduce particle count (200 → 50)
- [ ] Static images for complex 3D
- [ ] Smaller textures (1024px → 512px)
- [ ] Disable shadows on mobile
- [ ] Limit animations (60fps → 30fps)
- [ ] Lazy load below fold content
- [ ] Compress images (WebP 80%)
- [ ] Font subsetting (latin only)

## Performance Budget

### Target Sizes
- **Initial Load:** < 200KB JS (gzipped)
- **Images:** < 100KB each (WebP)
- **Fonts:** < 50KB total (WOFF2)
- **Total FCP:** < 1.5s
- **3D Scene:** < 3MB assets

## Atualização
Última modificação: 2026-01-30
Performance baseline: LCP 2.1s, FID 85ms, CLS 0.05
