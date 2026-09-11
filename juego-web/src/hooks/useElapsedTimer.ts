import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Elapsed-time timer backed by a low-frequency interval.
 * The internal clock stays precise while React only receives one update per
 * second, avoiding a 60fps re-render of the complete search game.
 */
export function useElapsedTimer() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const startRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const paintedSecondRef = useRef(-1);

  const updateElapsed = useCallback(() => {
    if (startRef.current === null) return;

    const nextElapsedMs = performance.now() - startRef.current;
    const nextSecond = Math.floor(nextElapsedMs / 1000);
    if (nextSecond !== paintedSecondRef.current) {
      paintedSecondRef.current = nextSecond;
      setElapsedMs(nextElapsedMs);
    }
  }, []);

  const clearIntervalRef = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (isRunning) return;
    startRef.current = performance.now() - elapsedMs;
    paintedSecondRef.current = Math.floor(elapsedMs / 1000) - 1;
    setIsRunning(true);
    updateElapsed();
    clearIntervalRef();
    intervalRef.current = window.setInterval(updateElapsed, 250);
  }, [clearIntervalRef, elapsedMs, isRunning, updateElapsed]);

  const stop = useCallback(() => {
    if (startRef.current !== null) {
      setElapsedMs(performance.now() - startRef.current);
    }
    setIsRunning(false);
    startRef.current = null;
    paintedSecondRef.current = -1;
    clearIntervalRef();
  }, [clearIntervalRef]);

  const reset = useCallback(() => {
    clearIntervalRef();
    startRef.current = null;
    paintedSecondRef.current = -1;
    setElapsedMs(0);
    setIsRunning(false);
  }, [clearIntervalRef]);

  /**
   * Atomic reset + start. Resets timer to 0 and immediately starts again.
   * Avoids stale closure issues with sequential reset()/start() calls.
   */
  const restart = useCallback(() => {
    clearIntervalRef();
    startRef.current = performance.now();
    paintedSecondRef.current = -1;
    setElapsedMs(0);
    setIsRunning(true);
    updateElapsed();
    intervalRef.current = window.setInterval(updateElapsed, 250);
  }, [clearIntervalRef, updateElapsed]);

  useEffect(() => {
    return clearIntervalRef;
  }, [clearIntervalRef]);

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
