# Error Handling Standards

## Error Message Format

### User-Facing Errors
```typescript
{
  title: "Something went wrong",      // Human-readable
  message: "We couldn't save...",     // What happened
  action: "Please try again",         // What to do
  code: "SAVE_FAILED"                 // For support
}
```

### Developer Errors (logs)
```typescript
{
  error: "DatabaseConnectionError",
  message: "Connection timeout after 30s",
  context: { host, port, attempt },
  stack: "...",
  timestamp: "ISO8601"
}
```

## Error Types

| Type | User Sees | Log Level | Retry? |
|------|-----------|-----------|--------|
| Validation | Specific field error | warn | No |
| Auth | "Please sign in" | info | No |
| NotFound | "Not found" | warn | No |
| RateLimit | "Too many requests" | warn | Yes, with backoff |
| ServerError | "Something went wrong" | error | Yes, once |
| NetworkError | "Connection issue" | warn | Yes, with backoff |

## Error Boundaries (React)
- Wrap major sections, not entire app
- Show fallback UI, not blank screen
- Include "Try Again" action
- Report to error tracking

## Retry Logic
```typescript
// Exponential backoff
const delays = [1000, 2000, 4000]; // ms
const maxRetries = 3;
```

## Graceful Degradation
- If non-critical feature fails, hide it
- If critical feature fails, show error with action
- Never show raw error messages to users
- Never expose stack traces in production

## What to Log
- All errors (with context)
- Failed validation attempts
- Auth failures
- Rate limit hits
- External service failures

## What NOT to Log
- Passwords / tokens
- Full credit card numbers
- PII without consent
