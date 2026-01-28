# Design System Complete

**Created:** 2026-01-28
**Status:** Ready for implementation

---

## Summary

Design system tokens and components derived from:
- `design/strategy/` - Brand positioning, audience, personality
- `design/identity/` - Visual identity (logo, colors, typography)

All decisions are grounded in strategy requirements. Confidence levels documented per decision.

## System Files

### Token Files

| File | Description | Status |
|------|-------------|--------|
| `tokens/colors.json` | Full color palette with semantic meanings | Complete |
| `tokens/typography.json` | Font family, scale, weights | Complete |
| `tokens/spacing.json` | Spacing scale, component spacing | Complete |
| `tokens/elevation.json` | Shadows, borders, radii | Complete |
| `tokens/motion.json` | Durations, easings, animations | Complete |
| `tokens/tokens.json` | Unified token file for tooling | Complete |

### Documentation

| File | Description | Status |
|------|-------------|--------|
| `COLORS.md` | Color system documentation | Complete |
| `TYPOGRAPHY.md` | Typography system documentation | Complete |
| `SPACING.md` | Spacing system documentation | Complete |
| `COMPONENTS.md` | Component inventory with specs | Complete |

## Key Design Decisions

### Colors

| Token | Hex | Usage | Confidence |
|-------|-----|-------|------------|
| Primary | `#1A5F5A` | Brand color, buttons, links | 95% |
| Secondary | `#C45D3A` | Terracotta accent, warmth | 90% |
| Background | `#FEFDFB` | Warm white (worker app) | 95% |
| Surface | `#FAF7F2` | Cream cards/surfaces | 95% |
| Text Primary | `#3D3935` | Body text | 95% |
| Money | `#C4A23A` | Earnings, payments | 85% |

### Typography

| Setting | Value | Confidence |
|---------|-------|------------|
| Font | Plus Jakarta Sans | 95% |
| Base size | 16px | 95% |
| Weights | 400, 500, 600, 700 | 90% |
| Line height (body) | 1.5 | 95% |

### Spacing

| Setting | Value | Confidence |
|---------|-------|------------|
| Base unit | 4px | 95% |
| Touch target | 48px minimum | 95% |
| Card padding | 16px (mobile) | 90% |
| Screen padding | 16px | 90% |

### Components

| Component | Priority | Confidence |
|-----------|----------|------------|
| Button | MVP | 95% |
| Input | MVP | 95% |
| Card | MVP | 95% |
| TaskCard | MVP | 90% |
| SentimentSelector | MVP | 90% |
| Timer | MVP | 85% |
| EarningsDisplay | MVP | 90% |
| Toast | MVP | 90% |
| BottomNav | MVP | 95% |
| Modal | MVP | 90% |

## Two-Audience Expression

Same brand, different surfaces:

| Aspect | Worker App | Client Dashboard |
|--------|------------|------------------|
| Background | Warm White (#FEFDFB) | White (#FFFFFF) |
| Surface | Cream (#FAF7F2) | Cool Gray (#F9FAFB) |
| Accent | Terracotta for warmth | Teal only |
| Density | Generous spacing | Efficient layouts |
| Personality | M-Pesa simplicity | Stripe clarity |

## What's NOT Included

Per brand strategy:
- Dark mode (future, not MVP)
- Gamification elements (no confetti, streaks)
- Crypto visual language (blockchain invisible)
- NGO charity aesthetic (dignified commerce)
- Complex animations (simple, functional motion)

## DESIGN.md Updated

Design System section appended to `DESIGN.md` with:
- Core color tokens
- Typography settings
- Spacing scale
- Key component list

This ensures Loa framework can access design system during `/implement`.

## Implementation Notes

### Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'warm-white': '#FEFDFB',
        'cream': '#FAF7F2',
        'sand': '#F0EBE3',
        'warm-gray': {
          400: '#A39E94',
          600: '#6B665C',
          800: '#3D3935',
        },
        'warm-black': '#2C2925',
        'teal': {
          50: '#E8F5F4',
          100: '#C7E6E4',
          300: '#5DACA6',
          500: '#2D8A83',
          600: '#1A7068',
          700: '#1A5F5A',
          800: '#164D49',
          900: '#0F3633',
        },
        'terracotta': {
          50: '#FDF3EF',
          100: '#F9DED4',
          300: '#E49A7C',
          500: '#C45D3A',
          600: '#A84E31',
          700: '#8B3F26',
        },
        'money-gold': '#C4A23A',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-background: #FEFDFB;
  --color-surface: #FAF7F2;
  --color-text-primary: #3D3935;
  --color-text-secondary: #6B665C;
  --color-primary: #1A5F5A;
  --color-primary-hover: #164D49;
  --color-secondary: #C45D3A;
  --color-success: #2D8A3D;
  --color-warning: #C4883A;
  --color-error: #C43A3A;
  --color-money: #C4A23A;

  /* Typography */
  --font-family: 'Plus Jakarta Sans', Inter, system-ui, sans-serif;
  --font-size-base: 1rem;

  /* Spacing */
  --spacing-unit: 0.25rem;
  --touch-target: 3rem;

  /* Elevation */
  --shadow-sm: 0 1px 3px 0 rgba(44, 41, 37, 0.1);
  --radius-lg: 0.5rem;
}
```

## Next Steps

1. **Implementation** - Apply tokens via `/implement` command
2. **Component Build** - Create shadcn/ui components with brand tokens
3. **Testing** - Verify accessibility (WCAG AA)
4. **Documentation** - Generate Storybook (post-MVP)

---

**Design system is ready for development.**
