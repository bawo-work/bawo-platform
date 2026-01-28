import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTaskTimer } from '@/hooks/useTaskTimer';

describe('TaskTimer Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with time limit', () => {
    const { result } = renderHook(() =>
      useTaskTimer({ timeLimit: 45, onTimeout: vi.fn(), autoStart: false })
    );

    expect(result.current.remaining).toBe(45);
    expect(result.current.isWarning).toBe(false);
    expect(result.current.isCritical).toBe(false);
  });

  it('should countdown when started', () => {
    const { result } = renderHook(() =>
      useTaskTimer({ timeLimit: 45, onTimeout: vi.fn(), autoStart: true })
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.remaining).toBe(44);
  });

  it('should trigger warning state at 10 seconds', () => {
    const { result } = renderHook(() =>
      useTaskTimer({ timeLimit: 10, onTimeout: vi.fn(), autoStart: true })
    );

    expect(result.current.isWarning).toBe(true);
    expect(result.current.isCritical).toBe(false);
  });

  it('should trigger critical state at 5 seconds', () => {
    const { result } = renderHook(() =>
      useTaskTimer({ timeLimit: 5, onTimeout: vi.fn(), autoStart: true })
    );

    expect(result.current.isWarning).toBe(false);
    expect(result.current.isCritical).toBe(true);
  });

  it('should call onTimeout when timer expires', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() =>
      useTaskTimer({ timeLimit: 3, onTimeout, autoStart: true })
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.remaining).toBe(0);
    expect(result.current.isExpired).toBe(true);
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('should pause timer', () => {
    const { result } = renderHook(() =>
      useTaskTimer({ timeLimit: 45, onTimeout: vi.fn(), autoStart: true })
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.remaining).toBe(43);

    act(() => {
      result.current.pause();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Should still be 43 after pause (timer stopped)
    expect(result.current.remaining).toBe(43);
  });

  it('should reset timer', () => {
    const { result } = renderHook(() =>
      useTaskTimer({ timeLimit: 45, onTimeout: vi.fn(), autoStart: true })
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.remaining).toBe(40);

    act(() => {
      result.current.reset();
    });

    expect(result.current.remaining).toBe(45);
  });
});
