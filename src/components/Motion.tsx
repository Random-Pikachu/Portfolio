import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sun } from '../lib/sunState';

gsap.registerPlugin(ScrollTrigger);

/**
 * All scroll choreography for the site.
 *
 * Two rules govern everything here.
 *
 * There are no ScrollTrigger pins. `pin: true` inserts a spacer and changes
 * document.scrollHeight, and Sundown's anchors are driven by a ResizeObserver
 * on the body — a pin toggling height mid-scroll would make the sunset
 * oscillate. Every held effect is CSS `position: sticky` with a scrubbed
 * timeline on top, which changes no heights at all.
 *
 * And everything lives inside one gsap.matchMedia keyed on
 * prefers-reduced-motion. Under `reduce` the callback never runs, so the
 * reduced-motion fallback for every item is simply the CSS resting state.
 */
export default function Motion() {
  const { key } = useLocation();

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      ScrollTrigger.config({ ignoreMobileResize: true });
      const onRefresh = () => sun.remeasure();
      ScrollTrigger.addEventListener('refresh', onRefresh);

      // ── M1  the hero line, four beats in reading order ──────────────────
      const heroLines = gsap.utils.toArray<HTMLElement>('.hero .display .g');
      if (heroLines.length) {
        gsap.set(heroLines, { yPercent: 112 });
        gsap.to(heroLines, {
          yPercent: 0, duration: 0.9, ease: 'power3.out', stagger: 0.075,
        });
      }

      // ── M2  the claim lands before its explanation arrives ──────────────
      const after = gsap.utils.toArray<HTMLElement>('.hero .sub, .hero-act');
      if (after.length) {
        gsap.from(after, {
          y: 14, opacity: 0, duration: 0.42, ease: 'power2.out',
          stagger: 0.08, delay: 0.36,
        });
      }

      // ── M3  the sun descends, with the horizon on the same timeline ─────
      gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement, start: 'top top',
          end: 'bottom bottom', scrub: 0.35, invalidateOnRefresh: true,
        },
      })
        .fromTo('.sun', { yPercent: 0 }, { yPercent: 78, ease: 'none' }, 0)
        .fromTo('.horizon', { yPercent: 0 }, { yPercent: 78, ease: 'none' }, 0);

      // ── M4  reveals that say what kind of thing arrived ─────────────────
      const rv = (kind: string, vars: gsap.TweenVars, start = 'top 84%') =>
        gsap.utils.toArray<HTMLElement>(`[data-rv="${kind}"]`).forEach((el) => {
          gsap.from(el, { ...vars, scrollTrigger: { trigger: el, start, once: true } });
        });

      // A heading is revealed, like the hero line, so the page has one grammar.
      gsap.utils.toArray<HTMLElement>('[data-rv="head"]').forEach((el) => {
        const g = el.querySelectorAll('.g');
        const t = g.length ? g : [el];
        gsap.from(t, {
          yPercent: g.length ? 100 : 0, opacity: g.length ? 1 : 0, y: g.length ? 0 : 12,
          duration: 0.62, ease: 'power3.out', stagger: 0.06,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      rv('text', { y: 10, opacity: 0, duration: 0.34, ease: 'power2.out' });
      rv('row', { x: -14, opacity: 0, duration: 0.38, ease: 'power2.out', stagger: 0.05 });
      // An image is not moved, it is uncovered.
      rv('plate', {
        clipPath: 'inset(0 0 100% 0)', duration: 0.78, ease: 'power2.inOut',
      });

      // ── M5  the full-bleed photograph reads as a window, not a backdrop ──
      gsap.utils.toArray<HTMLElement>('.photo-room').forEach((room) => {
        const img = room.querySelector('img');
        if (!img) return;
        gsap.fromTo(img, { yPercent: -5 }, {
          yPercent: 5, ease: 'none',
          scrollTrigger: { trigger: room, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
        });
      });

      // ── M6  the claim performs itself ───────────────────────────────────
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const to = Number(el.dataset.count);
        const from = Number(el.dataset.countFrom ?? 0);
        const suffix = el.dataset.countSuffix ?? '';
        const o = { v: from };
        gsap.to(o, {
          v: to, duration: 1.1, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          onUpdate: () => { el.textContent = Math.round(o.v) + suffix; },
        });
      });

      // ── M7  the forecast draws itself ───────────────────────────────────
      gsap.utils.toArray<SVGPathElement>('[data-draw]').forEach((path, i) => {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0, duration: i === 0 ? 0.9 : 0.7, ease: 'none',
          delay: i === 0 ? 0 : 0.2,
          scrollTrigger: { trigger: path.ownerSVGElement, start: 'top 85%', once: true },
        });
      });

      // ── M8  the fallback chain falls through ────────────────────────────
      gsap.utils.toArray<SVGGElement>('[data-chain] > g').forEach((g, i, all) => {
        gsap.from(g, {
          opacity: 0, duration: 0.18, ease: 'none', delay: i * 0.09,
          scrollTrigger: { trigger: all[0].ownerSVGElement, start: 'top 85%', once: true },
        });
      });

      // ── M15  the strip tells you how far along it is ────────────────────
      gsap.utils.toArray<HTMLElement>('.strip').forEach((strip) => {
        const bar = strip.parentElement?.querySelector<HTMLElement>('.strip-bar span');
        const num = strip.parentElement?.querySelector<HTMLElement>('[data-strip-n]');
        const total = strip.children.length;
        const update = () => {
          const max = strip.scrollWidth - strip.clientWidth;
          const p = max > 0 ? strip.scrollLeft / max : 0;
          if (bar) bar.style.transform = `scaleX(${Math.max(0.08, p * 0.92 + 0.08)})`;
          if (num) {
            const n = Math.min(total, Math.round(p * (total - 1)) + 1);
            num.textContent = String(n).padStart(2, '0');
          }
        };
        strip.addEventListener('scroll', update, { passive: true });
        update();

        // Drag to scroll. A horizontal scroller with no visible affordance is
        // a scroller most people never discover.
        let down = false;
        let startX = 0;
        let startL = 0;
        strip.addEventListener('pointerdown', (e) => {
          down = true; startX = e.clientX; startL = strip.scrollLeft;
          strip.classList.add('dragging');
        });
        const end = () => { down = false; strip.classList.remove('dragging'); };
        strip.addEventListener('pointerup', end);
        strip.addEventListener('pointerleave', end);
        strip.addEventListener('pointermove', (e) => {
          if (!down) return;
          strip.scrollLeft = startL - (e.clientX - startX);
        });
      });

      // ── M10  the crossover ──────────────────────────────────────────────
      const bandBody = document.querySelector('.band-body');
      if (bandBody) {
        gsap.timeline({
          scrollTrigger: {
            trigger: bandBody, start: 'top top', end: 'bottom bottom',
            scrub: 0.3, invalidateOnRefresh: true,
          },
        })
          .fromTo('.band-veil', { opacity: 0.82 },
            { opacity: 0.08, ease: 'power2.out', duration: 0.46 })
          .to('.band-veil', { opacity: 0.62, ease: 'power1.in', duration: 0.54 })
          .fromTo('.band-photo', { scale: 1.08 },
            { scale: 1, ease: 'none', duration: 1 }, 0);
      }

      ScrollTrigger.refresh();
      return () => { ScrollTrigger.removeEventListener('refresh', onRefresh); };
    });

    return () => { mm.revert(); };
  }, [key]);

  return null;
}
