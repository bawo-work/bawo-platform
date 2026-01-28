# Brand Creation Playbook

## When to Use

Use this playbook when creating a new brand identity from scratch or doing a rebrand.

## Prerequisites

- [ ] `design/strategy/STRATEGY_COMPLETE.md` is approved
- [ ] CEO is available for moodboard review
- [ ] Image Gen MCP is configured (for moodboards)
- [ ] Vector Gen MCP is configured (for logo, optional)

## Process

### Step 1: Generate Moodboards

```bash
ship design identity moodboard
```

VISUAL_DESIGNER agent creates 2-3 distinct visual directions based on personality.

**What's generated:**
- `design/identity/MOODBOARDS/direction_1/` - Images, rationale
- `design/identity/MOODBOARDS/direction_2/` - Images, rationale
- `design/identity/MOODBOARDS/direction_3/` - Images, rationale

**Time required:** 30-60 minutes (mostly AI generation time)

### Step 2: Review Moodboards

In Claude pane, agent presents each direction with:
- Name and description
- Visual samples
- Color palette direction
- Typography direction
- Rationale connecting to strategy

**CEO action:** Select one direction, or describe a hybrid.

### Step 3: Logo Development

```bash
ship design identity logo
```

**With Vector Gen MCP:**
Agent generates 5-10 logo concepts using Recraft or similar.

**Without Vector Gen MCP:**
Agent creates detailed logo brief for external designer or manual creation.

**What's generated:**
- `design/identity/LOGO.md` - Logo specifications, usage rules
- `design/assets/logo/` - Logo files (if generated)

### Step 4: Voice Development

```bash
ship design identity voice
```

Agent creates verbal identity guidelines based on personality.

**What's generated:**
- `design/identity/VOICE.md` - Tone, vocabulary, examples

### Step 5: Identity Sign-off

Review complete identity:
- Moodboard direction
- Logo (or logo brief)
- Voice guidelines

If satisfactory:
> "Identity approved. Proceed to design system."

Agent creates `design/identity/IDENTITY_COMPLETE.md`.

## Cost Estimates

| Item | Cost | Notes |
|------|------|-------|
| Moodboard generation | $2-5 | ~20-50 images via Replicate |
| Logo exploration | $0-20 | $0 if using brief, $20 if using Recraft |
| Total | $2-25 | Per project |

## Common Issues

### "Moodboards all look the same"
Ask agent to push further:
> "These all feel safe. Give me one direction that's more bold/unusual/distinctive."

### "Logo concepts aren't working"
Consider hiring a human designer for logo. AI is good at exploration but may not produce final-quality logomarks.

### "Voice guidelines feel generic"
Provide real examples:
> "Here's how we actually talk to customers: [paste examples]"

## Next Steps

After identity approval:
-> `playbooks/DESIGN_SYSTEM.md`
