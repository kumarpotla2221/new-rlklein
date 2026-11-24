import { useEffect, useRef, useState } from 'react';

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function resolvesImmediately(): boolean {
  return prefersReducedMotion() || typeof IntersectionObserver === 'undefined';
}

// Reports when the element first enters the viewport, then stops observing.
export function useInView<T extends Element = HTMLDivElement>(
  { threshold = 0.15, rootMargin = '0px 0px -10% 0px' }: { threshold?: number; rootMargin?: string } = {},
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(resolvesImmediately);

  useEffect(() => {
    const el = ref.current;
    if (inView || !el) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold, rootMargin });

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, threshold, rootMargin]);

  return { ref, inView };
}
