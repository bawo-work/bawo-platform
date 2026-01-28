/**
 * Offline Sync - Sync queued task submissions when reconnected
 */

import { getOfflineQueue, clearOfflineSubmission, incrementRetries } from './queue';

const MAX_RETRIES = 3;

/**
 * Sync all queued submissions
 * Returns number of successfully synced submissions
 */
export async function syncOfflineQueue(): Promise<number> {
  const queue = await getOfflineQueue();

  if (queue.length === 0) {
    console.log('[Sync] No queued submissions to sync');
    return 0;
  }

  console.log(`[Sync] Syncing ${queue.length} queued submissions...`);

  let successCount = 0;

  for (const submission of queue) {
    try {
      // Submit to API
      const response = await fetch(`/api/v1/tasks/${submission.taskId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission.response),
      });

      if (response.ok) {
        // Success - remove from queue
        await clearOfflineSubmission(submission.id!);
        successCount++;
        console.log(`[Sync] Successfully synced task ${submission.taskId}`);
      } else {
        // API error - retry later
        if (submission.retries < MAX_RETRIES) {
          await incrementRetries(submission.id!);
          console.warn(`[Sync] Failed to sync task ${submission.taskId}, will retry`);
        } else {
          // Max retries exceeded - remove from queue
          await clearOfflineSubmission(submission.id!);
          console.error(`[Sync] Max retries exceeded for task ${submission.taskId}, removed from queue`);
        }
      }
    } catch (error) {
      // Network error - keep in queue for next sync
      console.error(`[Sync] Network error syncing task ${submission.taskId}:`, error);
    }
  }

  console.log(`[Sync] Synced ${successCount}/${queue.length} submissions`);
  return successCount;
}
