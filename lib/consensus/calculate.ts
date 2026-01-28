/**
 * Consensus calculation logic
 * Determines majority agreement among multiple worker responses
 */

import { supabase } from '@/lib/supabase'
import { ConsensusResult, TaskResponse } from './types'

/**
 * Calculate consensus from task responses
 * Requires 2 out of 3 workers to agree (66% threshold)
 *
 * @param taskId Task ID to calculate consensus for
 * @returns Consensus result with final label and confidence
 */
export async function calculateConsensus(taskId: string): Promise<ConsensusResult> {
  // 1. Get all responses for this task
  const { data: responses, error } = await supabase
    .from('task_responses')
    .select('response, worker_id')
    .eq('task_id', taskId)

  if (error) {
    console.error('Failed to fetch task responses:', error)
    throw new Error(`Failed to calculate consensus for task ${taskId}`)
  }

  if (!responses || responses.length < 3) {
    return {
      consensusReached: false,
      finalLabel: null,
      confidence: 0,
      agreementCount: 0,
      totalResponses: responses?.length || 0,
    }
  }

  // 2. Count response frequencies
  const counts: Record<string, number> = {}
  responses.forEach((r) => {
    counts[r.response] = (counts[r.response] || 0) + 1
  })

  // 3. Find majority (2/3 minimum)
  const sortedResponses = Object.entries(counts).sort((a, b) => b[1] - a[1])

  const [finalLabel, agreementCount] = sortedResponses[0]
  const consensusReached = agreementCount >= 2 // 2 out of 3

  // 4. Calculate confidence as percentage
  const confidence = (agreementCount / responses.length) * 100

  return {
    consensusReached,
    finalLabel: consensusReached ? finalLabel : null,
    confidence,
    agreementCount,
    totalResponses: responses.length,
  }
}

/**
 * Check if a task has enough responses for consensus calculation
 * @param taskId Task ID to check
 * @returns True if task has 3 or more responses
 */
export async function hasEnoughResponses(taskId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('task_responses')
    .select('*', { count: 'exact', head: true })
    .eq('task_id', taskId)

  if (error) {
    console.error('Failed to count task responses:', error)
    return false
  }

  return (count || 0) >= 3
}

/**
 * Get workers who agreed with consensus answer
 * Used to determine who gets paid
 *
 * @param taskId Task ID
 * @param consensusLabel The agreed-upon answer
 * @returns Array of worker IDs who gave the consensus answer
 */
export async function getConsensusWorkers(
  taskId: string,
  consensusLabel: string
): Promise<string[]> {
  const { data: responses, error } = await supabase
    .from('task_responses')
    .select('worker_id, response')
    .eq('task_id', taskId)

  if (error || !responses) {
    console.error('Failed to fetch consensus workers:', error)
    return []
  }

  return responses
    .filter((r) => r.response === consensusLabel)
    .map((r) => r.worker_id)
}

/**
 * Calculate consensus confidence for multiple choice
 * Takes into account how close the second-best answer was
 */
export function calculateConsensusStrength(
  agreementCount: number,
  totalResponses: number,
  secondBestCount: number = 0
): number {
  const majorityStrength = (agreementCount / totalResponses) * 100

  // If there's a second-best answer, reduce confidence proportionally
  if (secondBestCount > 0) {
    const gap = agreementCount - secondBestCount
    const gapPenalty = (gap / totalResponses) * 20 // Up to 20% penalty
    return Math.max(majorityStrength - (20 - gapPenalty), 0)
  }

  return majorityStrength
}
