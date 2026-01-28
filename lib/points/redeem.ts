/**
 * Points Redemption - Convert points to cash
 * Enforces: revenue pool cap (20%), activity requirement, expiry
 */

import { supabase } from '@/lib/supabase/client';
import { sendPaymentWithFeeAbstraction } from '@/lib/blockchain/payments';

export type RedemptionError =
  | 'INSUFFICIENT_POINTS'
  | 'REDEMPTION_POOL_INSUFFICIENT'
  | 'INACTIVE_WORKER'
  | 'MINIMUM_NOT_MET';

/**
 * Get monthly redemption pool (20% of monthly revenue)
 */
async function getMonthlyRedemptionPool(): Promise<number> {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const { data } = await supabase
    .from('revenue_tracking')
    .select('total_revenue_usd, points_redeemed_usd')
    .eq('month', currentMonth)
    .single();

  if (!data) return 0;

  const redemptionCap = data.total_revenue_usd * 0.2;
  const remaining = redemptionCap - data.points_redeemed_usd;
  return Math.max(0, remaining);
}

/**
 * Check if worker is active (completed at least 1 task in last 30 days)
 */
async function isWorkerActive(workerId: string): Promise<boolean> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { count } = await supabase
    .from('task_responses')
    .select('*', { count: 'exact', head: true })
    .eq('worker_id', workerId)
    .gte('submitted_at', thirtyDaysAgo.toISOString());

  return (count || 0) > 0;
}

/**
 * Redeem points for cash (100 points = $1)
 * Minimum redemption: 1000 points ($10)
 */
export async function redeemPoints(
  workerId: string,
  walletAddress: string,
  pointsToRedeem: number
): Promise<
  | { success: true; amountUsd: number; txHash: string }
  | { success: false; error: RedemptionError }
> {
  // Check minimum (1000 points = $10)
  if (pointsToRedeem < 1000) {
    return { success: false, error: 'MINIMUM_NOT_MET' };
  }

  // Check available points
  const { data: pointsRecords } = await supabase
    .from('points_ledger')
    .select('id, points')
    .eq('worker_id', workerId)
    .eq('redeemed', false)
    .gt('expires_at', new Date().toISOString())
    .order('issued_at', { ascending: true }); // FIFO

  const availablePoints =
    pointsRecords?.reduce((sum, r) => sum + r.points, 0) || 0;

  if (pointsToRedeem > availablePoints) {
    return { success: false, error: 'INSUFFICIENT_POINTS' };
  }

  // Check redemption pool
  const redemptionAmount = pointsToRedeem / 100; // 100 points = $1
  const poolAvailable = await getMonthlyRedemptionPool();

  if (redemptionAmount > poolAvailable) {
    return { success: false, error: 'REDEMPTION_POOL_INSUFFICIENT' };
  }

  // Check worker activity
  const active = await isWorkerActive(workerId);
  if (!active) {
    return { success: false, error: 'INACTIVE_WORKER' };
  }

  // Redeem points (FIFO - oldest first)
  let remainingToRedeem = pointsToRedeem;
  const idsToRedeem: string[] = [];

  for (const record of pointsRecords!) {
    if (remainingToRedeem <= 0) break;

    idsToRedeem.push(record.id);
    remainingToRedeem -= record.points;
  }

  await supabase
    .from('points_ledger')
    .update({ redeemed: true, redeemed_at: new Date().toISOString() })
    .in('id', idsToRedeem);

  // Send payment
  const txHash = await sendPaymentWithFeeAbstraction(
    walletAddress as `0x${string}`,
    redemptionAmount
  );

  // Record transaction
  await supabase.from('transactions').insert({
    worker_id: workerId,
    amount_usd: redemptionAmount,
    fee_usd: 0.0002,
    tx_type: 'points_redemption',
    tx_hash: txHash,
    status: 'confirmed',
  });

  // Update revenue tracking
  const currentMonth = new Date().toISOString().slice(0, 7);
  const { data: revenueRecord } = await supabase
    .from('revenue_tracking')
    .select('*')
    .eq('month', currentMonth)
    .single();

  if (revenueRecord) {
    await supabase
      .from('revenue_tracking')
      .update({
        points_redeemed_usd: revenueRecord.points_redeemed_usd + redemptionAmount,
        updated_at: new Date().toISOString(),
      })
      .eq('month', currentMonth);
  }

  return { success: true, amountUsd: redemptionAmount, txHash };
}

/**
 * Get redemption pool status for display
 */
export async function getRedemptionPoolStatus(): Promise<{
  poolAvailable: number;
  poolPercentage: number;
}> {
  const poolAvailable = await getMonthlyRedemptionPool();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const { data } = await supabase
    .from('revenue_tracking')
    .select('total_revenue_usd')
    .eq('month', currentMonth)
    .single();

  const totalRevenue = data?.total_revenue_usd || 0;
  const poolPercentage = totalRevenue > 0 ? (poolAvailable / (totalRevenue * 0.2)) * 100 : 0;

  return { poolAvailable, poolPercentage };
}
