import { describe, it, expect } from 'vitest';
import { calculateReputationScore } from '@/lib/workers/accuracy';

describe('Worker Accuracy Tracking', () => {
  it('should calculate reputation score with high accuracy and experience', () => {
    const score = calculateReputationScore(95, 100);
    expect(score).toBeGreaterThan(90);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should calculate reputation score with high accuracy, low experience', () => {
    const score = calculateReputationScore(95, 10);
    // 95 * 0.7 + (10/100 * 100) * 0.3 = 66.5 + 3 = 69.5
    expect(score).toBeCloseTo(69.5, 1);
  });

  it('should calculate reputation score with low accuracy, high experience', () => {
    const score = calculateReputationScore(70, 100);
    // 70 * 0.7 + 100 * 0.3 = 49 + 30 = 79
    expect(score).toBeCloseTo(79, 1);
  });

  it('should cap experience at 100 tasks', () => {
    const score1 = calculateReputationScore(90, 100);
    const score2 = calculateReputationScore(90, 200);
    expect(score1).toBe(score2);
  });

  it('should handle zero values', () => {
    const score = calculateReputationScore(0, 0);
    expect(score).toBe(0);
  });

  it('should weight accuracy more heavily than experience', () => {
    const highAccuracyScore = calculateReputationScore(100, 10);
    const highExperienceScore = calculateReputationScore(60, 100);

    // High accuracy with low experience should score higher than
    // medium accuracy with high experience
    expect(highAccuracyScore).toBeGreaterThan(highExperienceScore);
  });
});
