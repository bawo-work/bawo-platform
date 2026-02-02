/**
 * Formatting Utilities
 *
 * Common formatting functions for currency, numbers, dates, etc.
 */

/**
 * Format number as USD currency
 * @param amount - Amount in dollars (e.g., 0.05, 10.50, 1000)
 * @returns Formatted string (e.g., "$0.05", "$10.50", "$1,000.00")
 */
export function formatUSD(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) {
    return '$0.00';
  }

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return '$0.00';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
}

/**
 * Format number with commas (e.g., 1000 -> "1,000")
 * @param num - Number to format
 * @returns Formatted string with commas
 */
export function formatNumber(num: number | string | null | undefined): string {
  if (num === null || num === undefined) {
    return '0';
  }

  const numValue = typeof num === 'string' ? parseFloat(num) : num;

  if (isNaN(numValue)) {
    return '0';
  }

  return new Intl.NumberFormat('en-US').format(numValue);
}

/**
 * Format number as percentage
 * @param value - Decimal value (e.g., 0.95 for 95%)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string (e.g., "95%")
 */
export function formatPercentage(
  value: number | string | null | undefined,
  decimals: number = 0
): string {
  if (value === null || value === undefined) {
    return '0%';
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return '0%';
  }

  return `${(numValue * 100).toFixed(decimals)}%`;
}

/**
 * Format compact number (e.g., 1000 -> "1K", 1000000 -> "1M")
 * @param num - Number to format
 * @returns Compact formatted string
 */
export function formatCompactNumber(num: number | string | null | undefined): string {
  if (num === null || num === undefined) {
    return '0';
  }

  const numValue = typeof num === 'string' ? parseFloat(num) : num;

  if (isNaN(numValue)) {
    return '0';
  }

  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(numValue);
}

/**
 * Format date as relative time (e.g., "2 hours ago", "3 days ago")
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - past.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else {
    return past.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}

/**
 * Format date as short date string (e.g., "Jan 15, 2024")
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format time as short time string (e.g., "2:30 PM")
 * @param date - Date string or Date object
 * @returns Formatted time string
 */
export function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
