import { describe, it, expect } from 'vitest';
import {
  isSentimentTask,
  validateSentimentResponse,
  calculateSentimentConsensus,
} from '@/lib/tasks/sentiment';
import type { Task } from '@/lib/tasks/types';

describe('Sentiment Task Logic', () => {
  const mockSentimentTask: Task = {
    id: '1',
    projectId: 'project-1',
    type: 'sentiment',
    content: 'This is a test.',
    timeLimit: 45,
    payAmount: 0.05,
    status: 'pending',
    consensusReached: false,
    isGoldenTask: false,
    createdAt: new Date().toISOString(),
  };

  it('should identify sentiment tasks correctly', () => {
    expect(isSentimentTask(mockSentimentTask)).toBe(true);
    expect(isSentimentTask({ ...mockSentimentTask, type: 'classification' })).toBe(false);
  });

  it('should validate sentiment responses', () => {
    expect(validateSentimentResponse('positive')).toBe(true);
    expect(validateSentimentResponse('negative')).toBe(true);
    expect(validateSentimentResponse('neutral')).toBe(true);
    expect(validateSentimentResponse('invalid')).toBe(false);
  });

  it('should calculate consensus with full agreement', () => {
    const responses = ['positive', 'positive', 'positive'];
    const result = calculateSentimentConsensus(responses);

    expect(result.label).toBe('positive');
    expect(result.confidence).toBe(1.0);
  });

  it('should calculate consensus with 2/3 agreement', () => {
    const responses = ['positive', 'positive', 'negative'];
    const result = calculateSentimentConsensus(responses);

    expect(result.label).toBe('positive');
    expect(result.confidence).toBeCloseTo(0.67, 2);
  });

  it('should handle split responses', () => {
    const responses = ['positive', 'negative', 'neutral'];
    const result = calculateSentimentConsensus(responses);

    expect(result.confidence).toBeCloseTo(0.33, 2);
  });

  it('should handle empty responses', () => {
    const result = calculateSentimentConsensus([]);

    expect(result.label).toBeNull();
    expect(result.confidence).toBe(0);
  });
});
