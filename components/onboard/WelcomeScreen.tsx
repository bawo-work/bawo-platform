// Welcome Screen Component

'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

/**
 * Welcome screen with value proposition
 */
export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="space-y-6">
      <Card className="p-8 text-center">
        <div className="w-20 h-20 bg-teal-700 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-warm-gray-800 mb-3">
          Welcome to Bawo
        </h1>
        <p className="text-lg text-warm-gray-600 mb-6">
          Earn money labeling AI data, get paid instantly
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-4 text-left">
            <div className="flex-shrink-0 w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-warm-gray-800 mb-1">
                Instant Payment
              </h3>
              <p className="text-sm text-warm-gray-600">
                Get paid within seconds of completing a task. No waiting 30-60 days.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 text-left">
            <div className="flex-shrink-0 w-12 h-12 bg-money-gold/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-money-gold"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-warm-gray-800 mb-1">
                Fair Earnings
              </h3>
              <p className="text-sm text-warm-gray-600">
                Earn $3-6/hour on average. 2-4x more than other platforms.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 text-left">
            <div className="flex-shrink-0 w-12 h-12 bg-teal-700/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-teal-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-warm-gray-800 mb-1">
                Secure & Private
              </h3>
              <p className="text-sm text-warm-gray-600">
                Your earnings are protected by blockchain. No personal data stored.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={onGetStarted}
          className="w-full min-h-[48px] text-base bg-teal-700 hover:bg-teal-600"
        >
          Get Started
        </Button>
      </Card>

      <div className="text-center">
        <p className="text-xs text-warm-gray-600">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
