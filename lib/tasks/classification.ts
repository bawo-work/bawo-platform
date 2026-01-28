/**
 * Text classification task logic
 */

import type { Task } from './types';

export function isClassificationTask(task: Task): boolean {
  return task.type === 'classification';
}

export function validateClassificationResponse(
  response: string,
  validCategories: string[]
): boolean {
  return validCategories.includes(response);
}

export function getClassificationInstruction(categories: string[]): string {
  return `Read the text below and select the most appropriate category from: ${categories.join(', ')}.`;
}

/**
 * Calculate confidence for classification consensus
 * Returns 1.0 if all agree, proportional confidence otherwise
 */
export function calculateClassificationConsensus(responses: string[]): {
  label: string | null;
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
    label: topLabel,
    confidence,
  };
}

/**
 * Default categories for testing/demo
 */
export const DEFAULT_CATEGORIES = [
  'Technology',
  'Sports',
  'Politics',
  'Entertainment',
  'Business',
  'Health',
  'Science',
  'Education',
];
