import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format USD amount with 2 decimal places
 * @param amount - Amount in USD
 * @returns Formatted string like "$12.47"
 */
export function formatUSD(amount: number): string {
  return `$${amount.toFixed(2)}`
}

/**
 * Format large numbers with K/M suffix
 * @param num - Number to format
 * @returns Formatted string like "1.2K" or "3.5M"
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}
