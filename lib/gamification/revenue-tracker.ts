/**
 * Revenue Tracker - Updates monthly revenue for points redemption pool
 */

import { supabase } from '@/lib/supabase/client';

/**
 * Record client project revenue (for points pool calculation)
 */
export async function recordRevenue(amountUsd: number): Promise<void> {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  // Upsert revenue record for current month
  const { data: existing } = await supabase
    .from('revenue_tracking')
    .select('total_revenue_usd')
    .eq('month', currentMonth)
    .single();

  if (existing) {
    // Update existing record
    await supabase
      .from('revenue_tracking')
      .update({
        total_revenue_usd: existing.total_revenue_usd + amountUsd,
        updated_at: new Date().toISOString(),
      })
      .eq('month', currentMonth);
  } else {
    // Create new record
    await supabase.from('revenue_tracking').insert({
      month: currentMonth,
      total_revenue_usd: amountUsd,
      points_redeemed_usd: 0,
      updated_at: new Date().toISOString(),
    });
  }

  console.log(`[Revenue] Recorded $${amountUsd} for ${currentMonth}`);
}

/**
 * Get monthly revenue summary
 */
export async function getMonthlyRevenueSummary(): Promise<{
  totalRevenue: number;
  redemptionPool: number;
  pointsRedeemed: number;
  poolPercentage: number;
}> {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const { data } = await supabase
    .from('revenue_tracking')
    .select('*')
    .eq('month', currentMonth)
    .single();

  if (!data) {
    return {
      totalRevenue: 0,
      redemptionPool: 0,
      pointsRedeemed: 0,
      poolPercentage: 100,
    };
  }

  const redemptionPool = data.total_revenue_usd * 0.2;
  const remaining = redemptionPool - data.points_redeemed_usd;
  const poolPercentage = redemptionPool > 0 ? (remaining / redemptionPool) * 100 : 100;

  return {
    totalRevenue: data.total_revenue_usd,
    redemptionPool: remaining,
    pointsRedeemed: data.points_redeemed_usd,
    poolPercentage,
  };
}
