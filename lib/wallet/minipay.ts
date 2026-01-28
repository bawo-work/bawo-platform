// MiniPay Wallet Detection and Auto-Connection Utilities

import type { WalletDetectionResult } from './types';

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

  if (!isMiniPay) {
    return {
      address: null,
      isMiniPay: false,
      error: 'Not MiniPay browser'
    };
  }

  try {
    // Request accounts - MiniPay auto-approves this without user prompt
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    });

    if (Array.isArray(accounts) && accounts.length > 0) {
      return {
        address: accounts[0] as string,
        isMiniPay: true
      };
    }

    // If no accounts returned, try requesting permission
    const requestedAccounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    if (Array.isArray(requestedAccounts) && requestedAccounts.length > 0) {
      return {
        address: requestedAccounts[0] as string,
        isMiniPay: true
      };
    }

    return {
      address: null,
      isMiniPay: true,
      error: 'No accounts available'
    };

  } catch (error) {
    console.error('MiniPay detection failed:', error);
    return {
      address: null,
      isMiniPay: true,
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
 * @returns boolean - true if MiniPay detected
 */
export function isMiniPayBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  return window.ethereum?.isMiniPay === true;
}
