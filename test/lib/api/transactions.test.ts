/**
 * Unit tests for transaction operations
 */

import { describe, it, expect, vi } from 'vitest'
import { getTransactionStats } from '@/lib/api/transactions'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

describe('Transaction Operations', () => {
  describe('getTransactionStats', () => {
    it('should calculate stats correctly with mixed transaction types', async () => {
      const { supabase } = await import('@/lib/supabase')

      const mockTransactions = [
        { amount_usd: 5.0, tx_type: 'task_payment', fee_usd: 0.001 },
        { amount_usd: 3.0, tx_type: 'task_payment', fee_usd: 0.001 },
        { amount_usd: -10.0, tx_type: 'withdrawal', fee_usd: 0.002 },
        { amount_usd: 1.0, tx_type: 'referral_bonus', fee_usd: 0.001 },
      ]

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: mockTransactions,
              error: null,
            }),
          }),
        }),
      } as any)

      const stats = await getTransactionStats('worker-123')

      expect(stats.totalEarned).toBe(9.0) // 5 + 3 + 1
      expect(stats.totalWithdrawn).toBe(10.0)
      expect(stats.totalFees).toBeCloseTo(0.005, 3)
      expect(stats.transactionCount).toBe(4)
    })

    it('should return zero stats when no transactions exist', async () => {
      const { supabase } = await import('@/lib/supabase')

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      } as any)

      const stats = await getTransactionStats('worker-123')

      expect(stats.totalEarned).toBe(0)
      expect(stats.totalWithdrawn).toBe(0)
      expect(stats.totalFees).toBe(0)
      expect(stats.transactionCount).toBe(0)
    })

    it('should handle errors gracefully', async () => {
      const { supabase } = await import('@/lib/supabase')

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      } as any)

      const stats = await getTransactionStats('worker-123')

      expect(stats.totalEarned).toBe(0)
      expect(stats.totalWithdrawn).toBe(0)
    })
  })
})
