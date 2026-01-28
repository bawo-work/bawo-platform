// React Hook for MiniPay Wallet Connection

'use client';

import { useState, useEffect, useCallback } from 'react';
import { detectMiniPayWallet, isMiniPayBrowser } from '@/lib/wallet/minipay';
import type { WalletState } from '@/lib/wallet/types';

/**
 * Custom React hook for MiniPay wallet detection and connection
 *
 * Auto-detects MiniPay wallet on mount. Updates wallet state
 * when accounts change. Provides connection methods.
 *
 * @returns WalletState and connection methods
 */
export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isMiniPay: false,
    isLoading: true,
    error: null
  });

  /**
   * Attempts to detect and connect MiniPay wallet
   */
  const detectWallet = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await detectMiniPayWallet();

      setState({
        address: result.address,
        isConnected: result.address !== null,
        isMiniPay: result.isMiniPay,
        isLoading: false,
        error: result.error || null
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to detect wallet';
      setState({
        address: null,
        isConnected: false,
        isMiniPay: false,
        isLoading: false,
        error: errorMessage
      });
      return { address: null, isMiniPay: false, error: errorMessage };
    }
  }, []);

  /**
   * Manually disconnect wallet (clears state)
   */
  const disconnect = useCallback(() => {
    setState({
      address: null,
      isConnected: false,
      isMiniPay: isMiniPayBrowser(),
      isLoading: false,
      error: null
    });
  }, []);

  /**
   * Handle account changes from MiniPay
   */
  const handleAccountsChanged = useCallback((accounts: unknown) => {
    if (Array.isArray(accounts) && accounts.length > 0) {
      setState(prev => ({
        ...prev,
        address: accounts[0] as string,
        isConnected: true,
        error: null
      }));
    } else {
      setState(prev => ({
        ...prev,
        address: null,
        isConnected: false,
        error: 'No accounts available'
      }));
    }
  }, []);

  /**
   * Auto-detect wallet on mount
   */
  useEffect(() => {
    detectWallet();
  }, [detectWallet]);

  /**
   * Listen for account changes
   */
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum?.on) return;

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [handleAccountsChanged]);

  return {
    ...state,
    detectWallet,
    disconnect
  };
}
