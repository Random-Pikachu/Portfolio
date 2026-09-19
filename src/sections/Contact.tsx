import { useCallback, useEffect, useRef, useState } from 'react';
import { CalendarDays, Github, Linkedin, Mail } from 'lucide-react';
import ContributionHeatmap from '../components/ContributionHeatmap';
import { DRAWING_NO, SITE } from '../data/site';
import { goTo } from '../sheet/scroll';
import { useNear } from '../sheet/useScrollProgress';

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
      className="t-label issue__copy"
      aria-label="Copy email address"
    >
      <span aria-live="polite">{copied ? 'copied' : 'copy'}</span>
    </button>
  );
}

/** The heatmap fetches only once it is near the viewport, never on page load. */
function LazyHeatmap() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const onNear = useCallback(() => setNear(true), []);
  useNear(ref, 300, onNear);
  return <div ref={ref}>{near ? <ContributionHeatmap /> : null}</div>;
}

/**
 * Chart 04, Transmission. The line, the one filled control on the site with the
 * issue notes beside it, three link cells that reveal their handles, the
 * year's activity as square cells, and the footer with the drawing number.
 */
export function Contact() {
  const year = new Date().getFullYear();
  return (
    <div className="sheet issue">
      <div className="grid-8">
        <div className="issue__lead">
          <p className="t-display-1 issue__line">
            Let&apos;s build
            <br />
            something<span className="issue__stop">.</span>
          </p>
          <p className="t-body issue__para">
            Open to remote work and interesting projects. The quickest way to reach me is a fifteen-minute call; the second
            quickest is mail.
          </p>
          <dl className="issue__notes t-label">
            <div>
              <dt>Issued for</dt>
              <dd>remote work</dd>
            </div>
            <div>
              <dt>Qty</dt>
              <dd>1</dd>
            </div>
            <div>
              <dt>Light-time</dt>
              <dd>15 min</dd>
            </div>
          </dl>
          <p className="issue__cta">
            <a href={SITE.calendar} target="_blank" rel="noopener" className="btn-accent arrow-link">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Book a 15-minute call
              <span className="arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </p>
        </div>
      </div>

      <address className="issue__cells sheet-card">
        {LINKS.map(({ icon: Icon, label, handle, href, aria, me }) => (
          <div key={label} className="issue__cell">
            <div className="issue__cell-head">
              <a href={href} target="_blank" rel={me ? 'me noopener' : 'noopener'} aria-label={aria} className="arrow-link mono issue__cell-link">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
                <span className="arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
              {label === 'mail' ? <CopyEmail /> : null}
            </div>
            <p className="t-data issue__handle">{handle}</p>
          </div>
        ))}
      </address>

      <div className="issue__activity">
        <h3 className="t-label issue__activity-title">Activity · a long exposure of {year}</h3>
        <LazyHeatmap />
      </div>

      <footer className="issue__footer t-data">
        <p>© {year} {SITE.handle.toLowerCase()}</p>
        <p className="issue__footer-no">[ pokédex entry No. {DRAWING_NO} ]</p>
        <a
          href="#cover"
          onClick={(e) => {
            e.preventDefault();
            goTo('cover');
          }}
          className="arrow-link"
        >
          back to the cover
          <span className="arrow" aria-hidden="true">
            ↑
          </span>
        </a>
      </footer>
    </div>
  );
}
