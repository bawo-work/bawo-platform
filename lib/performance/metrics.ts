/**
 * Performance Metrics - Web Vitals tracking
 */

export type Metric = {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
};

/**
 * Log Web Vitals to console (and optionally to analytics)
 */
export function reportWebVitals(metric: Metric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${metric.name}:`, metric.value, `(${metric.rating})`);
  }

  // TODO: Send to analytics service (PostHog, Axiom, etc.)
  // Example:
  // fetch('/api/analytics/vitals', {
  //   method: 'POST',
  //   body: JSON.stringify(metric),
  // });
}

/**
 * Measure page load time
 */
export function measurePageLoad(): number {
  if (typeof window === 'undefined') return 0;

  const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  if (!navigationTiming) return 0;

  const loadTime = navigationTiming.loadEventEnd - navigationTiming.fetchStart;
  return loadTime;
}

/**
 * Check if bundle size target is met
 * Target: <150kb gzipped JS
 */
export function checkBundleSize(): { success: boolean; size: number } {
  if (typeof window === 'undefined') return { success: true, size: 0 };

  // Get all JS resources
  const jsResources = performance
    .getEntriesByType('resource')
    .filter((r) => r.name.endsWith('.js'));

  const totalSize = jsResources.reduce((sum, r) => {
    const resource = r as PerformanceResourceTiming;
    return sum + (resource.transferSize || 0);
  }, 0);

  const sizeKB = totalSize / 1024;
  const success = sizeKB < 150;

  return { success, size: sizeKB };
}

/**
 * Get current connection type (for 3G detection)
 */
export function getConnectionType(): string {
  if (typeof window === 'undefined') return 'unknown';

  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

  if (!connection) return 'unknown';

  return connection.effectiveType || 'unknown';
}
