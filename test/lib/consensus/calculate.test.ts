/**
 * Unit tests for consensus calculation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { calculateConsensus, hasEnoughResponses, getConsensusWorkers } from '@/lib/consensus/calculate'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [],
          error: null,
        })),
      })),
    })),
  },
}))

describe('Consensus Calculation', () => {
  describe('calculateConsensus', () => {
    it('should return no consensus when fewer than 3 responses', async () => {
      const { supabase } = await import('@/lib/supabase')

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [
              { response: 'positive', worker_id: 'worker1' },
              { response: 'negative', worker_id: 'worker2' },
            ],
            error: null,
          }),
        }),
      } as any)

      const result = await calculateConsensus('task-123')

      expect(result.consensusReached).toBe(false)
      expect(result.finalLabel).toBe(null)
      expect(result.totalResponses).toBe(2)
    })

    it('should detect consensus when 2/3 workers agree', async () => {
      const { supabase } = await import('@/lib/supabase')

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [
              { response: 'positive', worker_id: 'worker1' },
              { response: 'positive', worker_id: 'worker2' },
              { response: 'negative', worker_id: 'worker3' },
            ],
            error: null,
          }),
        }),
      } as any)

      const result = await calculateConsensus('task-123')

      expect(result.consensusReached).toBe(true)
      expect(result.finalLabel).toBe('positive')
      expect(result.agreementCount).toBe(2)
      expect(result.confidence).toBeCloseTo(66.67, 1)
    })

    it('should detect full consensus when all 3 workers agree', async () => {
      const { supabase } = await import('@/lib/supabase')

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [
              { response: 'positive', worker_id: 'worker1' },
              { response: 'positive', worker_id: 'worker2' },
              { response: 'positive', worker_id: 'worker3' },
            ],
            error: null,
          }),
        }),
      } as any)

      const result = await calculateConsensus('task-123')

      expect(result.consensusReached).toBe(true)
      expect(result.finalLabel).toBe('positive')
      expect(result.agreementCount).toBe(3)
      expect(result.confidence).toBe(100)
    })

    it('should return no consensus when all workers disagree (3-way split)', async () => {
      const { supabase } = await import('@/lib/supabase')

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [
              { response: 'positive', worker_id: 'worker1' },
              { response: 'negative', worker_id: 'worker2' },
              { response: 'neutral', worker_id: 'worker3' },
            ],
            error: null,
          }),
        }),
      } as any)

      const result = await calculateConsensus('task-123')

      expect(result.consensusReached).toBe(false)
      expect(result.finalLabel).toBe(null)
      expect(result.agreementCount).toBe(1)
    })
  })

  describe('hasEnoughResponses', () => {
    it('should return true when 3 or more responses exist', async () => {
      const { supabase } = await import('@/lib/supabase')

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            count: 3,
            error: null,
          }),
        }),
      } as any)

      const result = await hasEnoughResponses('task-123')
      expect(result).toBe(true)
    })

    it('should return false when fewer than 3 responses exist', async () => {
      const { supabase } = await import('@/lib/supabase')

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            count: 2,
            error: null,
          }),
        }),
      } as any)

      const result = await hasEnoughResponses('task-123')
      expect(result).toBe(false)
    })
  })

  describe('getConsensusWorkers', () => {
    it('should return workers who gave the consensus answer', async () => {
      const { supabase } = await import('@/lib/supabase')

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [
              { response: 'positive', worker_id: 'worker1' },
              { response: 'positive', worker_id: 'worker2' },
              { response: 'negative', worker_id: 'worker3' },
            ],
            error: null,
          }),
        }),
      } as any)

      const result = await getConsensusWorkers('task-123', 'positive')

      expect(result).toEqual(['worker1', 'worker2'])
      expect(result.length).toBe(2)
    })
  })
})
