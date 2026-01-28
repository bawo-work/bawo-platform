// Worker API Functions

import { supabase } from '@/lib/supabase';
import type {
  Worker,
  WorkerProfileInput,
  WorkerStats,
  ApiResponse,
  WorkerTier
} from './types';

/**
 * Creates a new worker profile in Supabase
 *
 * @param input - Worker profile data
 * @returns Promise<ApiResponse<Worker>>
 */
export async function createWorkerProfile(
  input: WorkerProfileInput
): Promise<ApiResponse<Worker>> {
  try {
    const { data, error } = await supabase
      .from('workers')
      .insert({
        wallet_address: input.walletAddress,
        self_did: input.selfDid || null,
        phone_number: input.phoneNumber || null,
        verification_level: input.verificationLevel,
        language_skills: [],
        reputation_score: 0,
        total_tasks_completed: 0,
        accuracy_rate: 0,
        tier: 'newcomer' as WorkerTier
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create worker profile:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }

    return {
      data,
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Unexpected error creating worker profile:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    };
  }
}

/**
 * Gets worker profile by wallet address
 *
 * @param walletAddress - Worker's wallet address
 * @returns Promise<ApiResponse<Worker>>
 */
export async function getWorkerByWallet(
  walletAddress: string
): Promise<ApiResponse<Worker>> {
  try {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (error) {
      // If not found, return null data (not an error state)
      if (error.code === 'PGRST116') {
        return {
          data: null,
          error: null,
          success: true
        };
      }

      return {
        data: null,
        error: error.message,
        success: false
      };
    }

    return {
      data,
      error: null,
      success: true
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    };
  }
}

/**
 * Updates worker profile
 *
 * @param workerId - Worker's UUID
 * @param updates - Partial worker data to update
 * @returns Promise<ApiResponse<Worker>>
 */
export async function updateWorkerProfile(
  workerId: string,
  updates: Partial<Worker>
): Promise<ApiResponse<Worker>> {
  try {
    const { data, error } = await supabase
      .from('workers')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', workerId)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: error.message,
        success: false
      };
    }

    return {
      data,
      error: null,
      success: true
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    };
  }
}

/**
 * Gets worker statistics
 *
 * @param workerId - Worker's UUID
 * @returns Promise<ApiResponse<WorkerStats>>
 */
export async function getWorkerStats(
  workerId: string
): Promise<ApiResponse<WorkerStats>> {
  try {
    // Get worker data
    const { data: worker, error: workerError } = await supabase
      .from('workers')
      .select('total_tasks_completed, accuracy_rate, tier')
      .eq('id', workerId)
      .single();

    if (workerError) {
      return {
        data: null,
        error: workerError.message,
        success: false
      };
    }

    // Get earnings data (from transactions)
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('amount_usd, created_at')
      .eq('worker_id', workerId)
      .eq('status', 'confirmed');

    if (txError) {
      console.error('Failed to fetch transactions:', txError);
    }

    const earningsLifetime = transactions?.reduce(
      (sum, tx) => sum + Number(tx.amount_usd),
      0
    ) || 0;

    const today = new Date().toISOString().split('T')[0];
    const earningsToday = transactions?.filter(
      tx => tx.created_at.startsWith(today)
    ).reduce((sum, tx) => sum + Number(tx.amount_usd), 0) || 0;

    // Calculate streak (mock for now)
    const streak = 0; // TODO: Implement actual streak calculation

    return {
      data: {
        tasksCompleted: worker.total_tasks_completed,
        accuracy: worker.accuracy_rate,
        tier: worker.tier,
        earningsLifetime,
        earningsToday,
        streak
      },
      error: null,
      success: true
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    };
  }
}

/**
 * Upgrades worker verification level
 *
 * @param workerId - Worker's UUID
 * @param newLevel - New verification level
 * @param selfDid - Optional Self Protocol DID
 * @returns Promise<ApiResponse<Worker>>
 */
export async function upgradeWorkerVerification(
  workerId: string,
  newLevel: number,
  selfDid?: string
): Promise<ApiResponse<Worker>> {
  try {
    const updates: Partial<Worker> = {
      verification_level: newLevel
    };

    if (selfDid) {
      updates.self_did = selfDid;
    }

    return await updateWorkerProfile(workerId, updates);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    };
  }
}

/**
 * Determines worker tier based on stats
 *
 * @param tasksCompleted - Total tasks completed
 * @param accuracy - Accuracy rate (0-100)
 * @returns WorkerTier
 */
export function calculateWorkerTier(
  tasksCompleted: number,
  accuracy: number
): WorkerTier {
  if (tasksCompleted >= 1000 && accuracy >= 95) return 'expert';
  if (tasksCompleted >= 500 && accuracy >= 90) return 'gold';
  if (tasksCompleted >= 100 && accuracy >= 85) return 'silver';
  if (tasksCompleted >= 10 && accuracy >= 75) return 'bronze';
  return 'newcomer';
}
