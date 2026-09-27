import { useEffect, useState } from 'react';
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import { SITE } from '../data/site';

/**
 * The photograph beside the call, one of the gallery's frames: a lamp over
 * leaves with the moon behind them. The caption is only what the file's EXIF
 * says; the grade is an edge falling into the night and nothing more.
 */
const PHOTO = {
  slug: 'img-20240815-203837346',
  width: 1600,
  height: 2001,
  alt: 'A street lamp lit at night over dark green leaves, with the moon small behind them.',
  caption: '15 Aug 2024 · 20:38 · f/1.9 · 1/20 s · 24 mm · Nothing Phone (1)',
};

const CELLS = [
  { icon: Mail, label: 'Email', handle: SITE.email, href: `mailto:${SITE.email}`, me: false },
  { icon: Linkedin, label: 'LinkedIn', handle: '/in/sangam21', href: SITE.profiles.linkedin, me: true },
  { icon: Github, label: 'GitHub', handle: '@Random-Pikachu', href: SITE.profiles.github, me: true },
] as const;

/** Copies the address and says so, once, for a moment. */
function CopyEmail() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(id);
  }, [copied]);
  return (
    <button
      type="button"
      className="t-micro contact__copy"
      onClick={() => navigator.clipboard?.writeText(SITE.email).then(() => setCopied(true))}
      aria-label="Copy email address"
    >
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

/**
 * Contact: the line, the paragraph, the one call, and the quieter ways in,
 * mail first. The photograph stands beside it on a wide screen and below it
 * on a phone.
 */
export function Contact() {
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title" data-callbar-hide>
      <div className="frame grid contact__grid">
        <div className="contact__lead">
          <p className="t-label section-head__label">Contact</p>
          <h2 id="contact-title" className="t-hero contact__line">
            Let&apos;s build something.
          </h2>
          <p className="t-lead contact__para">
            Open to remote work and interesting projects. The quickest way to reach me is a fifteen-minute call; the second
            quickest is mail.
          </p>
          <p className="contact__cta" data-cta>
            <a href={SITE.calendar} target="_blank" rel="noopener" className="btn btn--ember" data-umami-event="book-call-contact">
              Book a 15-minute call
              <ArrowUpRight size={17} strokeWidth={1.75} aria-hidden="true" />
            </a>
          </p>
          <address className="contact__cells">
            {CELLS.map(({ icon: Icon, label, handle, href, me }) => (
              <div key={label} className="contact__cell">
                <a
                  href={href}
                  {...(href.startsWith('http') ? { target: '_blank', rel: me ? 'me noopener' : 'noopener' } : {})}
                  className="contact__cell-link"
                  data-umami-event={label === 'Email' ? 'email-contact' : undefined}
                >
                  <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                  <span className="contact__cell-label">{label}</span>
                  <span className="contact__handle">{handle}</span>
                </a>
                {label === 'Email' ? <CopyEmail /> : null}
              </div>
            ))}
          </address>
        </div>

        <figure className="contact__photo">
          <div className="contact__frame">
            <img
              src={`/photos/${PHOTO.slug}-800.webp`}
              srcSet={`/photos/${PHOTO.slug}-400.webp 400w, /photos/${PHOTO.slug}-800.webp 800w, /photos/${PHOTO.slug}-1600.webp 1600w`}
              sizes="(max-width: 47.99rem) calc(100vw - 40px), 32vw"
              width={PHOTO.width}
              height={PHOTO.height}
              alt={PHOTO.alt}
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption className="t-micro contact__caption">{PHOTO.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
