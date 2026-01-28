/**
 * Offline Sync Component - Auto-syncs queued submissions when reconnected
 */

'use client';

import { useEffect, useState } from 'react';
import { getQueueSize } from '@/lib/offline/queue';
import { syncOfflineQueue } from '@/lib/offline/sync';

export function OfflineSync() {
  const [queueSize, setQueueSize] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Check queue size on mount
  useEffect(() => {
    checkQueueSize();
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = async () => {
      console.log('[OfflineSync] Connection restored');
      setIsOnline(true);

      // Auto-sync when reconnected
      if (queueSize > 0) {
        await handleSync();
      }
    };

    const handleOffline = () => {
      console.log('[OfflineSync] Connection lost');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queueSize]);

  const checkQueueSize = async () => {
    const size = await getQueueSize();
    setQueueSize(size);
  };

  const handleSync = async () => {
    setSyncing(true);
    const syncedCount = await syncOfflineQueue();
    await checkQueueSize();
    setSyncing(false);

    if (syncedCount > 0) {
      // Show success notification (could integrate with toast library)
      console.log(`✅ Synced ${syncedCount} offline submissions`);
    }
  };

  // Don't show anything if online and queue is empty
  if (isOnline && queueSize === 0) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-sm ${
        isOnline ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Status Indicator */}
        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-amber-500'}`} />

        {/* Message */}
        <div className="flex-1">
          {!isOnline && (
            <p className="text-sm text-amber-900">
              <span className="font-semibold">Offline</span>
              {queueSize > 0 && ` • ${queueSize} task${queueSize > 1 ? 's' : ''} queued`}
            </p>
          )}
          {isOnline && queueSize > 0 && (
            <div>
              <p className="text-sm text-green-900">
                <span className="font-semibold">Online</span>
                {syncing ? ' • Syncing...' : ` • ${queueSize} task${queueSize > 1 ? 's' : ''} queued`}
              </p>
              {!syncing && (
                <button
                  onClick={handleSync}
                  className="text-xs text-green-700 underline mt-1"
                >
                  Sync now
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
