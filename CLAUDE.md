# LiberBlock - Project Instructions

## Overview
Portfolio imersivo showcasing produtos digitais através de cubo 3D interativo com estética Bitcoin/cypherpunk.

**Stack:** Next.js 14 (App Router) + React Three Fiber + GSAP + Tailwind CSS

## 📚 Documentação Modular

A documentação completa está organizada em segmentos independentes:

- **[main.md](./.claude/main.md)** - Índice e visão geral
- **[design-system.md](./.claude/design-system.md)** - Paleta de cores, tipografia, tokens
- **[components.md](./.claude/components.md)** - Padrões de componentes, organização
- **[three-js.md](./.claude/three-js.md)** - React Three Fiber, 3D, WebGL
- **[animations.md](./.claude/animations.md)** - GSAP, ScrollTrigger, transições
- **[performance.md](./.claude/performance.md)** - Otimizações, lazy loading
- **[hooks.md](./.claude/hooks.md)** - Custom hooks patterns
- **[api-routes.md](./.claude/api-routes.md)** - API routes, validação

## Quick Reference

### Color Palette
```
Bitcoin Orange: #F7931A (CTAs, accents)
Gold Metallic:  #D4AF37 (highlights)
Deep Black:     #0A0A0B (background)
Soft White:     #FAFAFA (text)
```

### File Structure
```
/components
  /layout    → Header, Footer, SmoothScroll
  /ui        → Buttons, Cards, Forms, Cursor
  /hero      → Cube, Plexus
  /sections  → Projects, About, Contact
  /three     → Scene, Lights, Effects
/hooks       → useScrollProgress, useCubeRotation, useMousePosition
/lib         → utils, projects data, gsap config
/app         → pages, layout, API routes
```

### Key Patterns

**3D Components:**
- Always use `'use client'` directive
- Dynamic import with `ssr: false`
- Wrap in `<Suspense>` with fallback
- Mobile fallbacks for complex 3D

**Animations:**
- GSAP for complex timelines
- Tailwind for simple transitions
- ScrollTrigger for scroll-based

**Performance:**
- Lazy load 3D components
- Reduce particles on mobile (200 → 50)
- Use InstancedMesh for repeated objects
- WebP images, 85% quality

## Projects Data
1. Libertarian Stone - Mini animated interface
2. ArcaPy - Screenshot with hover
3. GardenRosasDecor - Screenshot with hover
4. RPG 2D Godot - Mini animated interface
5. LiberBlock Logo - Animated glow
6. Contact/CTA - Mini interface with links

## Instructions
Consulte os arquivos segmentados em `.claude/` para documentação detalhada de cada área. Cada segmento pode ser atualizado independentemente conforme o projeto evolui.

**Última atualização:** 2026-01-30
