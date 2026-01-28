# Design Handoff Playbook

## When to Use

Use this playbook when handing off design to the BUILD phase.

## Prerequisites

- [ ] All screens designed and approved
- [ ] HANDOFF.json generated and validated
- [ ] No critical issues in REVIEW_REPORT.md

## Process

### Step 1: Validate Handoff

```bash
ship design export --validate
```

Checks:
- All file paths resolve
- All features are included
- JSON is valid against schema

### Step 2: Review Implementation Order

Open `design/export/HANDOFF.json` and verify `implementationOrder` makes sense:

- Dependencies respected?
- MVP features first?
- Rationale documented?

### Step 3: Generate Implementation Notes

If not already done:

```bash
ship design export --notes
```

Creates `design/export/IMPLEMENTATION.md` with:
- Technical considerations
- Third-party dependencies
- Performance considerations
- Accessibility requirements

### Step 4: Brief the BUILD Phase

In Claude pane:
```
Design handoff complete. Codex should:
1. Read design/export/HANDOFF.json for implementation order
2. Read design/system/tokens/tokens.json for design tokens
3. Read design/system/COMPONENTS.md for component contracts
4. Read individual screen specs as needed

Start with Phase 1 features: [list from HANDOFF.json]
```

### Step 5: Monitor Implementation

During BUILD:

```bash
ship design audit
```

Checks implemented code against design specifications.

Reports:
- Token usage (are tokens being used correctly?)
- Component compliance (do components match contracts?)
- Visual accuracy (if Figma mockups exist)

### Step 6: Handle Design Changes

If changes are needed during BUILD:

1. Update the relevant design file
2. Run `ship design export` to regenerate handoff
3. Note changes in CHANGELOG.md
4. Brief Codex on changes

**Never** make design decisions during BUILD without updating documentation.

## Common Issues

### "Codex isn't following the design"
Check that HANDOFF.json is being read. Remind:
> "Before implementing [feature], read design/screens/[feature]/SCREENS.md"

### "Design needs to change"
That's okay. Update docs, regenerate handoff, brief Codex.

### "Implementation is slower than expected"
Design complexity affects build time. Simplify where possible.

## Maintenance

After initial build:

1. Keep design docs updated as product evolves
2. Run `ship design audit` periodically
3. Update tokens when design system changes
4. Add new screens as features are added

## Next Steps

BUILD phase begins. See `playbooks/PARALLEL.md` for parallel execution.
