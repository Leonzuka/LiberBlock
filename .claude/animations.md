# Animations - GSAP & ScrollTrigger

## GSAP Setup (lib/gsap.ts)

### Configuração Inicial
```typescript
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Registrar plugins
gsap.registerPlugin(ScrollTrigger);

// Configurações globais
gsap.defaults({
  ease: 'power2.out',
  duration: 0.8
});

export { gsap, ScrollTrigger };
```

## Padrões de Animação

### 1. Text Reveal (TextReveal.tsx)
```tsx
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

export default function TextReveal({ children }: { children: string }) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const chars = textRef.current.querySelectorAll('.char');

    gsap.from(chars, {
      opacity: 0,
      y: 50,
      rotationX: -90,
      stagger: 0.02,
      duration: 0.8,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  }, []);

  return (
    <div ref={textRef} className="overflow-hidden">
      {children.split('').map((char, i) => (
        <span key={i} className="char inline-block">
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}
```

### 2. Fade In on Scroll
```tsx
useEffect(() => {
  gsap.from(elementRef.current, {
    opacity: 0,
    y: 100,
    duration: 1,
    scrollTrigger: {
      trigger: elementRef.current,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse'
    }
  });
}, []);
```

### 3. Parallax Effect
```tsx
useEffect(() => {
  gsap.to(elementRef.current, {
    y: -100,
    scrollTrigger: {
      trigger: containerRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1, // Smooth scrubbing
      markers: false
    }
  });
}, []);
```

### 4. Scale on Hover (Magnetic Button)
```tsx
const handleMouseMove = (e: MouseEvent) => {
  const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
  const centerX = left + width / 2;
  const centerY = top + height / 2;
  const deltaX = (e.clientX - centerX) * 0.3;
  const deltaY = (e.clientY - centerY) * 0.3;

  gsap.to(buttonRef.current, {
    x: deltaX,
    y: deltaY,
    scale: 1.1,
    duration: 0.3,
    ease: 'power2.out'
  });
};

const handleMouseLeave = () => {
  gsap.to(buttonRef.current, {
    x: 0,
    y: 0,
    scale: 1,
    duration: 0.5,
    ease: 'elastic.out(1, 0.5)'
  });
};
```

### 5. Stagger Animation (Cards)
```tsx
useEffect(() => {
  const cards = containerRef.current.querySelectorAll('.card');

  gsap.from(cards, {
    opacity: 0,
    y: 60,
    rotationX: -15,
    stagger: 0.1, // 0.1s delay entre cada card
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: containerRef.current,
      start: 'top 70%'
    }
  });
}, []);
```

## ScrollTrigger Patterns

### Toggle Actions
```typescript
toggleActions: 'onEnter onLeave onEnterBack onLeaveBack'
// Valores: 'play', 'pause', 'resume', 'reverse', 'restart', 'complete', 'reset', 'none'

// Exemplo comum:
toggleActions: 'play none none reverse'
// play no onEnter, reverse no onLeaveBack
```

### Pin Element
```tsx
ScrollTrigger.create({
  trigger: sectionRef.current,
  start: 'top top',
  end: '+=500',
  pin: true,
  pinSpacing: true,
  scrub: 1
});
```

### Scrub (Smooth Scroll Animation)
```tsx
gsap.to(element, {
  rotation: 360,
  scrollTrigger: {
    trigger: element,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1, // 1 segundo de smooth scrubbing
    // scrub: true, // Sem delay (instantâneo)
  }
});
```

## Timeline Patterns

### Sequential Timeline
```tsx
useEffect(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.current,
      start: 'top center'
    }
  });

  tl.from('.heading', { opacity: 0, y: 50, duration: 0.8 })
    .from('.subheading', { opacity: 0, y: 30, duration: 0.6 }, '-=0.4')
    .from('.cards', { opacity: 0, y: 40, stagger: 0.1, duration: 0.6 }, '-=0.3');

  return () => tl.kill();
}, []);
```

### Looping Animation
```tsx
useEffect(() => {
  gsap.to(elementRef.current, {
    rotation: 360,
    duration: 20,
    repeat: -1,
    ease: 'none'
  });
}, []);
```

### Hover Timeline
```tsx
const tl = useRef<gsap.core.Timeline>();

useEffect(() => {
  tl.current = gsap.timeline({ paused: true })
    .to(bgRef.current, { scale: 1.1, duration: 0.3 })
    .to(textRef.current, { y: -5, duration: 0.2 }, '<')
    .to(iconRef.current, { rotation: 180, duration: 0.4 }, '<');
}, []);

const handleMouseEnter = () => tl.current?.play();
const handleMouseLeave = () => tl.current?.reverse();
```

## Tailwind Transitions

Para animações simples, use Tailwind:

### Hover Effects
```tsx
<div className="transition-all duration-300 hover:scale-105 hover:shadow-xl">
```

### Transform Origin
```tsx
<div className="transition-transform duration-500 origin-left hover:scale-x-110">
```

### Opacity Fade
```tsx
<div className="transition-opacity duration-700 opacity-0 group-hover:opacity-100">
```

### Custom Timing
```tsx
<div className="transition-all duration-300 ease-out hover:translate-y-[-4px]">
```

## Cubic Bezier Presets

```typescript
// GSAP eases
'power1.out'   // Suave
'power2.out'   // Médio
'power3.out'   // Forte
'back.out(1.7)' // Bounce back
'elastic.out(1, 0.5)' // Elástico
'expo.out'     // Exponencial
'circ.out'     // Circular
```

## Performance Tips

1. **Use transforms** (x, y, scale, rotation) ao invés de top/left
2. **will-change** CSS para propriedades animadas
3. **Lazy load** animations (trigger on scroll)
4. **Kill timelines** no cleanup do useEffect
5. **Batch updates** com `.set()` quando possível
6. **Avoid layout thrashing** - ler depois escrever
7. **Use `scrub`** para scroll animations (performance++)

## Cleanup Pattern

```tsx
useEffect(() => {
  const tl = gsap.timeline({ ... });
  const st = ScrollTrigger.create({ ... });

  return () => {
    tl.kill();
    st.kill();
  };
}, []);
```

## Atualização
Última modificação: 2026-01-30
Animações ativas: TextReveal, MagneticButton, ScrollTrigger sections
