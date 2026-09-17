import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';

/**
 * The one scroll-linked text primitive on the site. Everything else that
 * moves is CSS (ink-in, draw, bleed) or the strip's own transform.
 *
 * Every element that starts hidden carries the `reveal` class: the <noscript>
 * stylesheet in index.html forces those visible when JavaScript never runs,
 * so the prerendered page is readable rather than stuck at low opacity.
 */
function Word({ word, progress, start, end }: { word: string; progress: MotionValue<number>; start: number; end: number }) {
  const opacity = useTransform(progress, [start, end], [0.22, 1]);
  return (
    <motion.span className="reveal" style={{ opacity }}>
      {word}{' '}
    </motion.span>
  );
}

/**
 * A paragraph whose words come to full ink as the reader's eye would reach
 * them: opacity is tied to the paragraph's travel through the viewport, so it
 * reverses when you scroll back. Reduced motion renders it solid.
 */
export function Words({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.45'] });
  const words = text.split(' ');
  if (reduce)
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    );
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} word={w} progress={scrollYProgress} start={i / words.length} end={Math.min(1, (i + 1) / words.length + 0.05)} />
      ))}
    </p>
  );
}
