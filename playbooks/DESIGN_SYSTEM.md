# Design System Playbook

## When to Use

Use this playbook when creating the design token system and component library.

## Prerequisites

- [ ] Strategy is approved (`STRATEGY_COMPLETE.md`)
- [ ] Identity is approved (if applicable) (`IDENTITY_COMPLETE.md`)
- [ ] Figma MCP is configured (optional but recommended)

## Process

### Step 1: Start System Design

```bash
ship design system
```

VISUAL_DESIGNER agent begins systematic token definition.

### Step 2: Colors

Agent defines color system:

```bash
ship design system colors
```

**Process:**
1. Agent proposes primary color based on identity/strategy
2. Agent builds neutral scale
3. Agent defines semantic colors
4. Agent validates accessibility
5. CEO reviews and approves

**What's generated:**
- `design/system/tokens/colors.json`
- `design/system/COLORS.md`

**Accessibility check:**
```bash
ship design validate --check accessibility
```

### Step 3: Typography

```bash
ship design system typography
```

**Process:**
1. Agent proposes fonts based on personality
2. Agent defines type scale (modular scale)
3. Agent documents font acquisition
4. CEO reviews and approves

**What's generated:**
- `design/system/tokens/typography.json`
- `design/system/TYPOGRAPHY.md`

### Step 4: Spacing, Elevation, Motion

```bash
ship design system spacing
```

Agent defines remaining tokens. These are usually less controversial and can be approved together.

**What's generated:**
- `design/system/tokens/spacing.json`
- `design/system/tokens/elevation.json`
- `design/system/tokens/motion.json`
- `design/system/SPACING.md`

### Step 5: Component Inventory

```bash
ship design system components
```

Agent defines all required components based on REQUIREMENTS.md.

**What's generated:**
- `design/system/COMPONENTS.md`
- `design/system/PATTERNS.md`

### Step 6: Export Tokens

```bash
ship design system tokens
```

Combines all token files into `design/system/tokens/tokens.json`.

### Step 7: Push to Figma (Optional)

If using Figma:

```bash
ship figma push --tokens
```

This creates Figma variables from your tokens.

### Step 8: System Sign-off

Review complete system:
- Color palette with rationale
- Typography with font sources
- Spacing scale
- Component inventory

If satisfactory:
> "System approved. Proceed to screen design."

Agent creates `design/system/SYSTEM_COMPLETE.md`.

## Figma Integration

### Pulling from Existing Figma

If you have an existing Figma design system:

```bash
ship figma pull <figma-url> --tokens
```

This extracts tokens and converts to our format.

### Two-Way Sync

After initial push, keep tokens in sync:

```bash
ship figma sync
```

## Cost Estimates

| Item | Cost | Notes |
|------|------|-------|
| Figma MCP | $0 | Included with Figma subscription |
| Font licensing | $0-500 | Depends on font choice |
| Total | $0-500 | Most projects use free fonts |

## Common Issues

### "Colors don't feel right"
Start with strategy. What emotion should color evoke?
Then explore: warm vs cool, saturated vs muted, dark vs light.

### "Type scale doesn't work"
Check the ratio. 1.25 (Major Third) is safe. 1.333 (Perfect Fourth) is more dramatic.

### "Component list is overwhelming"
Start with what's needed for MVP. Add components as needed.

## Next Steps

After system approval:
-> `playbooks/SCREEN_DESIGN.md`
