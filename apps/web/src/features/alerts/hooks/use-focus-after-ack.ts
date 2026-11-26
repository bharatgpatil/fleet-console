import { useLayoutEffect, useRef } from 'react';

const ACK_SELECTOR = '[data-ack]';

export function useFocusAfterAck(items: readonly unknown[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingIndex = useRef<number | null>(null);
  const seenItems = useRef(items);

  useLayoutEffect(() => {
    if (seenItems.current === items) {
      return;
    }

    seenItems.current = items;

    const index = pendingIndex.current;
    const container = containerRef.current;

    if (index === null || container === null) {
      return;
    }

    pendingIndex.current = null;

    const buttons = container.querySelectorAll<HTMLElement>(ACK_SELECTOR);
    const next = buttons[Math.min(index, buttons.length - 1)] ?? container;

    next.focus();
  });

  const rememberPosition = (button: HTMLElement) => {
    const container = containerRef.current;

    if (container === null) {
      return;
    }

    pendingIndex.current = [...container.querySelectorAll(ACK_SELECTOR)].indexOf(button);
  };

  return { containerRef, rememberPosition };
}
