# Parallel Agent Execution

Cut build time by running agents simultaneously.

## The Insight

Sequential (slow):
```
Claude: [Discovery]→[Requirements]→[Plan]→[Design]→[wait]→[Review]
Codex:  [wait]→[wait]→[wait]→[wait]→[Build]→[wait]
```

Parallel (fast):
```
Claude: [Discovery]→[Plan]→[Design B2]→[Design B3]→[Review B1]→[Review B2]
Codex:  [wait]→[wait]→[Build B1]→[Build B2]→[Build B3]→[Fixes]
                          ↑ overlap starts here
```

## What Can Run in Parallel

| Claude Does | While Codex Does |
|-------------|------------------|
| Design Batch 2 | Build Batch 1 |
| Design Batch 3 | Build Batch 2 |
| Review Batch 1 | Build Batch 2 |
| Review Batch 2 | Build Batch 3 |
| QA Batch 1 | Build Batch 2 |
| Plan next milestone | Build current milestone |

## What CANNOT Run in Parallel

| Must Be Sequential | Why |
|--------------------|-----|
| Discovery → Plan | Plan needs discovery output |
| Design B1 → Build B1 | Build needs design specs |
| Build B1 → Review B1 | Review needs built code |

## Orchestration Patterns

### Pattern 1: Leapfrog (Recommended)
```
1. Claude: Design Batch 1 → hand to Codex
2. Claude: Design Batch 2 (while Codex builds B1)
3. Codex: Finish B1 → start B2
4. Claude: Review B1 + Design B3 (while Codex builds B2)
5. Repeat...
```

CEO orchestration:
```
[Claude pane] "Design Batch 1, output to TICKETS.md"
[Codex pane]  (wait)
[Claude pane] "Now design Batch 2"
[Codex pane]  "Execute Batch 1 from TICKETS.md"
[Claude pane] "Review the Batch 1 diff, then design Batch 3"
[Codex pane]  "Execute Batch 2"
...continue leapfrogging...
```

### Pattern 2: Pipeline (High Velocity)
```
Claude: D1 → D2 → D3 → R1 → R2 → R3 → QA
Codex:       B1 → B2 → B3 → F1 → F2 → F3
```

Claude stays 1-2 batches ahead designing.
Reviews happen as builds complete.

### Pattern 3: Specialist Split
For larger projects, use role-specific prompts:
```
[Claude pane 1] "You are the Designer. Only design."
[Claude pane 2] "You are the Reviewer. Only review."
[Codex pane]    "You are the Builder. Only build."
```
(Requires multiple Claude sessions)

## CEO Commands for Parallel Work

Start parallel session:
```bash
dev start my-project  # Opens Claude + Codex + Logs
```

In Claude pane:
```
Read TICKETS.md. Design Batch 2 while Codex builds Batch 1.
Don't wait for Batch 1 to complete.
```

In Codex pane:
```
Read TICKETS.md. Execute Batch 1 only.
When done, report and wait for next batch.
```

## Handoff Protocol

When Claude finishes a batch design:
```markdown
## HANDOFF — Batch N Ready

Tickets: T#-T#
Files affected: <list>
Dependencies: <any setup needed>
Verify command: dev verify

Codex: Execute when ready. Don't wait for my next output.
```

When Codex finishes a batch:
```markdown
## COMPLETE — Batch N Done

Tickets completed: T#-T#
Commits: <list>
Verify: PASSED/FAILED

Ready for: Review / Next batch
```

## Timing Expectations

| Phase | Sequential | Parallel | Savings |
|-------|------------|----------|---------|
| 3 batches | 90 min | 50 min | 44% |
| 5 batches | 150 min | 80 min | 47% |
| 10 batches | 300 min | 160 min | 47% |

Parallel execution nearly halves total time.

## Gotchas

1. **Don't get too far ahead** — If Claude designs Batch 5 before Batch 1 is reviewed, you might design based on wrong assumptions

2. **Sync points** — After every 2-3 batches, pause and verify everything integrates

3. **Blockers cascade** — If Batch 1 has issues, Batch 2+ might need redesign

4. **Context management** — Each agent should only read what they need (see docs/CONTEXT.md)
