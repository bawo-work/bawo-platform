# Context Management

You have limited context. Be strategic about what you read.

## Starting a New Project
Read in this order:
1. `CLAUDE.md` — your instructions
2. `playbooks/KICKOFF.md` — the sequence to follow
3. `AGENTS.md` — your role and rules
4. `DISCOVERY.md` — if exists, problem understanding
5. `REQUIREMENTS.md` — if exists, success criteria
6. `SYSTEM_PLAN.md` — architecture and milestones

## Executing Tickets
Read only what's needed:
1. `TICKETS.md` — current batch ONLY (not all batches)
2. `DESIGN.md` — relevant section for current ticket
3. Target files you're modifying
4. `docs/CONVENTIONS.md` — if unsure about style

## Designing
1. `SYSTEM_PLAN.md` — architecture context
2. `DESIGN_SYSTEM.md` — existing tokens
3. `REQUIREMENTS.md` — constraints
4. `agents/ENVIRONMENT_DESIGNER.md` — your role

## Reviewing Code
1. Git diff (focused on changes)
2. `DESIGN.md` — verify against contracts
3. `docs/ERROR_HANDLING.md` — if error handling involved
4. `docs/TEST_CONVENTIONS.md` — if tests involved

## Writing Tests
1. `docs/TEST_CONVENTIONS.md` — patterns and naming
2. Source file being tested
3. Existing test files for patterns

## QA / Edge Cases
1. `agents/QA.md` — checklist
2. `REQUIREMENTS.md` — verify completeness
3. Feature code being reviewed

---

## DON'T Bulk-Read

These waste context:
- ❌ All agent files at once
- ❌ Entire codebase upfront
- ❌ Archived tickets (unless recovering)
- ❌ All templates
- ❌ Multiple design docs simultaneously

## When You're Lost

If you lose track of where you are:
1. Read `decisions.log` — recent decisions
2. Read last archived `TICKETS_*.md` in `docs/archive/tickets/`
3. Ask CEO: "Can you summarize where we are?"
4. Document recovery in `decisions.log`

## Context Budget Rule

Before reading a file, ask:
- Do I need this for the CURRENT task?
- Is there a smaller section I can read?
- Can I ask CEO instead of reading?

Prefer: targeted reads > full file reads > bulk reads
