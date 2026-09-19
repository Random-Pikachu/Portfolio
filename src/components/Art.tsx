import { ART, artFile, artSrcSet, type ArtName } from '../data/art';

/**
 * One plate of the atlas as a <picture>: the phone crop where there is one,
 * srcset at the slot's widths, explicit dimensions so nothing shifts.
 * Identical on the server and the client.
 */
export function Art({
  name,
  sizes,
  className,
  eager = false,
  alt,
}: {
  name: ArtName;
  sizes: string;
  className?: string;
  eager?: boolean;
  /** Overrides the slot's alt, for a plate whose caption says more. */
  alt?: string;
}) {
  const slot = ART[name];
  const phone = 'phone' in slot ? slot.phone : undefined;
  return (
    <picture>
      {phone ? (
        <source media="(max-width: 47.99rem)" srcSet={`/art/${slot.id}-phone.webp`} width={phone.width} height={phone.height} />
      ) : null}
      <img
        className={className}
        src={artFile(slot, slot.widths[0])}
        srcSet={artSrcSet(slot)}
        sizes={sizes}
        width={slot.width}
        height={slot.height}
        alt={alt ?? slot.alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
        draggable={false}
      />
    </picture>
  );
}
