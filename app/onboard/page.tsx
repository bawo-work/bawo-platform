// Worker Onboarding Page

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { createWorkerProfile, getWorkerByWallet } from '@/lib/api/workers';
import { WalletDetector } from '@/components/wallet/WalletDetector';
import { WelcomeScreen } from '@/components/onboard/WelcomeScreen';
import { VerificationChoice } from '@/components/onboard/VerificationChoice';
import { SelfVerification } from '@/components/identity/SelfVerification';
import { PhoneVerification } from '@/components/identity/PhoneVerification';
import { OnboardingLayout } from '@/components/onboard/OnboardingLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { SelfVerificationResult, PhoneVerificationResult } from '@/lib/identity/types';

type OnboardingStep =
  | 'wallet'
  | 'welcome'
  | 'choice'
  | 'self'
  | 'phone'
  | 'creating'
  | 'success';

/**
 * Worker Onboarding Flow
 *
 * Steps:
 * 1. Wallet detection
 * 2. Welcome screen
 * 3. Verification choice (Self vs Phone)
 * 4. Verification flow (Self or Phone)
 * 5. Profile creation
 * 6. Success → Dashboard
 */
export default function OnboardPage() {
  const router = useRouter();
  const { address, isConnected, isLoading: walletLoading } = useWallet();
  const [step, setStep] = useState<OnboardingStep>('wallet');
  const [error, setError] = useState<string | null>(null);
  const [verificationData, setVerificationData] = useState<{
    level: number;
    selfDid?: string;
    phoneNumber?: string;
  } | null>(null);

  /**
   * Check if worker already has profile
   */
  useEffect(() => {
    async function checkExistingProfile() {
      if (!address || !isConnected) return;

      console.log('[Onboard] Checking for existing profile...', address);

      try {
        // Add timeout to profile check
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Profile check timed out')), 5000);
        });

        const result = await Promise.race([
          getWorkerByWallet(address),
          timeoutPromise
        ]) as any;

        console.log('[Onboard] Profile check result:', result);

        if (result.success && result.data) {
          // Profile exists - redirect to dashboard
          console.log('[Onboard] Profile found, redirecting to dashboard');
          router.push('/dashboard');
        } else {
          // No profile - continue onboarding
          console.log('[Onboard] No profile found, continuing to welcome');
          setStep('welcome');
        }
      } catch (err) {
        console.error('[Onboard] Error checking profile:', err);
        console.log('[Onboard] Error caught, continuing to welcome screen anyway');
        // If profile check fails (e.g., Supabase not running), just continue
        setStep('welcome');
      }
    }

    if (isConnected && address && step === 'wallet' && !walletLoading) {
      console.log('[Onboard] Wallet connected, checking profile...');
      checkExistingProfile();
    }
  }, [address, isConnected, walletLoading, step, router]);

  /**
   * Handle Self Protocol verification success
   */
  const handleSelfSuccess = (result: SelfVerificationResult) => {
    setVerificationData({
      level: result.level,
      selfDid: result.did
    });
    createProfile(result.level, result.did, undefined);
  };

  /**
   * Handle phone verification success
   */
  const handlePhoneSuccess = (result: PhoneVerificationResult) => {
    setVerificationData({
      level: result.level,
      phoneNumber: result.phoneNumber
    });
    createProfile(result.level, undefined, result.phoneNumber);
  };

  /**
   * Create worker profile
   */
  const createProfile = async (
    level: number,
    selfDid?: string,
    phoneNumber?: string
  ) => {
    if (!address) {
      setError('No wallet address available');
      return;
    }

    setStep('creating');
    setError(null);

    try {
      const result = await createWorkerProfile({
        walletAddress: address,
        verificationLevel: level,
        selfDid: selfDid || null,
        phoneNumber: phoneNumber || null
      });

      if (result.success) {
        setStep('success');
        // Redirect to dashboard after brief success message
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(result.error || 'Failed to create profile');
        setStep('choice'); // Go back to choice
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStep('choice'); // Go back to choice
    }
  };

  /**
   * Get current step number for progress bar
   */
  const getStepNumber = (): number => {
    switch (step) {
      case 'wallet':
        return 1;
      case 'welcome':
        return 1;
      case 'choice':
        return 2;
      case 'self':
      case 'phone':
        return 2;
      case 'creating':
      case 'success':
        return 3;
      default:
        return 1;
    }
  };

  // Wallet detection step
  if (step === 'wallet' || walletLoading || !isConnected) {
    return (
      <OnboardingLayout step={1} showProgress={false}>
        <WalletDetector />
      </OnboardingLayout>
    );
  }

  // Welcome step
  if (step === 'welcome') {
    return (
      <OnboardingLayout step={1}>
        <WelcomeScreen onGetStarted={() => setStep('choice')} />
      </OnboardingLayout>
    );
  }

  // Verification choice step
  if (step === 'choice') {
    return (
      <OnboardingLayout step={2}>
        {error && (
          <Card className="p-4 mb-4 border-2 border-error bg-error/10">
            <p className="text-sm text-error">{error}</p>
          </Card>
        )}
        <VerificationChoice
          onChooseSelf={() => setStep('self')}
          onChoosePhone={() => setStep('phone')}
        />
      </OnboardingLayout>
    );
  }

  // Self Protocol verification step
  if (step === 'self' && address) {
    return (
      <OnboardingLayout step={2}>
        <SelfVerification
          walletAddress={address}
          onSuccess={handleSelfSuccess}
          onError={setError}
          onCancel={() => setStep('choice')}
        />
      </OnboardingLayout>
    );
  }

  // Phone verification step
  if (step === 'phone') {
    return (
      <OnboardingLayout step={2}>
        <PhoneVerification
          onSuccess={handlePhoneSuccess}
          onError={setError}
          onBack={() => setStep('choice')}
        />
      </OnboardingLayout>
    );
  }

  // Creating profile step
  if (step === 'creating') {
    return (
      <OnboardingLayout step={3}>
        <Card className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-warm-gray-800 mb-2">
            Creating your profile
          </h3>
          <p className="text-warm-gray-600">This will only take a moment...</p>
        </Card>
      </OnboardingLayout>
    );
  }

  // Success step
  if (step === 'success') {
    return (
      <OnboardingLayout step={3}>
        <Card className="p-6 text-center border-2 border-success bg-cream">
          <svg
            className="w-16 h-16 text-success mx-auto mb-4"
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
          <h3 className="text-2xl font-bold text-warm-gray-800 mb-2">
            Welcome to Bawo!
          </h3>
          <p className="text-warm-gray-600 mb-4">
            Your profile has been created successfully
          </p>
          <p className="text-sm text-warm-gray-600">
            Redirecting to dashboard...
          </p>
        </Card>
      </OnboardingLayout>
    );
  }

  return null;
}
