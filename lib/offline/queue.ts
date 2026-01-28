/**
 * Offline Task Queue - IndexedDB for task submissions
 * Queues submissions when offline, syncs when reconnected
 */

import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'bawo-offline';
const STORE_NAME = 'task-submissions';

let db: IDBPDatabase | null = null;

/**
 * Initialize IndexedDB database
 */
async function getDB() {
  if (!db) {
    db = await openDB(DB_NAME, 1, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      },
    });
  }
  return db;
}

export type QueuedSubmission = {
  id?: number;
  taskId: string;
  response: any;
  timestamp: number;
  retries: number;
};

/**
 * Add submission to offline queue
 */
export async function queueOfflineSubmission(
  taskId: string,
  response: any
): Promise<void> {
  const database = await getDB();
  await database.add(STORE_NAME, {
    taskId,
    response,
    timestamp: Date.now(),
    retries: 0,
  });
  console.log(`[Offline] Queued submission for task ${taskId}`);
}

/**
 * Get all queued submissions
 */
export async function getOfflineQueue(): Promise<QueuedSubmission[]> {
  const database = await getDB();
  return database.getAll(STORE_NAME);
}

/**
 * Remove submission from queue (after successful sync)
 */
export async function clearOfflineSubmission(id: number): Promise<void> {
  const database = await getDB();
  await database.delete(STORE_NAME, id);
  console.log(`[Offline] Cleared submission ${id} from queue`);
}

/**
 * Update retry count for failed submission
 */
export async function incrementRetries(id: number): Promise<void> {
  const database = await getDB();
  const submission = await database.get(STORE_NAME, id);
  if (submission) {
    submission.retries += 1;
    await database.put(STORE_NAME, submission);
  }
}

/**
 * Get queue size (for UI display)
 */
export async function getQueueSize(): Promise<number> {
  const database = await getDB();
  const count = await database.count(STORE_NAME);
  return count;
}
