/**
 * The illustrated plates of the atlas: where each one sits, what it shows,
 * and the points on it other things are registered to. Sources are
 * design/art/<id>.{png,webp,jpg}; `npm run art` writes the outputs listed
 * here into public/art. Where no source exists the script synthesizes a
 * placeholder plate from the site's own photographs, so every slot always
 * has a picture and a generated or hand-made one can replace it by dropping
 * the file in and re-running.
 *
 * The prompt brief for each slot is in design/art/<id>.md.
 */
export interface ArtSlot {
  id: string;
  alt: string;
  /** Intrinsic size of the largest output. */
  width: number;
  height: number;
  /** Output widths; the first is the largest. */
  widths: number[];
  /** A portrait crop for phones: the crop on a 1600-wide source, then the output width. */
  phone?: { crop: string; width: number; height: number };
  /** Named points on the plate, normalized 0..1. */
  anchors?: Record<string, [number, number]>;
  /** How build-art synthesizes the plate when design/art/<id> is absent. */
  placeholder: 'frontispiece' | 'firmament' | 'lighthouse';
}

export const ART = {
  frontispiece: {
    id: '00-frontispiece',
    alt: 'A night sky over a treeline: a large engraved moon high on the right, a cloud lit from behind, bare branches across the top left, stars.',
    width: 1600,
    height: 1200,
    widths: [1600, 960],
    phone: { crop: '1000x1250+560+0', width: 720, height: 900 },
    anchors: { moon: [0.78, 0.12] },
    placeholder: 'frontispiece',
  },
  firmament: {
    id: '03-firmament',
    alt: 'A wide night sky with thin clouds and a small moon at the far left.',
    width: 4800,
    height: 1200,
    widths: [4800, 2400],
    anchors: { moon: [0.06, 0.4] },
    placeholder: 'firmament',
  },
  lighthouse: {
    id: '04-lighthouse',
    alt: 'A lamp lit at night over dark foliage, seen from below.',
    width: 1200,
    height: 1500,
    widths: [1200, 600],
    anchors: { lamp: [0.23, 0.2] },
    placeholder: 'lighthouse',
  },
} as const satisfies Record<string, ArtSlot>;

export type ArtName = keyof typeof ART;

export const artFile = (slot: ArtSlot, width: number) => `/art/${slot.id}-${width}.webp`;
export const artSrcSet = (slot: ArtSlot) => slot.widths.map((w) => `${artFile(slot, w)} ${w}w`).join(', ');
