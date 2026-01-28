import { describe, it, expect } from 'vitest'
import { formatUSD, formatNumber } from '@/lib/utils'

describe('formatUSD', () => {
  it('formats USD amounts with 2 decimal places', () => {
    expect(formatUSD(12.47)).toBe('$12.47')
    expect(formatUSD(0.05)).toBe('$0.05')
    expect(formatUSD(1000)).toBe('$1000.00')
  })

  it('rounds to 2 decimal places', () => {
    expect(formatUSD(12.476)).toBe('$12.48')
    expect(formatUSD(12.474)).toBe('$12.47')
  })
})

describe('formatNumber', () => {
  it('formats large numbers with K suffix', () => {
    expect(formatNumber(1200)).toBe('1.2K')
    expect(formatNumber(5000)).toBe('5.0K')
  })

  it('formats large numbers with M suffix', () => {
    expect(formatNumber(1200000)).toBe('1.2M')
    expect(formatNumber(3500000)).toBe('3.5M')
  })

  it('returns small numbers as-is', () => {
    expect(formatNumber(50)).toBe('50')
    expect(formatNumber(999)).toBe('999')
  })
})
