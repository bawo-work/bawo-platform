// Phone Verification UI Component

'use client';

import { useState, useEffect } from 'react';
import {
  sendVerificationCode,
  verifyPhoneCode,
  resendVerificationCode,
  isValidPhoneNumber,
  PHONE_VERIFICATION_CONFIG
} from '@/lib/identity/phone-verification';
import { VerificationBadgeLarge } from './VerificationBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import type { PhoneVerificationResult } from '@/lib/identity/types';

interface PhoneVerificationProps {
  onSuccess: (result: PhoneVerificationResult) => void;
  onError?: (error: string) => void;
  onBack?: () => void;
}

/**
 * Phone Verification Flow Component
 *
 * Two-step verification:
 * 1. Enter phone number
 * 2. Enter SMS code
 * 3. Show success with limitation notice
 */
export function PhoneVerification({
  onSuccess,
  onError,
  onBack
}: PhoneVerificationProps) {
  const [step, setStep] = useState<'phone' | 'code' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PhoneVerificationResult | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setTimeout(() => {
      setResendCooldown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCooldown]);

  /**
   * Send SMS code
   */
  const handleSendCode = async () => {
    setError(null);

    if (!isValidPhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number with country code (e.g., +254712345678)');
      return;
    }

    setIsLoading(true);

    try {
      const result = await sendVerificationCode(phoneNumber);

      if (result.sent) {
        setStep('code');
        setResendCooldown(PHONE_VERIFICATION_CONFIG.resendCooldownSeconds);
      } else {
        setError(result.error || 'Failed to send code');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verify SMS code
   */
  const handleVerifyCode = async () => {
    setError(null);

    if (code.length !== PHONE_VERIFICATION_CONFIG.codeLength) {
      setError(`Code must be ${PHONE_VERIFICATION_CONFIG.codeLength} digits`);
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyPhoneCode(phoneNumber, code);

      if (result.verified) {
        setResult(result);
        setStep('success');
        onSuccess(result);
      } else {
        setError(result.error || 'Invalid code');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      onError?.(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resend code
   */
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setError(null);
    setIsLoading(true);

    try {
      const result = await resendVerificationCode(phoneNumber);

      if (result.sent) {
        setResendCooldown(PHONE_VERIFICATION_CONFIG.resendCooldownSeconds);
      } else {
        setError(result.error || 'Failed to resend code');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (step === 'success' && result) {
    return (
      <Card className="p-6 text-center border-2 border-teal-600 bg-cream">
        <div className="mb-4">
          <VerificationBadgeLarge level={result.level} />
        </div>
        <h3 className="text-xl font-semibold text-warm-gray-800 mb-2">
          Phone Verified
        </h3>
        <p className="text-warm-gray-600 mb-4">
          Limited access granted
        </p>
        <div className="bg-warning/10 border border-warning rounded-lg p-4 mb-4">
          <p className="text-sm text-warm-gray-800 font-medium mb-2">
            Current Limitations (Level 1):
          </p>
          <ul className="text-sm text-warm-gray-600 space-y-1 text-left">
            <li>• Earn up to $10 per day</li>
            <li>• Access to basic tasks only</li>
            <li>• Can upgrade to Self Protocol anytime</li>
          </ul>
        </div>
        <p className="text-xs text-warm-gray-600">
          Upgrade to Self Protocol verification to unlock $50/day and premium tasks
        </p>
      </Card>
    );
  }

  // Code entry step
  if (step === 'code') {
    return (
      <Card className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-teal-600 rounded-full mx-auto mb-3 flex items-center justify-center">
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
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-warm-gray-800 mb-2">
            Enter Verification Code
          </h3>
          <p className="text-warm-gray-600">
            We sent a 6-digit code to {phoneNumber}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error rounded-lg">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={PHONE_VERIFICATION_CONFIG.codeLength}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="text-center text-2xl tracking-widest min-h-[48px]"
              disabled={isLoading}
            />
          </div>

          <Button
            onClick={handleVerifyCode}
            disabled={isLoading || code.length !== PHONE_VERIFICATION_CONFIG.codeLength}
            className="w-full min-h-[48px]"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>

          <div className="text-center">
            <button
              onClick={handleResendCode}
              disabled={resendCooldown > 0 || isLoading}
              className="text-sm text-teal-700 hover:text-teal-600 underline disabled:text-warm-gray-600 disabled:no-underline min-h-[48px]"
            >
              {resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : 'Resend code'}
            </button>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="w-full text-sm text-warm-gray-600 hover:text-warm-gray-800 underline min-h-[48px]"
            >
              Back to phone entry
            </button>
          )}
        </div>
      </Card>
    );
  }

  // Phone entry step
  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-teal-600 rounded-full mx-auto mb-3 flex items-center justify-center">
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
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-warm-gray-800 mb-2">
          Verify Phone Number
        </h3>
        <p className="text-warm-gray-600">
          Get started with basic access
        </p>
      </div>

      <div className="bg-warning/10 border border-warning rounded-lg p-4 mb-6">
        <p className="text-sm text-warm-gray-800 font-medium mb-2">
          Note: Phone verification provides limited access
        </p>
        <ul className="text-sm text-warm-gray-600 space-y-1">
          <li>• $10/day earning limit</li>
          <li>• Basic tasks only</li>
          <li>• Upgrade to Self Protocol anytime for full access</li>
        </ul>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error rounded-lg">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+254712345678"
            className="min-h-[48px]"
            disabled={isLoading}
          />
          <p className="text-xs text-warm-gray-600 mt-1">
            Include country code (e.g., +254 for Kenya)
          </p>
        </div>

        <Button
          onClick={handleSendCode}
          disabled={isLoading || !phoneNumber}
          className="w-full min-h-[48px]"
        >
          {isLoading ? 'Sending...' : 'Send Verification Code'}
        </Button>

        {onBack && (
          <button
            onClick={onBack}
            className="w-full text-sm text-warm-gray-600 hover:text-warm-gray-800 underline min-h-[48px]"
          >
            Back to verification options
          </button>
        )}
      </div>
    </Card>
  );
}
