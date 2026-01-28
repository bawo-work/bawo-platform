/**
 * Withdrawal form component
 * Allows workers to withdraw their balance to MiniPay
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface WithdrawFormProps {
  workerId: string
  balance: number
  onSuccess?: (txHash: string, amount: number) => void
  onError?: (error: string) => void
}

export function WithdrawForm({
  workerId,
  balance,
  onSuccess,
  onError,
}: WithdrawFormProps) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleWithdrawAll = () => {
    setAmount(balance.toFixed(2))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const amountNum = parseFloat(amount)

      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Please enter a valid amount')
      }

      if (amountNum > balance) {
        throw new Error(`Amount exceeds available balance ($${balance.toFixed(2)})`)
      }

      const response = await fetch('/api/v1/earnings/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workerId,
          amount: amountNum,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Withdrawal failed')
      }

      setSuccess(
        `Successfully withdrew $${data.data.amountSent.toFixed(2)}! Check your MiniPay wallet.`
      )
      setAmount('')

      if (onSuccess) {
        onSuccess(data.data.txHash, data.data.amountSent)
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Withdrawal failed'
      setError(errorMsg)
      if (onError) {
        onError(errorMsg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Available balance */}
      <div className="rounded-lg bg-cream p-4">
        <p className="text-sm text-warm-gray-600">Available Balance</p>
        <p className="text-2xl font-semibold text-warm-gray-800">
          ${balance.toFixed(2)}
        </p>
      </div>

      {/* Amount input */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount to Withdraw</Label>
        <div className="flex gap-2">
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0.01"
            max={balance}
            step="0.01"
            disabled={loading}
            className="flex-1"
            required
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleWithdrawAll}
            disabled={loading || balance === 0}
          >
            Max
          </Button>
        </div>
        <p className="text-xs text-warm-gray-600">
          Minimum: $0.01 • No withdrawal fees
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Submit button */}
      <Button
        type="submit"
        disabled={loading || !amount || balance === 0}
        className="h-12 w-full"
      >
        {loading ? 'Processing...' : 'Withdraw Now'}
      </Button>

      {/* M-PESA cash out link */}
      <div className="rounded-lg border border-warm-gray-200 bg-warm-white p-4">
        <p className="mb-2 text-sm font-medium text-warm-gray-800">
          Need cash?
        </p>
        <p className="mb-2 text-xs text-warm-gray-600">
          After withdrawal, you can convert cUSD to M-PESA in ~55 seconds
        </p>
        <a
          href="https://minipay.opera.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-teal-700 hover:underline"
        >
          Cash out to M-PESA →
        </a>
      </div>
    </form>
  )
}
