// Verification Choice Component

'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VerificationChoiceProps {
  onChooseSelf: () => void;
  onChoosePhone: () => void;
}

/**
 * Verification method selection screen
 */
export function VerificationChoice({
  onChooseSelf,
  onChoosePhone
}: VerificationChoiceProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-warm-gray-800 mb-2">
          Verify your identity
        </h2>
        <p className="text-warm-gray-600">
          Choose a verification method to get started
        </p>
      </div>

      {/* Self Protocol Option - Prominent */}
      <Card className="p-6 border-2 border-teal-700">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
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
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-warm-gray-800 mb-1">
              Self Protocol (Recommended)
            </h3>
            <p className="text-sm text-warm-gray-600 mb-3">
              Scan your passport with NFC for full access
            </p>
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-sm text-warm-gray-600">
                <svg
                  className="w-4 h-4 text-success flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Earn up to $50/day</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-warm-gray-600">
                <svg
                  className="w-4 h-4 text-success flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Access all task types</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-warm-gray-600">
                <svg
                  className="w-4 h-4 text-success flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>No personal data stored</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-warm-gray-600">
                <svg
                  className="w-4 h-4 text-success flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Takes less than 60 seconds</span>
              </div>
            </div>
          </div>
        </div>
        <Button
          onClick={onChooseSelf}
          className="w-full min-h-[48px] bg-teal-700 hover:bg-teal-600"
        >
          Verify with Self Protocol
        </Button>
      </Card>

      {/* Phone Option - Secondary */}
      <Card className="p-6 border border-sand">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-warm-gray-600 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
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
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-warm-gray-800 mb-1">
              Phone Number
            </h3>
            <p className="text-sm text-warm-gray-600 mb-3">
              Get started with basic access
            </p>
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-sm text-warm-gray-600">
                <svg
                  className="w-4 h-4 text-warning flex-shrink-0"
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
                <span>Earn up to $10/day (limited)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-warm-gray-600">
                <svg
                  className="w-4 h-4 text-warning flex-shrink-0"
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
                <span>Basic tasks only</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-warm-gray-600">
                <svg
                  className="w-4 h-4 text-success flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Can upgrade to Self anytime</span>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={onChoosePhone}
          className="w-full min-h-[48px] text-base text-warm-gray-800 hover:text-warm-gray-600 underline font-medium"
        >
          Continue with phone only
        </button>
      </Card>

      <div className="text-center">
        <p className="text-xs text-warm-gray-600">
          We recommend Self Protocol for full access and higher earnings
        </p>
      </div>
    </div>
  );
}
