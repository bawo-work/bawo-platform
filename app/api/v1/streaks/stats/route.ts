/**
 * GET /api/v1/streaks/stats
 * Get worker's streak statistics
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { getStreakStats } from '@/lib/streaks/calculate';

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

  const stats = await getStreakStats(worker.id);

  return NextResponse.json({
    data: stats,
  });
}
