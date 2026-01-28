// Worker Profile Display Component

'use client';

import { formatWalletAddress } from '@/lib/wallet/minipay';
import { VerificationBadge } from '@/components/identity/VerificationBadge';
import { Card } from '@/components/ui/card';
import type { Worker, WorkerStats } from '@/lib/api/types';

interface WorkerProfileProps {
  worker: Worker;
  stats?: WorkerStats;
}

/**
 * Gets tier display configuration
 */
function getTierConfig(tier: string) {
  switch (tier) {
    case 'expert':
      return { label: 'Expert', color: 'text-money-gold', icon: '⭐⭐⭐' };
    case 'gold':
      return { label: 'Gold', color: 'text-money-gold', icon: '⭐⭐' };
    case 'silver':
      return { label: 'Silver', color: 'text-warm-gray-600', icon: '⭐' };
    case 'bronze':
      return { label: 'Bronze', color: 'text-terracotta-500', icon: '●' };
    default:
      return { label: 'Newcomer', color: 'text-warm-gray-600', icon: '○' };
  }
}

/**
 * Worker Profile Card Component
 */
export function WorkerProfile({ worker, stats }: WorkerProfileProps) {
  const tierConfig = getTierConfig(worker.tier);

  return (
    <Card className="p-6 bg-cream">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-warm-gray-800">
              Worker Profile
            </h3>
            <VerificationBadge level={worker.verification_level} />
          </div>
          <p className="text-sm text-warm-gray-600">
            Wallet: {formatWalletAddress(worker.wallet_address)}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-sm font-semibold ${tierConfig.color}`}>
            {tierConfig.icon} {tierConfig.label}
          </p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-sand">
          <div>
            <p className="text-xs text-warm-gray-600 mb-1">Tasks Completed</p>
            <p className="text-2xl font-bold text-warm-gray-800">
              {stats.tasksCompleted}
            </p>
          </div>
          <div>
            <p className="text-xs text-warm-gray-600 mb-1">Accuracy Rate</p>
            <p className="text-2xl font-bold text-warm-gray-800">
              {stats.accuracy.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {stats && stats.earningsToday > 0 && (
        <div className="mt-4 pt-4 border-t border-sand">
          <p className="text-xs text-warm-gray-600 mb-1">Earned Today</p>
          <p className="text-xl font-bold text-money-gold">
            ${stats.earningsToday.toFixed(2)}
          </p>
        </div>
      )}
    </Card>
  );
}

/**
 * Compact profile header for dashboard
 */
export function WorkerProfileHeader({ worker }: { worker: Worker }) {
  const tierConfig = getTierConfig(worker.tier);

  return (
    <div className="flex items-center justify-between p-4 bg-cream rounded-lg border border-sand">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center text-white font-semibold">
          {worker.wallet_address.slice(2, 4).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-warm-gray-800">
            {formatWalletAddress(worker.wallet_address)}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <VerificationBadge level={worker.verification_level} showLabel={false} />
            <span className={`text-xs ${tierConfig.color}`}>
              {tierConfig.icon} {tierConfig.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Stats grid for dashboard
 */
export function WorkerStatsGrid({ stats }: { stats: WorkerStats }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4">
        <p className="text-sm text-warm-gray-600 mb-1">Tasks Done</p>
        <p className="text-2xl font-bold text-warm-gray-800">
          {stats.tasksCompleted}
        </p>
      </Card>
      <Card className="p-4">
        <p className="text-sm text-warm-gray-600 mb-1">Accuracy</p>
        <p className="text-2xl font-bold text-warm-gray-800">
          {stats.accuracy.toFixed(1)}%
        </p>
      </Card>
      <Card className="p-4">
        <p className="text-sm text-warm-gray-600 mb-1">Today&apos;s Earnings</p>
        <p className="text-2xl font-bold text-money-gold">
          ${stats.earningsToday.toFixed(2)}
        </p>
      </Card>
      <Card className="p-4">
        <p className="text-sm text-warm-gray-600 mb-1">Total Earned</p>
        <p className="text-2xl font-bold text-money-gold">
          ${stats.earningsLifetime.toFixed(2)}
        </p>
      </Card>
    </div>
  );
}
