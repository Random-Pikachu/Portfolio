import { useCallback, useRef, useState, type CSSProperties } from 'react';
import { useScrollProgress } from '../sheet/useScrollProgress';
import { reducedMotion } from '../sheet/scroll';

/**
 * A paragraph whose words come to full ink as the reader's eye would reach
 * them: the paragraph's travel through the viewport becomes a custom
 * property, and each word's opacity is a CSS calc of that against its own
 * position in the text, so scrolling back reverses it. Reduced motion
 * renders it solid. Every word starts at low ink in the prerendered HTML and
 * carries the `reveal` class the <noscript> rule forces visible.
 */
export function Words({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [solid] = useState(() => reducedMotion());
  const words = text.split(' ');
  const onChange = useCallback((p: number) => {
    ref.current?.style.setProperty('--p', p.toFixed(3));
  }, []);
  useScrollProgress(ref, onChange, 'enter');
  if (solid)
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    );
  return (
    <p ref={ref} className={`words ${className}`} style={{ '--p': 0 } as CSSProperties}>
      {words.map((w, i) => (
        <span key={i} className="reveal words__w" style={{ '--s': (i / words.length).toFixed(3) } as CSSProperties}>
          {w}{' '}
        </span>
      ))}
    </p>
  );
}
