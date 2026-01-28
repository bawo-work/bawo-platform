/**
 * Streak Card - Display current streak and milestones
 */

'use client';

import useSWR from 'swr';
import { formatUSD } from '@/lib/utils/format';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function StreakCard() {
  const { data, error } = useSWR('/api/v1/streaks/stats', fetcher);

  if (error) return <div className="text-sm text-red-500">Failed to load streak data</div>;
  if (!data) return <div className="text-sm text-muted-foreground">Loading...</div>;

  const { currentStreak, longestStreak, totalBonusesEarned } = data.data;

  const progress7Day = Math.min((currentStreak / 7) * 100, 100);
  const progress30Day = Math.min((currentStreak / 30) * 100, 100);

  return (
    <div className="rounded-lg border border-gray-200 bg-warm-white p-6">
      <h3 className="text-lg font-semibold text-teal-700 mb-4">Daily Streak</h3>

      {/* Current Streak */}
      <div className="mb-6 text-center">
        <p className="text-5xl font-bold text-gold mb-1">🔥 {currentStreak}</p>
        <p className="text-sm text-gray-600">Day{currentStreak !== 1 ? 's' : ''} in a row</p>
      </div>

      {/* Milestones */}
      <div className="space-y-4 mb-6">
        {/* 7-Day Milestone */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">7-Day Streak</span>
            <span className="font-medium text-gold">$0.50</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold transition-all duration-300"
              style={{ width: `${progress7Day}%` }}
            />
          </div>
          {currentStreak < 7 && (
            <p className="text-xs text-gray-600 mt-1">{7 - currentStreak} days to go</p>
          )}
          {currentStreak >= 7 && (
            <p className="text-xs text-green-600 mt-1">✅ Milestone reached!</p>
          )}
        </div>

        {/* 30-Day Milestone */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">30-Day Streak</span>
            <span className="font-medium text-gold">$5.00</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold transition-all duration-300"
              style={{ width: `${progress30Day}%` }}
            />
          </div>
          {currentStreak < 30 && (
            <p className="text-xs text-gray-600 mt-1">{30 - currentStreak} days to go</p>
          )}
          {currentStreak >= 30 && (
            <p className="text-xs text-green-600 mt-1">✅ Milestone reached!</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-2xl font-bold text-teal-700">{longestStreak}</p>
          <p className="text-xs text-gray-600">Longest Streak</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gold">{formatUSD(totalBonusesEarned)}</p>
          <p className="text-xs text-gray-600">Bonuses Earned</p>
        </div>
      </div>
    </div>
  );
}
