/**
 * Leaderboard - Display top earners and top quality workers
 */

'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { formatUSD } from '@/lib/utils/format';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Leaderboard() {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const { data, error } = useSWR(`/api/v1/leaderboards?period=${period}`, fetcher);

  if (error) return <div className="text-sm text-red-500">Failed to load leaderboard</div>;
  if (!data) return <div className="text-sm text-muted-foreground">Loading...</div>;

  const { topEarners, topQuality } = data.data;

  const formatWallet = (wallet: string) => {
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-warm-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-teal-700">Leaderboard</h3>

        {/* Period Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              period === 'weekly'
                ? 'bg-teal-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={{ minHeight: '36px', minWidth: '72px' }}
          >
            Weekly
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              period === 'monthly'
                ? 'bg-teal-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={{ minHeight: '36px', minWidth: '72px' }}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Top Earners */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">🏆 Top Earners</h4>
        {topEarners.length === 0 ? (
          <p className="text-sm text-gray-500">No data yet</p>
        ) : (
          <ol className="space-y-2">
            {topEarners.map((worker: any, i: number) => (
              <li
                key={worker.workerId}
                className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-bold ${
                      i === 0
                        ? 'text-gold'
                        : i === 1
                        ? 'text-gray-400'
                        : i === 2
                        ? 'text-amber-700'
                        : 'text-gray-600'
                    }`}
                  >
                    #{i + 1}
                  </span>
                  <span className="text-sm font-mono text-gray-700">
                    {formatWallet(worker.walletAddress)}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gold">
                  {formatUSD(worker.totalEarnings)}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Top Quality */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">⭐ Top Quality</h4>
        {topQuality.length === 0 ? (
          <p className="text-sm text-gray-500">No data yet (min 50 tasks)</p>
        ) : (
          <ol className="space-y-2">
            {topQuality.map((worker: any, i: number) => (
              <li
                key={worker.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-bold ${
                      i === 0
                        ? 'text-gold'
                        : i === 1
                        ? 'text-gray-400'
                        : i === 2
                        ? 'text-amber-700'
                        : 'text-gray-600'
                    }`}
                  >
                    #{i + 1}
                  </span>
                  <span className="text-sm font-mono text-gray-700">
                    {formatWallet(worker.wallet_address)}
                  </span>
                </div>
                <span className="text-sm font-semibold text-teal-700">
                  {worker.accuracy_rate.toFixed(1)}%
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
