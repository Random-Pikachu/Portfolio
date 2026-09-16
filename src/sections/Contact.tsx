import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { CalendarDays, Github, Linkedin, Mail } from 'lucide-react';
import ContributionHeatmap from '../components/ContributionHeatmap';
import { FadeUp, Reveal } from '../motion/primitives';
import { STAGGER } from '../motion/tokens';
import { SECTIONS, SITE } from '../data/site';
import { SectionRail } from './SectionRail';

const SECTION = SECTIONS[3];

const LINKS = [
  { icon: Mail, label: 'mail', handle: SITE.email, href: `mailto:${SITE.email}`, aria: `Email ${SITE.name}`, me: false },
  { icon: Linkedin, label: 'linkedin', handle: '/in/sangam21', href: SITE.profiles.linkedin, aria: `${SITE.name} on LinkedIn`, me: true },
  { icon: Github, label: 'github', handle: '@Random-Pikachu', href: SITE.profiles.github, aria: `${SITE.name} on GitHub`, me: true },
];

/** Copies the address and says so, once, for a moment. */
function CopyEmail() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(id);
  }, [copied]);
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard?.writeText(SITE.email).then(() => setCopied(true))}
      className="t-meta text-text-faint transition-colors hover:text-text-base"
      aria-label="Copy email address"
    >
      <span aria-live="polite">{copied ? 'copied' : 'copy'}</span>
    </button>
  );
}

/** The heatmap fetches only once it is near the viewport, never on page load. */
function LazyHeatmap() {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: '300px 0px' });
  return <div ref={ref}>{near ? <ContributionHeatmap /> : null}</div>;
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-24 md:py-32">
      <div className="wrap grid-12">
        <SectionRail {...SECTION} id="contact" />

        <div className="content">
          <Reveal
            as="p"
            className="t-display text-text-base"
            lines={[
              "Let's build",
              <>
                something<span className="text-accent">.</span>
              </>,
            ]}
          />
          <FadeUp delay={0.15} className="mt-6">
            <p className="t-body max-w-[44ch] text-text-muted">
              Open to remote work and interesting projects. The quickest way to reach me is a
              fifteen-minute call; the second quickest is mail.
            </p>
          </FadeUp>

          <FadeUp delay={0.2} className="mt-10">
            <a href={SITE.calendar} target="_blank" rel="noopener" className="btn-accent arrow-link">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              schedule a call
              <span className="arrow" aria-hidden="true">↗</span>
            </a>
          </FadeUp>

          <address className="mt-16 grid not-italic sm:grid-cols-3">
            {LINKS.map(({ icon: Icon, label, handle, href, aria, me }, i) => (
              <FadeUp
                key={label}
                delay={0.1 + i * STAGGER}
                className={`group border-t border-border-main py-5 sm:border-t ${
                  i > 0 ? 'sm:border-l sm:pl-6' : ''
                } ${i < LINKS.length - 1 ? 'sm:pr-6' : ''}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <a
                    href={href}
                    target="_blank"
                    rel={me ? 'me noopener' : 'noopener'}
                    aria-label={aria}
                    className="arrow-link mono text-base text-text-base"
                  >
                    <Icon className="h-3.5 w-3.5 text-text-faint" aria-hidden="true" />
                    {label}
                    <span className="arrow" aria-hidden="true">↗</span>
                  </a>
                  {label === 'mail' ? <CopyEmail /> : null}
                </div>
                <p className="t-mono mt-1.5 truncate text-text-faint transition-all duration-500 ease-[var(--ease-out)] md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
                  {handle}
                </p>
              </FadeUp>
            ))}
          </address>

          <FadeUp delay={0.1} className="mt-20 border-t border-border-main pt-8">
            <h3 className="t-meta text-text-faint">activity</h3>
            <div className="mt-5">
              <LazyHeatmap />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
