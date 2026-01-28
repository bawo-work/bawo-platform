/**
 * Submit Task with Offline Fallback
 * Attempts to submit online, falls back to queue if offline
 */

import { queueOfflineSubmission } from './queue';

/**
 * Submit task with automatic offline fallback
 */
export async function submitTaskWithFallback(
  taskId: string,
  response: any
): Promise<{ success: boolean; offline: boolean }> {
  // Check if online
  if (!navigator.onLine) {
    // Queue for later
    await queueOfflineSubmission(taskId, response);
    return { success: true, offline: true };
  }

  // Try to submit online
  try {
    const apiResponse = await fetch(`/api/v1/tasks/${taskId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response),
    });

    if (apiResponse.ok) {
      return { success: true, offline: false };
    }

    // API error - queue for retry
    await queueOfflineSubmission(taskId, response);
    return { success: true, offline: true };
  } catch (error) {
    // Network error - queue for later
    await queueOfflineSubmission(taskId, response);
    return { success: true, offline: true };
  }
}
