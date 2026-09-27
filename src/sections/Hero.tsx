import type { MouseEvent } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { SITE } from '../data/site';
import { Nightscape } from '../night/Nightscape';
import { goTo } from '../shell/scroll';

/** The two lines of proof under the one-liner: where the work is done. */
const PROOF = ['Software Engineer Intern · Retsguide', 'KDE Plasma contributor'];

/**
 * The hero: the Nightscape at full height, and over it the one-liner, the
 * proof, and the two actions, the call and the work. On a wide screen the
 * words sit low on the left, clear of the house; on a phone they stack at
 * the top over a scrim, and the house stays in view beneath them.
 */
export function Hero() {
  const toWork = (e: MouseEvent) => {
    if (goTo('work')) e.preventDefault();
  };
  return (
    <section id="top" className="hero" data-hero aria-labelledby="hero-title">
      <Nightscape id="hero" className="hero__art" />
      <div className="hero__scrim" aria-hidden="true" />
      <div className="frame hero__frame">
        <div className="hero__copy">
          <p className="t-label hero__eyebrow">
            {SITE.name} · {SITE.jobTitle}
          </p>
          <h1 id="hero-title" className="t-hero hero__title">
            I build software after dark.
          </h1>
          <ul className="hero__proof">
            {PROOF.map((p) => (
              <li key={p} className="t-label">
                {p}
              </li>
            ))}
          </ul>
          <div className="hero__actions" data-hero-cta data-cta>
            <a href={SITE.calendar} target="_blank" rel="noopener" className="btn btn--ember" data-umami-event="book-call-hero">
              Book a 15-minute call
              <ArrowUpRight size={17} strokeWidth={1.75} aria-hidden="true" />
            </a>
            <a href="#work" onClick={toWork} className="btn btn--quiet">
              See the work
              <ArrowDown size={17} strokeWidth={1.75} aria-hidden="true" />
            </a>
          </div>
        </div>
        <p className="t-micro hero__cue" aria-hidden="true">
          Scroll
        </p>
      </div>
    </section>
  );
}
