'use client';

import { useTaskTimer } from '@/hooks/useTaskTimer';
import { cn } from '@/lib/utils';

interface TaskTimerProps {
  timeLimit: number; // seconds
  onTimeout: () => void;
  autoStart?: boolean;
  className?: string;
}

/**
 * TaskTimer component displays countdown with visual warnings
 * - Default: Teal color
 * - Warning (<10s): Amber/yellow color
 * - Critical (<5s): Red color with pulse animation
 */
export function TaskTimer({
  timeLimit,
  onTimeout,
  autoStart = true,
  className,
}: TaskTimerProps) {
  const { remaining, isWarning, isCritical, isExpired } = useTaskTimer({
    timeLimit,
    onTimeout,
    autoStart,
  });

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeString = `${minutes}:${String(seconds).padStart(2, '0')}`;

  const getColorClass = () => {
    if (isExpired) return 'text-red-600';
    if (isCritical) return 'text-red-500';
    if (isWarning) return 'text-amber-500';
    return 'text-teal-700';
  };

  const getPulseClass = () => {
    return isCritical ? 'animate-pulse' : '';
  };

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div
        className={cn(
          'text-center font-semibold text-2xl transition-colors',
          getColorClass(),
          getPulseClass()
        )}
        role="timer"
        aria-live="polite"
        aria-atomic="true"
      >
        {timeString}
      </div>
      {isWarning && !isCritical && (
        <p className="text-xs text-amber-600 font-medium">Time running out</p>
      )}
      {isCritical && (
        <p className="text-xs text-red-600 font-medium">Last seconds!</p>
      )}
    </div>
  );
}
