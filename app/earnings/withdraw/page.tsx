/**
 * Withdrawal page
 * Allows workers to withdraw their balance
 */

'use client'

import { useState, useEffect } from 'react'
import { WithdrawForm } from '@/components/earnings/WithdrawForm'
import { useRouter } from 'next/navigation'

export default function WithdrawPage() {
  const router = useRouter()
  const [workerId, setWorkerId] = useState<string | null>(null)
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Get workerId from auth context
    // For now, using mock data
    setWorkerId('mock-worker-id')
    setBalance(12.47)
    setLoading(false)
  }, [])

  const handleSuccess = (txHash: string, amount: number) => {
    // Update balance locally
    setBalance((prev) => prev - amount)

    // Redirect to earnings page after 3 seconds
    setTimeout(() => {
      router.push('/earnings')
    }, 3000)
  }

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
        <p>Please log in to withdraw</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-semibold text-warm-gray-800">
          Withdraw Earnings
        </h1>
        <p className="text-warm-gray-600">
          Transfer your balance to your MiniPay wallet
        </p>
      </div>

      <WithdrawForm
        workerId={workerId}
        balance={balance}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
