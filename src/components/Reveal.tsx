import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Scroll reveal. Renders visible and only hides itself once the observer is
 * attached, so the prerendered HTML and a no-JS reader get the finished page.
 * Classes are toggled on the node rather than through state, which avoids a
 * re-render per wrapped block on mount.
 */
export default function Reveal({
  children, delay = 0, as: Tag = 'div', className = '',
}: {
  children: ReactNode; delay?: number;
  as?: 'div' | 'section' | 'li' | 'header' | 'article'; className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('in');
      return;
    }
    el.classList.add('rv');
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.disconnect(); }
    }, { rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref as never} className={className}
         style={{ '--rv-d': `${delay}ms` } as React.CSSProperties}>
      {children}
    </Tag>
  );
}
