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
    console.log('[Wallet] Server-side - skipping detection');
    return {
      address: null,
      isMiniPay: false,
      error: 'Not in browser environment'
    };
  }

  console.log('[Wallet] Starting detection...');
  console.log('[Wallet] window.ethereum exists:', !!window.ethereum);

  // Check for multiple wallet providers
  const providers = (window as any).ethereum?.providers;
  console.log('[Wallet] Multiple providers detected:', !!providers);

  // If multiple providers, try to find MetaMask specifically
  let provider = window.ethereum;
  if (providers && Array.isArray(providers)) {
    console.log('[Wallet] Found', providers.length, 'providers');
    const metamaskProvider = providers.find((p: any) => p.isMetaMask);
    if (metamaskProvider) {
      console.log('[Wallet] Using MetaMask provider from multiple providers');
      provider = metamaskProvider;
    }
  }

  console.log('[Wallet] Selected provider:', provider);

  // Check for Ethereum provider
  if (!provider) {
    console.log('[Wallet] No Ethereum provider detected');
    return {
      address: null,
      isMiniPay: false,
      error: 'No Ethereum provider detected. Please install MetaMask.'
    };
  }

  // Check if it's MiniPay specifically
  const isMiniPay = (provider as any).isMiniPay === true;
  console.log('[Wallet] Is MiniPay:', isMiniPay);
  console.log('[Wallet] Is MetaMask:', (provider as any).isMetaMask);

  // DEV MODE: Allow any wallet (MetaMask, etc.) in development
  const isDevelopment = process.env.NODE_ENV === 'development';
  console.log('[Wallet] Is development mode:', isDevelopment);

  if (!isMiniPay && !isDevelopment) {
    console.log('[Wallet] Not MiniPay and not in dev mode');
    return {
      address: null,
      isMiniPay: false,
      error: 'Not MiniPay browser'
    };
  }

  // In dev mode, treat any wallet as "MiniPay" for testing
  const treatAsMiniPay = isMiniPay || isDevelopment;
  console.log('[Wallet] Treat as MiniPay:', treatAsMiniPay);

  try {
    console.log('[Wallet] Checking for existing accounts...');
    // Request accounts with 10-second timeout - MiniPay auto-approves this without user prompt
    const accounts = await withTimeout(
      provider.request({
        method: 'eth_accounts'
      }) as Promise<unknown>,
      10000,
      'Wallet request timed out'
    );

    console.log('[Wallet] eth_accounts result:', accounts);

    if (Array.isArray(accounts) && accounts.length > 0) {
      console.log('[Wallet] Found existing accounts:', accounts.length);
      return {
        address: accounts[0] as string,
        isMiniPay: treatAsMiniPay
      };
    }

    console.log('[Wallet] No existing accounts, requesting access...');
    // If no accounts returned, try requesting permission with 30-second timeout
    const requestedAccounts = await withTimeout(
      provider.request({
        method: 'eth_requestAccounts'
      }) as Promise<unknown>,
      30000,
      'Connection request timed out. Please unlock your wallet and approve the connection.'
    );

    console.log('[Wallet] eth_requestAccounts result:', requestedAccounts);

    if (Array.isArray(requestedAccounts) && requestedAccounts.length > 0) {
      console.log('[Wallet] Successfully connected:', requestedAccounts[0]);
      return {
        address: requestedAccounts[0] as string,
        isMiniPay: treatAsMiniPay
      };
    }

    console.log('[Wallet] No accounts available after request');
    return {
      address: null,
      isMiniPay: treatAsMiniPay,
      error: 'No accounts available'
    };

  } catch (error) {
    console.error('[Wallet] Detection failed:', error);
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
