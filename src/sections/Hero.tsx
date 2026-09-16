import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useScramble } from '../hooks/useScramble';
import { Reveal } from '../motion/primitives';
import { DUR, EASE } from '../motion/tokens';
import { SITE } from '../data/site';

const PIKACHU = ` (\\__/)
(•ω•)
/ > ⚡`;
const PIKACHU_WINK = ` (\\__/)
(-ω•)
/ > ⚡`;

/** Gwalior's clock, ticking. Proof that a person, in a place, keeps this page. */
function Clock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {time ?? '--:--:--'} IST
    </span>
  );
}

/**
 * Typed out character by character once the page is live, and winks under the
 * pointer. The prerendered markup and the first client render both carry the
 * full art, so hydration is clean and the layout never moves; the typing
 * starts from the render after that.
 */
function Pikachu() {
  const reduce = useReducedMotion();
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [len, setLen] = useState(0);
  const [wink, setWink] = useState(false);
  const typing = hydrated && !reduce;
  useEffect(() => {
    if (!typing || len >= PIKACHU.length) return;
    const id = setTimeout(() => setLen((n) => n + 1), len === 0 ? 900 : 45);
    return () => clearTimeout(id);
  }, [typing, len]);
  const art = wink ? PIKACHU_WINK : PIKACHU;
  const shown = typing ? len : art.length;
  return (
    <pre
      aria-hidden="true"
      onMouseEnter={() => setWink(true)}
      onMouseLeave={() => setWink(false)}
      className="mono select-none text-sm leading-relaxed text-text-faint"
    >
      {art.slice(0, shown)}
      <span className="invisible">{art.slice(shown)}</span>
    </pre>
  );
}

export function Hero() {
  const { display } = useScramble('/sangam · portfolio · 2026', 300);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  // The name drifts up at half speed and is gone by the time About arrives.
  const y = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -120]);
  const opacity = useTransform(scrollY, [0, 480], [1, reduce ? 1 : 0]);
  const hint = useTransform(scrollY, [0, 80], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col justify-between pt-28 pb-8 md:pt-32"
    >
      <motion.div style={{ y, opacity }} className="wrap grid-12 flex-1 items-center">
        <div className="content relative">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: DUR.fast, delay: 0.2 }}
            className="reveal t-mono text-text-faint tracking-[0.08em]"
            aria-hidden="true"
          >
            {display}
          </motion.p>

          <h1 className="mt-6">
            <span className="sr-only">
              {SITE.name} — {SITE.jobTitle}
            </span>
            <Reveal
              as="span"
              inView={false}
              delay={0.35}
              className="t-display block"
              lines={['Sangam', 'Pratap Singh']}
            />
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.base, delay: 0.9, ease: EASE }}
            className="reveal t-body mt-8 max-w-[44ch] text-text-muted md:text-[1.25rem]"
          >
            Software engineer. Legal tech at Retsguide by day, KDE Plasma patches by night.
          </motion.p>

          <div className="absolute top-0 right-0 hidden lg:block">
            <Pikachu />
          </div>
        </div>
      </motion.div>

      <div className="wrap">
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DUR.base, delay: 1.3 }}
          className="reveal"
        >
          <div className="hairline" />
          <dl className="relative grid gap-y-5 py-6 sm:grid-cols-3 sm:gap-x-6">
            <div>
              <dt className="t-meta text-text-faint">now</dt>
              <dd className="t-mono mt-1.5 text-text-muted">
                building a legal tech startup for Denmark, at{' '}
                <a
                  href="https://retsguide.dk/"
                  target="_blank"
                  rel="noopener"
                  className="underline-draw text-text-base"
                >
                  Retsguide
                </a>
              </dd>
            </div>
            <div>
              <dt className="t-meta text-text-faint">from</dt>
              <dd className="t-mono mt-1.5 text-text-muted">
                Gwalior, IN · <Clock />
              </dd>
            </div>
            <div>
              <dt className="t-meta text-text-faint">open to</dt>
              <dd className="t-mono mt-1.5 text-text-muted">remote work &amp; interesting projects</dd>
            </div>
            <motion.span
              style={{ opacity: hint }}
              aria-hidden="true"
              className="t-meta absolute right-0 bottom-6 hidden text-text-faint lg:block"
            >
              scroll ↓
            </motion.span>
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
