/**
 * POST /api/v1/points/redeem
 * Redeem points for cash (100 points = $1, min 1000 points)
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { redeemPoints } from '@/lib/points/redeem';

export async function POST(request: Request) {
  const walletAddress = request.headers.get('x-wallet-address');

  if (!walletAddress) {
    return NextResponse.json(
      { error: { code: 'MISSING_WALLET_ADDRESS', message: 'Wallet address required' } },
      { status: 401 }
    );
  }

  const { pointsToRedeem } = await request.json();

  if (!pointsToRedeem || typeof pointsToRedeem !== 'number' || pointsToRedeem <= 0) {
    return NextResponse.json(
      { error: { code: 'INVALID_POINTS', message: 'Invalid points amount' } },
      { status: 400 }
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

  // Redeem points
  const result = await redeemPoints(worker.id, walletAddress, pointsToRedeem);

  if (!result.success) {
    const errorMessages = {
      INSUFFICIENT_POINTS: 'Not enough points available',
      REDEMPTION_POOL_INSUFFICIENT: 'Redemption pool is currently insufficient. Try again later.',
      INACTIVE_WORKER: 'You must complete at least 1 task in the last 30 days to redeem',
      MINIMUM_NOT_MET: 'Minimum redemption is 1000 points ($10)',
    };

    return NextResponse.json(
      {
        error: {
          code: result.error,
          message: errorMessages[result.error],
        },
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    data: {
      success: true,
      amountUsd: result.amountUsd,
      txHash: result.txHash,
      message: `Redeemed ${pointsToRedeem} points for $${result.amountUsd.toFixed(2)}`,
    },
  });
}
