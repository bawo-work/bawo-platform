/**
 * Gamification Integration Hooks
 * Automatically trigger gamification events after task submission
 */

import { awardPointsForTask } from '@/lib/points/award';
import { checkAndPayReferralBonus } from '@/lib/referrals/bonus';
import { recordStreakActivity, checkStreakMilestones } from '@/lib/streaks/calculate';

/**
 * Post-submission hook - Awards points, checks referrals, tracks streaks
 * Called after a task is successfully submitted
 */
export async function onTaskSubmitted(params: {
  workerId: string;
  walletAddress: string;
  taskType: string;
  isGoldenTask: boolean;
  passedGolden: boolean;
}): Promise<void> {
  const { workerId, walletAddress, taskType, isGoldenTask, passedGolden } = params;

  try {
    // 1. Award points
    await awardPointsForTask(workerId, taskType, isGoldenTask, passedGolden);
    console.log(`[Gamification] Points awarded for task`);

    // 2. Check and pay referral bonus (if applicable)
    await checkAndPayReferralBonus(workerId);
    console.log(`[Gamification] Referral bonus check complete`);

    // 3. Record streak activity
    await recordStreakActivity(workerId);
    await checkStreakMilestones(workerId, walletAddress);
    console.log(`[Gamification] Streak updated`);
  } catch (error) {
    console.error('[Gamification] Error in post-submission hooks:', error);
    // Don't throw - gamification failures shouldn't block task submission
  }
}

/**
 * Quality bonus hook - Awards bonus points for high accuracy
 * Called when worker's accuracy rate crosses thresholds
 */
export async function checkQualityBonus(
  workerId: string,
  accuracyRate: number
): Promise<void> {
  // Award bonus points for sustained high accuracy
  if (accuracyRate >= 95) {
    const { awardPoints } = await import('@/lib/points/award');
    await awardPoints(workerId, 10, 'quality_bonus');
    console.log(`[Gamification] Quality bonus awarded (95%+ accuracy)`);
  }
}
