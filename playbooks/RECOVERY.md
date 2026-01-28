# Recovery Playbook

> When things go wrong, follow these procedures.

---

## Quick Reference

| Problem | Playbook |
|---------|----------|
| Stuck on ticket | See below |
| Verify failing | See below |
| Scope creep | See below |
| Lost context | See below |
| **Burnout** | `playbooks/BURNOUT.md` |
| **Need to pivot** | `playbooks/PIVOT.md` |

---

## Technical Recovery

When things go wrong, follow these procedures.

## Stuck on Ticket (> 10 minutes)

**Symptoms:** Can't figure out how to implement, unclear requirements

**Steps:**
1. Re-read ticket acceptance criteria carefully
2. Check DESIGN.md for missing specification
3. Check if there's a pattern in existing code
4. If still unclear: **STOP**
5. Report to CEO:
   ```
   BLOCKED on T#: <ticket>
   Issue: <what's unclear>
   Tried: <what you attempted>
   Need: <what would unblock you>
   ```
6. Do NOT guess or make assumptions

## Verify Failing

**Symptoms:** `dev verify` returns errors

**Steps:**
1. Read the FULL error message
2. Identify error type:
   - Lint error -> fix code style
   - Type error -> fix types
   - Build error -> fix imports/syntax
   - Test error -> fix test or implementation
3. If fix is obvious (< 2 min): fix it
4. If fix is complex:
   - Create a fix ticket
   - Note in current ticket: "blocked by verify, see T#"
   - Move to next ticket or stop
5. **Never** bypass verify with `--force` or skips

## Scope Creep

**Symptoms:** Realizing you need to build more than ticket specifies

**Steps:**
1. **STOP immediately**
2. Document in decisions.log:
   ```
   ## YYYY-MM-DD — Scope question
   Ticket: T#
   Issue: Discovered need for X
   Options: A) expand ticket, B) new ticket, C) skip
   Waiting: CEO decision
   ```
3. Ask CEO:
   ```
   While working on T#, I discovered we also need X.
   Options:
   A) Add to this ticket (risk: delay)
   B) Create new ticket (risk: incomplete feature)
   C) Skip for now (risk: technical debt)
   Recommendation: <your recommendation>
   ```
4. Wait for CEO response
5. **Never** silently expand scope

## Lost Context

**Symptoms:** Don't remember what we're building or where we are

**Steps:**
1. Read `decisions.log` (recent entries)
2. Read `SYSTEM_PLAN.md` (overall goal)
3. Read `TICKETS.md` (current work)
4. Check `docs/archive/tickets/` for recent completed tickets
5. If still lost, ask CEO:
   ```
   I've lost context on this project.
   I see: <what you understand>
   Unclear: <what you don't>
   Can you summarize where we are?
   ```
6. Document recovery in decisions.log

## Conflicting Instructions

**Symptoms:** Two docs say different things

**Steps:**
1. Check dates — newer usually wins
2. Check hierarchy:
   - AGENTS.md > agent-specific files
   - REQUIREMENTS.md > DESIGN.md > TICKETS.md
3. If still unclear: ask CEO
4. Document resolution in decisions.log

## Project Reset (Nuclear Option)

**When:** Project is fundamentally broken, continuing would waste time

**Steps:**
1. Get CEO approval first
2. Archive current state:
   ```
   mkdir -p logs/archive/reset-YYYYMMDD
   mv SYSTEM_PLAN.md logs/archive/reset-YYYYMMDD/
   mv DESIGN.md logs/archive/reset-YYYYMMDD/
   mv TICKETS.md logs/archive/reset-YYYYMMDD/
   ```
3. Document in decisions.log why reset happened
4. Start fresh from Discovery
5. Apply lessons learned from failed attempt

## Prevention

To avoid needing recovery:
- Read tickets fully before starting
- Ask questions BEFORE implementing
- Stop at first sign of confusion
- Keep tickets small (5-15 min)
- Commit frequently

---

## Founder-Level Recovery

Sometimes the problem isn't technical — it's you.

### Burnout Recovery

**Symptoms:**
- Dreading work you used to enjoy
- Can't focus or start tasks
- Physical/emotional exhaustion
- Everything feels urgent

**Action:**
```bash
ceo recover burnout
```

See `playbooks/BURNOUT.md` for the full protocol.

### Pivot Decision

**Symptoms:**
- No traction after months of effort
- Can't charge sustainable prices
- Repeatedly hitting the same wall
- Lost belief in the direction

**Action:**
```bash
ceo recover pivot
```

See `playbooks/PIVOT.md` for when and how to change direction.

---

## CLI

```bash
ceo recover burnout   # Burnout recovery protocol
ceo recover pivot     # Pivot decision framework
```
