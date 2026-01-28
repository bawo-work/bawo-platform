/**
 * Worker accuracy tracking and reputation management
 */

import { createServerClient } from '@/lib/supabase';

/**
 * Update worker accuracy after golden task completion
 * Calculates new accuracy rate based on golden task results
 */
export async function updateWorkerAccuracy(
  workerId: string,
  correct: boolean
): Promise<void> {
  const serverClient = createServerClient();

  try {
    // Fetch current worker stats
    const { data: worker, error: fetchError } = await serverClient
      .from('workers')
      .select('total_tasks_completed, accuracy_rate')
      .eq('id', workerId)
      .single();

    if (fetchError || !worker) {
      console.error('Error fetching worker:', fetchError);
      return;
    }

    // Calculate new accuracy
    // Note: accuracy_rate is stored as percentage (0-100)
    const totalGoldenTasks = worker.total_tasks_completed || 0;
    const currentAccuracy = worker.accuracy_rate || 0;

    // Calculate total correct from current accuracy
    const currentCorrect = (currentAccuracy / 100) * totalGoldenTasks;
    const newCorrect = currentCorrect + (correct ? 1 : 0);
    const newTotal = totalGoldenTasks + 1;
    const newAccuracy = (newCorrect / newTotal) * 100;

    // Update worker record
    const { error: updateError } = await serverClient
      .from('workers')
      .update({
        accuracy_rate: newAccuracy,
        total_tasks_completed: newTotal,
        updated_at: new Date().toISOString(),
      })
      .eq('id', workerId);

    if (updateError) {
      console.error('Error updating worker accuracy:', updateError);
    }

    // Update reputation tier based on accuracy and task count
    await updateWorkerTier(workerId, newAccuracy, newTotal);
  } catch (error) {
    console.error('Error in updateWorkerAccuracy:', error);
  }
}

/**
 * Update worker tier based on accuracy and task count
 * Tiers: newcomer -> bronze -> silver -> gold -> expert
 */
export async function updateWorkerTier(
  workerId: string,
  accuracy: number,
  tasksCompleted: number
): Promise<void> {
  const serverClient = createServerClient();

  let tier: 'newcomer' | 'bronze' | 'silver' | 'gold' | 'expert' = 'newcomer';

  if (tasksCompleted >= 100 && accuracy >= 95) {
    tier = 'expert';
  } else if (tasksCompleted >= 50 && accuracy >= 90) {
    tier = 'gold';
  } else if (tasksCompleted >= 25 && accuracy >= 85) {
    tier = 'silver';
  } else if (tasksCompleted >= 10 && accuracy >= 80) {
    tier = 'bronze';
  }

  await serverClient
    .from('workers')
    .update({ reputation_tier: tier })
    .eq('id', workerId);
}

/**
 * Get worker accuracy statistics
 */
export async function getWorkerAccuracy(workerId: string): Promise<{
  accuracy: number;
  tasksCompleted: number;
  tier: string;
} | null> {
  const serverClient = createServerClient();

  const { data, error } = await serverClient
    .from('workers')
    .select('accuracy_rate, total_tasks_completed, reputation_tier')
    .eq('id', workerId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    accuracy: data.accuracy_rate,
    tasksCompleted: data.total_tasks_completed,
    tier: data.reputation_tier || 'newcomer',
  };
}

/**
 * Calculate reputation score (0-100) based on accuracy and task count
 */
export function calculateReputationScore(
  accuracy: number,
  tasksCompleted: number
): number {
  // Weight accuracy heavily, but factor in experience
  const accuracyWeight = 0.7;
  const experienceWeight = 0.3;

  // Experience score based on tasks completed (caps at 100 tasks)
  const experienceScore = Math.min(tasksCompleted / 100, 1) * 100;

  const reputationScore =
    accuracy * accuracyWeight + experienceScore * experienceWeight;

  return Math.round(reputationScore * 100) / 100; // Round to 2 decimals
}
