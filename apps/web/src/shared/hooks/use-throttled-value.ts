import { useEffect, useRef, useState } from 'react';

export function useThrottledValue<Value>(value: Value, intervalMs: number): Value {
  const [throttled, setThrottled] = useState(value);
  const lastEmit = useRef(0);

  useEffect(() => {
    const wait = Math.max(0, intervalMs - (Date.now() - lastEmit.current));

    const timer = setTimeout(() => {
      lastEmit.current = Date.now();
      setThrottled(value);
    }, wait);

    return () => clearTimeout(timer);
  }, [value, intervalMs]);

  return throttled;
}
