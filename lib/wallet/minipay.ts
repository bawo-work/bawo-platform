// MiniPay Wallet Detection and Auto-Connection Utilities

import type { WalletDetectionResult } from './types';

/**
 * Helper function to add timeout to promises
 */
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutHandle);
    return result;
  } catch (error) {
    clearTimeout(timeoutHandle);
    throw error;
  }
}

/**
 * Detects MiniPay wallet and auto-captures wallet address
 *
 * MiniPay browser injects window.ethereum with isMiniPay flag.
 * This function checks for the provider and automatically retrieves
 * the wallet address without requiring manual connection.
 *
 * @returns Promise<WalletDetectionResult> - address if detected, null otherwise
 */
export async function detectMiniPayWallet(): Promise<WalletDetectionResult> {
  // Server-side guard
  if (typeof window === 'undefined') {
    return {
      address: null,
      isMiniPay: false,
      error: 'Not in browser environment'
    };
  }

  // Check for Ethereum provider
  if (!window.ethereum) {
    return {
      address: null,
      isMiniPay: false,
      error: 'No Ethereum provider detected'
    };
  }

  // Check if it's MiniPay specifically
  const isMiniPay = window.ethereum.isMiniPay === true;

  // DEV MODE: Allow any wallet (MetaMask, etc.) in development
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (!isMiniPay && !isDevelopment) {
    return {
      address: null,
      isMiniPay: false,
      error: 'Not MiniPay browser'
    };
  }

  // In dev mode, treat any wallet as "MiniPay" for testing
  const treatAsMiniPay = isMiniPay || isDevelopment;

  try {
    // Request accounts with 10-second timeout - MiniPay auto-approves this without user prompt
    const accounts = await withTimeout(
      window.ethereum.request({
        method: 'eth_accounts'
      }) as Promise<unknown>,
      10000,
      'Wallet request timed out'
    );

    if (Array.isArray(accounts) && accounts.length > 0) {
      return {
        address: accounts[0] as string,
        isMiniPay: treatAsMiniPay
      };
    }

    // If no accounts returned, try requesting permission with 30-second timeout
    const requestedAccounts = await withTimeout(
      window.ethereum.request({
        method: 'eth_requestAccounts'
      }) as Promise<unknown>,
      30000,
      'Wallet connection request timed out. Please unlock your wallet and try again.'
    );

    if (Array.isArray(requestedAccounts) && requestedAccounts.length > 0) {
      return {
        address: requestedAccounts[0] as string,
        isMiniPay: treatAsMiniPay
      };
    }

    return {
      address: null,
      isMiniPay: treatAsMiniPay,
      error: 'No accounts available'
    };

  } catch (error) {
    console.error('MiniPay detection failed:', error);
    return {
      address: null,
      isMiniPay: treatAsMiniPay,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Formats wallet address for display (last 6 characters)
 * @param address - Full wallet address
 * @returns Formatted address like "0x...abc123"
 */
export function formatWalletAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `0x...${address.slice(-6)}`;
}

/**
 * Validates Ethereum address format
 * @param address - Address to validate
 * @returns true if valid Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Checks if user is in MiniPay browser (synchronous check)
 * @returns boolean - true if MiniPay detected (or dev mode)
 */
export function isMiniPayBrowser(): boolean {
  if (typeof window === 'undefined') return false;

  // DEV MODE: Treat any wallet as MiniPay in development
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment && window.ethereum) return true;

  return window.ethereum?.isMiniPay === true;
}
