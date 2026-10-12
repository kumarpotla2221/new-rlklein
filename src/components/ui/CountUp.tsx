import { useEffect, useState } from 'react';
import { prefersReducedMotion, useInView } from '../../hooks/useInView';

interface CountUpProps {
  end: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function CountUp({ end, duration = 1400, delay = 0, prefix = '', suffix = '' }: CountUpProps) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.1, rootMargin: '0px' });
  const [value, setValue] = useState(() => (prefersReducedMotion() ? end : 0));

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setValue(end);
      return;
    }

    let frame = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(easeOutCubic(progress) * end));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    const timer = window.setTimeout(() => { frame = requestAnimationFrame(tick); }, delay);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [inView, end, duration, delay]);

  return (
    <span ref={ref} className="count-up">
      <span className="count-up__value" aria-hidden="true" style={{ opacity: inView ? 1 : 0 }}>{prefix}{value}{suffix}</span>
      <span className="sr-only">{prefix}{end}{suffix}</span>
    </span>
  );
}
