/**
 * TypeScript types for blockchain operations
 */

export interface PaymentResult {
  txHash: string
  success: boolean
  amount: number
  netAmount?: number
  fee?: number
}

export interface TransferResult {
  txHash: string
  gasPaid: bigint
}

export interface BlockchainError extends Error {
  code?: string
  txHash?: string
}

export interface PaymentDetails {
  workerId: string
  amount: number
  taskId?: string
  type: 'task_payment' | 'withdrawal' | 'referral_bonus' | 'streak_bonus'
}

export interface WithdrawalRequest {
  workerId: string
  amount: number
  walletAddress: string
}

export interface TransactionStatus {
  txHash: string
  status: 'pending' | 'confirmed' | 'failed'
  confirmations: number
  blockNumber?: bigint
}
