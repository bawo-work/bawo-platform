/**
 * Transaction item component
 * Displays a single transaction with details
 */

'use client'

import { BLOCK_EXPLORER_URL } from '@/lib/blockchain/config'
import { formatDistanceToNow } from 'date-fns'

interface Transaction {
  id: string
  amount_usd: number
  fee_usd?: number
  tx_type: 'task_payment' | 'withdrawal' | 'referral_bonus' | 'streak_bonus'
  tx_hash?: string
  status: 'pending' | 'confirmed' | 'failed'
  created_at: string
}

interface TransactionItemProps {
  transaction: Transaction
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const getTypeLabel = () => {
    switch (transaction.tx_type) {
      case 'task_payment':
        return { icon: '📝', label: 'Task Payment' }
      case 'withdrawal':
        return { icon: '💸', label: 'Withdrawal' }
      case 'referral_bonus':
        return { icon: '🎁', label: 'Referral Bonus' }
      case 'streak_bonus':
        return { icon: '🔥', label: 'Streak Bonus' }
      default:
        return { icon: '💰', label: 'Payment' }
    }
  }

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'confirmed':
        return 'text-green-600'
      case 'pending':
        return 'text-amber-600'
      case 'failed':
        return 'text-red-600'
      default:
        return 'text-warm-gray-600'
    }
  }

  const getStatusLabel = () => {
    switch (transaction.status) {
      case 'confirmed':
        return 'Confirmed'
      case 'pending':
        return 'Pending'
      case 'failed':
        return 'Failed'
      default:
        return transaction.status
    }
  }

  const typeInfo = getTypeLabel()
  const amount = parseFloat(transaction.amount_usd?.toString() || '0')
  const fee = parseFloat(transaction.fee_usd?.toString() || '0')

  // Format date
  const date = new Date(transaction.created_at)
  const relativeTime = formatDistanceToNow(date, { addSuffix: true })

  return (
    <div className="flex items-center justify-between rounded-lg bg-cream p-4 transition-colors hover:bg-sand">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">{typeInfo.icon}</span>
          <div>
            <p className="font-medium text-warm-gray-800">{typeInfo.label}</p>
            <p className="text-xs text-warm-gray-600">{relativeTime}</p>
          </div>
        </div>

        {/* Transaction hash link */}
        {transaction.tx_hash && (
          <a
            href={`${BLOCK_EXPLORER_URL}/tx/${transaction.tx_hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-xs text-teal-700 hover:underline"
          >
            View on Explorer →
          </a>
        )}

        {/* Fee display for withdrawals */}
        {fee > 0 && transaction.tx_type === 'withdrawal' && (
          <p className="mt-1 text-xs text-warm-gray-500">
            Fee: ${fee.toFixed(4)}
          </p>
        )}
      </div>

      <div className="text-right">
        <div className="text-lg font-semibold text-warm-gray-800">
          {amount > 0 ? '+' : ''}${Math.abs(amount).toFixed(2)}
        </div>
        <div className={`text-xs ${getStatusColor()}`}>
          {getStatusLabel()}
        </div>
      </div>
    </div>
  )
}
