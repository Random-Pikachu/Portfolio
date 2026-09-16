import { useRef, type ReactNode } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';

/**
 * The whole site animates with these five primitives, one easing and three
 * durations, so it reads as one hand. Rules: only transform, opacity and
 * filter move; nothing runs longer than 1.2s; an element either enters once
 * or is scroll-linked, never both; reduced motion renders the final state.
 *
 * Every element that starts hidden carries the `reveal` class: the <noscript>
 * stylesheet in index.html forces those visible when JavaScript never runs,
 * so the prerendered page is readable rather than stuck at opacity 0.
 */
import { DUR, EASE } from './tokens';

const VIEW = { once: true, margin: '-12% 0px -12% 0px' } as const;

/** A block that settles into place: 16px, not 24, so it lands rather than arrives. */
export function FadeUp({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
  x = 0,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'p' | 'span';
  x?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, VIEW);
  const reduce = useReducedMotion();
  const M = motion[Tag] as typeof motion.div;
  return (
    <M
      ref={ref as never}
      initial={reduce ? false : { opacity: 0, y: 16, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : undefined}
      transition={{ duration: DUR.base, delay, ease: EASE }}
      className={`reveal ${className}`}
    >
      {children}
    </M>
  );
}

/**
 * A heading that rises from behind a clip, one line at a time. Pass each line
 * as its own child; the wrapper clips, the inner span travels.
 */
export function Reveal({
  lines,
  className = '',
  lineClassName = '',
  delay = 0,
  as: Tag = 'span',
  inView: useViewport = true,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: 'span' | 'h1' | 'h2' | 'p';
  /** False animates on mount (the hero); true waits for the viewport. */
  inView?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, VIEW);
  const reduce = useReducedMotion();
  const go = !useViewport || seen;
  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
          <motion.span
            className={`reveal block ${lineClassName}`}
            initial={reduce ? false : { y: '110%' }}
            animate={go ? { y: 0 } : undefined}
            transition={{ duration: DUR.slow, delay: delay + i * 0.1, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

function Word({
  word,
  progress,
  start,
  end,
}: {
  word: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
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
  if (reduce) return <p ref={ref} className={className}>{text}</p>;
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word
          key={i}
          word={w}
          progress={scrollYProgress}
          start={i / words.length}
          end={Math.min(1, (i + 1) / words.length + 0.05)}
        />
      ))}
    </p>
  );
}

/** Mono digits that tick up to their value when they enter, once. */
export function Counter({ value, className = '' }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const reduce = useReducedMotion();
  return (
    <span ref={ref} className={`mono tabular-nums ${className}`}>
      {inView || reduce ? (
        <motion.span
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DUR.fast }}
        >
          {value}
        </motion.span>
      ) : (
        <span>{value}</span>
      )}
    </span>
  );
}
