import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { FadeUp } from '../motion/primitives';
import { STAGGER } from '../motion/tokens';
import { EXPERIENCES, SECTIONS, type Experience as Entry } from '../data/site';
import { SectionRail } from './SectionRail';

const SECTION = SECTIONS[1];

/**
 * One row of the timeline. The period cell is sticky inside its row so the
 * KDE entry's six bullets scroll past a fixed date; the node on the rule fills
 * while the row is in the middle band of the viewport.
 */
function Row({ exp, index, last }: { exp: Entry; index: number; last: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const on = useInView(ref, { margin: '-40% 0px -50% 0px' });
  const [start, end] = exp.period.split('—').map((s) => s.trim());

  return (
    <article
      ref={ref}
      className={`relative grid gap-4 py-10 md:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] md:gap-x-10 md:py-12 ${
        last ? '' : 'border-b border-border-main'
      }`}
    >
      <div className="self-start md:sticky md:top-28">
        <FadeUp delay={index * 0.05}>
          <p className="t-mono text-text-faint">
            <time dateTime={exp.startDate}>{start}</time>
            {' — '}
            {exp.endDate ? <time dateTime={exp.endDate}>{end}</time> : 'Present'}
          </p>
          {exp.companyUrl ? (
            <a
              href={exp.companyUrl}
              target="_blank"
              rel="noopener"
              className="underline-draw mt-2 inline-block text-base font-medium text-text-base"
            >
              {exp.company}
            </a>
          ) : (
            <p className="mt-2 text-base font-medium text-text-base">{exp.company}</p>
          )}
        </FadeUp>
      </div>

      <div className="relative md:border-l md:border-border-main md:pl-10">
        <span
          aria-hidden="true"
          data-on={on}
          className="node absolute top-1.5 -left-[5px] hidden md:block"
        />
        <FadeUp delay={index * 0.05 + 0.05}>
          <h3 className="t-pull text-text-base">
            {exp.role}
            <span className="sr-only"> at {exp.company}</span>
          </h3>
        </FadeUp>
        <ul className="mt-6 space-y-3.5">
          {exp.points.map((pt, j) => (
            <FadeUp as="li" key={j} x={-8} delay={0.1 + j * STAGGER} className="t-body flex gap-3 text-text-muted">
              <span className="mt-[0.6em] h-px w-4 shrink-0 bg-border-badge" aria-hidden="true" />
              <span className="min-w-0">
                {pt.href && pt.label ? (
                  <>
                    <a
                      href={pt.href}
                      target="_blank"
                      rel="noopener"
                      className="arrow-link underline-draw text-text-base"
                    >
                      {pt.label}
                      <span className="arrow t-mono" aria-hidden="true">↗</span>
                    </a>
                    {' — '}
                    {pt.text}
                  </>
                ) : (
                  pt.text
                )}
                {pt.featured ? (
                  <span className="t-meta ml-2 align-middle text-accent">featured</span>
                ) : null}
              </span>
            </FadeUp>
          ))}
        </ul>
        <FadeUp delay={0.2} className="mt-6">
          <p className="t-meta text-text-faint">{exp.stack.join(' · ')}</p>
        </FadeUp>
      </div>
    </article>
  );
}

export function Experience() {
  return (
    <div className="py-16 md:py-20">
      <div className="wrap grid-12">
        <SectionRail {...SECTION} id="experience" />
        <div className="content border-t border-border-main">
          {EXPERIENCES.map((exp, i) => (
            <Row key={exp.company} exp={exp} index={i} last={i === EXPERIENCES.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
