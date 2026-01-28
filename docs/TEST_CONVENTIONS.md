# Testing Conventions

## File Structure
```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx      # Co-located unit test
├── lib/
│   └── utils.ts
__tests__/
├── integration/              # Integration tests
│   └── api.test.ts
└── e2e/                      # End-to-end tests
    └── checkout.test.ts
```

## Naming
- Unit tests: `<filename>.test.ts` (co-located)
- Integration: `__tests__/integration/<name>.test.ts`
- E2E: `__tests__/e2e/<flow>.test.ts`

## What to Test

### Must Test (Coverage: 80%+)
- Utility functions (pure logic)
- API handlers (input -> output)
- State management (actions -> state)
- Form validation

### Should Test (Coverage: 60%+)
- Component behavior (user interactions)
- Error handling paths
- Edge cases

### Optional
- Styling (visual regression)
- Third-party integrations (mock instead)

## Test Structure
```typescript
describe('<ComponentName>', () => {
  it('should <expected behavior> when <condition>', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Running Tests
```bash
dev test          # Run all tests
dev test:watch    # Watch mode
dev test:coverage # With coverage report
```

## For Agents
When writing tests:
1. Read this file first
2. Follow naming conventions exactly
3. Test behavior, not implementation
4. One assertion per test when possible
5. Use descriptive test names
