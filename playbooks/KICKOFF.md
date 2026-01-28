# Project Kickoff Sequence

When you start a new project, follow this sequence exactly.

## Step 1: Discovery (agents/DISCOVERY.md)
Before planning anything:
- [ ] Read CEO's initial brief
- [ ] Ask 3-5 clarifying questions
- [ ] Research problem domain (if unfamiliar)
- [ ] Identify prior art / competitors
- [ ] List assumptions to validate
- [ ] Identify risks and unknowns

**Exit criteria:** DISCOVERY.md completed, CEO approved assumptions

## Step 2: Requirements (templates/REQUIREMENTS.template.md)
- [ ] Define functional requirements (what it does)
- [ ] Define non-functional requirements (performance, security, scale)
- [ ] Define success metrics
- [ ] Get CEO sign-off on requirements

**Exit criteria:** REQUIREMENTS.md completed, CEO approved

## Step 3: Plan (agents/PLANNER.md)
- [ ] Create SYSTEM_PLAN.md with architecture
- [ ] Break into milestones (M1, M2, M3)
- [ ] Identify technical decisions needed
- [ ] Create ADRs for major decisions

**Exit criteria:** SYSTEM_PLAN.md completed, CEO approved

## Step 4: Design (agents/ENVIRONMENT_DESIGNER.md)
- [ ] Define design tokens in DESIGN_SYSTEM.md
- [ ] Define component contracts in DESIGN.md
- [ ] Create first batch of tickets

**Exit criteria:** DESIGN.md completed, TICKETS.md has Batch 1

## Step 5: Build (handoff to Codex)
- [ ] Execute tickets via Builder agent
- [ ] Run verify after each batch
- [ ] Review with Reviewer agent

### Handoff Protocol
Before handing off to Codex:
1. Create tickets in TICKETS.md (not just describe them)
2. End your message with:

---
🚢 HANDOFF TO CODEX: Execute Batch N from TICKETS.md
- T1: [description]
- T2: [description]

Commit after each ticket.
---

## Quick Start (Experienced Projects)
If CEO says "skip discovery" or provides detailed requirements:
- Jump to Step 3 (Plan)
- Note skipped steps in decisions.log
