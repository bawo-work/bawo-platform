/**
 * Unit tests for withdrawal operations
 */

import { describe, it, expect, vi } from 'vitest'
import { validateWithdrawal } from '@/lib/api/withdraw'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

describe('Withdrawal Operations', () => {
  describe('validateWithdrawal', () => {
    it('should reject negative amounts', async () => {
      const { supabase } = await import('@/lib/supabase')

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { balance_usd: 100, wallet_address: '0x123' },
              error: null,
            }),
          }),
        }),
      } as any)

      const result = await validateWithdrawal({
        workerId: 'worker-123',
        amountUSD: -5,
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Amount must be positive')
    })

    it('should reject amounts below minimum', async () => {
      const { supabase } = await import('@/lib/supabase')

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { balance_usd: 100, wallet_address: '0x123' },
              error: null,
            }),
          }),
        }),
      } as any)

      const result = await validateWithdrawal({
        workerId: 'worker-123',
        amountUSD: 0.005,
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Minimum withdrawal is $0.01')
    })

    it('should reject amounts exceeding balance', async () => {
      const { supabase } = await import('@/lib/supabase')

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { balance_usd: 10, wallet_address: '0x123' },
              error: null,
            }),
          }),
        }),
      } as any)

      const result = await validateWithdrawal({
        workerId: 'worker-123',
        amountUSD: 20,
      })

      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.includes('Insufficient balance'))).toBe(true)
    })

    it('should accept valid withdrawal requests', async () => {
      const { supabase } = await import('@/lib/supabase')

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { balance_usd: 50, wallet_address: '0x123' },
              error: null,
            }),
          }),
        }),
      } as any)

      const result = await validateWithdrawal({
        workerId: 'worker-123',
        amountUSD: 25,
      })

      expect(result.valid).toBe(true)
      expect(result.errors.length).toBe(0)
    })

    it('should reject when worker has no wallet address', async () => {
      const { supabase } = await import('@/lib/supabase')

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { balance_usd: 50, wallet_address: null },
              error: null,
            }),
          }),
        }),
      } as any)

      const result = await validateWithdrawal({
        workerId: 'worker-123',
        amountUSD: 10,
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('No wallet address configured')
    })
  })
})
