import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Reveals by wiping a clip-path rather than fading opacity, so text appears as
 * though it is being written rather than loading.
 *
 * It renders visible and only hides itself once the observer is attached, so
 * the prerendered HTML a crawler sees — and anyone without JavaScript — gets
 * the finished page rather than a blank one.
 *
 * The arm/show flags are classes toggled on the node, not React state. Routing
 * them through state would re-render every wrapped block twice on mount for an
 * effect the DOM can carry on its own.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'article' | 'header';
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    el.classList.add('armed');

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('shown');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
