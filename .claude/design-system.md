# Design System - LiberBlock

## Paleta de Cores Bitcoin/Cypherpunk

### Cores Principais
```css
--bg-primary:      #0A0A0B    /* Deep black - background principal */
--bg-secondary:    #111113    /* Charcoal gray - seções alternadas */
--bg-card:         #1A1A1D    /* Card background - elementos elevados */
```

### Accents & Highlights
```css
--accent-bitcoin:  #F7931A    /* Bitcoin orange - CTAs primários */
--accent-gold:     #D4AF37    /* Metallic gold - highlights premium */
--accent-glow:     #FF9500    /* Orange glow - efeitos de luz */
```

### Tipografia & Borders
```css
--text-primary:    #FAFAFA    /* Soft white - texto principal */
--text-secondary:  #888888    /* Medium gray - texto secundário */
--border:          #2A2A2D    /* Subtle borders - divisores sutis */
```

## Tailwind Classes Customizadas

### Backgrounds
- `bg-[#0A0A0B]` - Primary background
- `bg-[#111113]` - Secondary background
- `bg-[#1A1A1D]` - Card background

### Text Colors
- `text-[#FAFAFA]` - Primary text
- `text-[#888888]` - Secondary text
- `text-[#F7931A]` - Bitcoin accent
- `text-[#D4AF37]` - Gold accent

### Borders & Effects
- `border-[#2A2A2D]` - Default border
- `shadow-[0_0_20px_rgba(247,147,26,0.3)]` - Bitcoin glow
- `shadow-[0_0_30px_rgba(212,175,55,0.4)]` - Gold glow

## Tipografia

### Fonts
```css
/* Títulos e headings */
font-family: 'Space Grotesk', sans-serif;
font-weight: 700 | 600 | 500;

/* Código e elementos técnicos */
font-family: 'JetBrains Mono', monospace;
font-weight: 400 | 500;
```

### Scale
```css
h1: text-6xl md:text-7xl lg:text-8xl font-bold
h2: text-4xl md:text-5xl lg:text-6xl font-bold
h3: text-2xl md:text-3xl lg:text-4xl font-semibold
p:  text-base md:text-lg
code: text-sm font-mono
```

## Spacing System
Baseado no sistema Tailwind (4px base):
- `xs`: 2 (8px)
- `sm`: 4 (16px)
- `md`: 6 (24px)
- `lg`: 8 (32px)
- `xl`: 12 (48px)
- `2xl`: 16 (64px)
- `3xl`: 24 (96px)

## Padrões de Uso

### Cards
```tsx
<div className="bg-[#1A1A1D] border border-[#2A2A2D] rounded-lg p-6
                hover:shadow-[0_0_20px_rgba(247,147,26,0.3)]
                transition-all duration-300">
```

### Buttons Primary (Bitcoin)
```tsx
<button className="bg-[#F7931A] text-[#0A0A0B] font-bold px-6 py-3 rounded-lg
                   hover:bg-[#FF9500] hover:shadow-[0_0_30px_rgba(247,147,26,0.5)]
                   transition-all duration-300">
```

### Buttons Secondary
```tsx
<button className="border border-[#F7931A] text-[#F7931A] px-6 py-3 rounded-lg
                   hover:bg-[#F7931A]/10 transition-all duration-300">
```

### Text Glow Effect
```tsx
<h1 className="text-[#FAFAFA]
               [text-shadow:0_0_20px_rgba(247,147,26,0.5)]">
```

## Atualização
Última modificação: 2026-01-30
Componentes afetados: Todos os componentes UI
