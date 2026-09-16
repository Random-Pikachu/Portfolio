import { FadeUp } from '../motion/primitives';

/**
 * The left rail: the section's index and label, sticky while the section
 * scrolls on desktop, inline above it on a phone. The visible label stays
 * lowercase to match the site; the full heading is there for screen readers
 * and crawlers.
 */
export function SectionRail({
  num,
  label,
  heading,
  id,
}: {
  num: string;
  label: string;
  heading: string;
  id: string;
}) {
  return (
    <div className="rail mb-10 md:mb-0">
      <FadeUp className="md:sticky md:top-24">
        <p className="t-meta text-text-faint" aria-hidden="true">{`[ ${num} ]`}</p>
        <h2 id={`${id}-heading`} className="mono mt-1 text-sm tracking-[0.08em] text-text-base">
          <span aria-hidden="true">{label}</span>
          <span className="sr-only">{heading}</span>
        </h2>
      </FadeUp>
    </div>
  );
}
