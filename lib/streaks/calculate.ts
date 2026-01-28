/**
 * Streak Tracking - Consecutive days with at least 1 task
 * 7-day streak: $0.50 bonus
 * 30-day streak: $5.00 bonus
 */

import { supabase } from '@/lib/supabase/client';
import { sendPaymentWithFeeAbstraction } from '@/lib/blockchain/payments';

/**
 * Record task completion for streak tracking
 */
export async function recordStreakActivity(workerId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Upsert streak record for today
  const { error } = await supabase
    .from('streak_records')
    .upsert(
      {
        worker_id: workerId,
        streak_date: today,
        tasks_completed: 1,
      },
      {
        onConflict: 'worker_id,streak_date',
        ignoreDuplicates: false,
      }
    );

  if (error) {
    console.error('Failed to record streak:', error);
  }
}

/**
 * Calculate current streak (consecutive days with tasks)
 */
export async function calculateStreak(workerId: string): Promise<number> {
  const { data: records } = await supabase
    .from('streak_records')
    .select('streak_date')
    .eq('worker_id', workerId)
    .order('streak_date', { ascending: false });

  if (!records || records.length === 0) return 0;

  let streak = 1;
  let currentDate = new Date(records[0].streak_date);

  for (let i = 1; i < records.length; i++) {
    const prevDate = new Date(records[i].streak_date);
    const daysDiff = Math.floor(
      (currentDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (daysDiff === 1) {
      streak++;
      currentDate = prevDate;
    } else if (daysDiff > 1) {
      break; // Streak broken
    }
  }

  return streak;
}

/**
 * Check for streak milestones and pay bonuses
 * Called after recording streak activity
 */
export async function checkStreakMilestones(
  workerId: string,
  walletAddress: string
): Promise<void> {
  const streak = await calculateStreak(workerId);

  // Check if bonus already paid for this milestone
  const { data: existingBonus } = await supabase
    .from('transactions')
    .select('created_at')
    .eq('worker_id', workerId)
    .eq('tx_type', 'streak_reward')
    .order('created_at', { ascending: false })
    .limit(1);

  // 7-day milestone
  if (streak === 7) {
    // Only pay if last bonus was not today
    const today = new Date().toISOString().split('T')[0];
    const lastBonusDate = existingBonus?.[0]?.created_at.split('T')[0];

    if (lastBonusDate !== today) {
      await payStreakBonus(workerId, walletAddress, 0.5, '7-day');
    }
  }

  // 30-day milestone
  if (streak === 30) {
    const today = new Date().toISOString().split('T')[0];
    const lastBonusDate = existingBonus?.[0]?.created_at.split('T')[0];

    if (lastBonusDate !== today) {
      await payStreakBonus(workerId, walletAddress, 5.0, '30-day');
    }
  }
}

/**
 * Pay streak milestone bonus
 */
async function payStreakBonus(
  workerId: string,
  walletAddress: string,
  amount: number,
  milestone: string
): Promise<void> {
  try {
    const txHash = await sendPaymentWithFeeAbstraction(
      walletAddress as `0x${string}`,
      amount
    );

    await supabase.from('transactions').insert({
      worker_id: workerId,
      amount_usd: amount,
      fee_usd: 0.0002,
      tx_type: 'streak_reward',
      tx_hash: txHash,
      status: 'confirmed',
    });

    console.log(`Streak bonus paid: Worker ${workerId} = $${amount} (${milestone})`);
  } catch (error) {
    console.error(`Failed to pay ${milestone} streak bonus:`, error);
  }
}

/**
 * Get streak stats for display
 */
export async function getStreakStats(workerId: string): Promise<{
  currentStreak: number;
  longestStreak: number;
  totalBonusesEarned: number;
}> {
  const currentStreak = await calculateStreak(workerId);

  // Calculate longest streak (brute force for now)
  const { data: allRecords } = await supabase
    .from('streak_records')
    .select('streak_date')
    .eq('worker_id', workerId)
    .order('streak_date', { ascending: false });

  let longestStreak = 0;
  let tempStreak = 1;

  if (allRecords && allRecords.length > 0) {
    let currentDate = new Date(allRecords[0].streak_date);

    for (let i = 1; i < allRecords.length; i++) {
      const prevDate = new Date(allRecords[i].streak_date);
      const daysDiff = Math.floor(
        (currentDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000)
      );

      if (daysDiff === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else if (daysDiff > 1) {
        tempStreak = 1;
      }

      currentDate = prevDate;
    }

    longestStreak = Math.max(longestStreak, tempStreak);
  }

  // Get total streak bonuses earned
  const { data: bonuses } = await supabase
    .from('transactions')
    .select('amount_usd')
    .eq('worker_id', workerId)
    .eq('tx_type', 'streak_reward')
    .eq('status', 'confirmed');

  const totalBonusesEarned = bonuses?.reduce((sum, t) => sum + t.amount_usd, 0) || 0;

  return { currentStreak, longestStreak, totalBonusesEarned };
}
