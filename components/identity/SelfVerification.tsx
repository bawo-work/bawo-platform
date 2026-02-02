// Self Protocol Verification UI Component

'use client';

import { useState } from 'react';
import { verifySelfProtocol, SELF_VERIFICATION_TIMEOUT } from '@/lib/identity/self-protocol';
import { VerificationBadgeLarge } from './VerificationBadge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { SelfVerificationResult } from '@/lib/identity/types';

interface SelfVerificationProps {
  walletAddress: string;
  onSuccess: (result: SelfVerificationResult) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

/**
 * Self Protocol Verification Flow Component
 *
 * Guides user through NFC passport verification:
 * 1. Explain what Self Protocol is
 * 2. Start verification (opens Self app)
 * 3. Wait for NFC scan and ZK proof
 * 4. Show success/error
 */
export function SelfVerification({
  walletAddress,
  onSuccess,
  onError,
  onCancel
}: SelfVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SelfVerificationResult | null>(null);

  /**
   * Start verification flow
   */
  const handleStartVerification = async () => {
    setIsVerifying(true);
    setError(null);

    try {
      // Start verification with timeout
      const verificationPromise = verifySelfProtocol(walletAddress);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Verification timeout')), SELF_VERIFICATION_TIMEOUT)
      );

      const result = await Promise.race([verificationPromise, timeoutPromise]);

      if (result.verified) {
        setResult(result);
        onSuccess(result);
      } else {
        const errorMsg = result.error || 'Verification failed';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Verification failed';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsVerifying(false);
    }
  };

  // Success state
  if (result?.verified) {
    return (
      <Card className="p-6 text-center border-2 border-success bg-cream">
        <div className="mb-4">
          <VerificationBadgeLarge level={result.level} />
        </div>
        <h3 className="text-xl font-semibold text-warm-gray-800 mb-2">
          Verified!
        </h3>
        <p className="text-warm-gray-600 mb-1">
          Your identity has been verified via Self Protocol
        </p>
        <p className="text-sm text-warm-gray-600">
          You now have Level 2+ access with up to $50/day earning limit
        </p>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="p-6 border-2 border-red-500 bg-red-50">
        <div className="text-center">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-3"
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
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            Could not verify
          </h3>
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleStartVerification}
              className="min-h-[48px] min-w-[120px]"
            >
              Try Again
            </Button>
            {onCancel && (
              <Button
                onClick={onCancel}
                variant="outline"
                className="min-h-[48px] min-w-[120px]"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Verifying state
  if (isVerifying) {
    return (
      <Card className="p-6 text-center">
        <div className="animate-pulse mb-4">
          <div className="w-16 h-16 bg-teal-700 rounded-full mx-auto mb-3 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-warm-gray-800 mb-2">
          Verifying your identity
        </h3>
        <p className="text-warm-gray-600 mb-1">
          Open Self app and scan your passport
        </p>
        <p className="text-sm text-warm-gray-600">
          This usually takes 10-20 seconds
        </p>
      </Card>
    );
  }

  // Initial state - Explain and start
  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-teal-700 rounded-full mx-auto mb-3 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-warm-gray-800 mb-2">
          Verify with Self Protocol
        </h3>
        <p className="text-warm-gray-600 mb-4">
          Scan your passport using NFC to prove you are a unique human
        </p>
      </div>

      <div className="space-y-3 mb-6 text-left">
        <div className="flex gap-3 items-start">
          <svg className="w-5 h-5 text-success mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium text-warm-gray-800">Private & Secure</p>
            <p className="text-sm text-warm-gray-600">No personal data stored, only a ZK proof</p>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <svg className="w-5 h-5 text-success mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium text-warm-gray-800">Higher Earnings</p>
            <p className="text-sm text-warm-gray-600">Unlock $50/day limit and premium tasks</p>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <svg className="w-5 h-5 text-success mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium text-warm-gray-800">Quick Process</p>
            <p className="text-sm text-warm-gray-600">Takes less than 60 seconds</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleStartVerification}
          className="w-full min-h-[48px] bg-teal-700 hover:bg-teal-600"
        >
          Verify with Self Protocol
        </Button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="w-full text-sm text-warm-gray-600 hover:text-warm-gray-800 underline min-h-[48px]"
          >
            Continue with phone only
          </button>
        )}
      </div>
    </Card>
  );
}
