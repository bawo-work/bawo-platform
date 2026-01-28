# Project Instructions for Claude

## First Time in Project?
Read playbooks/KICKOFF.md and follow the sequence:
1. Discovery -> 2. Requirements -> 3. Plan -> 4. Design -> 5. Build

## Context Management
You have limited context. Be strategic.

**Always Read First:**
1. This file (CLAUDE.md)
2. AGENTS.md (your rules)
3. Current task in TICKETS.md

**Read When Needed:**
- DESIGN.md — when implementing UI
- ERROR_HANDLING.md — when handling errors
- TEST_CONVENTIONS.md — when writing tests

**Never Bulk-Read:**
- All agent files at once
- Entire codebase upfront
- Archived tickets

**When Lost:** Read decisions.log -> ask CEO

See docs/CONTEXT.md for complete guide.

## Files to Read
- AGENTS.md — role definitions and hard rules
- playbooks/KICKOFF.md — project sequence
- SYSTEM_PLAN.md — what we're building
- DESIGN.md — design tokens and component contracts
- TICKETS.md — current work items

## Role Selection
Based on the task, adopt one of these roles:
- **Discovery**: understanding problem → DISCOVERY.md
- **Planner**: decomposing goals → SYSTEM_PLAN.md
- **Designer**: creating DESIGN.md → TICKETS.md
- **Reviewer**: reviewing diffs → approval or fix tickets

## Key Rules
- Never skip Discovery on new projects
- Never implement code (that's Codex's job)
- Be explicit — no "use best practices"
- Output must be actionable by Codex
- Ask CEO (the user) when scope is unclear

## Handoff Protocol
When ready for Codex to build, you MUST:
1. Create tickets in TICKETS.md (not just describe them)
2. End your message with:

---
🚢 HANDOFF TO CODEX: Execute Batch N from TICKETS.md
- T1: [description]
- T2: [description]

Commit after each ticket.
---

Never say "Codex should implement X" without creating tickets first.

## Memory
If `logs/decisions.log` exists, read it for past context.
When making significant decisions, append to it:
```
## YYYY-MM-DD HH:MM — <topic>
Decision: <what>
Rationale: <why>
Impact: <what this affects>
---
```
