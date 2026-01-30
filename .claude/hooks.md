# Custom Hooks - LiberBlock

## Hooks Existentes

### 1. useScrollProgress (hooks/useScrollProgress.ts)
Tracked scroll progress da página (0 a 1)

```tsx
import { useState, useEffect } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = scrollTop / docHeight;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

// Uso
const progress = useScrollProgress();
<ProgressBar width={`${progress * 100}%`} />
```

### 2. useCubeRotation (hooks/useCubeRotation.ts)
Controla rotação do cubo 3D baseado em scroll/mouse

```tsx
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

export function useCubeRotation(scrollProgress: number) {
  const rotationRef = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    rotationRef.current.x = scrollProgress * Math.PI * 2;
    rotationRef.current.y += delta * 0.1;
  });

  return rotationRef.current;
}

// Uso no componente 3D
const rotation = useCubeRotation(scrollProgress);
<mesh rotation={[rotation.x, rotation.y, 0]}>
```

### 3. useMousePosition (hooks/useMousePosition.ts)
Tracked posição do mouse para efeitos interativos

```tsx
import { useState, useEffect } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

export function useMousePosition() {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}

// Uso
const { x, y } = useMousePosition();
<Cursor style={{ left: x, top: y }} />
```

## Padrões de Hooks

### Hook com Cleanup
```tsx
export function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  element: HTMLElement | Window = window
) {
  useEffect(() => {
    element.addEventListener(eventName, handler);
    return () => element.removeEventListener(eventName, handler);
  }, [eventName, handler, element]);
}
```

### Hook com Debounce
```tsx
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Uso
const searchTerm = useDebounce(inputValue, 500);
```

### Hook com Local Storage
```tsx
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(newValue));
    }
  };

  return [value, setStoredValue] as const;
}

// Uso
const [theme, setTheme] = useLocalStorage('theme', 'dark');
```

### Hook com Media Query
```tsx
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// Uso
const isMobile = useMediaQuery('(max-width: 768px)');
```

### Hook com Intersection Observer
```tsx
export function useInView(options?: IntersectionObserverInit) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options]);

  return [setRef, isInView] as const;
}

// Uso
const [ref, isInView] = useInView({ threshold: 0.5 });
<div ref={ref}>{isInView && <LazyComponent />}</div>
```

## Hooks Best Practices

### 1. Naming Convention
```tsx
// ✅ Sempre começar com 'use'
export function useCustomHook() {}

// ❌ Não começar com use
export function customHook() {}
```

### 2. Return Types
```tsx
// ✅ Tuple para múltiplos valores relacionados
return [value, setValue] as const;

// ✅ Object para múltiplos valores distintos
return { data, loading, error };

// ✅ Single value para hooks simples
return isVisible;
```

### 3. Cleanup Functions
```tsx
useEffect(() => {
  const subscription = subscribe();

  // SEMPRE retornar cleanup
  return () => subscription.unsubscribe();
}, []);
```

### 4. Dependencies
```tsx
// ✅ Incluir todas as dependências
useEffect(() => {
  doSomething(value);
}, [value]);

// ❌ Omitir dependências necessárias
useEffect(() => {
  doSomething(value);
}, []); // ESLint error!
```

### 5. SSR Safety
```tsx
// ✅ Verificar se está no browser
const [value, setValue] = useState(() => {
  if (typeof window === 'undefined') return defaultValue;
  return window.localStorage.getItem('key');
});

// ❌ Acessar window direto
const value = window.localStorage.getItem('key'); // Error no SSR!
```

## Common Patterns

### Ref Forwarding
```tsx
export function useForwardedRef<T>(
  ref: ForwardedRef<T>
): MutableRefObject<T | null> {
  const innerRef = useRef<T>(null);

  useEffect(() => {
    if (!ref) return;
    if (typeof ref === 'function') {
      ref(innerRef.current);
    } else {
      ref.current = innerRef.current;
    }
  });

  return innerRef;
}
```

### Async Hook
```tsx
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setValue(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setValue(response);
      setStatus('success');
    } catch (error) {
      setError(error as Error);
      setStatus('error');
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) execute();
  }, [execute, immediate]);

  return { execute, status, value, error };
}
```

## Criando Novos Hooks

Checklist ao criar um hook:
- [ ] Nome começa com 'use'
- [ ] Arquivo em `/hooks/useHookName.ts`
- [ ] TypeScript com tipos explícitos
- [ ] Documentação JSDoc
- [ ] Cleanup functions quando necessário
- [ ] SSR-safe (verificar window/document)
- [ ] Return type apropriado (tuple/object/value)
- [ ] Dependencies array correto

## Atualização
Última modificação: 2026-01-30
Hooks ativos: useScrollProgress, useCubeRotation, useMousePosition
