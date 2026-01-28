/**
 * Transaction history API
 * Fetches and manages transaction records
 */

import { supabase } from '@/lib/supabase'

export interface Transaction {
  id: string
  worker_id: string
  amount_usd: number
  fee_usd?: number
  tx_type: 'task_payment' | 'withdrawal' | 'referral_bonus' | 'streak_bonus'
  tx_hash?: string
  status: 'pending' | 'confirmed' | 'failed'
  task_id?: string
  created_at: string
}

/**
 * Get transaction history for a worker
 * @param workerId Worker ID
 * @param limit Maximum number of records (default 50)
 * @param offset Offset for pagination
 * @returns Array of transactions
 */
export async function getTransactionHistory(
  workerId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('worker_id', workerId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Failed to fetch transaction history:', error)
    throw new Error('Failed to fetch transactions')
  }

  return (data as Transaction[]) || []
}

/**
 * Get transaction by ID
 * @param transactionId Transaction ID
 * @returns Transaction details
 */
export async function getTransactionById(
  transactionId: string
): Promise<Transaction | null> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', transactionId)
    .single()

  if (error) {
    console.error('Failed to fetch transaction:', error)
    return null
  }

  return data as Transaction
}

/**
 * Get transaction statistics for a worker
 * @param workerId Worker ID
 * @returns Statistics object
 */
export async function getTransactionStats(workerId: string) {
  // Get all confirmed transactions
  const { data, error } = await supabase
    .from('transactions')
    .select('amount_usd, tx_type, fee_usd')
    .eq('worker_id', workerId)
    .eq('status', 'confirmed')

  if (error || !data) {
    console.error('Failed to fetch transaction stats:', error)
    return {
      totalEarned: 0,
      totalWithdrawn: 0,
      totalFees: 0,
      transactionCount: 0,
    }
  }

  // Calculate totals
  const stats = data.reduce(
    (acc, tx) => {
      const amount = parseFloat(tx.amount_usd?.toString() || '0')
      const fee = parseFloat(tx.fee_usd?.toString() || '0')

      if (tx.tx_type === 'withdrawal') {
        acc.totalWithdrawn += Math.abs(amount)
      } else {
        acc.totalEarned += amount
      }

      acc.totalFees += fee
      acc.transactionCount++

      return acc
    },
    {
      totalEarned: 0,
      totalWithdrawn: 0,
      totalFees: 0,
      transactionCount: 0,
    }
  )

  return stats
}

/**
 * Get transactions by type
 * @param workerId Worker ID
 * @param txType Transaction type
 * @param limit Maximum number of records
 * @returns Array of filtered transactions
 */
export async function getTransactionsByType(
  workerId: string,
  txType: Transaction['tx_type'],
  limit: number = 50
): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('worker_id', workerId)
    .eq('tx_type', txType)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Failed to fetch transactions by type:', error)
    return []
  }

  return (data as Transaction[]) || []
}

/**
 * Get recent transactions (last 24 hours)
 * @param workerId Worker ID
 * @returns Array of recent transactions
 */
export async function getRecentTransactions(
  workerId: string
): Promise<Transaction[]> {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('worker_id', workerId)
    .gte('created_at', yesterday.toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch recent transactions:', error)
    return []
  }

  return (data as Transaction[]) || []
}
