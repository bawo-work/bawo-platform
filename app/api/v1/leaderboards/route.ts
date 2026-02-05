/**
 * GET /api/v1/leaderboards?period=weekly|monthly
 * Get top earners and top quality workers
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'weekly';

  if (!['weekly', 'monthly'].includes(period)) {
    return NextResponse.json(
      { error: { code: 'INVALID_PERIOD', message: 'Period must be weekly or monthly' } },
      { status: 400 }
    );
  }

  const days = period === 'weekly' ? 7 : 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Top Earners (by total earnings in period)
  const { data: earnings } = await supabase
    .from('transactions')
    .select('worker_id, workers(wallet_address), amount_usd')
    .gte('created_at', startDate.toISOString())
    .eq('status', 'confirmed')
    .neq('tx_type', 'withdrawal'); // Exclude withdrawals

  // Group by worker and sum earnings
  const earningsMap = new Map<string, { wallet: string; total: number }>();
  earnings?.forEach((t: any) => {
    const workerData = t.workers as { wallet_address?: string } | null;
    const existing = earningsMap.get(t.worker_id) || {
      wallet: workerData?.wallet_address || '',
      total: 0,
    };
    earningsMap.set(t.worker_id, {
      wallet: existing.wallet,
      total: existing.total + t.amount_usd,
    });
  });

  const topEarners = Array.from(earningsMap.entries())
    .map(([workerId, data]) => ({
      workerId,
      walletAddress: data.wallet,
      totalEarnings: data.total,
    }))
    .sort((a, b) => b.totalEarnings - a.totalEarnings)
    .slice(0, 10);

  // Top Quality (by accuracy rate, min 50 tasks)
  const { data: topQuality } = await supabase
    .from('workers')
    .select('id, wallet_address, accuracy_rate, total_tasks_completed')
    .gte('total_tasks_completed', 50)
    .order('accuracy_rate', { ascending: false })
    .limit(10);

  return NextResponse.json({
    data: {
      period,
      topEarners,
      topQuality: topQuality || [],
    },
  });
}
