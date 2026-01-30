# Components - LiberBlock

## Organização de Arquivos

### Estrutura de Diretórios
```
/components
├── /layout          # Layout components (Header, Footer, SmoothScroll)
├── /ui              # UI primitives (Button, Card, Form, Cursor)
├── /hero            # Hero section components (Cube, Plexus)
├── /sections        # Page sections (Projects, About, Contact, TechStack)
└── /three           # 3D/WebGL components (Scene, Lights, Effects)
```

## Naming Conventions

### Arquivos
- **Componentes:** PascalCase (ex: `InteractiveCube.tsx`)
- **Hooks:** camelCase com prefixo 'use' (ex: `useMousePosition.ts`)
- **Utils:** camelCase (ex: `three-utils.ts`)
- **CSS:** kebab-case para classes customizadas

### Componentes
```tsx
// Nome do componente = Nome do arquivo
// InteractiveCube.tsx
export default function InteractiveCube() { ... }

// Props interface com sufixo Props
interface InteractiveCubeProps {
  rotation?: number;
  scale?: number;
}
```

## Padrões de Componentes

### 1. Client Components (3D/Interactive)
```tsx
'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Componentes 3D sempre com dynamic import (sem SSR)
const Scene = dynamic(() => import('@/components/three/Scene'), {
  ssr: false,
  loading: () => <LoadingSpinner />
});

export default function InteractiveCube() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Scene />
    </Suspense>
  );
}
```

### 2. Server Components (Default)
```tsx
// Sem 'use client' - renderizado no servidor
import { projects } from '@/lib/projects';

export default function ProjectsSection() {
  return (
    <section>
      {projects.map(project => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </section>
  );
}
```

### 3. Layout Components
```tsx
// components/layout/Header.tsx
export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md">
      {/* Content */}
    </header>
  );
}
```

### 4. UI Components
```tsx
// components/ui/MagneticButton.tsx
'use client';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function MagneticButton({
  children,
  className,
  onClick
}: MagneticButtonProps) {
  // Magnetic effect logic
  return <button className={className} onClick={onClick}>{children}</button>;
}
```

## Component Composition

### Atomic Design Adaptado
```
Atoms     → ui/       (Button, Input, Card)
Molecules → ui/       (ContactForm, GlowCard)
Organisms → sections/ (ProjectsSection, HeroSection)
Templates → layout/   (Header, Footer, SmoothScroll)
Pages     → app/      (page.tsx, layout.tsx)
```

## Props Patterns

### Optional Props com Default Values
```tsx
interface CubeProps {
  size?: number;
  rotation?: [number, number, number];
  enablePhysics?: boolean;
}

export default function Cube({
  size = 1,
  rotation = [0, 0, 0],
  enablePhysics = false
}: CubeProps) {
  // ...
}
```

### Children Pattern
```tsx
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glow' | 'flat';
}

export default function Card({ children, variant = 'default' }: CardProps) {
  return <div className={getVariantClass(variant)}>{children}</div>;
}
```

### Render Props Pattern
```tsx
interface DataLoaderProps<T> {
  data: T[];
  render: (item: T) => React.ReactNode;
}

export default function DataLoader<T>({ data, render }: DataLoaderProps<T>) {
  return <>{data.map(render)}</>;
}
```

## Component Checklist

Ao criar um novo componente, verificar:

- [ ] Nome em PascalCase e match com arquivo
- [ ] 'use client' se usa hooks/state/eventos
- [ ] Interface Props com sufixo Props
- [ ] Default values para props opcionais
- [ ] TypeScript strict (sem any)
- [ ] Tailwind CSS (evitar CSS modules)
- [ ] Mobile responsive
- [ ] Acessibilidade (aria-labels, semantic HTML)
- [ ] Performance (memo, useMemo se necessário)

## Import Aliases
```tsx
import Component from '@/components/ui/Component';
import { useHook } from '@/hooks/useHook';
import { util } from '@/lib/util';
```

## Atualização
Última modificação: 2026-01-30
Componentes mapeados: 30+ componentes
