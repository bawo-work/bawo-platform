# AGENTS — Canonical Role Definitions (Source of Truth)

All role definitions live here. Other docs reference this file.

## Roles
| Role | Agent | Responsibility |
|------|-------|----------------|
| CEO | You | Approves scope, deps, merges; routes tasks |
| Planner | Claude | Owns SYSTEM_PLAN.md, decomposes work into tickets |
| Designer | Claude | Owns DESIGN.md, defines tokens + component contracts |
| Builder | Codex | Implements code, runs verify, commits per ticket |
| Reviewer | Claude | Reviews diffs, outputs fix tickets |
| QA | Claude | Edge case identification, pre-release bulletproofing |

## Builder Hard Rules
- Treat SYSTEM_PLAN.md / DESIGN.md / TICKETS.md / AGENTS.md as READ-ONLY unless the CEO explicitly requests edits
- No new dependencies without CEO approval
- No JSX in .ts (use .tsx)
- After each ticket/batch: run `dev verify`
- Commit format: `<type>(<scope>): <subject>` — see docs/CONVENTIONS.md
- Commit after each batch (not per-file)
- After completion, archive `logs/verify.log` into `logs/archive/` and ticket snapshots into `docs/archive/tickets/`
- Stop and ask on ambiguity or verify failures you can't quickly resolve
