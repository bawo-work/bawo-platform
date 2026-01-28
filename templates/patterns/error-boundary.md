# Pattern: Error Boundary

## Problem
Component crashes break the entire page. Users see white screen.

## Solution
Wrap major sections in error boundaries that:
1. Catch render errors
2. Show fallback UI
3. Provide recovery action
4. Report error to tracking

## Example

```tsx
// components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Report to error tracking
    console.error('Error caught by boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center">
          <p>Something went wrong.</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

Usage:
```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <RiskyComponent />
</ErrorBoundary>
```

## When to Use
- Around major page sections
- Around third-party components
- Around data-fetching components
- Around user-input-driven renders

## When NOT to Use
- Around the entire app (too broad)
- Around every small component (overhead)
- For expected errors (use try/catch or error states)

## Related Patterns
- Error handling states in components
- Retry with backoff
