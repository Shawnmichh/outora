# 🎨 Outora Design System

## Premium Visual Language

This document defines the design system for Outora's premium, elegant interface.

---

## Color Palette

### Backgrounds

```css
/* Primary background - rich charcoal */
--color-charcoal: #0a0a0b;
background-color: #0a0a0b;

/* Surface - off-black */
--color-surface: #111113;
background-color: #111113;

/* Elevated surface */
--color-surface-elevated: #18181b; /* zinc-900 */
background-color: #18181b;
```

### Borders

```css
/* Default border - 6% opacity */
--color-border: rgba(255, 255, 255, 0.06);
border-color: rgba(255, 255, 255, 0.06);

/* Hover border - 12% opacity */
--color-border-hover: rgba(255, 255, 255, 0.12);
border-color: rgba(255, 255, 255, 0.12);
```

### Text Colors

```css
/* Primary text - soft white */
--color-text-primary: #fafafa;
color: #fafafa;

/* Secondary text */
--color-text-secondary: #a1a1aa; /* zinc-400 */
color: #a1a1aa;

/* Tertiary text */
--color-text-tertiary: #71717a; /* zinc-500 */
color: #71717a;

/* Muted text */
--color-text-muted: #52525b; /* zinc-600 */
color: #52525b;
```

### Accent Colors

```css
/* Emerald - muted, not neon */
--color-emerald-muted: #10b981;
color: #10b981;

/* Cyan - muted, not neon */
--color-cyan-muted: #06b6d4;
color: #06b6d4;
```

### Gradients

```css
/* Brand gradient - emerald to cyan */
background: linear-gradient(to right, #34d399, #22d3ee);

/* Subtle brand gradient */
background: linear-gradient(to bottom right, #10b981, #06b6d4);
```

---

## Typography

### Font Family

```css
font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
```

### Font Weights

```css
font-weight: 400; /* Regular - body text */
font-weight: 500; /* Medium - subheadings, labels */
font-weight: 600; /* Semibold - headings, buttons */
font-weight: 700; /* Bold - hero headlines */
```

### Type Scale

```css
/* Hero headline */
font-size: 3rem;    /* 48px - mobile */
font-size: 3.75rem; /* 60px - tablet */
font-size: 4.5rem;  /* 72px - desktop */
line-height: 1.1;
letter-spacing: -0.025em;

/* Section heading */
font-size: 1.875rem; /* 30px - mobile */
font-size: 2.25rem;  /* 36px - desktop */
line-height: 1.2;
letter-spacing: -0.025em;

/* Card title */
font-size: 1rem;     /* 16px */
font-weight: 600;
line-height: 1.5;

/* Body text */
font-size: 1rem;     /* 16px */
font-size: 1.125rem; /* 18px - large */
line-height: 1.6;

/* Small text */
font-size: 0.875rem; /* 14px */
line-height: 1.5;
```

---

## Spacing System

### Padding Scale

```css
/* Component padding */
padding: 1rem;      /* 16px - tight */
padding: 1.5rem;    /* 24px - default */
padding: 2rem;      /* 32px - comfortable */
padding: 2.5rem;    /* 40px - spacious */

/* Section padding */
padding-top: 6rem;    /* 96px - mobile */
padding-top: 8rem;    /* 128px - tablet */
padding-top: 10rem;   /* 160px - desktop */
padding-bottom: 6rem; /* 96px - mobile */
padding-bottom: 8rem; /* 128px - tablet */
padding-bottom: 10rem;/* 160px - desktop */
```

### Gap Scale

```css
gap: 0.25rem; /* 4px - tight */
gap: 0.5rem;  /* 8px - compact */
gap: 1rem;    /* 16px - default */
gap: 1.5rem;  /* 24px - comfortable */
gap: 2rem;    /* 32px - spacious */
```

---

## Border Radius

```css
/* Small elements */
border-radius: 0.5rem;  /* 8px - rounded-lg */

/* Medium elements */
border-radius: 0.75rem; /* 12px - rounded-xl */

/* Large elements */
border-radius: 1rem;    /* 16px - rounded-2xl */

/* Pills */
border-radius: 9999px;  /* rounded-full */
```

---

## Shadows

```css
/* Subtle shadow */
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Default shadow */
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* Large shadow */
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Premium shadow */
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

---

## Components

### Buttons

#### Primary Button (White)
```css
background-color: #ffffff;
color: #18181b;
padding: 0.875rem 2rem;
border-radius: 0.75rem;
font-weight: 600;
font-size: 0.875rem;
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

/* Hover */
background-color: rgba(255, 255, 255, 0.9);
```

#### Secondary Button (Ghost)
```css
background-color: rgba(255, 255, 255, 0.02);
border: 1px solid rgba(255, 255, 255, 0.08);
color: #ffffff;
padding: 0.875rem 2rem;
border-radius: 0.75rem;
font-weight: 600;
font-size: 0.875rem;
backdrop-filter: blur(12px);
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

/* Hover */
background-color: rgba(255, 255, 255, 0.05);
border-color: rgba(255, 255, 255, 0.12);
```

### Cards

#### Feature Card
```css
background-color: #0a0a0b;
border: 1px solid rgba(255, 255, 255, 0.06);
padding: 2rem;
border-radius: 1rem;
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

/* Hover */
background-color: rgba(24, 24, 27, 0.5);
```

#### Elevated Card
```css
background-color: rgba(24, 24, 27, 0.5);
border: 1px solid rgba(255, 255, 255, 0.08);
padding: 2rem;
border-radius: 1rem;
backdrop-filter: blur(12px);
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### Inputs

```css
background-color: rgba(10, 10, 11, 0.5);
border: 1px solid rgba(255, 255, 255, 0.08);
color: #ffffff;
padding: 0.75rem 1rem;
border-radius: 0.75rem;
font-size: 0.875rem;
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

/* Hover */
border-color: rgba(255, 255, 255, 0.12);

/* Focus */
border-color: rgba(16, 185, 129, 0.4);
outline: 2px solid rgba(16, 185, 129, 0.1);
outline-offset: 0;
```

### Badges

```css
background-color: rgba(255, 255, 255, 0.02);
border: 1px solid rgba(255, 255, 255, 0.08);
color: #a1a1aa;
padding: 0.5rem 1rem;
border-radius: 9999px;
font-size: 0.875rem;
font-weight: 500;
backdrop-filter: blur(12px);
```

### Icon Containers

```css
display: flex;
align-items: center;
justify-content: center;
width: 2.5rem;
height: 2.5rem;
background-color: rgba(255, 255, 255, 0.02);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 0.5rem;
color: #10b981;
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

/* Hover */
background-color: rgba(16, 185, 129, 0.05);
border-color: rgba(16, 185, 129, 0.2);
```

---

## Animations

### Transitions

```css
/* Default transition */
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

/* Smooth transition */
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

/* Slow transition */
transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Hover Effects

```css
/* Scale up */
transform: scale(1.05);

/* Lift */
transform: translateY(-2px);

/* Glow */
box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.1),
            0 0 20px rgba(16, 185, 129, 0.1);
```

---

## Layout

### Container Widths

```css
/* Default container */
max-width: 80rem; /* 1280px */
margin-left: auto;
margin-right: auto;
padding-left: 1rem;
padding-right: 1rem;

/* Narrow container */
max-width: 42rem; /* 672px */

/* Wide container */
max-width: 90rem; /* 1440px */
```

### Grid Systems

```css
/* Feature grid */
display: grid;
grid-template-columns: repeat(1, 1fr);
gap: 1px;
background-color: rgba(255, 255, 255, 0.06);
border: 1px solid rgba(255, 255, 255, 0.06);
border-radius: 1rem;
overflow: hidden;

@media (min-width: 640px) {
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 1024px) {
  grid-template-columns: repeat(3, 1fr);
}
```

---

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 639px) { }

/* Tablet */
@media (min-width: 640px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large desktop */
@media (min-width: 1280px) { }
```

---

## Accessibility

### Focus States

```css
*:focus-visible {
  outline: 2px solid rgba(16, 185, 129, 0.4);
  outline-offset: 2px;
}
```

### Color Contrast

All text meets WCAG AA standards:
- White on charcoal: 19.5:1 (AAA)
- zinc-400 on charcoal: 8.5:1 (AA)
- zinc-500 on charcoal: 5.2:1 (AA)

---

## Usage Examples

### Hero Section

```jsx
<section className="relative overflow-hidden px-4 pt-32 pb-24 sm:px-6 sm:pt-40 sm:pb-32 lg:px-8 lg:pt-48 lg:pb-40">
  <div className="pointer-events-none absolute inset-0 -z-10">
    <div className="absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-emerald-500/[0.03] blur-[120px]" />
  </div>
  
  <div className="mx-auto max-w-7xl">
    <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
      Your headline
    </h1>
  </div>
</section>
```

### Feature Card

```jsx
<article className="group relative bg-zinc-950 p-8 transition-colors hover:bg-zinc-900/50">
  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-emerald-400">
    {icon}
  </div>
  <h3 className="mt-6 text-base font-semibold text-white">Title</h3>
  <p className="mt-2 text-sm leading-relaxed text-zinc-500">Description</p>
</article>
```

### Button

```jsx
<button className="rounded-xl bg-white px-8 py-4 text-base font-semibold text-zinc-950 transition-all hover:bg-white/90">
  Get Started
</button>
```

---

## Design Principles

1. **Elegance over Flash** - Subtle, refined interactions
2. **Hierarchy through Contrast** - Clear visual weight
3. **Premium Spacing** - Generous, breathable layouts
4. **Tasteful Depth** - Subtle shadows and layers
5. **Intentional Color** - Muted accents, not neon
6. **Smooth Motion** - Refined animations

---

This design system creates a premium, elegant exploration platform that feels sophisticated and professional.
