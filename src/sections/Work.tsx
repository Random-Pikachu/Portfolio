import { useCallback, useEffect, useRef, useState, type CSSProperties, type FocusEvent } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ExternalLink, Github, Youtube } from 'lucide-react';
import { FadeUp } from '../motion/primitives';
import { PROJECTS, SECTIONS, type Project } from '../data/site';
import { SectionRail } from './SectionRail';

const SECTION = SECTIONS[2];
const N = PROJECTS.length;

function Card({
  p,
  i,
  x,
  centre,
  active,
}: {
  p: Project;
  i: number;
  x: MotionValue<number>;
  centre: number;
  active: boolean;
}) {
  // The image slides a little against the card's own travel: depth without a library.
  const imgX = useTransform(x, (v) => {
    if (typeof window === 'undefined' || !centre) return '0%';
    const rel = (centre + v - window.innerWidth / 2) / window.innerWidth;
    return `${(-rel * 5).toFixed(2)}%`;
  });
  const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <article
      data-index={i}
      data-active={active}
      aria-labelledby={`project-${slug}`}
      className="work-card"
    >
      {p.image ? (
        <motion.img
          style={{ x: imgX }}
          className="work-img"
          src={`/work/${p.image}-1600.webp`}
          srcSet={`/work/${p.image}-960.webp 960w, /work/${p.image}-1600.webp 1600w`}
          sizes="(min-width: 48rem) 72vw, 100vw"
          alt={`${p.title} screenshot`}
          loading={i < 2 ? 'eager' : 'lazy'}
          decoding="async"
        />
      ) : (
        <div className="work-type" aria-hidden="true">
          <span>{p.title}</span>
        </div>
      )}
      <div className="work-shade" aria-hidden="true" />

      <div className="work-caption">
        <p className="t-meta text-[#f7d02c]" aria-hidden="true">
          {p.index} ///
        </p>
        <h3 id={`project-${slug}`} className="t-card mt-2 text-white">
          {p.title}
        </h3>
        <p className="t-body mt-2 max-w-[48ch] text-white/78">{p.summary}</p>
        <p className="sr-only">{p.description}</p>
        <p className="t-meta mt-4 text-white/60">{p.stack.join(' · ')}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a href={p.github} target="_blank" rel="noopener" className="pill" aria-label={`${p.title} source code on GitHub`}>
            <Github className="h-3 w-3" aria-hidden="true" /> github
          </a>
          {p.live && (
            <a href={p.live} target="_blank" rel="noopener" className="pill" aria-label={`${p.title} live site`}>
              <ExternalLink className="h-3 w-3" aria-hidden="true" /> live
            </a>
          )}
          {p.youtube && (
            <a href={p.youtube} target="_blank" rel="noopener" className="pill" aria-label={`${p.title} video walkthrough on YouTube`}>
              <Youtube className="h-3 w-3" aria-hidden="true" /> demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * The projects, sideways. The section is tall; a sticky frame one viewport
 * high holds the row of cards, and vertical progress through the section is
 * mapped onto the row's horizontal position. Native scroll is never hijacked,
 * so Lenis, anchors and the back button keep working. The section's height
 * comes from CSS (see .work in index.css); JavaScript only measures how far
 * the row must travel and drives the transform.
 */
export function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [dist, setDist] = useState(0);
  const [centres, setCentres] = useState<number[]>([]);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const stacked = window.matchMedia('(max-width: 47.99rem)').matches;
    if (stacked || reduce) {
      setDist(0);
      setCentres([]);
      return;
    }
    const cards = Array.from(track.querySelectorAll<HTMLElement>('.work-card'));
    const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const last = cards[cards.length - 1];
    if (!last) return;
    setDist(Math.max(0, last.offsetLeft + last.offsetWidth + pad - window.innerWidth));
    setCentres(cards.map((c) => c.offsetLeft + c.offsetWidth / 2));
  }, [reduce]);

  useEffect(() => {
    // A ResizeObserver reports once on observe, which is the initial measure.
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  // The card nearest the middle of the viewport is the one in colour.
  useMotionValueEvent(x, 'change', (v) => {
    if (!centres.length) return;
    const mid = window.innerWidth / 2 - v;
    let best = 0;
    let bestD = Infinity;
    centres.forEach((c, i) => {
      const d = Math.abs(c - mid);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setActive((prev) => (prev === best ? prev : best));
  });

  // Tabbing into a card scrolls the page so that card is in view; keyboard
  // users are never left focused on something off-screen to the right.
  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>('[data-index]');
    const section = sectionRef.current;
    if (!card || !section || !dist || !centres.length) return;
    const i = Number(card.dataset.index);
    const p = Math.min(1, Math.max(0, (centres[i] - window.innerWidth / 2) / dist));
    const top = section.offsetTop + p * (section.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-labelledby="projects-heading"
      className="work"
      style={{ '--n': N } as CSSProperties}
    >
      <div className="work-pin">
        <div className="wrap grid-12 mb-8 items-end">
          <SectionRail {...SECTION} id="projects" />
          <div className="content flex items-end justify-between gap-6">
            <FadeUp>
              <h3 className="t-title text-text-base">Selected work</h3>
            </FadeUp>
            <FadeUp delay={0.05}>
              <p className="t-mono tabular-nums text-text-faint" aria-live="polite">
                <span className="text-text-base">{String(active + 1).padStart(2, '0')}</span>
                {' / '}
                {String(N).padStart(2, '0')}
              </p>
            </FadeUp>
          </div>
        </div>

        <motion.div ref={trackRef} className="work-track" style={{ x }} onFocus={onFocus}>
          {PROJECTS.map((p, i) => (
            <Card key={p.index} p={p} i={i} x={x} centre={centres[i] ?? 0} active={i === active} />
          ))}
        </motion.div>

        <div className="work-progress wrap mt-6">
          <div className="hairline relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 w-full origin-left bg-text-base"
              style={{ scaleX: progress }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
