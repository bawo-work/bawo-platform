/**
 * Referral Card - Generate and share referral link
 */

'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { formatUSD } from '@/lib/utils/format';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ReferralCard({ workerId }: { workerId: string }) {
  const { data, error } = useSWR(`/api/v1/referrals/stats`, fetcher);
  const [copied, setCopied] = useState(false);

  if (error) return <div className="text-sm text-red-500">Failed to load referral data</div>;
  if (!data) return <div className="text-sm text-muted-foreground">Loading...</div>;

  const { referralLink, stats } = data.data;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy link');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Bawo - Earn Money with AI Tasks',
          text: 'I\'m earning money on Bawo! Use my referral link to join and we both get bonuses.',
          url: referralLink,
        });
      } catch (err) {
        // User cancelled or error - fallback to copy
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-warm-white p-6">
      <h3 className="text-lg font-semibold text-teal-700 mb-4">Refer Friends</h3>

      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-3">
          Share your link. When your friend completes 10 tasks:
        </p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-semibold text-teal-700">You get:</span> $1.00
          </p>
          <p className="text-sm">
            <span className="font-semibold text-teal-700">They get:</span> $0.50
          </p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <p className="text-xs font-medium text-gray-700 mb-1">Your Referral Link</p>
        <p className="text-sm text-gray-900 font-mono break-all">{referralLink}</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Button onClick={handleCopy} variant="outline" style={{ minHeight: '48px' }}>
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>
        <Button onClick={handleShare} style={{ minHeight: '48px' }}>
          Share
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-2xl font-bold text-teal-700">{stats.totalReferrals}</p>
          <p className="text-xs text-gray-600">Total</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gold">{stats.activeReferrals}</p>
          <p className="text-xs text-gray-600">Active (10+)</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gold">{formatUSD(stats.totalEarned)}</p>
          <p className="text-xs text-gray-600">Earned</p>
        </div>
      </div>
    </div>
  );
}
