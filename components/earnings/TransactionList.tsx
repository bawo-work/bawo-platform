/**
 * Transaction list component
 * Displays transaction history for a worker
 */

'use client'

import { useEffect, useState } from 'react'
import { TransactionItem } from './TransactionItem'
import { getTransactionHistory } from '@/lib/api/transactions'

interface Transaction {
  id: string
  amount_usd: number
  fee_usd?: number
  tx_type: 'task_payment' | 'withdrawal' | 'referral_bonus' | 'streak_bonus'
  tx_hash?: string
  status: 'pending' | 'confirmed' | 'failed'
  created_at: string
}

interface TransactionListProps {
  workerId: string
  limit?: number
}

export function TransactionList({ workerId, limit = 50 }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true)
        const data = await getTransactionHistory(workerId, limit)
        setTransactions(data)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to load transactions')
      } finally {
        setLoading(false)
      }
    }

    if (workerId) {
      fetchTransactions()
    }
  }, [workerId, limit])

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-lg bg-warm-gray-200"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-700">
        {error}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-lg bg-cream p-8 text-center">
        <p className="text-warm-gray-600">No transactions yet</p>
        <p className="mt-2 text-sm text-warm-gray-500">
          Complete your first task to start earning!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </div>
  )
}
