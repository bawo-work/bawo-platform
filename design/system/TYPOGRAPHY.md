# Typography System

## Design Rationale

**Derived from brand strategy:**
- Clean, modern sans-serif
- Slightly rounded (friendly without childish)
- 16px minimum body text (mobile accessibility)
- Generous spacing for cracked Tecno screens in Nairobi sunlight

## Font Selection

### Primary: Plus Jakarta Sans

**Source:** Google Fonts (free, open source)
**License:** SIL Open Font License
**Download:** https://fonts.google.com/specimen/Plus+Jakarta+Sans

**Why Plus Jakarta Sans:**
1. Rounded terminals - warm without being childish
2. Contemporary - designed 2020, feels current
3. Excellent weight range (200-800)
4. Good x-height - readable at small sizes on mobile
5. Variable font - single file, ~25kb gzipped
6. Strong Latin extended support - handles Swahili diacritics

### Fallback Stack

```css
font-family: 'Plus Jakarta Sans', Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Monospace (Code/Metrics)

```css
font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Monaco, monospace;
```

## Type Scale

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `fontSize.xs` | 12px | 1.5 | 400 | Timestamps, fine print |
| `fontSize.sm` | 14px | 1.5 | 400 | Labels, secondary text |
| `fontSize.base` | 16px | 1.5 | 400 | Body text, inputs |
| `fontSize.lg` | 18px | 1.5 | 400 | Emphasized body |
| `fontSize.xl` | 20px | 1.4 | 500 | Section headers |
| `fontSize.2xl` | 24px | 1.3 | 600 | Page titles |
| `fontSize.3xl` | 30px | 1.25 | 600 | Hero text |
| `fontSize.4xl` | 36px | 1.2 | 700 | Marketing headlines |
| `fontSize.5xl` | 48px | 1.1 | 700 | Giant earnings display |

## Weight Usage

| Token | Value | Usage |
|-------|-------|-------|
| `fontWeight.regular` | 400 | Body text, descriptions |
| `fontWeight.medium` | 500 | Links, emphasis |
| `fontWeight.semibold` | 600 | Headings, buttons |
| `fontWeight.bold` | 700 | Headlines, earnings |

**Note:** Avoid weights below 400 - too light for mobile screens in sunlight.

## Application Examples

### Worker App (Mobile)

```css
/* Body text */
font-size: 16px;
line-height: 1.5;
font-weight: 400;
color: #3D3935;

/* Earnings amount */
font-size: 30px;
line-height: 1.25;
font-weight: 700;
color: #C4A23A;

/* Button text */
font-size: 16px;
font-weight: 600;
letter-spacing: 0.01em;
```

### Client Dashboard (Desktop)

```css
/* Body text */
font-size: 14px; /* Can be smaller on desktop */
line-height: 1.5;
font-weight: 400;

/* Page title */
font-size: 24px;
font-weight: 600;

/* Metric numbers */
font-size: 36px;
font-weight: 700;
font-feature-settings: "tnum" 1; /* Tabular numbers */
```

## Loading Strategy

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Bundle impact:** ~25kb (variable font, gzipped)

## Confidence Level

| Decision | Confidence | Rationale |
|----------|------------|-----------|
| Plus Jakarta Sans | 95% | Matches strategy perfectly, Google Fonts free |
| 16px base | 95% | Strategy requirement, mobile best practice |
| Variable font | 90% | Modern approach, smaller bundle |
| Weight range 400-700 | 90% | Covers all use cases |
| No display font | 95% | One font is sufficient for MVP |

---

**Status:** Complete
**Last Updated:** 2026-01-28
