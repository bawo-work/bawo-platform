/**
 * Golden task validation logic
 */

import type { Task } from './types';

/**
 * Check if a task is a golden task (pre-labeled test)
 */
export function isGoldenTask(task: Task): boolean {
  return task.isGoldenTask === true;
}

/**
 * Validate a response against the golden answer
 */
export function validateGoldenTask(task: Task, response: string): boolean {
  if (!isGoldenTask(task) || !task.goldenAnswer) {
    throw new Error('Task is not a golden task or missing golden answer');
  }

  return response === task.goldenAnswer;
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100 * 100) / 100; // Round to 2 decimals
}
