# Spacing System

## Design Rationale

**Derived from brand strategy:**
- Generous spacing - readable on cracked Tecno screens
- Mobile-first - touch targets 48px minimum
- Simple - no visual clutter

**Base unit:** 4px (0.25rem)

## Spacing Scale

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `spacing.0` | 0 | 0px | No spacing |
| `spacing.px` | 1px | 1px | Hairline borders |
| `spacing.0.5` | 0.125rem | 2px | Micro spacing |
| `spacing.1` | 0.25rem | 4px | Base unit |
| `spacing.2` | 0.5rem | 8px | Tight spacing |
| `spacing.3` | 0.75rem | 12px | Compact spacing |
| `spacing.4` | 1rem | 16px | Standard spacing |
| `spacing.5` | 1.25rem | 20px | Comfortable spacing |
| `spacing.6` | 1.5rem | 24px | Generous spacing |
| `spacing.8` | 2rem | 32px | Section spacing |
| `spacing.10` | 2.5rem | 40px | Large gaps |
| `spacing.12` | 3rem | 48px | Major sections |
| `spacing.16` | 4rem | 64px | Page sections |
| `spacing.20` | 5rem | 80px | Hero spacing |
| `spacing.24` | 6rem | 96px | Extra large |

## Component Spacing

| Token | Value | Usage |
|-------|-------|-------|
| Button padding X | 16px | Horizontal button padding |
| Button padding Y | 12px | Vertical button padding |
| Input padding X | 12px | Horizontal input padding |
| Input padding Y | 10px | Vertical input padding |
| Card padding (mobile) | 16px | Card content padding |
| Card padding (desktop) | 24px | Card content padding |
| Stack gap | 16px | Gap between stacked items |
| Section gap | 32px | Gap between sections |

## Touch Targets

Per brand strategy - larger than Apple minimum for "thick fingers":

| Token | Value | Usage |
|-------|-------|-------|
| Minimum | 44px | Apple standard |
| Recommended | 48px | Bawo standard |

All interactive elements (buttons, inputs, links) must have minimum 48x48px tap area.

## Application

### Worker App (Mobile)

```css
/* Card */
.card {
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
}

/* Button */
.button {
  padding: 12px 16px;
  min-height: 48px;
}

/* Input */
.input {
  padding: 10px 12px;
  min-height: 48px;
}

/* Screen padding */
.screen {
  padding: 16px;
}
```

### Client Dashboard (Desktop)

```css
/* Card */
.card {
  padding: 24px;
  margin-bottom: 24px;
}

/* Section */
.section {
  margin-bottom: 32px;
}
```

## Confidence Level

| Decision | Confidence | Rationale |
|----------|------------|-----------|
| 4px base unit | 95% | Industry standard, works with 8px grid |
| 48px touch targets | 95% | Strategy explicitly requests larger targets |
| 16px screen padding | 90% | Mobile standard, not cramped |
| Generous spacing | 90% | Strategy emphasizes readability |

---

**Status:** Complete
**Last Updated:** 2026-01-28
