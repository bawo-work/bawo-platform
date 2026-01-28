/**
 * Points Balance Display - Shows available points and redemption UI
 */

'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { formatUSD } from '@/lib/utils/format';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function PointsBalance() {
  const { data, error, mutate } = useSWR('/api/v1/points/balance', fetcher);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  if (error) return <div className="text-sm text-red-500">Failed to load points</div>;
  if (!data) return <div className="text-sm text-muted-foreground">Loading...</div>;

  const { availablePoints, breakdown, redemptionPool, valueUsd, minimumRedemption } = data.data;

  const handleRedeemAll = async () => {
    if (availablePoints < minimumRedemption) {
      setRedeemError(`Minimum redemption is ${minimumRedemption} points ($${minimumRedemption / 100})`);
      return;
    }

    setRedeeming(true);
    setRedeemError(null);

    try {
      const response = await fetch('/api/v1/points/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pointsToRedeem: availablePoints }),
      });

      const result = await response.json();

      if (!response.ok) {
        setRedeemError(result.error?.message || 'Redemption failed');
        return;
      }

      // Success - refresh balance
      mutate();
      alert(`✅ Redeemed ${availablePoints} points for ${formatUSD(result.data.amountUsd)}`);
    } catch (err) {
      setRedeemError('Network error. Please try again.');
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-warm-white p-6">
      <h3 className="text-lg font-semibold text-teal-700 mb-4">Points Balance</h3>

      {/* Available Points */}
      <div className="mb-6">
        <p className="text-4xl font-bold text-gold">{availablePoints.toLocaleString()} pts</p>
        <p className="text-sm text-muted-foreground mt-1">
          = {formatUSD(valueUsd)} • Min redemption: {minimumRedemption} pts
        </p>
      </div>

      {/* Breakdown */}
      {breakdown && breakdown.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Points Breakdown</p>
          <div className="space-y-1">
            {breakdown.map((item: any) => (
              <div key={item.activityType} className="flex justify-between text-sm">
                <span className="text-gray-600 capitalize">
                  {item.activityType.replace(/_/g, ' ')}
                </span>
                <span className="font-medium text-gray-900">{item.points} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Redemption Pool Status */}
      <div className="mb-6 p-3 bg-gray-50 rounded-md">
        <p className="text-sm font-medium text-gray-700 mb-1">Redemption Pool</p>
        <p className="text-sm text-gray-600">
          {formatUSD(redemptionPool.available)} available ({redemptionPool.percentage.toFixed(0)}% remaining)
        </p>
      </div>

      {/* Redeem Button */}
      <Button
        onClick={handleRedeemAll}
        disabled={redeeming || availablePoints < minimumRedemption}
        className="w-full"
        style={{ minHeight: '48px', minWidth: '48px' }}
      >
        {redeeming ? 'Redeeming...' : `Redeem All (${formatUSD(valueUsd)})`}
      </Button>

      {redeemError && (
        <p className="mt-2 text-sm text-red-600">{redeemError}</p>
      )}

      {availablePoints < minimumRedemption && (
        <p className="mt-2 text-sm text-muted-foreground text-center">
          Earn {minimumRedemption - availablePoints} more points to redeem
        </p>
      )}
    </div>
  );
}
