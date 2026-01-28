/**
 * Types for consensus mechanism
 */

export interface ConsensusResult {
  consensusReached: boolean
  finalLabel: string | null
  confidence: number
  agreementCount: number
  totalResponses: number
}

export interface TaskResponse {
  id: string
  task_id: string
  worker_id: string
  response: string
  response_time_seconds: number
  submitted_at: string
}

export interface ConsensusTask {
  id: string
  project_id: string
  content: string
  task_type: string
  pay_amount: number
  assigned_to: string[]
  status: string
}
