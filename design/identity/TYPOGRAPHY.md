# Typography — Bawo

## Design Rationale

**Derived from brand strategy:**
- Clean, modern sans-serif
- Slightly rounded (friendly without being childish)
- Inter, Plus Jakarta Sans, or similar
- Generous spacing — readable on cracked Tecno screen in Nairobi sunlight
- 16px minimum body text

**Constraints:**
- Must work across cheap Android devices
- Must be readable in poor lighting conditions
- Must look credible to both Grace (mobile worker) and Dr. Chen (technical client)
- Must have good internationalization support (African language characters)

## Font Selection

### Primary: Plus Jakarta Sans

**Source:** Google Fonts (free, open source)
**License:** SIL Open Font License
**Download:** https://fonts.google.com/specimen/Plus+Jakarta+Sans

**Why Plus Jakarta Sans:**
1. **Rounded terminals** — Friendly without being childish (exactly what strategy requests)
2. **Contemporary** — Designed 2020, feels current not dated
3. **Excellent weight range** — 200-800 provides hierarchy flexibility
4. **Good x-height** — Readable at small sizes on mobile
5. **Open source** — No licensing concerns
6. **Variable font** — Single file, smaller payload (~25kb)
7. **Strong Latin extended support** — Handles diacritics for Swahili

**Comparison:**
| Attribute | Plus Jakarta Sans | Inter | Reason for choice |
|-----------|-------------------|-------|-------------------|
| Warmth | Warmer | Neutral | Strategy asks for "friendly" |
| Roundness | Slightly rounded | Geometric | Avoids coldness |
| Personality | Approachable | Swiss precision | Better for Grace |
| Technical credibility | High | Very high | Both acceptable for Dr. Chen |

### Fallback Stack

```css
font-family: 'Plus Jakarta Sans', Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Why this order:**
1. **Plus Jakarta Sans** — Primary brand font
2. **Inter** — Closest match if primary fails (may be pre-installed)
3. **system-ui** — Native system font (fast, familiar)
4. **-apple-system** — macOS/iOS system font
5. **BlinkMacSystemFont** — Chrome on macOS
6. **Segoe UI** — Windows system font
7. **sans-serif** — Final fallback

## Type Scale

**Base:** 16px (1rem) — prevents iOS zoom on input focus

### Scale Values

| Name | Size | Line Height | Weight | Use Case |
|------|------|-------------|--------|----------|
| **xs** | 12px | 1.5 (18px) | 400 | Fine print, timestamps |
| **sm** | 14px | 1.5 (21px) | 400 | Secondary text, labels |
| **base** | 16px | 1.5 (24px) | 400 | Body text, inputs |
| **lg** | 18px | 1.5 (27px) | 400 | Emphasized body |
| **xl** | 20px | 1.4 (28px) | 500 | Section headers |
| **2xl** | 24px | 1.3 (31px) | 600 | Page titles, earnings display |
| **3xl** | 30px | 1.25 (38px) | 600 | Hero text |
| **4xl** | 36px | 1.2 (43px) | 700 | Marketing headlines |
| **5xl** | 48px | 1.1 (53px) | 700 | Giant numbers (large earnings) |

**Rationale:**
- Tighter line height on larger text (looks better)
- 1.5 line height on body (accessibility)
- Weight increases with size (visual hierarchy)

## Weight Usage

| Weight | Name | Usage |
|--------|------|-------|
| 400 | Regular | Body text, descriptions |
| 500 | Medium | Emphasis within body, links |
| 600 | SemiBold | Headings, buttons, labels |
| 700 | Bold | Headlines, earnings amounts |

**Note:** Avoid weights below 400 (too light for mobile screens in sunlight).

## Application

### Worker App (Mobile)

```css
/* Body text */
font-size: 16px;
line-height: 1.5;
font-weight: 400;
color: #3D3935; /* Warm Gray 800 */

/* Earnings amount */
font-size: 30px;
line-height: 1.25;
font-weight: 700;
color: #C4A23A; /* Money Gold */

/* Task card title */
font-size: 16px;
line-height: 1.4;
font-weight: 600;
color: #2C2925; /* Warm Black */

/* Button text */
font-size: 16px;
font-weight: 600;
letter-spacing: 0.01em; /* Very subtle */
```

### Client Dashboard (Desktop)

```css
/* Body text */
font-size: 14px; /* Can be smaller on desktop */
line-height: 1.5;
font-weight: 400;
color: #374151; /* Standard gray */

/* Page title */
font-size: 24px;
line-height: 1.3;
font-weight: 600;
color: #111827;

/* Metric numbers */
font-size: 36px;
line-height: 1.2;
font-weight: 700;
font-feature-settings: "tnum" 1; /* Tabular numbers */
```

## Special Cases

### Monospace (Code/Metrics)

For API documentation and technical content:

```css
font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Monaco, monospace;
```

### Tabular Numbers

For tables, metrics, and financial displays:

```css
font-feature-settings: "tnum" 1;
```

This ensures numbers align vertically (useful for earnings history).

## Loading Strategy

**Implementation:**
1. Preload variable font file
2. Font-display: swap (show system font immediately, swap when loaded)
3. Load only Latin + Latin Extended subsets (covers Swahili)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Bundle impact:** ~25kb (variable font, gzipped)

## Confidence Level

| Decision | Confidence | Rationale |
|----------|------------|-----------|
| Plus Jakarta Sans | 90% | Matches strategy perfectly. Alternative: Inter (more neutral, equally good). |
| 16px base | 95% | Strategy explicitly requires this. Standard mobile best practice. |
| Variable font | 85% | Modern approach, smaller bundle. Fallback to static weights if issues. |
| Weight range 400-700 | 90% | Covers all use cases without bloat. |
| No display font | 95% | Strategy says "1-2 fonts." One is sufficient for MVP. |

---

**Status:** Proposed
**Last Updated:** 2026-01-28
