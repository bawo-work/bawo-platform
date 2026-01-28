# Component Inventory

## Design Rationale

**Derived from brand strategy:**
- Mobile-first components
- 48px minimum touch targets
- Warm, not cold - uses cream/warm white backgrounds
- Accessible - WCAG AA compliant
- Simple - no unnecessary complexity

**Implementation:** Tailwind CSS + shadcn/ui components

## Core Components

### Button

**Purpose:** Primary interactive element for actions

**Variants:**

| Variant | Background | Text | Usage |
|---------|------------|------|-------|
| Primary | Teal 600 (#1A7068) | White | Primary actions: "Submit", "Withdraw" |
| Secondary | Transparent | Teal 700 | Secondary actions: "Skip", "Cancel" |
| Ghost | Transparent | Warm Gray 800 | Tertiary actions: links |
| Destructive | Error (#C43A3A) | White | Destructive: "Log out" (rare) |

**States:**
- Default: Base styling
- Hover: Teal 700 (primary), Teal 50 background (secondary)
- Active/Pressed: Teal 800, scale 98%
- Disabled: Sand background, Warm Gray 400 text
- Loading: Spinner replaces text

**Sizes:**
| Size | Padding | Height | Font |
|------|---------|--------|------|
| sm | 8px 12px | 36px | 14px |
| md | 12px 16px | 48px | 16px (default) |
| lg | 16px 24px | 56px | 18px |

**Accessibility:**
- Minimum 48px height for touch
- 4.5:1 contrast ratio
- Focus ring: 2px Teal 700

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}
```

---

### Input

**Purpose:** Text entry fields

**Variants:**
| Variant | Usage |
|---------|-------|
| Text | Standard text input |
| Number | Numeric input (withdrawal amounts) |
| Search | Search with icon |

**States:**
- Default: Sand border, Cream background
- Focus: Teal 700 border (2px), Teal 50 background
- Error: Error border, Error Light background
- Disabled: Sand background, muted

**Sizes:**
| Size | Padding | Height | Font |
|------|---------|--------|------|
| md | 10px 12px | 48px | 16px |

**Accessibility:**
- Minimum 48px height
- Associated label required
- Error messages announced

```tsx
interface InputProps {
  type: 'text' | 'number' | 'email';
  label: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}
```

---

### Card

**Purpose:** Container for grouped content

**Variants:**
| Variant | Background | Border | Usage |
|---------|------------|--------|-------|
| Default | Cream | Sand | Task cards, content containers |
| Elevated | Cream | Shadow sm | Highlighted content |
| Interactive | Cream | Sand | Clickable cards (task list) |

**States (Interactive):**
- Default: Base styling
- Hover: Shadow md, slight scale
- Active: Shadow xs, scale 99%

**Spacing:**
- Padding: 16px (mobile), 24px (desktop)
- Border radius: 8px (lg)

```tsx
interface CardProps {
  variant: 'default' | 'elevated' | 'interactive';
  onClick?: () => void;
  children: React.ReactNode;
}
```

---

### TaskCard

**Purpose:** Display available task in dashboard

**Content:**
- Task type icon (left)
- Task description (center)
- Pay amount (right, Money Gold)
- Time estimate (muted)

**States:**
- Default: Cream card
- Hover: Elevated shadow
- Loading: Skeleton
- Disabled: Grayed, "Coming Soon" badge

```tsx
interface TaskCardProps {
  taskType: 'sentiment' | 'classification';
  description: string;
  payAmount: number;
  timeLimit: number;
  disabled?: boolean;
  onStart: () => void;
}
```

---

### SentimentSelector

**Purpose:** Select sentiment for text classification

**Content:**
- Three equal-width buttons: Positive / Negative / Neutral
- Horizontal row layout

**States:**
- Default: Outlined buttons
- Hover: Teal 50 background
- Selected: Teal 600 fill, white text, checkmark
- Other options: Dimmed when one selected

**Accessibility:**
- Radio button group semantically
- Keyboard navigable
- Selection announced

```tsx
interface SentimentSelectorProps {
  value: 'positive' | 'negative' | 'neutral' | null;
  onChange: (value: 'positive' | 'negative' | 'neutral') => void;
  disabled?: boolean;
}
```

---

### Timer

**Purpose:** Countdown for task time limit

**Visual:**
- Circular progress indicator
- Time remaining in center (0:45)
- Color changes at thresholds

**States:**
| Time Remaining | Color | Animation |
|----------------|-------|-----------|
| > 10s | Teal 500 | None |
| 5-10s | Warning | None |
| < 5s | Error | Pulse |
| 0s | Error | Stopped |

```tsx
interface TimerProps {
  seconds: number;
  onExpire: () => void;
}
```

---

### EarningsDisplay

**Purpose:** Show current balance prominently

**Visual:**
- Large amount (3xl, Bold, Money Gold)
- "cUSD" label (sm, muted) - hidden in UI, show "$" only
- Pulse animation on update

**States:**
- Default: Static display
- Updating: Brief pulse
- Loading: Skeleton

```tsx
interface EarningsDisplayProps {
  amount: number;
  loading?: boolean;
  updating?: boolean;
}
```

---

### Toast

**Purpose:** Brief notification messages

**Variants:**
| Variant | Icon | Background | Usage |
|---------|------|------------|-------|
| Success | Checkmark | Success Light | "Earned $0.05" |
| Error | X | Error Light | "Couldn't connect" |
| Info | Info | Info Light | Neutral messages |

**Behavior:**
- Appears from bottom (mobile)
- Auto-dismiss after 3s
- Swipe to dismiss

```tsx
interface ToastProps {
  variant: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}
```

---

### BottomNav

**Purpose:** Primary navigation for worker app

**Items:**
- Home (task dashboard)
- Earnings
- Profile
- (Leaderboard - post-MVP)

**States:**
- Default: Warm Gray 600 icon
- Active: Teal 700 icon + text

**Spacing:**
- Height: 56px + safe area inset
- Touch targets: 48px minimum

```tsx
interface BottomNavProps {
  activeItem: 'home' | 'earnings' | 'profile';
}
```

---

### Modal

**Purpose:** Overlay for focused interactions

**Visual:**
- Backdrop: rgba(44, 41, 37, 0.5)
- Content: Cream background
- Border radius: 16px (2xl)
- Max width: 400px (mobile full-width)

**Behavior:**
- Trap focus
- ESC to close
- Tap backdrop to close (optional)

```tsx
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}
```

---

### Skeleton

**Purpose:** Loading placeholder

**Visual:**
- Sand background
- Pulse animation
- Matches content shape

```tsx
interface SkeletonProps {
  variant: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}
```

---

## Client Dashboard Components

### Sidebar

**Purpose:** Navigation for client dashboard

**Content:**
- Logo (top)
- Nav items: Dashboard, Projects, Deposit, API Docs, Settings
- User menu (bottom)

**States:**
- Collapsed: Icons only (tablet)
- Expanded: Icons + labels (desktop)

---

### DataTable

**Purpose:** Display tabular data (projects, transactions)

**Features:**
- Sortable columns
- Row selection
- Pagination
- Loading state

---

### MetricCard

**Purpose:** Display key metrics on dashboard

**Content:**
- Label (sm, muted)
- Value (4xl, bold)
- Trend indicator (optional)

---

## Confidence Level

| Component | Confidence | Rationale |
|-----------|------------|-----------|
| Button | 95% | Standard component, well-defined in DESIGN.md |
| Input | 95% | Standard component |
| Card | 95% | Standard component |
| TaskCard | 90% | Derived from DESIGN.md task flow |
| SentimentSelector | 90% | Derived from DESIGN.md component spec |
| Timer | 85% | Derived from DESIGN.md, may need refinement |
| EarningsDisplay | 90% | Core to worker experience |
| Toast | 90% | Standard notification pattern |
| BottomNav | 95% | Standard mobile pattern |

---

**Status:** Complete
**Last Updated:** 2026-01-28
