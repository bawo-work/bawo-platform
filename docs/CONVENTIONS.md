# Conventions

## File naming
- Components: PascalCase `.tsx`
- Hooks: `useX.ts`
- No JSX in `.ts` files (use `.tsx`)

## Dependencies
- No new deps without CEO approval

## Tickets
- Keep tickets small (5–15 min each)
- Max 2–3 per batch before reporting
- Commit after each batch to keep changes readable
- After completion, archive `logs/verify.log` into `logs/archive/` and ticket snapshots into `docs/archive/tickets/`

## Commits

Format: `<type>(<scope>): <subject>`

### Types
| Type | Use for |
|------|---------|
| feat | New feature or capability |
| fix | Bug fix |
| refactor | Code change that doesn't add feature or fix bug |
| chore | Maintenance (deps, scripts, config) |
| docs | Documentation only |
| test | Adding or updating tests |

### Scope (optional)
Area of change: `agents`, `cli`, `docs`, `scripts`, `templates`

### Subject
- Imperative mood ("add" not "added")
- Lowercase
- No period at end
- Max 50 chars

### Examples
```
feat(agents): add reviewer agent definition
fix(cli): handle missing project directory
chore(deps): update node to v20
docs: expand GOLDEN_PATH with observables
refactor(scripts): extract verify gates into functions
```

### Multi-ticket commits
When committing a batch: `feat(agents): add planner + builder agents (T2, T3)`
