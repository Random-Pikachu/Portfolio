import { SITE } from '../data/site';
import { Nightscape } from '../night/Nightscape';
import { WindowMark } from '../night/WindowMark';

/** One social card: what it is, in three lines over the Nightscape. */
export interface OgSpec {
  /** `cover` is public/og.jpg; anything else is public/og/<key>.jpg. */
  key: string;
  label: string;
  title: string;
  sub: string;
}

/**
 * The social card, 1200 by 630: the Nightscape with the house at the right,
 * the label, title and one line at the left, the mark and the name at the
 * foot. Rendered by scripts/build-og.mjs through the same build as the
 * pages, so the card is the site's own art and type, not a copy of them.
 */
export function OgCard({ label, title, sub }: Omit<OgSpec, 'key'>) {
  return (
    <div className="og">
      <Nightscape id="og" className="og__art" />
      <div className="og__scrim" aria-hidden="true" />
      <div className="og__copy">
        <p className="og__label">{label}</p>
        <p className="og__title">{title}</p>
        <p className="og__sub">{sub}</p>
      </div>
      <p className="og__sign">
        <WindowMark size={32} />
        <span className="og__name">{SITE.name}</span>
        <span className="og__url">random-pikachu.dev</span>
      </p>
      <div className="grain" aria-hidden="true" />
    </div>
  );
}
