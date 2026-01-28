/**
 * Points Program - Award and track worker points
 * Points expire after 12 months
 */

import { supabase } from '@/lib/supabase/client';

export type ActivityType =
  | 'training_task'
  | 'golden_bonus'
  | 'referral_bonus'
  | 'streak_bonus'
  | 'quality_bonus';

/**
 * Award points to a worker for completing an activity
 */
export async function awardPoints(
  workerId: string,
  points: number,
  activityType: ActivityType
): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 12 months from now

  const { error } = await supabase.from('points_ledger').insert({
    worker_id: workerId,
    points,
    activity_type: activityType,
    issued_at: new Date().toISOString(),
    expires_at: expiresAt.toISOString(),
    redeemed: false,
  });

  if (error) {
    console.error('Error awarding points:', error);
    throw new Error('Failed to award points');
  }
}

/**
 * Get worker's available (non-redeemed, non-expired) points balance
 */
export async function getAvailablePoints(workerId: string): Promise<number> {
  const { data, error } = await supabase
    .from('points_ledger')
    .select('points')
    .eq('worker_id', workerId)
    .eq('redeemed', false)
    .gt('expires_at', new Date().toISOString());

  if (error) {
    console.error('Error fetching points:', error);
    return 0;
  }

  return data?.reduce((sum, record) => sum + record.points, 0) || 0;
}

/**
 * Get points breakdown by activity type
 */
export async function getPointsBreakdown(workerId: string): Promise<{
  activityType: ActivityType;
  points: number;
}[]> {
  const { data, error } = await supabase
    .from('points_ledger')
    .select('activity_type, points')
    .eq('worker_id', workerId)
    .eq('redeemed', false)
    .gt('expires_at', new Date().toISOString());

  if (error) {
    console.error('Error fetching points breakdown:', error);
    return [];
  }

  // Group by activity type
  const breakdown = new Map<ActivityType, number>();
  data?.forEach((record) => {
    const current = breakdown.get(record.activity_type as ActivityType) || 0;
    breakdown.set(record.activity_type as ActivityType, current + record.points);
  });

  return Array.from(breakdown.entries()).map(([activityType, points]) => ({
    activityType,
    points,
  }));
}

/**
 * Award points after task completion
 */
export async function awardPointsForTask(
  workerId: string,
  taskType: string,
  isGoldenTask: boolean,
  passedGolden: boolean
): Promise<void> {
  // Base points for training tasks
  if (taskType !== 'golden') {
    await awardPoints(workerId, 5, 'training_task');
  }

  // Bonus for passing golden task
  if (isGoldenTask && passedGolden) {
    await awardPoints(workerId, 2, 'golden_bonus');
  }
}
