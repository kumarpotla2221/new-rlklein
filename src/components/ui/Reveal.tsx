import type { CSSProperties, ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';

interface RevealProps {
  children: ReactNode;
  stagger?: boolean;
  delay?: number;
  className?: string;
}

export function Reveal({ children, stagger = false, delay = 0, className }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const classes = [stagger ? 'reveal-group' : 'reveal', inView && 'is-visible', className].filter(Boolean).join(' ');
  const style = delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined;

  return <div ref={ref} className={classes} style={style}>{children}</div>;
}
