/**
 * Worker Dashboard - Main hub with tasks, earnings, and gamification
 */

'use client';

import { PointsBalance } from '@/components/workers/PointsBalance';
import { ReferralCard } from '@/components/workers/ReferralCard';
import { StreakCard } from '@/components/workers/StreakCard';
import { Leaderboard } from '@/components/workers/Leaderboard';
import { OfflineSync } from '@/components/offline/OfflineSync';

export default function DashboardPage() {
  // TODO: Get worker ID from auth context
  const workerId = 'mock-worker-id';

  return (
    <div className="min-h-screen bg-warm-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-700 mb-6">Dashboard</h1>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Earnings & Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-teal-700 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="/tasks"
                  className="p-4 bg-teal-700 text-white rounded-lg text-center font-semibold hover:bg-teal-800 transition"
                  style={{ minHeight: '48px' }}
                >
                  Browse Tasks
                </a>
                <a
                  href="/earnings"
                  className="p-4 bg-gold text-white rounded-lg text-center font-semibold hover:bg-amber-600 transition"
                  style={{ minHeight: '48px' }}
                >
                  View Earnings
                </a>
              </div>
            </div>

            {/* Gamification Features */}
            <StreakCard />
            <ReferralCard workerId={workerId} />
            <Leaderboard />
          </div>

          {/* Right Column - Points & Stats */}
          <div className="space-y-6">
            <PointsBalance />

            {/* Today's Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-teal-700 mb-4">Today's Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tasks Completed</span>
                  <span className="text-sm font-semibold text-teal-700">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Accuracy Rate</span>
                  <span className="text-sm font-semibold text-green-600">95%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Points Earned</span>
                  <span className="text-sm font-semibold text-gold">62 pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offline Sync Notification */}
      <OfflineSync />
    </div>
  );
}
