import { describe, it, expect } from 'vitest';
import { isGoldenTask, validateGoldenTask, calculateAccuracy } from '@/lib/tasks/validation';
import type { Task } from '@/lib/tasks/types';

describe('Task Validation', () => {
  const mockGoldenTask: Task = {
    id: '1',
    projectId: 'project-1',
    type: 'sentiment',
    content: 'This is a test.',
    timeLimit: 45,
    payAmount: 0.05,
    status: 'pending',
    consensusReached: false,
    isGoldenTask: true,
    goldenAnswer: 'positive',
    createdAt: new Date().toISOString(),
  };

  const mockRegularTask: Task = {
    ...mockGoldenTask,
    isGoldenTask: false,
    goldenAnswer: undefined,
  };

  it('should identify golden tasks', () => {
    expect(isGoldenTask(mockGoldenTask)).toBe(true);
    expect(isGoldenTask(mockRegularTask)).toBe(false);
  });

  it('should validate correct golden task responses', () => {
    expect(validateGoldenTask(mockGoldenTask, 'positive')).toBe(true);
  });

  it('should validate incorrect golden task responses', () => {
    expect(validateGoldenTask(mockGoldenTask, 'negative')).toBe(false);
  });

  it('should throw error for non-golden tasks', () => {
    expect(() => validateGoldenTask(mockRegularTask, 'positive')).toThrow();
  });

  it('should calculate accuracy correctly', () => {
    expect(calculateAccuracy(8, 10)).toBe(80);
    expect(calculateAccuracy(10, 10)).toBe(100);
    expect(calculateAccuracy(0, 10)).toBe(0);
    expect(calculateAccuracy(0, 0)).toBe(0);
  });

  it('should round accuracy to 2 decimals', () => {
    expect(calculateAccuracy(2, 3)).toBe(66.67);
  });
});
