import { useCallback, useRef } from "react";

interface UseSyncScrollOptions {
  enabled: boolean;
}

/**
 * Hook for synchronizing scroll position across multiple scrollable elements.
 *
 * @example
 * ```tsx
 * const { registerRef } = useSyncScroll({ enabled: true });
 *
 * <Textarea ref={registerRef("input")} />
 * <div ref={registerRef("preview")} />
 * <div ref={registerRef("output")} />  // supports N elements
 * ```
 */
export function useSyncScroll({ enabled }: UseSyncScrollOptions) {
  // Store refs by key
  const refsMap = useRef<Map<string, HTMLElement>>(new Map());
  // Track which element is currently scrolling (prevents infinite loops)
  const scrollingElement = useRef<string | null>(null);

  const handleScroll = useCallback(
    (sourceKey: string) => {
      if (!enabled || scrollingElement.current !== null) return;

      const sourceEl = refsMap.current.get(sourceKey);
      if (!sourceEl) return;

      const maxScroll = sourceEl.scrollHeight - sourceEl.clientHeight;
      if (maxScroll <= 0) return;

      scrollingElement.current = sourceKey;

      // Calculate scroll percentage of source
      const scrollPercentage = sourceEl.scrollTop / maxScroll;

      // Apply to all other registered elements
      refsMap.current.forEach((targetEl, key) => {
        if (key !== sourceKey) {
          const targetMaxScroll = targetEl.scrollHeight - targetEl.clientHeight;
          if (targetMaxScroll > 0) {
            targetEl.scrollTop = scrollPercentage * targetMaxScroll;
          }
        }
      });

      requestAnimationFrame(() => {
        scrollingElement.current = null;
      });
    },
    [enabled]
  );

  // Returns a ref callback for registering elements
  const registerRef = useCallback(
    (key: string) => (element: HTMLElement | null) => {
      if (element) {
        refsMap.current.set(key, element);
        element.onscroll = () => handleScroll(key);
      } else {
        const existing = refsMap.current.get(key);
        if (existing) existing.onscroll = null;
        refsMap.current.delete(key);
      }
    },
    [handleScroll]
  );

  return { registerRef };
}
