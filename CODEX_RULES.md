# Codex Rules

Before building, verify TICKETS.md has your tasks.
If no tickets exist, ask Claude to create them.

Use:
  ship verify-tickets

## Commit Message Format

Follow conventional commits from CONTRIBUTING.md:

```
type(scope): subject

- Bullet point describing what changed
- Another bullet point
- etc.
```

**Types:** feat, fix, docs, chore, refactor, test

**Creating commit messages from tickets:**

1. Read the ticket title and acceptance criteria
2. Determine the type:
   - New feature/capability → `feat`
   - Bug fix → `fix`
   - Documentation only → `docs`
   - Refactoring/cleanup → `refactor`
   - Tests → `test`
3. Determine scope from context (e.g., design, auth, cli, ui)
4. Subject = concise description of what was added/changed
5. Body bullets = key changes from acceptance criteria

**Examples:**

Ticket: "Create STRATEGIST agent"
```
feat(design): add STRATEGIST agent

- Guides strategic positioning work (Phase 1)
- Creates POSITIONING.md, AUDIENCE.md, PERSONALITY.md
- Includes discovery questions for design strategy
- Hands off to VISUAL_DESIGNER
```

Ticket: "Implement ship design init and ship design strategy"
```
feat(design): add ship design init and strategy commands

- ship design init creates design/ structure in existing projects
- ship design strategy launches STRATEGIST agent with prerequisites check
- Copy design playbooks to new projects
- Reuse template logic from seed_project_from_studio_os
```

**Guidelines:**
- Subject line: lowercase, under 72 characters, no period
- Body bullets: what changed, not how it was done
- Be specific but concise
- Always end with blank line before Co-Authored-By (if using)

## Working from Tickets File

If working from a tickets file (e.g., `ideas/TICKETS_DESIGN_SUBSYSTEM.md`):

1. Read the ticket section for your batch
2. Note the **Files to create/modify**
3. Note the **Acceptance criteria**
4. Note any **Implementation** code snippets
5. Create commit message from ticket title + acceptance criteria
6. Commit after EACH ticket (T1, then T2, not both together)

**You don't need HANDOFF.md to have commit messages spelled out - derive them from the ticket details.**
