# DESIGN SYSTEM — <project>

## Primitives

### Colors
```css
--gray-50: #fafafa;
--gray-100: #f4f4f5;
/* ... through gray-950 */
--brand-50: <value>;
/* ... through brand-950 */
```

### Spacing
```css
--space-0: 0;
--space-1: 4px;
--space-2: 8px;
/* ... */
```

### Typography
```css
--font-sans: "Inter", system-ui, sans-serif;
--font-mono: "JetBrains Mono", monospace;
--text-xs: 12px;
/* ... */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Radii
```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-full: 9999px;
```

### Shadows
```css
--shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px rgb(0 0 0 / 0.1);
```

## Semantic Tokens

### Light Mode
```css
--background: var(--gray-50);
--foreground: var(--gray-950);
--primary: var(--brand-600);
--primary-foreground: white;
--secondary: var(--gray-100);
--muted: var(--gray-500);
--accent: var(--brand-100);
--destructive: var(--red-600);
--border: var(--gray-200);
--ring: var(--brand-500);
```

### Dark Mode
```css
--background: var(--gray-950);
--foreground: var(--gray-50);
/* ... inverted values */
```

## Motion

### Durations
```css
--duration-fast: 75ms;
--duration-normal: 150ms;
--duration-slow: 300ms;
```

### Easings
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

## Component Tokens

### Button
```css
--button-height-sm: 32px;
--button-height-md: 40px;
--button-height-lg: 48px;
--button-radius: var(--radius-md);
--button-font: var(--text-sm);
```

## Layout

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Container
- Max width: 1280px
- Padding: 16px (mobile), 24px (tablet), 32px (desktop)

## Components

### Button
- Variants: primary, secondary, outline, ghost, destructive
- Sizes: sm, md, lg
- States: default, hover, active, focus, disabled, loading

### Input
- States: default, focus, error, disabled
- Includes: label, helper text, error message

<!-- Add more components as needed -->
