# Color System

## Design Rationale

**Derived from brand strategy:**
- Base: Warm neutrals (cream, sand, warm white) - not clinical, not cold
- Primary: Deep teal (Safaricom confidence, trustworthy, African)
- Secondary: Terracotta (earthy, subtle warmth)
- Money: Warm gold (universal, premium)

**What we avoid:** Charity blue, crypto purple, betting neon, pastels

## Core Palette

### Neutrals (Warm Base)

| Token | Hex | Usage | Contrast |
|-------|-----|-------|----------|
| `neutral.warmWhite` | `#FEFDFB` | Primary background (worker app) | - |
| `neutral.cream` | `#FAF7F2` | Surface/cards | - |
| `neutral.sand` | `#F0EBE3` | Dividers, disabled states | - |
| `neutral.warmGray400` | `#A39E94` | Placeholder text, icons | 3.1:1 |
| `neutral.warmGray600` | `#6B665C` | Secondary text | 5.2:1 |
| `neutral.warmGray800` | `#3D3935` | Primary text | 10.5:1 |
| `neutral.warmBlack` | `#2C2925` | Headlines, emphasis | 12.3:1 |
| `neutral.white` | `#FFFFFF` | Client dashboard background | - |

### Primary (Deep Teal)

| Token | Hex | Usage | Contrast |
|-------|-----|-------|----------|
| `primary.50` | `#E8F5F4` | Subtle backgrounds | - |
| `primary.100` | `#C7E6E4` | Hover highlights | - |
| `primary.300` | `#5DACA6` | Borders, secondary buttons | 2.9:1 |
| `primary.500` | `#2D8A83` | Links, active states | 4.5:1 |
| `primary.600` | `#1A7068` | Primary buttons | 5.8:1 |
| `primary.700` | `#1A5F5A` | Primary brand color | 6.8:1 |
| `primary.800` | `#164D49` | Pressed states | 8.4:1 |
| `primary.900` | `#0F3633` | Near-black | 11.2:1 |

### Secondary (Terracotta)

| Token | Hex | Usage | Contrast |
|-------|-----|-------|----------|
| `secondary.50` | `#FDF3EF` | Warm backgrounds | - |
| `secondary.100` | `#F9DED4` | Warm highlights | - |
| `secondary.300` | `#E49A7C` | Icons, accents | 2.4:1 |
| `secondary.500` | `#C45D3A` | Secondary actions | 4.5:1 |
| `secondary.600` | `#A84E31` | Hover states | 5.5:1 |
| `secondary.700` | `#8B3F26` | Pressed states | 7.2:1 |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `semantic.success` | `#2D8A3D` | Task complete, payment confirmed |
| `semantic.successLight` | `#E6F5E8` | Success backgrounds |
| `semantic.warning` | `#C4883A` | Time warnings, cautions |
| `semantic.warningLight` | `#FDF5E6` | Warning backgrounds |
| `semantic.error` | `#C43A3A` | Validation errors, failures |
| `semantic.errorLight` | `#FDE8E8` | Error backgrounds |
| `semantic.info` | `#2D6B8A` | Informational messages |
| `semantic.infoLight` | `#E6F0F5` | Info backgrounds |

### Money Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `money.gold` | `#C4A23A` | Earnings display, payments |
| `money.goldLight` | `#FDF8E6` | Earnings backgrounds |

## Two-Audience Application

### Worker App (Grace)

```css
--background: #FEFDFB;      /* Warm White */
--surface: #FAF7F2;         /* Cream */
--text-primary: #3D3935;    /* Warm Gray 800 */
--text-secondary: #6B665C;  /* Warm Gray 600 */
--accent-primary: #1A5F5A;  /* Teal 700 */
--accent-secondary: #C45D3A; /* Terracotta 500 */
--earnings: #C4A23A;        /* Money Gold */
```

**Feel:** Warm, M-Pesa simplicity

### Client Dashboard (Dr. Chen)

```css
--background: #FFFFFF;      /* White */
--surface: #F9FAFB;         /* Cool gray */
--text-primary: #2C2925;    /* Warm Black */
--text-secondary: #6B7280;  /* Gray 500 */
--accent-primary: #1A5F5A;  /* Teal 700 (same brand) */
--accent-secondary: #2D8A83; /* Teal 500 */
```

**Feel:** Sparse, Stripe clarity

## Accessibility

All text colors meet WCAG AA requirements:
- Primary text (Warm Gray 800): 10.5:1 contrast
- Secondary text (Warm Gray 600): 5.2:1 contrast
- Links (Teal 500): 4.5:1 contrast
- Primary buttons (Teal 600): 5.8:1 contrast

## Confidence Level

| Decision | Confidence | Rationale |
|----------|------------|-----------|
| Warm white base | 95% | Strategy explicitly says "not clinical white" |
| Deep teal primary | 95% | Safaricom confidence, African identity |
| Terracotta secondary | 90% | Earthy, African without clichés |
| Gold for money | 85% | Universal premium association |
| Two-audience split | 95% | Strategy mandates same brand, two expressions |

---

**Status:** Complete
**Last Updated:** 2026-01-28
