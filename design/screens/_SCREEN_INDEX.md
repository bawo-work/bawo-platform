# Screen Design Index

This directory contains screen specifications for all features.

## Directory Structure

```
screens/
  [feature-name]/
    FLOWS.md          # User flows for this feature
    STATES.md         # All UI states (loading, empty, error, etc.)
    SCREENS.md        # Detailed screen specifications
    DATA.json         # Sample data for all scenarios
```

## Features

| Feature | Status | Screens | Priority |
|---------|--------|---------|----------|
| [Name] | [Not Started / In Progress / Complete] | [Count] | [P0/P1/P2] |

## How to Design a Feature

1. Create `screens/[feature]/` directory
2. Map user flows in `FLOWS.md`
3. Document all states in `STATES.md`
4. Design each screen in `SCREENS.md`
5. Generate sample data in `DATA.json`
6. Run `ship design validate` to check completeness
