# Iteration & Learning

Studio OS improves with every project. Here's how.

## After Each Milestone

When a milestone is complete, take 5 minutes:

1. **What worked well?**
   - Fast tickets? Note the pattern.
   - Clean verify? Note the approach.

2. **What was harder than expected?**
   - Missing specs? Improve templates.
   - Repeated issues? Add to checklists.

3. **Any reusable patterns?**
   - Solved something clever? Extract to `templates/patterns/`

4. **Update decisions.log:**
   ```
   ## YYYY-MM-DD — M# Complete
   Milestone: <name>
   Went well: <what>
   Struggled: <what>
   Pattern extracted: <if any>
   ---
   ```

## After Project Completion

Create `RETROSPECTIVE.md` in project root:

```markdown
# Retrospective — <project>

## Summary
- Started: YYYY-MM-DD
- Completed: YYYY-MM-DD
- Milestones: #
- Tickets: #

## What Went Well
-

## What Struggled
-

## Patterns Extracted
- templates/patterns/<name>.md

## Agent Improvements
- Suggested update to agents/X.md: ...

## Template Improvements
- Suggested update to templates/X.md: ...

## For Next Project
- Remember to: ...
- Avoid: ...
```

## Pattern Extraction

When you solve something worth reusing:

1. Create `templates/patterns/<name>.md`:
   ```markdown
   # Pattern: <name>

   ## Problem
   <what situation triggers this>

   ## Solution
   <how to solve it>

   ## Example
   <code or steps>

   ## When to Use
   - <condition>

   ## When NOT to Use
   - <condition>
   ```

2. Reference from relevant agent:
   ```markdown
   See templates/patterns/<name>.md for reusable solution.
   ```

3. Add to patterns index:
   ```markdown
   | Pattern | Use When |
   |---------|----------|
   | <name> | <condition> |
   ```

## Improving Agents

If an agent's rules are incomplete or wrong:

1. Document the issue in decisions.log
2. Propose specific change
3. Get CEO approval
4. Update agent file
5. Update global/AGENTS.md if role definition changed

## Metrics to Track

Over time, notice:
- Average tickets per milestone
- Common blockers
- Frequently extracted patterns
- Agent rules that need updating
