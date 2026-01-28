/**
 * Referral Program - Link generation and tracking
 * Referrer gets $1, referee gets $0.50 after 10 completed tasks
 */

import { supabase } from '@/lib/supabase/client';

/**
 * Generate referral link for a worker
 */
export function generateReferralLink(workerId: string): string {
  const code = Buffer.from(workerId).toString('base64url').slice(0, 12);
  return `https://bawo.work/join?ref=${code}`;
}

/**
 * Decode referral code to get referrer worker ID
 */
export async function getReferrerFromCode(code: string): Promise<string | null> {
  try {
    // Decode base64url
    const decoded = Buffer.from(code, 'base64url').toString();

    // Verify worker exists
    const { data, error } = await supabase
      .from('workers')
      .select('id')
      .eq('id', decoded)
      .single();

    if (error || !data) return null;

    return data.id;
  } catch {
    return null;
  }
}

/**
 * Track referral relationship when referee signs up
 */
export async function trackReferral(
  refereeId: string,
  referralCode: string
): Promise<boolean> {
  const referrerId = await getReferrerFromCode(referralCode);

  if (!referrerId) return false;

  // Update referee's referred_by field
  const { error } = await supabase
    .from('workers')
    .update({ referred_by: referrerId })
    .eq('id', refereeId);

  return !error;
}

/**
 * Get referral stats for a worker
 */
export async function getReferralStats(workerId: string): Promise<{
  totalReferrals: number;
  activeReferrals: number; // Referees with 10+ tasks
  totalEarned: number; // Total referral bonuses earned
}> {
  // Get all referees
  const { data: referees } = await supabase
    .from('workers')
    .select('id')
    .eq('referred_by', workerId);

  const totalReferrals = referees?.length || 0;

  if (totalReferrals === 0) {
    return { totalReferrals: 0, activeReferrals: 0, totalEarned: 0 };
  }

  // Count referees with 10+ tasks
  const refereeIds = referees!.map((r) => r.id);
  const { data: taskCounts } = await supabase
    .from('task_responses')
    .select('worker_id')
    .in('worker_id', refereeIds);

  const countsMap = new Map<string, number>();
  taskCounts?.forEach((t) => {
    countsMap.set(t.worker_id, (countsMap.get(t.worker_id) || 0) + 1);
  });

  const activeReferrals = Array.from(countsMap.values()).filter((count) => count >= 10).length;

  // Get total earned from referral bonuses
  const { data: transactions } = await supabase
    .from('transactions')
    .select('amount_usd')
    .eq('worker_id', workerId)
    .eq('tx_type', 'referral_bonus')
    .eq('status', 'confirmed');

  const totalEarned = transactions?.reduce((sum, t) => sum + t.amount_usd, 0) || 0;

  return { totalReferrals, activeReferrals, totalEarned };
}
