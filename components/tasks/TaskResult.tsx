'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface TaskResultProps {
  success: boolean;
  earned: number;
  isGolden?: boolean;
  correct?: boolean;
  totalToday?: number;
  onComplete?: () => void;
  autoAdvanceDelay?: number; // milliseconds
}

/**
 * TaskResult component shows task completion status
 * Displays earnings, accuracy feedback for golden tasks
 * Auto-advances to next task after delay
 */
export function TaskResult({
  success,
  earned,
  isGolden = false,
  correct,
  totalToday = 0,
  onComplete,
  autoAdvanceDelay = 2000,
}: TaskResultProps) {
  useEffect(() => {
    if (success && onComplete && autoAdvanceDelay > 0) {
      const timer = setTimeout(() => {
        onComplete();
      }, autoAdvanceDelay);

      return () => clearTimeout(timer);
    }
  }, [success, onComplete, autoAdvanceDelay]);

  if (!success) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <X className="w-8 h-8 text-red-600" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-warm-gray-800 mb-2">
            Submission Failed
          </h2>
          <p className="text-sm text-warm-gray-600">
            Could not submit your response. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      {/* Success icon */}
      <div
        className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center transition-all',
          isGolden && correct === false
            ? 'bg-amber-100'
            : 'bg-green-100 animate-pulse'
        )}
      >
        <Check
          className={cn(
            'w-8 h-8',
            isGolden && correct === false ? 'text-amber-600' : 'text-green-600'
          )}
        />
      </div>

      {/* Task complete message */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-warm-gray-800 mb-2">
          Task Complete!
        </h2>

        {/* Golden task feedback */}
        {isGolden && correct !== undefined && (
          <p
            className={cn(
              'text-sm mb-2',
              correct ? 'text-green-600' : 'text-amber-600'
            )}
          >
            {correct
              ? 'Quality check passed!'
              : 'Quality check - please review guidelines'}
          </p>
        )}

        {/* Earnings */}
        {earned > 0 && (
          <p className="text-2xl font-bold text-money-gold mb-2">
            Earned ${earned.toFixed(2)}
          </p>
        )}

        {/* Running total */}
        {totalToday > 0 && (
          <p className="text-sm text-warm-gray-600">
            Total today: ${totalToday.toFixed(2)}
          </p>
        )}

        {/* Auto-advance message */}
        {onComplete && (
          <p className="text-xs text-warm-gray-600 mt-4">
            Loading next task...
          </p>
        )}
      </div>
    </div>
  );
}
