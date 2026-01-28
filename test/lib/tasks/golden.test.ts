import { describe, it, expect } from 'vitest';
import { shouldInjectGoldenTask } from '@/lib/tasks/golden';

describe('Golden Task System', () => {
  it('should inject golden tasks at approximately 10% rate', () => {
    const iterations = 1000;
    let goldenCount = 0;

    for (let i = 0; i < iterations; i++) {
      if (shouldInjectGoldenTask()) {
        goldenCount++;
      }
    }

    const injectionRate = goldenCount / iterations;

    // Allow for variance in randomness (5-15% range)
    expect(injectionRate).toBeGreaterThan(0.05);
    expect(injectionRate).toBeLessThan(0.15);
  });

  it('should return boolean value', () => {
    const result = shouldInjectGoldenTask();
    expect(typeof result).toBe('boolean');
  });
});
