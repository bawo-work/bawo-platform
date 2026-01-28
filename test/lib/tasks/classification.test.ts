import { describe, it, expect } from 'vitest';
import {
  isClassificationTask,
  validateClassificationResponse,
  calculateClassificationConsensus,
} from '@/lib/tasks/classification';
import type { Task } from '@/lib/tasks/types';

describe('Classification Task Logic', () => {
  const mockClassificationTask: Task = {
    id: '1',
    projectId: 'project-1',
    type: 'classification',
    content: 'This is a test.',
    options: ['Technology', 'Sports', 'Politics'],
    timeLimit: 45,
    payAmount: 0.05,
    status: 'pending',
    consensusReached: false,
    isGoldenTask: false,
    createdAt: new Date().toISOString(),
  };

  it('should identify classification tasks correctly', () => {
    expect(isClassificationTask(mockClassificationTask)).toBe(true);
    expect(isClassificationTask({ ...mockClassificationTask, type: 'sentiment' })).toBe(false);
  });

  it('should validate classification responses', () => {
    const categories = ['Technology', 'Sports', 'Politics'];

    expect(validateClassificationResponse('Technology', categories)).toBe(true);
    expect(validateClassificationResponse('Sports', categories)).toBe(true);
    expect(validateClassificationResponse('Invalid', categories)).toBe(false);
  });

  it('should calculate consensus with full agreement', () => {
    const responses = ['Technology', 'Technology', 'Technology'];
    const result = calculateClassificationConsensus(responses);

    expect(result.label).toBe('Technology');
    expect(result.confidence).toBe(1.0);
  });

  it('should calculate consensus with 2/3 agreement', () => {
    const responses = ['Technology', 'Technology', 'Sports'];
    const result = calculateClassificationConsensus(responses);

    expect(result.label).toBe('Technology');
    expect(result.confidence).toBeCloseTo(0.67, 2);
  });

  it('should handle split responses', () => {
    const responses = ['Technology', 'Sports', 'Politics'];
    const result = calculateClassificationConsensus(responses);

    expect(result.confidence).toBeCloseTo(0.33, 2);
  });
});
