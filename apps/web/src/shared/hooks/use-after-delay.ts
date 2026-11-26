import { useEffect, useState } from 'react';

export function useAfterDelay(delayMs: number): boolean {
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPassed(true), delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  return passed;
}
