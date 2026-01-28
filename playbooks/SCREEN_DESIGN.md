# Screen Design Playbook

## When to Use

Use this playbook when designing individual screens and features.

## Prerequisites

- [ ] Design system is approved (`SYSTEM_COMPLETE.md`)
- [ ] Feature list exists in REQUIREMENTS.md
- [ ] Figma MCP is configured (optional but recommended)

## Process

### Step 1: List Features

```bash
ship design screens --list
```

Shows all features that need screen design.

### Step 2: Design Each Feature

For each feature:

```bash
ship design screens [feature-name]
```

UI_DESIGNER agent follows this process:

1. **Extract requirements** -> `screens/[feature]/REQUIREMENTS.md`
2. **Map user flows** -> `screens/[feature]/FLOWS.md`
3. **Generate sample data** -> `screens/[feature]/DATA.json`
4. **Document states** -> `screens/[feature]/STATES.md`
5. **Specify screens** -> `screens/[feature]/SCREENS.md`
6. **Document edge cases** -> `screens/[feature]/EDGE_CASES.md`

### Step 3: Review Each Feature

For each feature, verify:
- [ ] All user stories are covered
- [ ] All states are documented (loading, empty, error, success)
- [ ] Sample data is realistic
- [ ] Edge cases are comprehensive
- [ ] Copy is real (not Lorem ipsum)

Approve in Claude pane:
> "Auth screens approved. Continue to dashboard."

### Step 4: Generate Visual Mockups (Optional)

If CEO wants to see visuals before approving:

```bash
ship figma code design/screens/auth/SCREENS.md
```

This generates a Figma frame from the specification.

### Step 5: Design Review

After all features are specified:

```bash
ship design review
```

DESIGN_REVIEWER agent validates:
- Consistency across screens
- Design system compliance
- Completeness of documentation
- Accessibility requirements

Generates `design/REVIEW_REPORT.md`.

### Step 6: Final Approval

Review REVIEW_REPORT.md. Fix any critical issues.

When ready:
> "All screens approved. Generate handoff."

### Step 7: Generate Handoff

```bash
ship design export
```

Generates `design/export/HANDOFF.json` for BUILD phase.

## Parallel Design

For large projects, design multiple features in parallel:

**In Claude pane:**
```
Design auth and onboarding features in parallel.
Start with auth, then immediately begin onboarding.
```

## Cost Estimates

| Item | Cost | Notes |
|------|------|-------|
| Figma mockups | $0 | Included with Figma subscription |
| Screen design | $0 | All done by AI agents |
| Total | $0 | |

## Common Issues

### "Too many screens to design"
Prioritize MVP features. Design must-haves first.

### "States are missing"
Use the checklist: loading, empty, error, success, partial, permission.

### "Sample data isn't realistic"
Look at real data from similar products. Use realistic names, numbers, dates.

### "Edge cases keep appearing"
That's good. Document them all. Better to find them now than in production.

## Next Steps

After handoff generation:
-> `playbooks/DESIGN_HANDOFF.md`
