# 🎨 Outora Brand Guide

## Brand Identity

**Name:** Outora  
**Tagline:** AI-powered exploration  
**Voice:** Modern, premium, exploration-focused

---

## Logo Design

### Visual Elements

The Outora logo combines three symbolic elements:

1. **Mountains** (top) - Adventure, exploration, reaching new heights
2. **Waves** (middle) - Flow, journey, movement
3. **Circle** (center) - Focus, destination, discovery

### Color Palette

**Primary Colors:**
- Emerald Green: `#10b981`, `#0d9488`, `#14b8a6`
- Cyan Blue: `#22d3ee`, `#06b6d4`, `#0891b2`, `#0284c7`
- Light Cyan: `#67e8f9`

**UI Colors:**
- Background: `#09090b` (zinc-950)
- Surface: `#18181b` (zinc-900)
- Border: `rgba(255, 255, 255, 0.05)`
- Text Primary: `#ffffff`
- Text Secondary: `#a1a1aa` (zinc-400)

---

## Typography

**Font Family:** Inter  
**Weights Used:**
- Regular (400) - Body text
- Medium (500) - Subheadings
- Semibold (600) - Brand name, buttons
- Bold (700) - Headings

### Brand Name Treatment

**"Outora"** is displayed with a gradient effect:
- "Out" - White (`#ffffff`)
- "ora" - Gradient from emerald (`#34d399`) to cyan (`#22d3ee`)

```css
.brand-name {
  font-weight: 600;
  letter-spacing: -0.025em;
}

.brand-gradient {
  background: linear-gradient(to right, #34d399, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## Logo Usage

### Sizes

**Navbar:** 36px × 36px (h-9 w-9)  
**Footer:** 36px × 36px (h-9 w-9)  
**Favicon:** 32px × 32px (browser default)  
**Minimum Size:** 32px × 32px (for readability)

### Spacing

**With Text:**
- Gap between logo and text: 10px (gap-2.5)
- Logo and text should be vertically centered

**Standalone:**
- Minimum clear space: 8px on all sides

### Do's and Don'ts

✅ **DO:**
- Use on dark backgrounds (zinc-950, zinc-900)
- Maintain square aspect ratio
- Use SVG format for web
- Keep gradients intact
- Scale proportionally

❌ **DON'T:**
- Use on light backgrounds without adjustment
- Stretch or distort
- Change gradient colors
- Add drop shadows or effects
- Use raster formats (PNG/JPG) when SVG is available

---

## UI Components

### Buttons

**Primary (CTA):**
```css
background: linear-gradient(to right, #0d9488, #14b8a6);
color: white;
border-radius: 16px;
padding: 12px 24px;
font-weight: 600;
```

**Secondary:**
```css
border: 1px solid rgba(6, 182, 212, 0.3);
background: rgba(6, 182, 212, 0.1);
color: #22d3ee;
border-radius: 16px;
padding: 12px 24px;
font-weight: 600;
```

### Cards

```css
border: 1px solid rgba(255, 255, 255, 0.05);
background: rgba(24, 24, 27, 0.5);
border-radius: 16px;
padding: 24px;
```

### Badges

```css
border: 1px solid rgba(16, 185, 129, 0.3);
background: rgba(16, 185, 129, 0.1);
color: #10b981;
border-radius: 9999px;
padding: 6px 16px;
font-size: 14px;
font-weight: 500;
```

---

## Gradients

### Background Gradients

**Hero Section:**
```css
/* Violet glow */
background: radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%);

/* Cyan accent */
background: radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%);
```

### Text Gradients

**Primary:**
```css
background: linear-gradient(to right, #a78bfa, #ec4899, #22d3ee);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

**Brand:**
```css
background: linear-gradient(to right, #34d399, #22d3ee);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## Iconography

### Style
- Outline style (not filled)
- 1.5px stroke weight
- Rounded line caps and joins
- Heroicons library

### Colors
- Default: `#a1a1aa` (zinc-400)
- Hover: `#ffffff` (white)
- Active/Accent: `#10b981` (emerald-400) or `#22d3ee` (cyan-400)

---

## Voice & Tone

### Brand Voice
- **Knowledgeable** - Expert in exploration and travel
- **Supportive** - Helpful companion, not authoritative
- **Warm** - Friendly and approachable
- **Modern** - Tech-savvy and current

### Writing Style
- Use active voice
- Keep sentences concise
- Avoid jargon
- Be conversational but professional
- Focus on benefits, not features

### Example Copy

**Good:**
> "Discover your city like never before with AI-powered exploration."

**Avoid:**
> "Our advanced machine learning algorithms generate optimal itineraries."

---

## Application Examples

### Navbar
```jsx
<Link to="/" className="flex items-center gap-2.5">
  <img src={logo} alt="Outora" className="h-9 w-9" />
  <span className="text-lg font-semibold text-white">
    Out<span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">ora</span>
  </span>
</Link>
```

### Hero Heading
```jsx
<h1 className="text-5xl font-bold text-white">
  Discover your city{' '}
  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
    like never before
  </span>
</h1>
```

### Badge
```jsx
<span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-300">
  AI-powered day plans
</span>
```

---

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 minimum)
- Interactive elements have clear focus states
- Gradients used for decoration, not critical information

### Alt Text
- Logo: "Outora"
- Decorative elements: Empty alt or aria-hidden

### Focus States
```css
focus:outline-none
focus:ring-2
focus:ring-emerald-500/20
focus:border-emerald-500/60
```

---

## File Assets

### Logo Files
- `outora-logo.svg` - Primary logo (200×200)
- `outora-icon.svg` - Icon version (200×200)
- `favicon.svg` - Browser favicon (100×100)

### Locations
- Source: `frontend/src/assets/branding/`
- Public: `frontend/public/` (favicon only)
- Build: `frontend/dist/` (after build)

---

## Brand Applications

### Website
- Navbar logo + text
- Footer logo + text
- Favicon in browser tab
- Loading states
- Error states

### Social Media
- Profile picture: Icon version
- Cover images: Logo with tagline
- Post graphics: Maintain color palette

### Marketing
- Email signatures
- Presentations
- Documentation
- Promotional materials

---

## Version History

**v1.0** - May 25, 2026
- Initial Outora rebrand
- Logo design finalized
- Color palette established
- Typography system defined
- Component library created

---

## Contact

For brand guidelines questions or asset requests, refer to the design team or project documentation.

**Remember:** Consistency is key. When in doubt, refer to existing implementations in the codebase.
