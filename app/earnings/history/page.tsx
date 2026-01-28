/**
 * Transaction history page
 * Shows all worker transactions with filters
 */

'use client'

import { useState, useEffect } from 'react'
import { TransactionList } from '@/components/earnings/TransactionList'
import { getTransactionStats } from '@/lib/api/transactions'

export default function TransactionHistoryPage() {
  const [workerId, setWorkerId] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalEarned: 0,
    totalWithdrawn: 0,
    totalFees: 0,
    transactionCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Get workerId from auth context
    // For now, using mock data
    setWorkerId('mock-worker-id')

    async function fetchStats() {
      try {
        const data = await getTransactionStats('mock-worker-id')
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!workerId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Please log in to view transaction history</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-semibold text-warm-gray-800">
          Transaction History
        </h1>
        <p className="text-warm-gray-600">
          All your earnings and withdrawals
        </p>
      </div>

      {/* Stats cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-cream p-4">
          <p className="text-xs text-warm-gray-600">Total Earned</p>
          <p className="text-lg font-semibold text-green-600">
            ${stats.totalEarned.toFixed(2)}
          </p>
        </div>

        <div className="rounded-lg bg-cream p-4">
          <p className="text-xs text-warm-gray-600">Total Withdrawn</p>
          <p className="text-lg font-semibold text-warm-gray-800">
            ${stats.totalWithdrawn.toFixed(2)}
          </p>
        </div>

        <div className="rounded-lg bg-cream p-4">
          <p className="text-xs text-warm-gray-600">Total Fees</p>
          <p className="text-lg font-semibold text-warm-gray-600">
            ${stats.totalFees.toFixed(4)}
          </p>
        </div>

        <div className="rounded-lg bg-cream p-4">
          <p className="text-xs text-warm-gray-600">Transactions</p>
          <p className="text-lg font-semibold text-warm-gray-800">
            {stats.transactionCount}
          </p>
        </div>
      </div>

      {/* Transaction list */}
      <div>
        <h2 className="mb-4 text-lg font-medium text-warm-gray-800">
          Recent Transactions
        </h2>
        <TransactionList workerId={workerId} limit={50} />
      </div>
    </div>
  )
}
