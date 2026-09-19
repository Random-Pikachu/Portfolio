import { useSyncExternalStore } from 'react';
import { PLACE } from '../data/site';
import { revisionDate } from '../sheet/astro';
import { MoonGlyph } from '../sheet/MoonGlyph';
import { useMoon } from '../sheet/useMoon';

/** Today's date on the client, nothing on the server, without an effect. */
const noop = () => () => {};
const useToday = () =>
  useSyncExternalStore(
    noop,
    () => revisionDate(new Date(), PLACE.timeZone),
    () => null
  );

/**
 * The seal on the transmission: tonight's moon, ringed by the date and the
 * place, set a little crooked the way a stamp lands. The date is the
 * client's; the server renders the ring without it.
 */
export function Stamp({ className = '' }: { className?: string }) {
  const moon = useMoon();
  const date = useToday();
  const text = `Observed · ${date ?? '--.--.--'} · ${PLACE.city} · `;
  return (
    <span className={`stamp ${className}`} role="img" aria-label={`Observed ${date ?? ''} at ${PLACE.city}, under a ${moon?.name ?? 'moon'}`}>
      <svg className="stamp__ring" viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">
        <defs>
          <path id="stamp-arc" d="M0 -38 A38 38 0 1 1 -0.01 -38" />
        </defs>
        <circle r="47" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle r="29" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <text className="stamp__text" suppressHydrationWarning>
          <textPath href="#stamp-arc" startOffset="0">
            {text.toUpperCase()}
          </textPath>
        </text>
      </svg>
      <span className="stamp__moon">
        <MoonGlyph phase={moon} size={34} />
      </span>
    </span>
  );
}
