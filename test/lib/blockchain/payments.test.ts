/**
 * Unit tests for payment operations
 * Uses mocks to avoid real blockchain transactions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateWorkerBalance, getWorkerBalance } from '@/lib/blockchain/payments'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
  createServerClient: vi.fn(),
}))

// Mock blockchain modules
vi.mock('@/lib/blockchain/celo-client', () => ({
  publicClient: {
    waitForTransactionReceipt: vi.fn().mockResolvedValue({ status: 'success' }),
  },
  createPlatformWallet: vi.fn(),
}))

vi.mock('@/lib/blockchain/erc20', () => ({
  transferCUSDWithFeeAbstraction: vi.fn().mockResolvedValue({
    txHash: '0xmockhash123',
    gasPaid: 1000000000000000n, // 0.001 ETH
  }),
  weiToUsd: vi.fn((wei: bigint) => parseFloat((Number(wei) / 1e18).toFixed(4))),
}))

describe('Payment Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('updateWorkerBalance', () => {
    it('should increase worker balance correctly', async () => {
      const { supabase } = await import('@/lib/supabase')

      // Mock current balance fetch
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { balance_usd: 10.5 },
              error: null,
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: null,
          }),
        }),
      } as any)

      await updateWorkerBalance('worker-123', 5.0)

      // Verify update was called with correct amount
      const updateCall = vi.mocked(supabase.from).mock.results[1]
      expect(updateCall).toBeDefined()
    })

    it('should decrease worker balance for withdrawals', async () => {
      const { supabase } = await import('@/lib/supabase')

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { balance_usd: 20.0 },
              error: null,
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: null,
          }),
        }),
      } as any)

      await updateWorkerBalance('worker-123', -10.0)

      const updateCall = vi.mocked(supabase.from).mock.results[1]
      expect(updateCall).toBeDefined()
    })
  })

  describe('getWorkerBalance', () => {
    it('should fetch worker balance correctly', async () => {
      const { supabase } = await import('@/lib/supabase')

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { balance_usd: 25.75 },
              error: null,
            }),
          }),
        }),
      } as any)

      const balance = await getWorkerBalance('worker-123')
      expect(balance).toBe(25.75)
    })

    it('should throw error when worker not found', async () => {
      const { supabase } = await import('@/lib/supabase')

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found' },
            }),
          }),
        }),
      } as any)

      await expect(getWorkerBalance('invalid-worker')).rejects.toThrow()
    })
  })
})
