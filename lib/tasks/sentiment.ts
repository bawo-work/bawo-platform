/**
 * Sentiment analysis task logic
 */

import type { Task, Sentiment } from './types';

export function isSentimentTask(task: Task): boolean {
  return task.type === 'sentiment';
}

export function validateSentimentResponse(response: string): response is Sentiment {
  return ['positive', 'negative', 'neutral'].includes(response);
}

export function getSentimentInstruction(): string {
  return 'Read the text below and select whether the sentiment is Positive, Negative, or Neutral.';
}

/**
 * Calculate confidence for sentiment consensus
 * Returns 1.0 if all agree, 0.67 if 2/3 agree, 0.33 if split
 */
export function calculateSentimentConsensus(responses: string[]): {
  label: Sentiment | null;
  confidence: number;
} {
  if (responses.length === 0) {
    return { label: null, confidence: 0 };
  }

  const counts: Record<string, number> = {};
  responses.forEach((resp) => {
    counts[resp] = (counts[resp] || 0) + 1;
  });

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const [topLabel, topCount] = entries[0];
  const confidence = topCount / responses.length;

  return {
    label: topLabel as Sentiment,
    confidence,
  };
}
