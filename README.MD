# LiberBlock

An immersive 3D portfolio showcasing digital products through an interactive Bitcoin-themed experience. Built with cutting-edge web technologies and cypherpunk aesthetics.

![LiberBlock](./public/og-image.png)

## Overview

LiberBlock is a modern, interactive portfolio website that presents 4 digital products through a unique 3D cube interface. The project combines WebGL rendering, smooth animations, and Bitcoin-inspired design to create an engaging user experience.

## Features

- **Interactive 3D Cube**: Navigate between projects using a rotating 3D cube interface
- **Cypherpunk Aesthetics**: Bitcoin-friendly color palette with orange accents and high-tech styling
- **Smooth Animations**: GSAP-powered transitions and scroll-triggered effects
- **Responsive Design**: Optimized for desktop and mobile devices with fallback modes
- **Performance Optimized**: Lazy loading, texture compression, and mobile-specific optimizations
- **Type-Safe**: Built with TypeScript for enhanced development experience

## Tech Stack

### Core Technologies
- **[Next.js 14+](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### 3D & Graphics
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** - React renderer for Three.js
- **[Drei](https://github.com/pmndrs/drei)** - Helper components for R3F
- **[Three.js](https://threejs.org/)** - WebGL 3D library

### Styling & Animation
- **[Tailwind CSS 3.4+](https://tailwindcss.com/)** - Utility-first CSS framework
- **[GSAP 3](https://greensock.com/gsap/)** - Professional animation library
- **[Lenis](https://lenis.studiofreight.com/)** - Smooth scroll library

### Forms & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[Zod](https://zod.dev/)** - Schema validation

### UI Components
- **[Lucide React](https://lucide.dev/)** - Icon library
- **Space Grotesk** - Title typography
- **JetBrains Mono** - Technical text font

## Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm package manager
- Modern browser with WebGL support

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/liberblock.git
cd liberblock
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
liberblock/
├── app/                    # Next.js App Router pages
├── components/            # React components
│   ├── 3d/               # Three.js/R3F components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

### Component Patterns

#### 3D Components
All 3D components use client-side rendering with dynamic imports:

```tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

const Scene = dynamic(() => import('./Scene'), {
  ssr: false,
  loading: () => <LoadingFallback />
})
```

#### Animations
GSAP is used for complex animations with timeline control:

```tsx
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
```

### Design System

#### Color Palette
```css
/* Bitcoin Cypherpunk Theme */
--bg-primary:      #0A0A0B    /* Deep black */
--bg-secondary:    #111113    /* Charcoal gray */
--bg-card:         #1A1A1D    /* Card background */
--accent-bitcoin:  #F7931A    /* Bitcoin orange */
--accent-gold:     #D4AF37    /* Metallic gold */
--accent-glow:     #FF9500    /* Orange glow */
--text-primary:    #FAFAFA    /* Soft white */
--text-secondary:  #888888    /* Medium gray */
--border:          #2A2A2D    /* Subtle borders */
```

#### Typography
- **Headings**: Space Grotesk (modern, geometric)
- **Technical Text**: JetBrains Mono (monospace, developer-friendly)
- **Body**: System font stack for optimal performance

## Performance Optimizations

- **Lazy Loading**: 3D components loaded on demand
- **Texture Compression**: Optimized asset sizes
- **Mobile Fallbacks**: Reduced particle counts and simpler geometries
- **InstancedMesh**: Efficient rendering for repeated objects
- **Code Splitting**: Route-based and component-based splitting

## Projects Showcased

1. **Libertarian Stone** - Mini animated interface
2. **ArcaPy** - Screenshot with hover effects
3. **GardenRosasDecor** - Screenshot with hover effects
4. **RPG 2D Godot** - Mini animated interface
5. **LiberBlock Logo** - Animated pulse glow
6. **Contact/CTA** - Interactive mini interface

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

WebGL support required for full 3D experience.

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for all new components
- Follow existing naming conventions
- Use Tailwind utilities over custom CSS
- Add comments for complex 3D logic

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Bitcoin logo and branding
- Three.js community
- GSAP animation library
- Vercel for hosting

## Contact

- Website: [liberblock.com](https://liberblock.com)
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: contact@liberblock.com

---

Built with ⚡ by LiberBlock
