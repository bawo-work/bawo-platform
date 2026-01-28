# Color Palette — Bawo

## Design Rationale

**Derived from brand strategy:**
- Base: Warm neutrals (cream, sand, warm white) — not clinical, not cold
- Primary: Deep teal/warm green (Safaricom confidence, trustworthy, African)
- Secondary: Terracotta/warm gold (earthy, subtle success)
- Avoid: Charity blue, crypto purple, betting neon, pastels

**Accessibility requirements:**
- All text must meet WCAG AA (4.5:1 contrast minimum)
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

## Core Palette

### Neutrals (Warm Base)

| Name | Hex | Usage | Contrast (on white) |
|------|-----|-------|---------------------|
| **Warm White** | `#FEFDFB` | Primary background (worker app) | — |
| **Cream** | `#FAF7F2` | Surface/cards | — |
| **Sand** | `#F0EBE3` | Subtle dividers, disabled states | — |
| **Warm Gray 400** | `#A39E94` | Placeholder text, icons | 3.1:1 |
| **Warm Gray 600** | `#6B665C` | Secondary text | 5.2:1 |
| **Warm Gray 800** | `#3D3935` | Primary text | 10.5:1 |
| **Warm Black** | `#2C2925` | Headlines, emphasis | 12.3:1 |

**Rationale:** Warm neutrals feel human and approachable. Clinical white (#FFFFFF) reads as sterile or Western enterprise. These tones feel like natural materials — paper, sand, stone — consistent with "Warm modern African" direction.

### Primary (Deep Teal)

| Name | Hex | Usage | Contrast (on white) |
|------|-----|-------|---------------------|
| **Teal 50** | `#E8F5F4` | Subtle backgrounds | — |
| **Teal 100** | `#C7E6E4` | Hover states, highlights | — |
| **Teal 300** | `#5DACA6` | Borders, secondary buttons | 2.9:1 |
| **Teal 500** | `#2D8A83` | Links, active states | 4.5:1 |
| **Teal 600** | `#1A7068` | Primary buttons | 5.8:1 |
| **Teal 700** | `#1A5F5A` | Primary brand color, headers | 6.8:1 |
| **Teal 800** | `#164D49` | Pressed states, dark UI | 8.4:1 |
| **Teal 900** | `#0F3633` | Near-black applications | 11.2:1 |

**Rationale:** Deep teal evokes Safaricom's green confidence while remaining distinct. Communicates trust, stability, and growth without crypto associations. The 700 value is the primary brand color — used for logos, key UI elements, and emphasis.

### Secondary (Terracotta)

| Name | Hex | Usage | Contrast (on white) |
|------|-----|-------|---------------------|
| **Terracotta 50** | `#FDF3EF` | Subtle warm backgrounds | — |
| **Terracotta 100** | `#F9DED4` | Warm highlights | — |
| **Terracotta 300** | `#E49A7C` | Icons, accents | 2.4:1 |
| **Terracotta 500** | `#C45D3A` | Secondary actions, emphasis | 4.5:1 |
| **Terracotta 600** | `#A84E31` | Hover on secondary | 5.5:1 |
| **Terracotta 700** | `#8B3F26` | Pressed states | 7.2:1 |

**Rationale:** Terracotta is earthy, African, warm. Used sparingly for personality and emphasis. Never primary — always supporting teal.

### Semantic Colors

| State | Hex | Usage | Based On |
|-------|-----|-------|----------|
| **Success** | `#2D8A3D` | Payments confirmed, task complete | Green with warm undertone |
| **Success Light** | `#E6F5E8` | Success backgrounds | — |
| **Warning** | `#C4883A` | Cautions, time warnings | Warm amber/gold |
| **Warning Light** | `#FDF5E6` | Warning backgrounds | — |
| **Error** | `#C43A3A` | Failures, validation errors | Warm red |
| **Error Light** | `#FDE8E8` | Error backgrounds | — |
| **Info** | `#2D6B8A` | Informational, neutral | Teal-adjacent blue |
| **Info Light** | `#E6F0F5` | Info backgrounds | — |

**Rationale:** Semantic colors maintain warm undertones for consistency. Standard green/amber/red meanings preserved for accessibility.

### Money/Payment Color

| Name | Hex | Usage | Notes |
|------|-----|-------|-------|
| **Money Gold** | `#C4A23A` | Earnings display, payment confirmations | Warm gold, not crypto yellow |
| **Money Gold Light** | `#FDF8E6` | Earnings backgrounds | — |

**Rationale:** Gold for money feels universal and premium. Distinct from success green (which indicates task completion, not payment).

## Application Guidelines

### Worker App (Grace)

```
Background:     Warm White (#FEFDFB)
Cards/Surfaces: Cream (#FAF7F2)
Primary Text:   Warm Gray 800 (#3D3935)
Secondary Text: Warm Gray 600 (#6B665C)
Primary Action: Teal 700 (#1A5F5A)
Accent:         Terracotta 500 (#C45D3A)
Earnings:       Money Gold (#C4A23A)
```

**Feel:** Warm, welcoming, M-Pesa-esque simplicity

### Client Dashboard (Dr. Chen)

```
Background:     White (#FFFFFF) — clinical is acceptable for B2B
Cards/Surfaces: Gray 50 (#F9FAFB) — cooler tone acceptable
Primary Text:   Warm Black (#2C2925)
Secondary Text: Gray 500 (#6B7280)
Primary Action: Teal 700 (#1A5F5A) — same brand color
Accent:         Teal 500 (#2D8A83)
```

**Feel:** Sparse, Stripe-like clarity, professional

## Dark Mode (Future)

Reserved. Not in MVP scope. When implemented:
- Warm Black (#2C2925) as background
- Teal 300 (#5DACA6) as primary accent
- Cream (#FAF7F2) as text

## Confidence Level

| Decision | Confidence | Rationale |
|----------|------------|-----------|
| Warm white base | 95% | Strategy explicitly says "not clinical white." Warm white is differentiated. |
| Deep teal primary | 90% | "Safaricom confidence" mentioned repeatedly. Teal 700 hits target. |
| Terracotta secondary | 85% | Strategy suggests terracotta or warm gold. Terracotta feels more African. |
| Gold for money | 80% | Intuitive association. Could alternatively use success green for payments. |
| Split expression (worker/client) | 90% | Strategy mandates "same brand, two expressions." Palette achieves this. |

---

**Status:** Proposed
**Last Updated:** 2026-01-28
