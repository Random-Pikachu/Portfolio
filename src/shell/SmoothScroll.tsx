import { useEffect, useState } from 'react';
import ReactLenis, { useLenis } from 'lenis/react';
import { attachLenis, detachLenis, goTo } from './scroll';

/**
 * Lenis in `root` mode renders its children directly (no wrapper element), so
 * the server and client trees match exactly and hydration stays clean.
 *
 * Smooth wheel scrolling is skipped for visitors who ask for reduced motion:
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
      <ScrollBridge />
      {children}
    </ReactLenis>
  );
}

/**
 * Hands the Lenis instance to the scroll layer, honours a hash on first load
 * and on back/forward. Renders nothing.
 */
function ScrollBridge() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    attachLenis(lenis);
    const hash = location.hash.slice(1);
    if (hash) goTo(hash, { instant: true });
    const onPop = () => {
      const h = location.hash.slice(1);
      if (h) goTo(h);
    };
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      detachLenis();
    };
  }, [lenis]);
  return null;
}
