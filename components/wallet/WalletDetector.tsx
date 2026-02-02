// MiniPay Wallet Auto-Detection Component

'use client';

import { useWallet } from '@/hooks/useWallet';
import { formatWalletAddress } from '@/lib/wallet/minipay';
import { Card } from '@/components/ui/card';

interface WalletDetectorProps {
  onWalletDetected?: (address: string) => void;
  onError?: (error: string) => void;
  children?: (state: {
    address: string | null;
    isConnected: boolean;
    isLoading: boolean;
  }) => React.ReactNode;
}

/**
 * Auto-detects MiniPay wallet and displays connection status
 *
 * Shows different UI based on detection state:
 * - Loading: Connecting spinner
 * - MiniPay detected: Wallet address and success
 * - Not MiniPay: "Open in MiniPay" message
 * - Error: Error message with retry
 */
export function WalletDetector({
  onWalletDetected,
  onError,
  children
}: WalletDetectorProps) {
  const { address, isConnected, isMiniPay, isLoading, error, detectWallet } = useWallet();

  // Notify parent components of wallet state changes
  React.useEffect(() => {
    if (isConnected && address && onWalletDetected) {
      onWalletDetected(address);
    }
    if (error && onError) {
      onError(error);
    }
  }, [isConnected, address, error, onWalletDetected, onError]);

  // Use render prop pattern if children provided
  if (children) {
    return <>{children({ address, isConnected, isLoading })}</>;
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700 mx-auto mb-3" />
        <p className="text-warm-gray-800 font-medium">Connecting wallet...</p>
        <p className="text-sm text-warm-gray-600 mt-1">Detecting MiniPay</p>
      </Card>
    );
  }

  // Not MiniPay browser
  if (!isMiniPay) {
    return (
      <Card className="p-6 border-2 border-terracotta-500 bg-cream">
        <div className="text-center">
          <svg
            className="w-12 h-12 text-terracotta-500 mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-warm-gray-800 mb-2">
            Open in MiniPay
          </h3>
          <p className="text-warm-gray-600 mb-4">
            For the best experience, please open this link in the MiniPay browser.
          </p>
          <p className="text-sm text-warm-gray-600">
            MiniPay provides instant payments and secure wallet connection.
          </p>
        </div>
      </Card>
    );
  }

  // Check if in dev mode with non-MiniPay wallet
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isDevMode = isDevelopment && !window.ethereum?.isMiniPay;

  // Error state (in MiniPay but connection failed)
  if (error && !isConnected) {
    return (
      <Card className="p-6 border-2 border-error bg-cream">
        <div className="text-center">
          <svg
            className="w-12 h-12 text-error mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <h3 className="text-lg font-semibold text-warm-gray-800 mb-2">
            Could not connect wallet
          </h3>
          <p className="text-warm-gray-600 mb-4">{error}</p>
          <button
            onClick={detectWallet}
            className="px-6 py-3 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors min-h-[48px] min-w-[48px]"
          >
            Try Again
          </button>
        </div>
      </Card>
    );
  }

  // Success state
  if (isConnected && address) {
    return (
      <Card className="p-6 border-2 border-success bg-cream">
        <div className="text-center">
          {isDevMode && (
            <div className="mb-3 inline-block px-3 py-1 bg-amber-100 border border-amber-400 rounded-full text-xs font-medium text-amber-800">
              DEV MODE: Using {window.ethereum?.isMetaMask ? 'MetaMask' : 'wallet'} for testing
            </div>
          )}
          <svg
            className="w-12 h-12 text-success mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-warm-gray-800 mb-2">
            Wallet Connected
          </h3>
          <p className="text-warm-gray-600 mb-1">
            {formatWalletAddress(address)}
          </p>
          <p className="text-sm text-warm-gray-600">
            {isDevMode ? 'Test wallet for development' : 'MiniPay wallet detected and connected'}
          </p>
        </div>
      </Card>
    );
  }

  return null;
}

// Add React import for useEffect
import React from 'react';
