// Onboarding Layout Component

'use client';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  step?: number;
  totalSteps?: number;
  showProgress?: boolean;
}

/**
 * Consistent layout for onboarding screens
 */
export function OnboardingLayout({
  children,
  step,
  totalSteps = 3,
  showProgress = true
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-cream border-b border-sand">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-teal-700">Bawo</h1>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {showProgress && step && (
        <div className="bg-cream border-b border-sand">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-warm-gray-600">
                Step {step} of {totalSteps}
              </span>
              <span className="text-xs text-warm-gray-600">
                {Math.round((step / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-sand rounded-full h-2">
              <div
                className="bg-teal-700 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {children}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-cream border-t border-sand py-3">
        <div className="max-w-md mx-auto px-4">
          <p className="text-xs text-center text-warm-gray-600">
            Need help? Contact support
          </p>
        </div>
      </div>
    </div>
  );
}
