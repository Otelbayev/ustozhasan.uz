'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Konteyner kengligini o'lchaydi.
 *
 * Nega kerak: SVG'ni `viewBox` bilan cho'zish matn va chiziqlarni ham
 * cho'zadi — 2px chiziq ba'zan 1.4px, ba'zan 3px bo'lib ko'rinadi. Haqiqiy
 * kenglikni bilib, koordinatalarni piksel aniqligida hisoblaymiz.
 */
export function useChartWidth(fallback = 720) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(240, Math.round(entry.contentRect.width)));
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, width };
}
