// Worker Dashboard Page

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { getWorkerByWallet, getWorkerStats } from '@/lib/api/workers';
import { WorkerProfileHeader, WorkerStatsGrid } from '@/components/worker/WorkerProfile';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Worker, WorkerStats } from '@/lib/api/types';

/**
 * Navigation tabs for worker dashboard
 */
function DashboardTabs({ active }: { active: 'tasks' | 'earnings' | 'profile' }) {
  return (
    <div className="flex border-b border-sand bg-cream">
      <button
        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors min-h-[48px] ${
          active === 'tasks'
            ? 'text-teal-700 border-b-2 border-teal-700'
            : 'text-warm-gray-600 hover:text-warm-gray-800'
        }`}
      >
        Tasks
      </button>
      <button
        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors min-h-[48px] ${
          active === 'earnings'
            ? 'text-teal-700 border-b-2 border-teal-700'
            : 'text-warm-gray-600 hover:text-warm-gray-800'
        }`}
      >
        Earnings
      </button>
      <button
        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors min-h-[48px] ${
          active === 'profile'
            ? 'text-teal-700 border-b-2 border-teal-700'
            : 'text-warm-gray-600 hover:text-warm-gray-800'
        }`}
      >
        Profile
      </button>
    </div>
  );
}

/**
 * Worker Dashboard Page
 */
export default function DashboardPage() {
  const router = useRouter();
  const { address, isConnected, isLoading: walletLoading } = useWallet();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [stats, setStats] = useState<WorkerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load worker profile and stats
   */
  useEffect(() => {
    async function loadWorkerData() {
      if (!address) return;

      try {
        setIsLoading(true);
        setError(null);

        // Get worker profile
        const workerResult = await getWorkerByWallet(address);

        if (!workerResult.success) {
          setError(workerResult.error || 'Failed to load profile');
          return;
        }

        if (!workerResult.data) {
          // Worker profile doesn't exist - redirect to onboarding
          router.push('/onboard');
          return;
        }

        setWorker(workerResult.data);

        // Get worker stats
        const statsResult = await getWorkerStats(workerResult.data.id);
        if (statsResult.success && statsResult.data) {
          setStats(statsResult.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    if (isConnected && address && !walletLoading) {
      loadWorkerData();
    }
  }, [address, isConnected, walletLoading, router]);

  /**
   * Redirect to onboarding if not connected
   */
  useEffect(() => {
    if (!walletLoading && !isConnected) {
      router.push('/onboard');
    }
  }, [isConnected, walletLoading, router]);

  // Loading state
  if (walletLoading || isLoading) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center p-4">
        <Card className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700 mx-auto mb-3" />
          <p className="text-warm-gray-800">Loading dashboard...</p>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center p-4">
        <Card className="p-6 text-center border-2 border-error">
          <svg
            className="w-12 h-12 text-error mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <h3 className="text-lg font-semibold text-warm-gray-800 mb-2">
            Error Loading Dashboard
          </h3>
          <p className="text-warm-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  // Main dashboard
  if (worker) {
    return (
      <div className="min-h-screen bg-warm-white">
        {/* Header */}
        <div className="bg-cream border-b border-sand">
          <div className="max-w-7xl mx-auto p-4">
            <WorkerProfileHeader worker={worker} />
          </div>
        </div>

        {/* Navigation Tabs */}
        <DashboardTabs active="tasks" />

        {/* Content */}
        <div className="max-w-7xl mx-auto p-4 space-y-6">
          {/* Stats Grid */}
          {stats && <WorkerStatsGrid stats={stats} />}

          {/* Tasks Section (placeholder) */}
          <Card className="p-6 text-center">
            <svg
              className="w-16 h-16 text-warm-gray-600 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-semibold text-warm-gray-800 mb-2">
              No tasks available right now
            </h3>
            <p className="text-warm-gray-600 mb-4">
              Check back soon for new tasks!
            </p>
            <p className="text-sm text-warm-gray-600">
              Task system coming in Sprint 3
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
