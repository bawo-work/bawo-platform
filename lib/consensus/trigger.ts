/**
 * Payment trigger after consensus reached
 * Checks consensus and initiates payment to workers who agreed
 */

import { supabase } from '@/lib/supabase'
import { calculateConsensus, getConsensusWorkers } from './calculate'
import { payWorker } from '@/lib/blockchain/payments'

/**
 * Check if consensus reached and trigger payments
 * Called after each task response submission
 *
 * @param taskId Task ID to check
 */
export async function checkAndTriggerPayment(taskId: string): Promise<void> {
  try {
    // 1. Calculate consensus
    const consensus = await calculateConsensus(taskId)

    if (!consensus.consensusReached) {
      console.log(`Task ${taskId}: No consensus yet (${consensus.totalResponses}/3 responses)`)
      return
    }

    console.log(`Task ${taskId}: Consensus reached! Answer: "${consensus.finalLabel}" (${consensus.confidence.toFixed(1)}% confidence)`)

    // 2. Update task with final label and consensus info
    const { error: updateError } = await supabase
      .from('tasks')
      .update({
        final_label: consensus.finalLabel,
        consensus_reached: true,
        confidence_score: consensus.confidence,
        status: 'completed',
      })
      .eq('id', taskId)

    if (updateError) {
      console.error('Failed to update task with consensus:', updateError)
      throw new Error('Failed to update task status')
    }

    // 3. Get task details for payment
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('pay_amount, project_id')
      .eq('id', taskId)
      .single()

    if (taskError || !task) {
      console.error('Failed to fetch task details:', taskError)
      throw new Error('Task not found')
    }

    // 4. Get workers who agreed with consensus
    const winnerIds = await getConsensusWorkers(taskId, consensus.finalLabel!)

    console.log(`Paying ${winnerIds.length} workers who gave consensus answer`)

    // 5. Pay each winning worker
    const paymentPromises = winnerIds.map((workerId) =>
      payWorker(workerId, task.pay_amount, taskId)
    )

    await Promise.all(paymentPromises)

    console.log(`✅ Task ${taskId}: Successfully paid ${winnerIds.length} workers`)
  } catch (error) {
    console.error('Error in checkAndTriggerPayment:', error)
    // Don't throw - we want to continue processing even if payment fails
    // Payment can be retried later via a background job
  }
}

/**
 * Handle non-consensus tasks (for manual review or rejection)
 * @param taskId Task ID with no consensus
 */
export async function handleNoConsensus(taskId: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update({
      status: 'review_needed',
      consensus_reached: false,
    })
    .eq('id', taskId)

  if (error) {
    console.error('Failed to mark task for review:', error)
  }
}

/**
 * Batch process pending consensus tasks
 * Run this periodically to catch any missed consensus triggers
 */
export async function processPendingConsensus(): Promise<number> {
  // Get tasks with 3+ responses but not yet processed
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('id')
    .eq('status', 'assigned')
    .eq('consensus_reached', false)

  if (error || !tasks) {
    console.error('Failed to fetch pending tasks:', error)
    return 0
  }

  let processed = 0

  for (const task of tasks) {
    await checkAndTriggerPayment(task.id)
    processed++
  }

  return processed
}
