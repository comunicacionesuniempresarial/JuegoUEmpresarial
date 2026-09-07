import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Elapsed-time timer backed by requestAnimationFrame.
 * Returns elapsed milliseconds and helpers to start/stop/reset/restart.
 */
export function useElapsedTimer() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  const tick = useCallback(function tickCb(now: number) {
    if (startRef.current !== null) {
      setElapsedMs(now - startRef.current);
      rafRef.current = requestAnimationFrame(tickCb);
    }
  }, []);

  const start = useCallback(() => {
    if (isRunning) return;
    startRef.current = performance.now() - elapsedMs;
    setIsRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [isRunning, elapsedMs, tick]);

  const stop = useCallback(() => {
    setIsRunning(false);
    startRef.current = null;
    cancelAnimationFrame(rafRef.current);
  }, []);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    setElapsedMs(0);
    setIsRunning(false);
  }, []);

  /**
   * Atomic reset + start. Resets timer to 0 and immediately starts again.
   * Avoids stale closure issues with sequential reset()/start() calls.
   */
  const restart = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    startRef.current = performance.now();
    setElapsedMs(0);
    setIsRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /** Format elapsed ms as mm:ss */
  const formatted = formatElapsed(elapsedMs);

  return { elapsedMs, formatted, isRunning, start, stop, reset, restart };
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
