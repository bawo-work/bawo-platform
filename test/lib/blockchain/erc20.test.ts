/**
 * Unit tests for ERC20 token operations
 */

import { describe, it, expect, vi } from 'vitest'
import { usdToWei, weiToUsd } from '@/lib/blockchain/erc20'
import { parseUnits, formatUnits } from 'viem'

describe('ERC20 Token Operations', () => {
  describe('usdToWei', () => {
    it('should convert USD to wei correctly', () => {
      expect(usdToWei(1)).toBe(parseUnits('1', 18))
      expect(usdToWei(0.05)).toBe(parseUnits('0.05', 18))
      expect(usdToWei(100)).toBe(parseUnits('100', 18))
    })

    it('should handle decimal amounts', () => {
      expect(usdToWei(1.5)).toBe(parseUnits('1.5', 18))
      expect(usdToWei(0.123456)).toBe(parseUnits('0.123456', 18))
    })
  })

  describe('weiToUsd', () => {
    it('should convert wei to USD correctly', () => {
      const oneToken = parseUnits('1', 18)
      expect(weiToUsd(oneToken)).toBe(1)

      const halfToken = parseUnits('0.5', 18)
      expect(weiToUsd(halfToken)).toBe(0.5)
    })

    it('should handle small amounts', () => {
      const smallAmount = parseUnits('0.0001', 18)
      expect(weiToUsd(smallAmount)).toBeCloseTo(0.0001, 4)
    })

    it('should handle large amounts', () => {
      const largeAmount = parseUnits('1000000', 18)
      expect(weiToUsd(largeAmount)).toBe(1000000)
    })
  })

  describe('round-trip conversion', () => {
    it('should maintain precision through round-trip conversion', () => {
      const amounts = [1, 0.05, 100, 0.123456, 999.99]

      amounts.forEach((amount) => {
        const wei = usdToWei(amount)
        const backToUsd = weiToUsd(wei)
        expect(backToUsd).toBeCloseTo(amount, 6)
      })
    })
  })
})
