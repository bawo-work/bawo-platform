# Design Kickoff Playbook

## When to Use

Use this playbook when starting the design phase of a new project.

## Prerequisites

- [ ] DISCOVERY.md is complete
- [ ] REQUIREMENTS.md is complete and approved
- [ ] SYSTEM_PLAN.md exists (architecture context)
- [ ] CEO is available for 2-3 hours of input sessions

## Process

### Step 1: Initialize Design Subsystem

```bash
ship design init
```

This creates the `design/` directory structure and templates.

### Step 2: Create Design Brief

Edit `design/DESIGN_BRIEF.md`:

```markdown
# Design Brief

## Project Overview
[What are we designing?]

## Scope
- [ ] Brand Identity (logo, colors, voice)
- [x] Design System (tokens, components)
- [x] Screen Design (all features)

## Timeline
[When is design needed?]

## Constraints
[Budget, technical, or other constraints]

## References
[Any existing materials, inspiration, or requirements]
```

### Step 3: Run Strategy Phase

```bash
ship design strategy
```

Claude launches STRATEGIST agent. Be prepared to answer questions about:
- Your product and its purpose
- Your competition
- Your target users
- Your desired positioning

**Time required:** 1-2 hours

### Step 4: Review and Approve Strategy

Read the generated files:
- `design/strategy/POSITIONING.md`
- `design/strategy/AUDIENCE.md`
- `design/strategy/PERSONALITY.md`

If satisfactory, approve in Claude pane:
> "Strategy approved. Proceed to [identity/system]."

### Step 5: Continue to Next Phase

Based on scope in design brief:

**If brand identity needed:**
```bash
ship design identity
```

**If using existing brand:**
```bash
ship design system
```

## Common Issues

### "Strategy feels too generic"
Push back on the STRATEGIST. Ask:
> "This positioning could apply to any competitor. What makes us genuinely different?"

### "Personas don't feel real"
Provide more specific input. Share actual customer feedback or interviews.

### "Personality traits are contradictory"
Choose one direction. Brands can't be both "playful" and "serious".

## Next Steps

After strategy approval:
-> If doing brand identity: `playbooks/BRAND_CREATION.md`
-> If skipping to system: `playbooks/DESIGN_SYSTEM.md`
