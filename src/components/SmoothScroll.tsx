import { useEffect, useState } from 'react';
import ReactLenis from 'lenis/react';

/**
 * Lenis in `root` mode renders its children directly (no wrapper element), so
 * the server and client trees match exactly and hydration stays clean.
 *
 * Smooth wheel scrolling is skipped for visitors who ask for reduced motion —
 * hijacking the scroll wheel is the single most common accessibility complaint
 * about sites like this one.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: !reduceMotion,
        wheelMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
