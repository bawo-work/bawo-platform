'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface UseTaskTimerOptions {
  timeLimit: number; // seconds
  onTimeout: () => void;
  autoStart?: boolean;
}

interface UseTaskTimerResult {
  remaining: number;
  isWarning: boolean; // <10s
  isCritical: boolean; // <5s
  isExpired: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

/**
 * Hook for managing task countdown timer
 * Handles warnings, critical states, and timeout callback
 */
export function useTaskTimer({
  timeLimit,
  onTimeout,
  autoStart = true,
}: UseTaskTimerOptions): UseTaskTimerResult {
  const [remaining, setRemaining] = useState(timeLimit);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutCalledRef = useRef(false);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setRemaining(timeLimit);
    setIsRunning(autoStart);
    timeoutCalledRef.current = false;
  }, [timeLimit, autoStart]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (remaining <= 0) {
      setIsRunning(false);
      if (!timeoutCalledRef.current) {
        timeoutCalledRef.current = true;
        onTimeout();
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setIsRunning(false);
          if (!timeoutCalledRef.current) {
            timeoutCalledRef.current = true;
            onTimeout();
          }
        }
        return Math.max(0, next);
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, remaining, onTimeout]);

  return {
    remaining,
    isWarning: remaining <= 10 && remaining > 5,
    isCritical: remaining <= 5 && remaining > 0,
    isExpired: remaining === 0,
    start,
    pause,
    reset,
  };
}
