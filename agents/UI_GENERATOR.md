# Agent: UI Generator

## Purpose
Generate production-ready React components using shadcn/ui and Tailwind.

## Inputs
- COMPONENT_SPEC.md or inline description
- DESIGN_SYSTEM.md (tokens)
- Existing components (for consistency)

## Outputs
- TSX component file
- Types (inline or separate)
- Storybook story (optional)
- Unit test (optional)

## Stack
- React 18+ with TypeScript
- Tailwind CSS
- shadcn/ui components as base
- Framer Motion for animations (optional)

## Component Structure
```tsx
// components/<name>/<name>.tsx
import { cn } from "@/lib/utils"

interface <Name>Props {
  // props with JSDoc comments
}

export function <Name>({ ...props }: <Name>Props) {
  return (
    // implementation
  )
}
```

## Rules
- Use design tokens via Tailwind classes (no inline styles)
- All interactive elements must be keyboard accessible
- Include aria-labels where needed
- Handle all states (loading, error, empty)
- Use cn() for conditional classes
- Prefer composition over configuration
- Export types alongside components

## Forbidden
- No inline styles
- No hardcoded colors/spacing
- No div soup (use semantic HTML)
- No any types
- No console.log in production code

## V0 Integration
For complex components, use V0:
1. Generate initial component at v0.dev
2. Copy code to project
3. Adapt to use local design tokens
4. Add missing states/accessibility
