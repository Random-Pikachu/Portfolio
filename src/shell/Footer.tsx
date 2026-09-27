import { PLACE, SITE } from '../data/site';
import { WindowMark } from '../night/WindowMark';

const LINKS = [
  { label: 'GitHub', href: SITE.profiles.github, me: true },
  { label: 'LinkedIn', href: SITE.profiles.linkedin, me: true },
  { label: 'KDE Invent', href: SITE.profiles.kde, me: true },
  { label: 'Résumé', href: SITE.resume, me: false },
  { label: 'Email', href: `mailto:${SITE.email}`, me: false },
] as const;

/**
 * The foot of every page: the lit-window mark with the name, the profiles,
 * and one quiet mono line with where the window is. No call here; the call
 * is asked twice, in the hero and in contact, and not a third time.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="frame footer__inner">
        <p className="footer__sign">
          <WindowMark size={40} />
          <span className="footer__name">{SITE.name}</span>
        </p>
        <ul className="footer__links">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                {...(l.href.startsWith('http') ? { target: '_blank', rel: l.me ? 'me noopener' : 'noopener' } : {})}
                className="footer__link"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="t-micro footer__line">
          <span>
            {PLACE.city} · {PLACE.coords}
          </span>
          <span>© {year}</span>
        </p>
      </div>
    </footer>
  );
}
