# Architecture Decision Records (ADRs)

## What is an ADR?
A short document capturing a significant architectural decision.
We record decisions so future team members understand WHY.

## When to Create an ADR
- Choosing a framework / library
- Choosing a database
- Designing API structure
- Choosing auth strategy
- Any decision that would be hard to reverse

## When NOT to Create an ADR
- Routine implementation details
- Decisions easily changed
- Already covered by conventions

## Numbering
- ADR-001, ADR-002, etc.
- Never reuse numbers
- Never delete ADRs (deprecate instead)

## Workflow
1. Create ADR with status "Proposed"
2. Discuss with CEO
3. Change status to "Accepted"
4. Implement decision
5. If later reversed, mark "Deprecated" or "Superseded by ADR-XXX"

## File Location
- Template: templates/ADR.template.md
- Decisions: docs/adr/ADR-001-*.md

## Index
| ADR | Title | Status | Date |
|-----|-------|--------|------|
| 001 | Example | Accepted | 2025-01-01 |
