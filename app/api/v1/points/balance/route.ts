/**
 * GET /api/v1/points/balance
 * Get worker's points balance and redemption pool status
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { getAvailablePoints, getPointsBreakdown } from '@/lib/points/award';
import { getRedemptionPoolStatus } from '@/lib/points/redeem';

export async function GET(request: Request) {
  const walletAddress = request.headers.get('x-wallet-address');

  if (!walletAddress) {
    return NextResponse.json(
      { error: { code: 'MISSING_WALLET_ADDRESS', message: 'Wallet address required' } },
      { status: 401 }
    );
  }

  // Get worker ID
  const { data: worker, error: workerError } = await supabase
    .from('workers')
    .select('id')
    .eq('wallet_address', walletAddress)
    .single();

  if (workerError || !worker) {
    return NextResponse.json(
      { error: { code: 'WORKER_NOT_FOUND', message: 'Worker not found' } },
      { status: 404 }
    );
  }

  // Get points data
  const availablePoints = await getAvailablePoints(worker.id);
  const breakdown = await getPointsBreakdown(worker.id);
  const { poolAvailable, poolPercentage } = await getRedemptionPoolStatus();

  return NextResponse.json({
    data: {
      availablePoints,
      breakdown,
      redemptionPool: {
        available: poolAvailable,
        percentage: poolPercentage,
      },
      valueUsd: availablePoints / 100, // 100 points = $1
      minimumRedemption: 1000, // 1000 points = $10
    },
  });
}
