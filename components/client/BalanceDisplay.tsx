'use client'

import { useEffect, useState } from 'react'
import { Wallet } from 'lucide-react'
import { getCurrentClient } from '@/lib/auth/client'

export function BalanceDisplay() {
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBalance() {
      try {
        const client = await getCurrentClient()
        if (client) {
          setBalance(client.balance_usd)
        }
      } catch (error) {
        console.error('Failed to fetch balance:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md animate-pulse">
        <Wallet className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-md">
      <Wallet className="w-4 h-4 text-teal-700" />
      <span className="text-sm font-medium text-teal-900">
        ${balance?.toFixed(2) || '0.00'} cUSD
      </span>
    </div>
  )
}
